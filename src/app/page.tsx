"use client";

import React from 'react';
import { useSentinel } from '@/context/SentinelContext';
import { AppShell } from '@/components/layout/AppShell';
import { CommandCentreModule } from '@/components/modules/CommandCentreModule';
import { CasesModule } from '@/components/modules/CasesModule';
import { WorkspaceModule } from '@/components/modules/WorkspaceModule';
import { MobileIntelligenceModule } from '@/components/modules/MobileIntelligenceModule';
import { LocationIntelligenceModule } from '@/components/modules/LocationIntelligenceModule';
import { CctvIntelligenceModule } from '@/components/modules/CctvIntelligenceModule';
import { VehicleIntelligenceModule } from '@/components/modules/VehicleIntelligenceModule';
import { AiEngineModule } from '@/components/modules/AiEngineModule';
import { RelationshipExplorerModule } from '@/components/modules/RelationshipExplorerModule';
import { DigitalEvidenceModule } from '@/components/modules/DigitalEvidenceModule';
import { ReportsModule } from '@/components/modules/ReportsModule';
import { CollaborationModule } from '@/components/modules/CollaborationModule';
import { AdminAuditModule } from '@/components/modules/AdminAuditModule';

export default function ProjectSentinelPage() {
  const { activeModule } = useSentinel();

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'command-centre':
        return <CommandCentreModule />;
      case 'cases':
        return <CasesModule />;
      case 'workspace':
        return <WorkspaceModule />;
      case 'mobile-intelligence':
        return <MobileIntelligenceModule />;
      case 'location-intelligence':
        return <LocationIntelligenceModule />;
      case 'cctv-intelligence':
        return <CctvIntelligenceModule />;
      case 'vehicle-intelligence':
        return <VehicleIntelligenceModule />;
      case 'ai-engine':
        return <AiEngineModule />;
      case 'relationship-explorer':
        return <RelationshipExplorerModule />;
      case 'digital-evidence':
        return <DigitalEvidenceModule />;
      case 'reports':
        return <ReportsModule />;
      case 'collaboration':
        return <CollaborationModule />;
      case 'admin-audit':
        return <AdminAuditModule />;
      default:
        return <CommandCentreModule />;
    }
  };

  return <AppShell>{renderActiveModule()}</AppShell>;
}

