"use client";

import React, { useState, useEffect } from 'react';
import { Play, Pause, Cctv, Maximize2, Volume2, Radio, ExternalLink } from 'lucide-react';
import { useChakravyuh } from '@/context/ChakravyuhContext';

interface ScenarioCctvVideoDeckProps {
  caseId: string;
  isHi?: boolean;
}

interface FeedMeta {
  camId: string;
  titleEn: string;
  titleHi: string;
  timeStamp: string;
  locationEn: string;
  locationHi: string;
  trapBadgeEn: string;
  trapBadgeHi: string;
  voiceEn: string;
  voiceHi: string;
}

const CASE_FEEDS: Record<string, FeedMeta[]> = {
  'CASE-CKV-2026-0042': [
    {
      camId: 'CAM-008',
      titleEn: 'FEED 1: BMTC Bus #335E Moving Dashcam (Inside CAM-008 Blind Spot)',
      titleHi: 'फुटेज 1: सरकारी बस (BMTC 335E) का डैशकैम (बंद कैमरे वाली गली का सच)',
      timeStamp: '02 NOV 2026 • 18:44:50 IST',
      locationEn: '12th Main Service Lane, Indiranagar (Bengaluru)',
      locationHi: '12वां मेन सर्विस लेन, इंदिरानगर (बेंगलुरु)',
      trapBadgeEn: '🪤 BUS ADAS TRAP: KA-01-MX-4XX1 FILMED IN BLIND SPOT',
      trapBadgeHi: '🪤 बस कैमरा ट्रैप: बंद कैमरे के नीचे खड़ी सफेद कार रिकॉर्ड',
      voiceEn:
        'Camera Feed 1 for Case 0042: Fixed pole Camera 008 was offline for battery maintenance, so the kidnapper hid his White S U V inside 12th Main Indiranagar. Watch how passing B M T C Bus 335 E filmed his White S U V waiting in the blind spot at 6:44 PM.',
      voiceHi:
        'केस एक का पहला वीडियो फुटेज: गली का कैमरा 008 बैटरी रिपेयर के कारण बंद था, लेकिन शाम छह बजकर चौवालीस मिनट पर वहां से गुजरती बीएमटीसी बस 335-ई के साइड कैमरे ने अंधेरी गली में खड़ी संदिग्ध सफेद एसयूवी को साफ रिकॉर्ड कर लिया।',
    },
    {
      camId: 'CAM-014',
      titleEn: 'FEED 2: Sony World Signal ANPR & RF Sniffer (Muddy Plate)',
      titleHi: 'फुटेज 2: सोनी वर्ल्ड सिग्नल कैमरा (कीचड़ लगी नंबर प्लेट)',
      timeStamp: '02 NOV 2026 • 19:02:14 IST',
      locationEn: 'Sony World Junction (Indiranagar–Koramangala Link)',
      locationHi: 'सोनी वर्ल्ड जंक्शन (इंदिरानगर–कोरमंगला लिंक)',
      trapBadgeEn: '🪤 RF TRAP: WHEEL SENSOR TPMS-HEX-88A4 LOGGED',
      trapBadgeHi: '🪤 टायर सेंसर ट्रैप: TPMS-HEX-88A4 रेडियो आईडी दर्ज',
      voiceEn:
        'Camera Feed 2: At 7:02 PM at Sony World Signal, the suspect splashed mud over the last digits of number plate K A 01 M X 4 X X 1, but the smart pole captured the car’s unique 433 megahertz tyre pressure sensor I D.',
      voiceHi:
        'केस एक का दूसरा वीडियो फुटेज: शाम सात बजकर दो मिनट पर सोनी वर्ल्ड सिग्नल पर अपराधी ने नंबर प्लेट के आखिरी अंकों पर कीचड़ लगा दिया था, लेकिन स्मार्ट पोल ने कार के पहियों के रेडियो सेंसर आईडी को पकड़ लिया।',
    },
    {
      camId: 'CAM-019',
      titleEn: 'FEED 3: Domlur–Marathahalli Flyover (High-Beam Glare + Ghost FASTag)',
      titleHi: 'फुटेज 3: डोमलूर–मराठाहल्ली फ्लाईओवर (हाई-बीम ग्लेयर और घोस्ट फास्टैग)',
      timeStamp: '02 NOV 2026 • 19:18:19 IST',
      locationEn: 'Domlur–Marathahalli Flyover Ramp (Old Airport Rd)',
      locationHi: 'डोमलूर–मराठाहल्ली फ्लाईओवर रैंप (ओल्ड एयरपोर्ट रोड)',
      trapBadgeEn: '🪤 GHOST-FASTAG (1 OF 412 CARS) + TPMS-88A4 MATCH',
      trapBadgeHi: '🪤 घोस्ट-फास्टैग अलर्ट (412 में से 1 कार) + टायर सेंसर मिलान',
      voiceEn:
        'Camera Feed 3: After hiding for 12 minutes near Challaghatta Lake, the White S U V ascends Domlur Marathahalli Flyover at 7:18 PM with high beam glare and a ripped off Fast Tag, triggering a Ghost Fast Tag alert and matching the exact same wheel sensor I D.',
      voiceHi:
        'केस एक का तीसरा वीडियो फुटेज: चल्लघट्टा झील के पास बारह मिनट छिपने के बाद सफेद एसयूवी शाम सात बजकर अठारह मिनट पर डोमलूर फ्लाईओवर पर चढ़ती है। फास्टैग उखाड़ने के कारण तुरंत घोस्ट-फास्टैग अलर्ट बजता है और टायर सेंसर से वही कार साबित हो जाती है।',
    },
  ],
  'CASE-CKV-2026-0043': [
    {
      camId: 'CAM-021',
      titleEn: 'FEED 1: Chickpet Bullion Vault — 532nm Green Laser Attack on CCTV',
      titleHi: 'फुटेज 1: चिकपेट बुलियन तिजोरी — सीसीटीवी पर ग्रीन लेज़र अटैक',
      timeStamp: '04 NOV 2026 • 14:10:22 IST',
      locationEn: 'Sri Lakshmi Bullion Vault, Raja Market (Chickpet)',
      locationHi: 'श्री लक्ष्मी बुलियन वॉल्ट, राजा मार्केट (चिकपेट)',
      trapBadgeEn: '🪤 SDR TRAP: 446.09 MHz WALKIE-TALKIE + PRE-SILENCE MATCH',
      trapBadgeHi: '🪤 रेडियो ट्रैप: 446 MHz वॉकी-टॉकी + चामराजपेट के 3 बंद फ़ोन',
      voiceEn:
        'Case 2 Video Feed 1: Inside Sri Lakshmi Bullion Vault at Chickpet Raja Market at 2:10 PM, three masked operatives carry zero mobile phones and fire green lasers into Camera 021 while looting 52 kilograms of gold. C-DOT sensors outside capture their 446 megahertz walkie talkie bursts.',
      voiceHi:
        'केस दो का पहला वीडियो फुटेज: दोपहर दो बजकर दस मिनट पर चिकपेट राजा मार्केट की तिजोरी में तीन नकाबपोश बदमाश बिना किसी मोबाइल फ़ोन के घुसते हैं और कैमरे के लेंस पर तेज हरी लेज़र लाइट मारते हैं। बाहर लगे सरकारी सेंसर उनके वॉकी-टॉकी की रेडियो तरंगें पकड़ लेते हैं।',
    },
    {
      camId: 'CAM-022',
      titleEn: 'FEED 2: Lalbagh West Gate — EV Scooter Dump to Fake Ambulance Relay',
      titleHi: 'फुटेज 2: लालबाग वेस्ट गेट — स्कूटर छोड़कर नकली एम्बुलेंस में सोना शिफ्ट',
      timeStamp: '04 NOV 2026 • 14:28:09 IST',
      locationEn: 'Lalbagh West Gate Underground Parking (Basavanagudi)',
      locationHi: 'लालबाग वेस्ट गेट अंडरग्राउंड पार्किंग (बसवनगुड़ी)',
      trapBadgeEn: '🪤 BMS TRAP: SCOOTER BATTERY BMS-9921 → HARSHA GOWDA UPI',
      trapBadgeHi: '🪤 बैटरी चिप ट्रैप: BMS-9921 से हर्षा गौड़ा का UPI पेमेंट मिला',
      voiceEn:
        'Case 2 Video Feed 2: At 2:28 PM inside Lalbagh West Gate parking, the gang dumps two electric scooters and loads the 52 kilograms of gold into a disguised Patient Ambulance, K A 05 A G 9 X X 2. BESCOM fast charger logs link the scooter’s internal battery chip directly to Harsha Gowda’s U P I payment.',
      voiceHi:
        'केस दो का दूसरा वीडियो फुटेज: दोपहर दो बजकर अट्ठाईस मिनट पर लालबाग वेस्ट गेट पार्किंग में बदमाश दोनों इलेक्ट्रिक स्कूटर छोड़कर बावन किलो सोना एक नकली एम्बुलेंस में लोड करते हैं। स्कूटर की बैटरी चिप से बसवनगुड़ी चार्जिंग स्टेशन पर किया गया हर्षा गौड़ा का यूपीआई पेमेंट पकड़ लिया जाता है।',
    },
    {
      camId: 'CAM-023',
      titleEn: 'FEED 3: NICE Road Kengeri Toll — Ambulance Weigh-In-Motion (+265 kg)',
      titleHi: 'फुटेज 3: नाइस रोड केंगेरी टोल — एम्बुलेंस वजन सेंसर (+265 किलो पकड़)',
      timeStamp: '04 NOV 2026 • 14:52:41 IST',
      locationEn: 'NICE Ring Road Kengeri Toll Plaza → Bidadi (Mysuru Hwy)',
      locationHi: 'नाइस रिंग रोड केंगेरी टोल प्लाजा → बिदादी (मैसूर हाईवे)',
      trapBadgeEn: '🪤 WIM AXLE SENSOR: +265 KG GOLD PAYLOAD | ZERO 108 DISPATCH',
      trapBadgeHi: '🪤 टोल वजन सेंसर: +265 किलो वजन बढ़ा | 108 अस्पताल रिकॉर्ड शून्य',
      voiceEn:
        'Case 2 Video Feed 3: At 2:52 PM at N I C E Road Kengeri Toll, the fake ambulance uses the emergency siren lane to skip Fast Tag, but the road Weigh In Motion axle sensor catches a 265 kilogram weight increase after Lalbagh, while the 108 hospital grid confirms zero patient dispatches.',
      voiceHi:
        'केस दो का तीसरा वीडियो फुटेज: दोपहर दो बजकर बावन मिनट पर नाइस रोड केंगेरी टोल पर नकली एम्बुलेंस सायरन बजाते हुए निकलती है, लेकिन सड़क के नीचे लगे वजन सेंसर ने पकड़ लिया कि लालबाग के बाद एम्बुलेंस का वजन दो सौ पैंसठ किलो बढ़ गया है और किसी अस्पताल में इसका रिकॉर्ड नहीं है!',
    },
  ],
  'CASE-CKV-2026-0044': [
    {
      camId: 'CAM-024',
      titleEn: 'FEED 1: Devanahalli SEZ Gate-2 — Connected SUV eSIM Defeats Airplane Mode',
      titleHi: 'फुटेज 1: देवनहल्ली एयरोस्पेस गेट-2 — कार के eSIM ने तोड़ा एयरप्लेन मोड',
      timeStamp: '05 NOV 2026 • 10:22:15 IST',
      locationEn: 'AeroVeda Defence SEZ Gate-2, Devanahalli (NH-44)',
      locationHi: 'एरोवेदा डिफेंस पार्क गेट-2, देवनहल्ली (NH-44)',
      trapBadgeEn: '🪤 TELEMATICS TRAP: PHONE IN AIRPLANE MODE, CAR eSIM ACTIVE',
      trapBadgeHi: '🪤 टेलीमैटिक्स ट्रैप: फ़ोन एयरप्लेन मोड में, पर कार का eSIM चालू!',
      voiceEn:
        'Case 3 Video Feed 1: Insider Vikramaditya Joshi exits Devanahalli Aerospace Gate 2 at 10:22 AM with stolen drone blueprints and his phone in 100 percent Airplane Mode, after using an A I voice clone call. However, his connected S U V’s factory telematics e-SIM pings cell towers every 60 seconds all the way to M G Road.',
      voiceHi:
        'केस तीन का पहला वीडियो फुटेज: सुबह दस बजकर बाईस मिनट पर भेदी विक्रमादित्य जोशी चोरी किए गए डिफेंस ब्लूप्रिंट लेकर देवनहल्ली गेट-दो से निकलता है। उसका फ़ोन एयरप्लेन मोड में था, लेकिन उसकी कार का इनबिल्ट फैक्ट्री ई-सिम हर साठ सेकंड में उसकी लोकेशन टावर को भेज रहा था!',
    },
    {
      camId: 'CAM-025',
      titleEn: 'FEED 2: MG Road Metro Locker #14 — Split-Screen 22-Min Time-Shifted Match',
      titleHi: 'फुटेज 2: एमजी रोड मेट्रो लॉकर #14 — 22-मिनट के अंतराल का स्प्लिट-स्क्रीन मिलान',
      timeStamp: '05 NOV 2026 • 13:40:12 vs 14:02:18 IST',
      locationEn: 'MG Road Namma Metro Concourse — Smart Parcel Locker #14',
      locationHi: 'एमजी रोड नम्मा मेट्रो स्टेशन — स्मार्ट लॉकर #14',
      trapBadgeEn: '🪤 TIME-SHIFTED GRAPH: ONLY 2 OF 18,000 PASSENGERS TOUCHED BAY #14',
      trapBadgeHi: '🪤 टाइम-शिफ्टेड ट्रैप: 18,000 यात्रियों में सिर्फ इन 2 ने लॉकर #14 खोला',
      voiceEn:
        'Case 3 Video Feed 2: Look at this split screen replay at M G Road Namma Metro Concourse. On the left at 1:40 PM, insider Vikramaditya drops the key fob chip inside Locker 14. On the right, 22 minutes later at 2:02 PM, courier Zoya Merchant unlocks the exact same Locker 14. Even though they never met in one frame, Chakravyuh isolated them out of 18,000 passengers.',
      voiceHi:
        'केस तीन का दूसरा वीडियो फुटेज: एमजी रोड मेट्रो स्टेशन का यह स्प्लिट-स्क्रीन वीडियो देखिए। बाईं तरफ दोपहर एक बजकर चालीस मिनट पर विक्रमादित्य लॉकर नंबर चौदह में चिप रखता है। दाईं तरफ बाईस मिनट बाद दोपहर दो बजकर दो मिनट पर कूरियर ज़ोया वही लॉकर खोलती है। दोनों कभी एक साथ कैमरे में नहीं आए, फिर भी चक्रव्यूह ने अठारह हज़ार यात्रियों में से दोनों को जोड़ दिया!',
    },
    {
      camId: 'CAM-026',
      titleEn: 'FEED 3: Kempegowda Airport (KIAL) Terminal-2 — Gate-4 Courier Intercept',
      titleHi: 'फुटेज 3: केंपेगौड़ा एयरपोर्ट (KIAL) टर्मिनल-2 — गेट-4 पर कूरियर की गिरफ्तारी',
      timeStamp: '05 NOV 2026 • 17:45:08 IST',
      locationEn: 'Kempegowda International Airport (BLR) Terminal 2, Gate 4',
      locationHi: 'केंपेगौड़ा अंतर्राष्ट्रीय एयरपोर्ट (बेंगलुरु) टर्मिनल-2, गेट 4',
      trapBadgeEn: '🪤 RBI NOTE-OCR → TAXI KA-04-D-3XX9 TRACKED TO KIAL T2 GATE 4',
      trapBadgeHi: '🪤 हवाला नोट सीरियल स्कैन → टैक्सी ट्रैक कर एयरपोर्ट गेट-4 पर गिरफ्तारी',
      voiceEn:
        'Case 3 Video Feed 3: After a Whitefield cash machine scanned the serial numbers of the hawala payout notes at 3:35 PM, Chakravyuh traced the courier’s airport taxi K A 04 D 3 X X 9 up Bellary Road and intercepted Zoya Merchant at Kempegowda International Airport Terminal 2 Gate 4 at 5:45 PM with the stolen blueprints.',
      voiceHi:
        'केस तीन का तीसरा वीडियो फुटेज: व्हाइटफील्ड की कैश मशीन में जमा किए गए हवाला नोटों के सीरियल नंबर से चक्रव्यूह ने एयरपोर्ट टैक्सी को ट्रैक किया और शाम पांच बजकर पैंतालीस मिनट पर केंपेगौड़ा एयरपोर्ट टर्मिनल-दो के गेट नंबर चार पर कूरियर ज़ोया मर्चेंट को चोरी के ब्लूप्रिंट के साथ पकड़ लिया!',
    },
  ],
};

export const ScenarioCctvVideoDeck: React.FC<ScenarioCctvVideoDeckProps> = ({ caseId, isHi = false }) => {
  const { setActiveModule, setSelectedCameraId, speakCustomText } = useChakravyuh();
  const feeds = CASE_FEEDS[caseId] || CASE_FEEDS['CASE-CKV-2026-0042'];

  const [activeFeedIdx, setActiveFeedIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(30);

  // Reset active feed index when case switches
  useEffect(() => {
    setActiveFeedIdx(0);
    setProgress(25);
    setIsPlaying(true);
  }, [caseId]);

  // Smooth 60fps-style animation loop for all video feeds
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1.4));
    }, 120);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const currentFeed = feeds[activeFeedIdx] || feeds[0];

  const renderAnimatedSvgCanvas = (camId: string, pct: number) => {
    switch (camId) {
      // CASE 1 FEED 1: BMTC BUS 335E DASHCAM FILMING WHITE SUV IN CAM-008 BLIND SPOT
      case 'CAM-008':
        return (
          <svg className="w-full h-full" viewBox="0 0 680 280" preserveAspectRatio="none">
            <rect width="680" height="280" fill="#060B16" />
            {/* Road perspective */}
            <polygon points="0,275 680,275 510,95 170,95" fill="#0F172A" stroke="#1E293B" strokeWidth="2" />
            <line x1="340" y1="95" x2="340" y2="275" stroke="#38BDF8" strokeWidth="2" strokeDasharray="12 8" opacity="0.45" />
            {/* Dead Pole CAM-008 indicator */}
            <g transform="translate(495, 58)">
              <rect x="0" y="0" width="165" height="36" rx="5" fill="#450A0A" stroke="#EF4444" strokeWidth="1.5" />
              <text x="8" y="15" fill="#FCA5A5" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                POLE CAM-008: OFFLINE (UPS)
              </text>
              <text x="8" y="28" fill="#F87171" fontSize="8.5" fontFamily="monospace">
                Criminal thought lane was blind!
              </text>
            </g>
            {/* Side lay-by with idling White SUV captured from moving BMTC Bus */}
            <g transform={`translate(${210 + (pct % 50) * 1.1}, 142)`}>
              <rect x="-10" y="-22" width="175" height="72" fill="none" stroke="#10B981" strokeWidth="2" strokeDasharray="5 3" />
              <text x="-8" y="-27" fill="#6EE7B7" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                BMTC BUS #335E CAM: KA-01-MX-4XX1
              </text>
              <rect x="0" y="0" width="122" height="34" rx="6" fill="#F8FAFC" />
              <polygon points="15,0 32,-12 92,-12 108,0" fill="#E2E8F0" />
              <circle cx="26" cy="34" r="9" fill="#334155" stroke="#38BDF8" strokeWidth="2" />
              <circle cx="94" cy="34" r="9" fill="#334155" stroke="#38BDF8" strokeWidth="2" />
              <circle cx="138" cy="12" r="7" fill="#F59E0B" />
              <rect x="132" y="20" width="12" height="20" rx="3" fill="#0EA5E9" />
            </g>
            {/* Bus Dashcam Frame Overlay */}
            <text x="16" y="262" fill="#38BDF8" fontSize="10" fontFamily="monospace" fontWeight="bold">
              🚌 MOVING SOURCE: BMTC ROUTE-335E (KA-01-F-8XX1) ADAS SIDE-CAM • 12TH MAIN INDIRANAGAR
            </text>
          </svg>
        );

      // CASE 1 FEED 2: SONY WORLD SIGNAL (MUDDY PLATE + TPMS-HEX-88A4)
      case 'CAM-014':
        return (
          <svg className="w-full h-full" viewBox="0 0 680 280" preserveAspectRatio="none">
            <rect width="680" height="280" fill="#060B16" />
            <polygon points="0,275 680,275 520,100 160,100" fill="#0F172A" stroke="#1E293B" strokeWidth="2" />
            <line x1="340" y1="100" x2="340" y2="275" stroke="#F59E0B" strokeWidth="2" strokeDasharray="14 9" opacity="0.45" />
            <g transform={`translate(${90 + pct * 4.1}, 158)`}>
              <rect x="-12" y="-24" width="175" height="74" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 2" />
              <text x="-10" y="-29" fill="#FDE68A" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                KA-01-MX-4XX? (MUD) | TPMS-HEX-88A4
              </text>
              <rect x="0" y="0" width="120" height="34" rx="6" fill="#F8FAFC" />
              <polygon points="15,0 32,-12 90,-12 106,0" fill="#CBD5E1" />
              <circle cx="25" cy="34" r="9" fill="#334155" stroke="#10B981" strokeWidth="2.5" />
              <circle cx="92" cy="34" r="9" fill="#334155" stroke="#10B981" strokeWidth="2.5" />
              {/* RF Waves from tyres */}
              <circle cx="25" cy="34" r={12 + (pct % 15)} fill="none" stroke="#10B981" strokeWidth="1.2" opacity="0.7" />
              <circle cx="92" cy="34" r={12 + (pct % 15)} fill="none" stroke="#10B981" strokeWidth="1.2" opacity="0.7" />
            </g>
            <text x="16" y="262" fill="#6EE7B7" fontSize="10" fontFamily="monospace" fontWeight="bold">
              📡 SMART POLE 433MHz SNIFFER: WHEEL SENSOR ID TPMS-HEX-88A4-C109 LOCKED @ SONY WORLD SIGNAL
            </text>
          </svg>
        );

      // CASE 1 FEED 3: DOMLUR-MARATHAHALLI FLYOVER (HIGH BEAM GLARE + GHOST FASTAG)
      case 'CAM-019':
        return (
          <svg className="w-full h-full" viewBox="0 0 680 280" preserveAspectRatio="none">
            <rect width="680" height="280" fill="#060B16" />
            <polygon points="40,275 640,275 480,85 200,85" fill="#0F172A" stroke="#1E293B" strokeWidth="2" />
            {/* Overhead NHAI FASTag Gantry */}
            <rect x="140" y="38" width="400" height="24" rx="4" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
            <text x="205" y="54" fill="#38BDF8" fontSize="10" fontFamily="monospace" fontWeight="bold">
              NHAI UHF-RFID FASTAG GANTRY • DOMLUR–MARATHAHALLI FLYOVER
            </text>
            <g transform={`translate(${120 + pct * 3.8}, 156)`}>
              {/* High-beam glare cone */}
              <polygon points="-40,15 10,-15 10,45" fill="#FEF08A" opacity="0.55" />
              <rect x="-12" y="-24" width="185" height="74" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 2" />
              <text x="-10" y="-29" fill="#FCA5A5" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                GHOST-FASTAG ALERT + TPMS-88A4 MATCH!
              </text>
              <rect x="0" y="0" width="120" height="34" rx="6" fill="#F8FAFC" />
              <polygon points="15,0 32,-12 90,-12 106,0" fill="#E2E8F0" />
              <circle cx="25" cy="34" r="9" fill="#334155" stroke="#EF4444" strokeWidth="2.5" />
              <circle cx="92" cy="34" r="9" fill="#334155" stroke="#EF4444" strokeWidth="2.5" />
            </g>
            <text x="16" y="262" fill="#FCA5A5" fontSize="10" fontFamily="monospace" fontWeight="bold">
              🚨 411/412 CARS HAD VALID FASTAG • ONLY THIS WHITE SUV HAD RIPPED FASTAG + MATCHING TPMS-88A4!
            </text>
          </svg>
        );

      // CASE 2 FEED 1: CHICKPET BULLION VAULT — GREEN LASER ATTACK ON CCTV + 446MHz RF
      case 'CAM-021':
        return (
          <svg className="w-full h-full" viewBox="0 0 680 280" preserveAspectRatio="none">
            <rect width="680" height="280" fill="#050B14" />
            {/* Vault shelves & bullion bars */}
            <rect x="60" y="45" width="560" height="190" rx="8" fill="#0D1726" stroke="#334155" strokeWidth="2" />
            <rect x="90" y="75" width="140" height="120" fill="#1E293B" stroke="#F59E0B" strokeWidth="1.5" />
            <text x="102" y="95" fill="#FDE68A" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
              VAULT BAY-A (52 KG GOLD)
            </text>
            {/* Gold bullion stacks */}
            <rect x="108" y="110" width="42" height="14" rx="2" fill="#F59E0B" />
            <rect x="156" y="110" width="42" height="14" rx="2" fill="#FBBF24" />
            <rect x="108" y="130" width="42" height="14" rx="2" fill="#F59E0B" />

            {/* 3 Masked Operatives moving & firing 532nm Green Laser at Camera Lens */}
            <g transform={`translate(${240 + (pct % 45) * 1.8}, 125)`}>
              <rect x="-12" y="-22" width="160" height="86" fill="none" stroke="#10B981" strokeWidth="1.8" strokeDasharray="4 2" />
              <text x="-10" y="-27" fill="#6EE7B7" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                3 MASKED OPERATIVES (ZERO PHONES)
              </text>
              {/* Operative 1 */}
              <circle cx="20" cy="4" r="9" fill="#475569" />
              <rect x="10" y="14" width="20" height="36" rx="4" fill="#1E293B" />
              {/* Operative 2 holding green laser */}
              <circle cx="65" cy="2" r="9" fill="#475569" />
              <rect x="55" y="12" width="20" height="38" rx="4" fill="#0F172A" />
              {/* Operative 3 carrying gold crate */}
              <circle cx="112" cy="6" r="9" fill="#475569" />
              <rect x="102" y="16" width="20" height="34" rx="4" fill="#1E293B" />
              <rect x="92" y="24" width="28" height="16" rx="2" fill="#F59E0B" />

              {/* 532nm Green Laser Beam shooting toward top-left camera lens */}
              <line x1="65" y1="16" x2="-180" y2="-95" stroke="#22C55E" strokeWidth="3.5" opacity="0.85" />
              <circle cx="-180" cy="-95" r={18 + (pct % 20)} fill="#22C55E" opacity="0.35" />
            </g>
            {/* Green laser flare overlay */}
            <circle cx="80" cy="40" r={28 + (pct % 25)} fill="#10B981" opacity="0.22" />
            <text x="16" y="262" fill="#6EE7B7" fontSize="10" fontFamily="monospace" fontWeight="bold">
              🪤 LASER BLINDING DEFEATED: C-DOT SDR LOCKED 446.09MHz WALKIE-TALKIE + 13:25:04 CHAMARAJPET PHONE BLACKOUT!
            </text>
          </svg>
        );

      // CASE 2 FEED 2: LALBAGH WEST GATE — EV SCOOTER DUMP TO FAKE AMBULANCE RELAY
      case 'CAM-022':
        return (
          <svg className="w-full h-full" viewBox="0 0 680 280" preserveAspectRatio="none">
            <rect width="680" height="280" fill="#060B16" />
            <rect x="30" y="65" width="620" height="175" rx="6" fill="#0D1627" stroke="#1E293B" strokeWidth="2" />
            {/* Abandoned EV Scooters on Left */}
            <g transform="translate(65, 138)">
              <rect x="-8" y="-20" width="170" height="68" fill="none" stroke="#38BDF8" strokeWidth="1.8" strokeDasharray="4 2" />
              <text x="-6" y="-25" fill="#7DD3FC" fontSize="9" fontFamily="monospace" fontWeight="bold">
                DUMPED EV SCOOTERS (KA-01-EM-2XX9)
              </text>
              <rect x="8" y="10" width="52" height="18" rx="4" fill="#0284C7" />
              <circle cx="16" cy="30" r="7" fill="#334155" stroke="#38BDF8" strokeWidth="2" />
              <circle cx="52" cy="30" r="7" fill="#334155" stroke="#38BDF8" strokeWidth="2" />
              <text x="68" y="22" fill="#FDE68A" fontSize="9" fontFamily="monospace" fontWeight="bold">
                BMS-PACK-9921
              </text>
              <text x="68" y="34" fill="#6EE7B7" fontSize="8.5" fontFamily="monospace">
                Charged @ 11:40 UPI!
              </text>
            </g>

            {/* Gold Crates moving from Scooters into Fake Ambulance */}
            <g transform={`translate(${245 + (pct % 50) * 1.9}, 152)`}>
              <rect x="0" y="0" width="34" height="20" rx="3" fill="#F59E0B" stroke="#FEF08A" strokeWidth="1.5" />
              <text x="4" y="13" fill="#090D16" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
                52KG
              </text>
            </g>

            {/* Disguised Fake Patient Ambulance on Right */}
            <g transform="translate(385, 118)">
              <rect x="-10" y="-22" width="235" height="86" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="5 3" />
              <text x="-8" y="-27" fill="#FCA5A5" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                FAKE AMBULANCE: KA-05-AG-9XX2 (NO 108 LOG)
              </text>
              <rect x="0" y="0" width="165" height="46" rx="6" fill="#F8FAFC" />
              {/* Red stripe & medical cross */}
              <rect x="0" y="22" width="165" height="8" fill="#EF4444" />
              <rect x="38" y="6" width="14" height="4" fill="#EF4444" />
              <rect x="43" y="1" width="4" height="14" fill="#EF4444" />
              {/* Flashing red/blue siren bar */}
              <rect x="115" y="-8" width="28" height="8" rx="2" fill={pct % 20 < 10 ? '#EF4444' : '#3B82F6'} />
              <circle cx="34" cy="46" r="10" fill="#334155" stroke="#94A3B8" strokeWidth="2" />
              <circle cx="132" cy="46" r="10" fill="#334155" stroke="#94A3B8" strokeWidth="2" />
            </g>
            <text x="16" y="262" fill="#FDE68A" fontSize="10" fontFamily="monospace" fontWeight="bold">
              🪤 BESCOM EV-MITRA TRAP: SCOOTER BATTERY CHIP BMS-PACK-9921 MATCHED TO HARSHA GOWDA’S UPI AT 11:40 AM!
            </text>
          </svg>
        );

      // CASE 2 FEED 3: NICE ROAD KENGERI TOLL — WEIGH-IN-MOTION (+265 KG) + FAKE AMBULANCE
      case 'CAM-023':
        return (
          <svg className="w-full h-full" viewBox="0 0 680 280" preserveAspectRatio="none">
            <rect width="680" height="280" fill="#060B16" />
            <polygon points="0,275 680,275 530,90 150,90" fill="#0F172A" stroke="#1E293B" strokeWidth="2" />
            {/* Weigh-In-Motion (WIM) Sensor Pad embedded in highway lane */}
            <polygon points="220,210 460,210 435,165 245,165" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" strokeDasharray="6 3" />
            <text x="252" y="192" fill="#FDE68A" fontSize="10" fontFamily="monospace" fontWeight="bold">
              WIM AXLE SENSOR PAD: +265 KG SPIKE!
            </text>

            {/* Speeding Fake Ambulance with flashing sirens */}
            <g transform={`translate(${100 + pct * 3.9}, 126)`}>
              <rect x="-10" y="-22" width="215" height="82" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 2" />
              <text x="-8" y="-27" fill="#FCA5A5" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                KA-05-AG-9XX2 | +265 KG | 108 DISPATCH: 0
              </text>
              <rect x="0" y="0" width="155" height="44" rx="6" fill="#F8FAFC" />
              <rect x="0" y="20" width="155" height="7" fill="#EF4444" />
              <rect x="108" y="-8" width="26" height="8" rx="2" fill={pct % 16 < 8 ? '#EF4444' : '#38BDF8'} />
              <circle cx="32" cy="44" r="9" fill="#334155" stroke="#F59E0B" strokeWidth="2.5" />
              <circle cx="122" cy="44" r="9" fill="#334155" stroke="#F59E0B" strokeWidth="2.5" />
            </g>
            <text x="16" y="262" fill="#FCA5A5" fontSize="10" fontFamily="monospace" fontWeight="bold">
              🚨 NICE ROAD KENGERI TOLL TRAP: AMBULANCE GAINED +265 KG AFTER LALBAGH & HAS ZERO HOSPITAL RECORDS!
            </text>
          </svg>
        );

      // CASE 3 FEED 1: DEVANAHALLI SEZ GATE-2 — CONNECTED CAR eSIM DEFEATS AIRPLANE MODE
      case 'CAM-024':
        return (
          <svg className="w-full h-full" viewBox="0 0 680 280" preserveAspectRatio="none">
            <rect width="680" height="280" fill="#060B16" />
            <polygon points="0,275 680,275 510,95 170,95" fill="#0F172A" stroke="#1E293B" strokeWidth="2" />
            {/* Cell Tower in background receiving Car eSIM pings */}
            <g transform="translate(535, 38)">
              <line x1="25" y1="10" x2="10" y2="75" stroke="#38BDF8" strokeWidth="2" />
              <line x1="25" y1="10" x2="40" y2="75" stroke="#38BDF8" strokeWidth="2" />
              <circle cx="25" cy="10" r="5" fill="#10B981" />
              <circle cx="25" cy="10" r={10 + (pct % 22)} fill="none" stroke="#10B981" strokeWidth="1.5" opacity="0.7" />
              <text x="-45" y="92" fill="#6EE7B7" fontSize="9" fontFamily="monospace" fontWeight="bold">
                TOWER BLR-DEV-SEZ-01
              </text>
            </g>

            {/* Connected SUV KA-03-NC-7XX5 */}
            <g transform={`translate(${95 + pct * 3.7}, 152)`}>
              <rect x="-12" y="-26" width="215" height="78" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="4 2" />
              <text x="-10" y="-31" fill="#7DD3FC" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                SUV KA-03-NC-7XX5 | FACTORY eSIM: ACTIVE!
              </text>
              <rect x="0" y="0" width="126" height="36" rx="6" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
              <polygon points="16,0 34,-12 94,-12 112,0" fill="#334155" />
              {/* Dashboard eSIM transmitter pulse */}
              <circle cx="88" cy="-4" r="5" fill="#10B981" />
              <circle cx="88" cy="-4" r={8 + (pct % 18)} fill="none" stroke="#10B981" strokeWidth="1.5" />
              <circle cx="28" cy="36" r="9" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
              <circle cx="98" cy="36" r="9" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
            </g>
            <text x="16" y="262" fill="#6EE7B7" fontSize="10" fontFamily="monospace" fontWeight="bold">
              🪤 AIRPLANE MODE DEFEATED: INSIDER SWITCHED OFF PHONE, BUT SUV’S FACTORY SOS eSIM PINGED EVERY 60s!
            </text>
          </svg>
        );

      // CASE 3 FEED 2: MG ROAD METRO LOCKER #14 — SPLIT-SCREEN 22-MIN TIME-SHIFTED MATCH
      case 'CAM-025':
        return (
          <svg className="w-full h-full" viewBox="0 0 680 280" preserveAspectRatio="none">
            <rect width="680" height="280" fill="#060B16" />
            {/* Split-Screen Divider */}
            <line x1="340" y1="0" x2="340" y2="245" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="6 4" />

            {/* LEFT SCREEN: 13:40:12 IST (Insider Vikramaditya drops Key-Fob in Locker #14) */}
            <g>
              <rect x="14" y="14" width="312" height="220" rx="6" fill="#0B1324" stroke="#38BDF8" strokeWidth="1.5" />
              <text x="24" y="32" fill="#7DD3FC" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                CLIP A: 13:40:12 IST • INSIDER DROP
              </text>
              {/* Smart Locker Grid */}
              <rect x="195" y="55" width="110" height="150" rx="4" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
              {/* Highlighted Locker Bay #14 */}
              <rect x="205" y="95" width="42" height="32" rx="3" fill="#F59E0B" stroke="#FEF08A" strokeWidth="2" />
              <text x="211" y="115" fill="#090D16" fontSize="10" fontFamily="monospace" fontWeight="bold">
                #14
              </text>
              {/* Insider walking to Locker #14 */}
              <g transform={`translate(${65 + (pct % 50) * 2.1}, 115)`}>
                <circle cx="16" cy="0" r="9" fill="#38BDF8" />
                <rect x="6" y="10" width="20" height="38" rx="4" fill="#0284C7" />
                <text x="-20" y="-14" fill="#BAE6FD" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
                  Vikramaditya (13:40)
                </text>
              </g>
            </g>

            {/* RIGHT SCREEN: 14:02:18 IST (+22m 06s Later — Courier Zoya unlocks Locker #14) */}
            <g>
              <rect x="354" y="14" width="312" height="220" rx="6" fill="#0B1324" stroke="#10B981" strokeWidth="1.5" />
              <text x="364" y="32" fill="#6EE7B7" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                CLIP B: 14:02:18 IST (+22 MIN GAP) • PICKUP
              </text>
              {/* Identical Smart Locker Grid */}
              <rect x="535" y="55" width="110" height="150" rx="4" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
              {/* Highlighted Locker Bay #14 */}
              <rect x="545" y="95" width="42" height="32" rx="3" fill="#10B981" stroke="#A7F3D0" strokeWidth="2" />
              <text x="551" y="115" fill="#090D16" fontSize="10" fontFamily="monospace" fontWeight="bold">
                #14
              </text>
              {/* Courier walking to Locker #14 */}
              <g transform={`translate(${405 + (pct % 50) * 2.1}, 115)`}>
                <circle cx="16" cy="0" r="9" fill="#F43F5E" />
                <rect x="6" y="10" width="20" height="38" rx="4" fill="#E11D48" />
                <text x="-20" y="-14" fill="#FECDD3" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
                  Courier Zoya (14:02)
                </text>
              </g>
            </g>

            {/* Correlation Arc Linking Locker #14 Across Both Time-Shifted Frames */}
            <path
              d="M 226 95 Q 395 25, 566 95"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2.5"
              strokeDasharray="6 3"
            />
            <rect x="245" y="42" width="190" height="20" rx="4" fill="#090D16" stroke="#F59E0B" strokeWidth="1.5" />
            <text x="255" y="55" fill="#FDE68A" fontSize="9" fontFamily="monospace" fontWeight="bold">
              99.8% LOCKER #14 HANDSHAKE LINK
            </text>

            <text x="16" y="262" fill="#FDE68A" fontSize="10" fontFamily="monospace" fontWeight="bold">
              🪤 TIME-SHIFTED CCTV GRAPH: ONLY 2 OF 18,000 METRO PASSENGERS TOUCHED LOCKER #14 WITHIN 30 MINS!
            </text>
          </svg>
        );

      // CASE 3 FEED 3: KEMPEGOWDA INTERNATIONAL AIRPORT (KIAL) TERMINAL-2 GATE-4 INTERCEPT
      case 'CAM-026':
      default:
        return (
          <svg className="w-full h-full" viewBox="0 0 680 280" preserveAspectRatio="none">
            <rect width="680" height="280" fill="#060B16" />
            {/* KIAL Terminal 2 Departure Forecourt */}
            <rect x="40" y="35" width="600" height="55" rx="6" fill="#0F1E36" stroke="#38BDF8" strokeWidth="1.5" />
            <text x="135" y="65" fill="#E0F2FE" fontSize="11" fontFamily="monospace" fontWeight="bold">
              ✈️ KEMPEGOWDA INTERNATIONAL AIRPORT (BLR) • TERMINAL 2 DEPARTURE GATE-4
            </text>
            <polygon points="0,275 680,275 560,105 120,105" fill="#0F172A" stroke="#1E293B" strokeWidth="2" />

            {/* Tracked Airport Taxi KA-04-D-3XX9 arriving & surrounded by CISF / Police Intercept */}
            <g transform={`translate(${140 + (pct % 45) * 2.2}, 150)`}>
              <rect x="-12" y="-24" width="225" height="78" fill="none" stroke="#10B981" strokeWidth="2" strokeDasharray="5 2" />
              <text x="-8" y="-29" fill="#6EE7B7" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                INTERCEPTED: TAXI KA-04-D-3XX9 (ZOYA MERCHANT)
              </text>
              <rect x="0" y="0" width="118" height="34" rx="6" fill="#F8FAFC" />
              <rect x="42" y="-7" width="30" height="7" rx="2" fill="#F59E0B" />
              <circle cx="24" cy="34" r="9" fill="#334155" stroke="#10B981" strokeWidth="2" />
              <circle cx="92" cy="34" r="9" fill="#334155" stroke="#10B981" strokeWidth="2" />
              {/* CISF / Police Intercept Team */}
              <circle cx="145" cy="8" r="8" fill="#38BDF8" />
              <rect x="137" y="16" width="16" height="26" rx="3" fill="#0284C7" />
              <circle cx="172" cy="8" r="8" fill="#10B981" />
              <rect x="164" y="16" width="16" height="26" rx="3" fill="#059669" />
            </g>
            <text x="16" y="262" fill="#6EE7B7" fontSize="10" fontFamily="monospace" fontWeight="bold">
              🎯 KIAL T2 GATE-4 INTERCEPT: HAWALA NOTE SERIAL OCR TRACKED TAXI KA-04-D-3XX9 BEFORE TAKEOFF!
            </text>
          </svg>
        );
    }
  };

  return (
    <div className="bg-[#0B1324] border-2 border-sky-500/45 rounded-xl p-4 space-y-3 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-[11px] font-bold">
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            {isHi ? 'लाइव सीसीटीवी और फॉरेंसिक वीडियो फुटेज' : 'LIVE CASE CCTV & FORENSIC VIDEO EVIDENCE DECK'}
          </span>
          <span className="text-xs font-bold text-white">
            {isHi ? currentFeed.titleHi : currentFeed.titleEn}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() =>
              speakCustomText(currentFeed.voiceEn, currentFeed.voiceHi, undefined, isHi ? 'hi' : 'en')
            }
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition shadow"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isHi ? '🔊 इस वीडियो फुटेज का विवरण सुनें' : '🔊 Explain This Video Feed (Voice)'}</span>
          </button>

          <button
            onClick={() => {
              setSelectedCameraId(currentFeed.camId);
              setActiveModule('cctv-intelligence');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/50 text-sky-200 font-bold text-xs transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{isHi ? 'फुल-स्क्रीन सीसीटीवी लैब में खोलें' : 'Open in Full CCTV Lab'}</span>
          </button>
        </div>
      </div>

      {/* 3 Camera Feed Switcher Pills for the Active Case */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {feeds.map((f, idx) => {
          const isSelected = idx === activeFeedIdx;
          return (
            <button
              key={f.camId}
              onClick={() => setActiveFeedIdx(idx)}
              className={`text-left p-2.5 rounded-lg border transition flex items-center justify-between gap-2 ${
                isSelected
                  ? 'bg-sky-950/90 border-sky-400 text-white shadow-md'
                  : 'bg-[#090D16]/80 border-slate-800 text-slate-300 hover:border-slate-600'
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <Cctv className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="font-mono text-[11px] font-bold text-sky-300">{f.camId}</span>
                  <span className="text-[10px] font-mono text-emerald-300 truncate">{f.timeStamp}</span>
                </div>
                <div className="text-xs font-bold text-white truncate mt-0.5">
                  {isHi ? f.titleHi : f.titleEn}
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono text-[10px] font-bold shrink-0">
                {isSelected ? (isHi ? 'चल रहा है' : 'PLAYING') : isHi ? 'देखें' : 'WATCH'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Animated Video Canvas + Controls */}
      <div className="rounded-xl overflow-hidden border border-slate-700 bg-[#050911] relative">
        <div className="h-64 md:h-72 w-full relative">
          {renderAnimatedSvgCanvas(currentFeed.camId, progress)}

          {/* Top-Left Camera Stamp */}
          <div className="absolute top-2.5 left-2.5 bg-[#090D16]/90 border border-slate-700 rounded px-2.5 py-1 text-[10px] font-mono text-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="font-bold text-sky-300">{currentFeed.camId}</span>
            <span>•</span>
            <span>{isHi ? currentFeed.locationHi : currentFeed.locationEn}</span>
            <span>•</span>
            <span className="text-emerald-300 font-bold">{currentFeed.timeStamp}</span>
          </div>

          {/* Top-Right Sovereign Trap Badge */}
          <div className="absolute top-2.5 right-2.5 bg-emerald-950/90 border border-emerald-400/60 rounded px-2.5 py-1 text-[10px] font-mono font-bold text-emerald-300">
            {isHi ? currentFeed.trapBadgeHi : currentFeed.trapBadgeEn}
          </div>
        </div>

        {/* Bottom Scrubber Bar */}
        <div className="bg-[#090D16] px-3 py-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? (isHi ? 'रोकें' : 'Pause') : isHi ? 'चलाएं' : 'Play'}</span>
            </button>
            <span className="text-[11px] font-mono text-slate-400">
              {isHi ? 'प्रोग्रेस:' : 'Timecode:'} 00:{String(Math.floor((progress / 100) * 59)).padStart(2, '0')} / 01:00
            </span>
          </div>

          <input
            type="range"
            aria-label="Case Video Scrubber"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="flex-1 max-w-md accent-sky-400 cursor-pointer"
          />

          <span className="text-[10px] font-mono text-emerald-400">
            SHA-256 SEALED • COURT-TRACEABLE VIDEO
          </span>
        </div>
      </div>
    </div>
  );
};
