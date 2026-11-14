import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const ALLOWED_VOICES = new Set(['Kore', 'Puck', 'Charon', 'Aoede', 'Fenrir']);

/**
 * Dynamically reads .env / .env.local from disk on every call so the user
 * does NOT need to restart the Next.js server after updating GEMINI_PAID_API_KEY / GEMINI_API_KEY.
 */
function readEnvConfig(): { primaryKey: string; fallbackKey: string; defaultVoice: string } {
  let paidKey = process.env.GEMINI_PAID_API_KEY || '';
  let apiKey = process.env.GEMINI_API_KEY || '';
  let fallbackKey = process.env.GEMINI_FALLBACK_API_KEY || '';
  let defaultVoice = process.env.GEMINI_TTS_VOICE || 'Kore';

  const envFiles = ['.env.local', '.env'];
  for (const fileName of envFiles) {
    try {
      const envPath = path.join(process.cwd(), fileName);
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        const lines = content.split(/\r?\n/);
        for (const rawLine of lines) {
          const line = rawLine.trim();
          if (!line || line.startsWith('#')) continue;
          const eqIdx = line.indexOf('=');
          if (eqIdx === -1) continue;
          const key = line.slice(0, eqIdx).trim();
          const val = line
            .slice(eqIdx + 1)
            .trim()
            .replace(/^["']|["']$/g, '');
          if (!val || val === 'YOUR_GEMINI_API_KEY_HERE') continue;
          if (key === 'GEMINI_PAID_API_KEY') paidKey = val;
          if (key === 'GEMINI_API_KEY') apiKey = val;
          if (key === 'GEMINI_FALLBACK_API_KEY') fallbackKey = val;
          if (key === 'GEMINI_TTS_VOICE' && ALLOWED_VOICES.has(val)) {
            defaultVoice = val;
          }
        }
      }
    } catch {
      // Ignore read errors
    }
  }

  const primaryKey = (paidKey || apiKey || fallbackKey).trim();
  const secondaryKey = (fallbackKey || (apiKey !== primaryKey ? apiKey : '')).trim();

  return {
    primaryKey: primaryKey === 'YOUR_GEMINI_API_KEY_HERE' ? '' : primaryKey,
    fallbackKey: secondaryKey === 'YOUR_GEMINI_API_KEY_HERE' ? '' : secondaryKey,
    defaultVoice: ALLOWED_VOICES.has(defaultVoice) ? defaultVoice : 'Kore',
  };
}

/**
 * Wraps raw 16-bit signed little-endian mono PCM (24,000 Hz) from Gemini TTS
 * into a standard 44-byte RIFF/WAVE buffer playable in all browsers.
 */
function pcm16ToWav(pcmBuffer: Buffer, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): Buffer {
  if (
    pcmBuffer.length > 12 &&
    pcmBuffer.toString('ascii', 0, 4) === 'RIFF' &&
    pcmBuffer.toString('ascii', 8, 12) === 'WAVE'
  ) {
    return pcmBuffer;
  }

  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmBuffer.length;
  const wavHeader = Buffer.alloc(44);

  wavHeader.write('RIFF', 0);
  wavHeader.writeUInt32LE(36 + dataSize, 4);
  wavHeader.write('WAVE', 8);
  wavHeader.write('fmt ', 12);
  wavHeader.writeUInt32LE(16, 16);
  wavHeader.writeUInt16LE(1, 20);
  wavHeader.writeUInt16LE(numChannels, 22);
  wavHeader.writeUInt32LE(sampleRate, 24);
  wavHeader.writeUInt32LE(byteRate, 28);
  wavHeader.writeUInt16LE(blockAlign, 32);
  wavHeader.writeUInt16LE(bitsPerSample, 34);
  wavHeader.write('data', 36);
  wavHeader.writeUInt32LE(dataSize, 40);

  return Buffer.concat([wavHeader, pcmBuffer]);
}

async function synthesizeGeminiSpeech(text: string, lang: string, requestedVoice?: string) {
  const { primaryKey, fallbackKey, defaultVoice } = readEnvConfig();
  if (!primaryKey) {
    return NextResponse.json(
      {
        error: 'GEMINI_API_KEY_NOT_CONFIGURED',
        message: 'Paste your paid GEMINI_API_KEY in .env to enable Gemini Studio HD Indian Human Voice.',
      },
      { status: 503 }
    );
  }

  const cleanText = (text || '').trim();
  if (!cleanText) {
    return NextResponse.json({ error: 'EMPTY_TEXT' }, { status: 400 });
  }

  const isHindi = lang === 'hi';
  const voiceName = requestedVoice && ALLOWED_VOICES.has(requestedVoice) ? requestedVoice : defaultVoice;

  // Check disk cache first so repeated playback is instant and zero-cost
  const cacheDir = path.join(process.cwd(), '.cache', 'gemini-tts');
  const cacheHash = crypto
    .createHash('sha256')
    .update(`indian-v3|${voiceName}|${isHindi ? 'hi-IN' : 'en-IN'}|${cleanText}`)
    .digest('hex');
  const cacheFile = path.join(cacheDir, `${cacheHash}.wav`);

  try {
    if (fs.existsSync(cacheFile)) {
      const cachedWav = fs.readFileSync(cacheFile);
      if (cachedWav.length > 100) {
        return new NextResponse(new Uint8Array(cachedWav), {
          status: 200,
          headers: {
            'Content-Type': 'audio/wav',
            'Cache-Control': 'public, max-age=86400',
            'X-TTS-Engine': 'gemini-2.5-flash-preview-tts',
            'X-TTS-Accent': isHindi ? 'hi-IN' : 'en-IN',
            'X-TTS-Voice': voiceName,
            'X-TTS-Cache': 'HIT',
          },
        });
      }
    }
  } catch {
    // Ignore cache read error
  }

  // Verified Indian accent director prompt, with automatic fallback to plain transcript if model ever skips audio
  const promptsToTry = [
    isHindi
      ? `Read the following Hindi transcript aloud verbatim in a natural, warm Indian accent (hi-IN):\n\n${cleanText}`
      : `Read the following English transcript aloud verbatim in a natural, warm Indian English accent (en-IN):\n\n${cleanText}`,
    cleanText,
  ];

  const keysToTry = fallbackKey && fallbackKey !== primaryKey ? [primaryKey, fallbackKey] : [primaryKey];
  let lastErrorText = '';
  let lastStatus = 500;

  for (const activeKey of keysToTry) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${encodeURIComponent(
      activeKey
    )}`;

    for (const promptText of promptsToTry) {
      const payload = {
        contents: [
          {
            parts: [
              {
                text: promptText,
              },
            ],
          },
        ],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            languageCode: isHindi ? 'hi-IN' : 'en-IN',
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName,
              },
            },
          },
        },
      };

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          lastStatus = response.status;
          lastErrorText = await response.text();
          break; // Try next key on HTTP error
        }

        const data = await response.json();
        const parts = data?.candidates?.[0]?.content?.parts || [];
        const audioPart = parts.find((p: { inlineData?: { data?: string; mimeType?: string } }) => p?.inlineData?.data);

        if (!audioPart?.inlineData?.data) {
          lastStatus = 502;
          lastErrorText = JSON.stringify(data).slice(0, 400);
          continue; // Retry with plain cleanText + languageCode (en-IN / hi-IN)
        }

        const mimeType: string = audioPart.inlineData.mimeType || 'audio/L16;codec=pcm;rate=24000';
        const rateMatch = mimeType.match(/rate=(\d+)/i);
        const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 24000;

        const rawBuffer = Buffer.from(audioPart.inlineData.data, 'base64');
        const wavBuffer = pcm16ToWav(rawBuffer, sampleRate, 1, 16);

        try {
          fs.mkdirSync(cacheDir, { recursive: true });
          fs.writeFileSync(cacheFile, wavBuffer);
        } catch {
          // Ignore cache write errors
        }

        return new NextResponse(new Uint8Array(wavBuffer), {
          status: 200,
          headers: {
            'Content-Type': 'audio/wav',
            'Cache-Control': 'public, max-age=86400',
            'X-TTS-Engine': 'gemini-2.5-flash-preview-tts',
            'X-TTS-Accent': isHindi ? 'hi-IN' : 'en-IN',
            'X-TTS-Voice': voiceName,
            'X-TTS-Cache': 'MISS',
          },
        });
      } catch (error) {
        lastStatus = 500;
        lastErrorText = error instanceof Error ? error.message : 'Unknown network error';
      }
    }
  }

  return NextResponse.json(
    {
      error: 'GEMINI_TTS_API_ERROR',
      status: lastStatus,
      details: lastErrorText.slice(0, 500),
    },
    { status: lastStatus }
  );
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('status') === '1') {
    const { primaryKey, defaultVoice } = readEnvConfig();
    return NextResponse.json({
      configured: Boolean(primaryKey),
      defaultVoice,
      accent: 'Indian (en-IN / hi-IN)',
      model: 'gemini-2.5-flash-preview-tts',
    });
  }

  const text = searchParams.get('text') || '';
  const lang = searchParams.get('lang') || 'en';
  const voice = searchParams.get('voice') || undefined;
  return synthesizeGeminiSpeech(text, lang, voice);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return synthesizeGeminiSpeech(body.text || '', body.lang || 'en', body.voice);
  } catch {
    return NextResponse.json({ error: 'INVALID_JSON_BODY' }, { status: 400 });
  }
}
