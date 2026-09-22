export type StageStatus = 'pending' | 'running' | 'success' | 'failed' | 'skipped';

export interface PipelineStage {
  id: string;
  name: string;
  tool: string;
  icon: string;
  status: StageStatus;
  duration: string;
  logs: string[];
  metrics?: { label: string; value: string }[];
}

export interface PodInfo {
  id: string;
  name: string;
  node: string;
  status: 'Running' | 'Pending' | 'Terminating' | 'CrashLoopBackOff' | 'ContainerCreating';
  cpu: number; // percentage
  memory: number; // MB
  restarts: number;
  age: string;
}

export interface NodeInfo {
  id: string;
  name: string;
  region: string;
  status: 'Ready' | 'NotReady';
  cpuUsage: number;
  memUsage: number;
  podCount: number;
}

export interface DoraMetric {
  id: string;
  title: string;
  value: string;
  subtext: string;
  tier: 'Elite' | 'High' | 'Medium' | 'Low';
  change: string;
  isPositive: boolean;
  history: number[];
  unit: string;
}

export interface ToolItem {
  name: string;
  category: 'orchestration' | 'cicd' | 'containers' | 'iac' | 'observability' | 'security';
  icon: string;
  tagline: string;
  description: string;
  role: string;
  version: string;
  popularity: string;
}

export interface IncidentAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  service: string;
  timestamp: string;
  status: 'active' | 'mitigating' | 'resolved';
  description: string;
  mitigationAction: string;
}
