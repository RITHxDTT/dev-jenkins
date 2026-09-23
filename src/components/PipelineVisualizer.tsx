'use client';

import React, { useState, useEffect } from 'react';
import { soundManager } from '@/lib/sound';
import { PipelineStage, StageStatus } from '@/lib/types';
import {
  GitCommit,
  TestTube,
  ShieldAlert,
  Box,
  Send,
  Radio,
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  Terminal as TerminalIcon,
  ChevronRight,
  AlertTriangle,
  Flame
} from 'lucide-react';

const INITIAL_STAGES: PipelineStage[] = [
  {
    id: 'source',
    name: '1. Source & Lint',
    tool: 'Git & ESLint',
    icon: 'GitCommit',
    status: 'success',
    duration: '1.2s',
    logs: [
      '[00:00:01] ⚡ Webhook received: commit #e8f9a1b (branch: main)',
      '[00:00:01] 🔍 Executing ESLint v9 & TypeScript static analysis...',
      '[00:00:02] ✨ Zero syntax errors found in 184 source files.',
      '[00:00:02] 📦 Dependency lockfile hash verified against SHA-256.',
    ],
    metrics: [{ label: 'Files Checked', value: '184' }, { label: 'Lint Score', value: '100%' }]
  },
  {
    id: 'test',
    name: '2. Unit & Integration',
    tool: 'Jest & Vitest',
    icon: 'TestTube',
    status: 'success',
    duration: '4.8s',
    logs: [
      '[00:00:02] 🧪 Initializing Jest parallel test runners on 8 worker threads...',
      '[00:00:04] ↳ Running auth.spec.ts (28/28 passed)',
      '[00:00:05] ↳ Running billing.service.spec.ts (64/64 passed)',
      '[00:00:06] ↳ Running telemetry.collector.spec.ts (32/32 passed)',
      '[00:00:07] ✅ 428/428 tests passed. Code coverage: 94.8% (Target >= 90%).',
    ],
    metrics: [{ label: 'Tests Passed', value: '428/428' }, { label: 'Coverage', value: '94.8%' }]
  },
  {
    id: 'security',
    name: '3. SAST & SBOM Scan',
    tool: 'Trivy & Snyk',
    icon: 'ShieldAlert',
    status: 'success',
    duration: '3.1s',
    logs: [
      '[00:00:07] 🛡️ Inspecting SBOM dependencies for known CVE vulnerabilities...',
      '[00:00:09] 🔍 Scanning container base image: alpine:3.20.1',
      '[00:00:10] 🔐 Secrets detector: 0 hardcoded keys / API tokens found.',
      '[00:00:10] 🛡️ Security Gate PASSED: 0 Critical, 0 High, 0 Medium CVEs.',
    ],
    metrics: [{ label: 'CVEs Found', value: '0' }, { label: 'Gate Status', value: 'PASSED' }]
  },
  {
    id: 'build',
    name: '4. Containerize (OCI)',
    tool: 'Docker Buildx',
    icon: 'Box',
    status: 'success',
    duration: '8.4s',
    logs: [
      '[00:00:10] 🐳 Initiating multi-stage BuildKit container build...',
      '[00:00:12] ↳ [stage-1] compiling Next.js production bundle with Turbopack',
      '[00:00:15] ↳ [stage-2] extracting lightweight minimal runner layer',
      '[00:00:17] 🏷️ Tagged image: registry.devops.io/synapse-core:v2.4.8 (Size: 42.1MB)',
      '[00:00:18] 🚀 Image pushed to AWS ECR with digest sha256:49c81b9...',
    ],
    metrics: [{ label: 'Image Size', value: '42.1 MB' }, { label: 'Build Time', value: '8.4s' }]
  },
  {
    id: 'canary',
    name: '5. Canary Rollout',
    tool: 'Argo Rollouts',
    icon: 'Send',
    status: 'success',
    duration: '12.0s',
    logs: [
      '[00:00:18] 🚦 Initiating progressive delivery via Argo Rollouts...',
      '[00:00:20] ↳ Step 1: Routing 10% of live traffic to canary replicaset',
      '[00:00:25] ↳ Telemetry Analysis: p99 Latency = 18ms, Error Rate = 0.00%',
      '[00:00:27] ↳ Step 2: Escalating to 50% traffic weight...',
      '[00:00:30] 🌟 Health validation check: Prometheus PrometheusRule 100% OK.',
    ],
    metrics: [{ label: 'Canary Traffic', value: '50% -> 100%' }, { label: 'Error Rate', value: '0.00%' }]
  },
  {
    id: 'live',
    name: '6. Production Live',
    tool: 'K8s Cluster',
    icon: 'Radio',
    status: 'success',
    duration: '2.5s',
    logs: [
      '[00:00:30] 🚀 Promoting canary to stable release across 3 multi-zone clusters.',
      '[00:00:31] 🔄 Graceful termination of previous replica version pods.',
      '[00:00:32] 📈 Datadog & Prometheus dashboards updated: Release v2.4.8 Active.',
      '[00:00:33] 🎉 Zero-downtime deployment successfully completed!',
    ],
    metrics: [{ label: 'Active Pods', value: '32 Replicas' }, { label: 'Live SLA', value: '100.0%' }]
  },
];

export default function PipelineVisualizer() {
  const [stages, setStages] = useState<PipelineStage[]>(INITIAL_STAGES);
  const [selectedStageId, setSelectedStageId] = useState<string>('source');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [scenario, setScenario] = useState<'standard' | 'security_breach' | 'canary_fail'>('standard');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);

  const selectedStage = stages.find((s) => s.id === selectedStageId) || stages[0];

  const handleStageClick = (stageId: string) => {
    soundManager.playBlip(700);
    setSelectedStageId(stageId);
  };

  const runPipelineExecution = () => {
    if (isRunning) return;
    setIsRunning(true);
    soundManager.playDeploy();

    // Reset all stages to pending
    const reset = stages.map((st) => ({
      ...st,
      status: 'pending' as StageStatus,
    }));
    setStages(reset);
    setActiveStepIndex(0);
    setSelectedStageId(reset[0].id);

    let currentIdx = 0;

    const interval = setInterval(() => {
      if (currentIdx >= stages.length) {
        clearInterval(interval);
        setIsRunning(false);
        setActiveStepIndex(-1);
        soundManager.playSuccess();
        return;
      }

      setStages((prev) => {
        const updated = [...prev];
        // Handle scenario deviations
        if (scenario === 'security_breach' && currentIdx === 2) {
          updated[currentIdx] = {
            ...updated[currentIdx],
            status: 'failed',
            logs: [
              '[00:00:07] 🛡️ Inspecting SBOM dependencies...',
              '[00:00:08] 🚨 CRITICAL VULNERABILITY DETECTED: CVE-2026-9901 in libcrypto.so',
              '[00:00:09] ❌ Pipeline aborted by Security Policy Engine.',
              '[00:00:09] 🔒 Quarantine build artifact created & Slack alert sent to SecOps.',
            ],
          };
          clearInterval(interval);
          setIsRunning(false);
          soundManager.playAlert();
          return updated;
        }

        if (scenario === 'canary_fail' && currentIdx === 4) {
          updated[currentIdx] = {
            ...updated[currentIdx],
            status: 'failed',
            logs: [
              '[00:00:18] 🚦 Routing 10% traffic to canary pods...',
              '[00:00:22] ⚠️ Alert: HTTP 500 error rate spiked to 4.8% on endpoint /api/checkout',
              '[00:00:24] 🛑 Automated Rollback initiated by Argo Rollouts controller!',
              '[00:00:26] ↩️ Restored 100% traffic to stable release v2.4.7 (0 downtime).',
            ],
          };
          clearInterval(interval);
          setIsRunning(false);
          soundManager.playAlert();
          return updated;
        }

        // Normal success step
        updated[currentIdx] = {
          ...updated[currentIdx],
          status: 'success',
        };
        return updated;
      });

      setSelectedStageId(stages[currentIdx].id);
      soundManager.playBlip(900 + currentIdx * 100);

      currentIdx++;
      setActiveStepIndex(currentIdx);
    }, 1200);
  };

  const resetPipeline = () => {
    soundManager.playBlip(500);
    setStages(INITIAL_STAGES);
    setIsRunning(false);
    setActiveStepIndex(-1);
    setSelectedStageId('source');
  };

  return (
    <section id="pipeline" style={{ padding: '6rem 0', position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Radio size={14} />
            <span>Autonomous Delivery Engine</span>
          </div>
          <h2 className="section-title">Interactive CI/CD Pipeline Simulator</h2>
          <p className="section-desc">
            Experience end-to-end automated software delivery with real-time log telemetry, SAST security gates, container builds, and canary traffic shifts.
          </p>
        </div>

        {/* Controls Bar */}
        <div className="glass-panel" style={{
          padding: '1.2rem 1.75rem',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          border: '1px solid rgba(0, 242, 254, 0.25)',
        }}>
          {/* Scenario Picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              EXECUTION SCENARIO:
            </span>
            <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(0,0,0,0.4)', padding: '0.3rem', borderRadius: 'var(--radius-md)' }}>
              <button
                onClick={() => { setScenario('standard'); soundManager.playBlip(700); }}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: scenario === 'standard' ? 'var(--accent-cyan)' : 'transparent',
                  color: scenario === 'standard' ? '#040d1a' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                }}
              >
                Standard Clean Pass
              </button>
              <button
                onClick={() => { setScenario('security_breach'); soundManager.playBlip(700); }}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: scenario === 'security_breach' ? 'var(--accent-rose)' : 'transparent',
                  color: scenario === 'security_breach' ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                }}
              >
                Security CVE Gate
              </button>
              <button
                onClick={() => { setScenario('canary_fail'); soundManager.playBlip(700); }}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: scenario === 'canary_fail' ? 'var(--accent-amber)' : 'transparent',
                  color: scenario === 'canary_fail' ? '#040d1a' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                }}
              >
                Canary Auto-Rollback
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <button
              onClick={runPipelineExecution}
              disabled={isRunning}
              className="btn btn-primary"
              style={{ padding: '0.6rem 1.4rem' }}
            >
              {isRunning ? (
                <>
                  <span className="animate-spin-slow">⚙️</span>
                  <span>Executing Pipeline...</span>
                </>
              ) : (
                <>
                  <Play size={16} fill="#030814" />
                  <span>Run Pipeline</span>
                </>
              )}
            </button>
            <button
              onClick={resetPipeline}
              className="btn btn-secondary"
              style={{ padding: '0.6rem 1rem' }}
              title="Reset Pipeline"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Multi-Stage Visual Ribbon */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          {stages.map((stage, idx) => {
            const isSelected = stage.id === selectedStageId;
            const isCurrentActive = idx === activeStepIndex;

            let statusColor = 'var(--text-muted)';
            let statusGlow = 'none';
            let StatusIcon = Clock;

            if (stage.status === 'success') {
              statusColor = 'var(--accent-emerald)';
              statusGlow = '0 0 15px rgba(0, 245, 160, 0.4)';
              StatusIcon = CheckCircle;
            } else if (stage.status === 'failed') {
              statusColor = 'var(--accent-rose)';
              statusGlow = '0 0 15px rgba(255, 0, 127, 0.5)';
              StatusIcon = XCircle;
            } else if (stage.status === 'running' || isCurrentActive) {
              statusColor = 'var(--accent-cyan)';
              statusGlow = '0 0 20px rgba(0, 242, 254, 0.6)';
              StatusIcon = Radio;
            }

            return (
              <div
                key={stage.id}
                onClick={() => handleStageClick(stage.id)}
                className="glass-panel"
                style={{
                  padding: '1.2rem',
                  cursor: 'pointer',
                  border: isSelected
                    ? `1px solid ${statusColor}`
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isSelected
                    ? 'rgba(14, 24, 48, 0.9)'
                    : 'var(--bg-glass)',
                  transform: isSelected ? 'translateY(-3px)' : 'none',
                  boxShadow: isSelected ? statusGlow : 'var(--shadow-card)',
                  transition: 'all 0.25s ease',
                  position: 'relative',
                }}
              >
                {/* Stage top row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    fontWeight: 600,
                  }}>
                    STEP 0{idx + 1}
                  </span>
                  <StatusIcon size={16} color={statusColor} className={isCurrentActive ? 'animate-spin-slow' : ''} />
                </div>

                {/* Stage Title */}
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.3rem' }}>
                  {stage?.name?.includes('. ') ? stage.name.split('. ')[1] : stage?.name || 'Stage'}
                </div>

                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--accent-cyan)',
                  fontFamily: 'var(--font-mono)',
                  marginBottom: '0.6rem'
                }}>
                  {stage.tool}
                </div>

                {/* Duration Badge */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                }}>
                  <Clock size={12} />
                  <span>{stage.duration}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stage Deep Dive & Streaming Terminal */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}>
          {/* Terminal Logs View */}
          <div className="terminal-box" style={{ minHeight: '340px' }}>
            <div className="terminal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div className="terminal-dots">
                  <div className="terminal-dot red" />
                  <div className="terminal-dot yellow" />
                  <div className="terminal-dot green" />
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  pipeline://synapse-runner/stage/{selectedStage.id}.log
                </span>
              </div>
              <span className={`badge ${
                selectedStage.status === 'success' ? 'badge-emerald' :
                selectedStage.status === 'failed' ? 'badge-rose' : 'badge-cyan'
              }`}>
                {selectedStage.status.toUpperCase()}
              </span>
            </div>

            <div className="terminal-body" style={{ minHeight: '260px' }}>
              {selectedStage.logs.map((log, index) => (
                <div key={index} style={{ marginBottom: '0.45rem', fontSize: '0.85rem' }}>
                  {log.includes('🚨') || log.includes('❌') ? (
                    <span className="code-rose">{log}</span>
                  ) : log.includes('⚠️') ? (
                    <span style={{ color: 'var(--accent-amber)' }}>{log}</span>
                  ) : log.includes('✅') || log.includes('✨') || log.includes('🌟') ? (
                    <span className="code-emerald">{log}</span>
                  ) : log.includes('⚡') || log.includes('🚀') || log.includes('🐳') ? (
                    <span className="code-cyan">{log}</span>
                  ) : (
                    <span>{log}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Stage Telemetry Specs */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.2rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(0, 242, 254, 0.1)',
                border: '1px solid rgba(0, 242, 254, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-cyan)'
              }}>
                <TerminalIcon size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
                  {selectedStage.name}
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Orchestrated by {selectedStage.tool}
                </span>
              </div>
            </div>

            {/* Metrics List */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              {selectedStage.metrics?.map((m, idx) => (
                <div key={idx} style={{
                  padding: '1rem',
                  background: 'rgba(0, 0, 0, 0.35)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                    {m.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                    {m.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Architectural Stage Details */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-md)',
              padding: '1.2rem',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>
                DevOps Pipeline Guardrails:
              </div>
              <ul style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)'
              }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ChevronRight size={14} color="var(--accent-emerald)" />
                  <span>Automated ephemeral preview environment provisioning per pull request</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ChevronRight size={14} color="var(--accent-emerald)" />
                  <span>Continuous vulnerability attestation with SLSA Level 3 compliance</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ChevronRight size={14} color="var(--accent-emerald)" />
                  <span>Real-time metric analysis with automated zero-touch rollback threshold</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
