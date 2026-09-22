import React from 'react';
import Hero from '@/components/Hero';
import PipelineVisualizer from '@/components/PipelineVisualizer';
import ClusterTopology from '@/components/ClusterTopology';
import DoraMetrics from '@/components/DoraMetrics';
import GitOpsEngine from '@/components/GitOpsEngine';
import ToolchainMatrix from '@/components/ToolchainMatrix';
import IncidentRoom from '@/components/IncidentRoom';

export default function HomePage() {
  return (
    <>
      <Hero />
      <PipelineVisualizer />
      <ClusterTopology />
      <DoraMetrics />
      <GitOpsEngine />
      <ToolchainMatrix />
      <IncidentRoom />
    </>
  );
}
