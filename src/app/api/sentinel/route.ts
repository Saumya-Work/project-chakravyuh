import { NextResponse } from 'next/server';
import {
  INITIAL_CASES,
  INITIAL_DEVICES,
  INITIAL_CAMERAS,
  INITIAL_VEHICLES,
  INITIAL_LEADS,
  INITIAL_EVIDENCE,
} from '@/data/syntheticData';

export async function GET() {
  return NextResponse.json({
    platform: 'PROJECT SENTINEL',
    version: '1.0.0',
    environment: 'DEMONSTRATION ENVIRONMENT — SYNTHETIC DATA ONLY',
    primaryCase: INITIAL_CASES[0].id,
    counts: {
      cases: INITIAL_CASES.length,
      devices: INITIAL_DEVICES.length,
      cameras: INITIAL_CAMERAS.length,
      vehicles: INITIAL_VEHICLES.length,
      leads: INITIAL_LEADS.length,
      evidencePackages: INITIAL_EVIDENCE.length,
    },
    safeguards: {
      syntheticDataOnly: true,
      livePhoneTracking: false,
      facialRecognition: false,
      automatedGuiltScoring: false,
      humanInTheLoopEnforced: true,
    },
  });
}

