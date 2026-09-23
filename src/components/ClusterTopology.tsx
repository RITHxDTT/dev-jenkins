'use client';

import React, { useState, useEffect } from 'react';
import { soundManager } from '@/lib/sound';
import { PodInfo, NodeInfo } from '@/lib/types';
import {
  Server,
  Cpu,
  HardDrive,
  Activity,
  Plus,
  Minus,
  Skull,
  RefreshCw,
  Layers,
  CheckCircle2,
  AlertCircle,
  Zap,
  Globe
} from 'lucide-react';

const INITIAL_NODES: NodeInfo[] = [
  { id: 'node-1', name: 'edge-worker-us-east-1a', region: 'us-east-1 (N. Virginia)', status: 'Ready', cpuUsage: 42, memUsage: 58, podCount: 6 },
  { id: 'node-2', name: 'core-worker-eu-west-1b', region: 'eu-west-1 (Frankfurt)', status: 'Ready', cpuUsage: 56, memUsage: 64, podCount: 7 },
  { id: 'node-3', name: 'ai-gpu-worker-ap-east-1', region: 'ap-east-1 (Tokyo)', status: 'Ready', cpuUsage: 31, memUsage: 45, podCount: 5 },
];

const INITIAL_PODS: PodInfo[] = [
  { id: 'pod-1', name: 'api-gateway-7b94c', node: 'edge-worker-us-east-1a', status: 'Running', cpu: 18, memory: 240, restarts: 0, age: '14d' },
  { id: 'pod-2', name: 'auth-service-5f82a', node: 'edge-worker-us-east-1a', status: 'Running', cpu: 12, memory: 180, restarts: 0, age: '14d' },
  { id: 'pod-3', name: 'checkout-v2-88d3e', node: 'core-worker-eu-west-1b', status: 'Running', cpu: 28, memory: 420, restarts: 1, age: '4d' },
  { id: 'pod-4', name: 'inventory-svc-44k1a', node: 'core-worker-eu-west-1b', status: 'Running', cpu: 15, memory: 310, restarts: 0, age: '9d' },
  { id: 'pod-5', name: 'payment-processor-99x7c', node: 'core-worker-eu-west-1b', status: 'Running', cpu: 22, memory: 290, restarts: 0, age: '12d' },
  { id: 'pod-6', name: 'telemetry-stream-12b4f', node: 'ai-gpu-worker-ap-east-1', status: 'Running', cpu: 35, memory: 580, restarts: 0, age: '18d' },
  { id: 'pod-7', name: 'neural-recommender-61c8a', node: 'ai-gpu-worker-ap-east-1', status: 'Running', cpu: 44, memory: 890, restarts: 2, age: '2d' },
  { id: 'pod-8', name: 'cache-redis-sentinel-0', node: 'edge-worker-us-east-1a', status: 'Running', cpu: 8, memory: 150, restarts: 0, age: '28d' },
];

export default function ClusterTopology() {
  const [nodes, setNodes] = useState<NodeInfo[]>(INITIAL_NODES);
  const [pods, setPods] = useState<PodInfo[]>(INITIAL_PODS);
  const [chaosLog, setChaosLog] = useState<string | null>(null);
  const [selectedNamespace, setSelectedNamespace] = useState<'production' | 'staging' | 'kube-system'>('production');

  // Scale pod count
  const handleAddPod = () => {
    soundManager.playBlip(800);
    const newId = `pod-${Date.now().toString().slice(-4)}`;
    const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
    const services = ['api-gateway', 'checkout-v2', 'auth-service', 'worker-queue', 'search-engine'];
    const serviceName = services[Math.floor(Math.random() * services.length)];
    const randomHash = Math.random().toString(36).substring(2, 7);

    const newPod: PodInfo = {
      id: newId,
      name: `${serviceName}-${randomHash}`,
      node: randomNode.name,
      status: 'ContainerCreating',
      cpu: Math.floor(Math.random() * 25) + 10,
      memory: Math.floor(Math.random() * 300) + 150,
      restarts: 0,
      age: '0s',
    };

    setPods((prev) => [newPod, ...prev]);

    // Transition from ContainerCreating to Running
    setTimeout(() => {
      setPods((prev) =>
        prev.map((p) => (p.id === newId ? { ...p, status: 'Running' } : p))
      );
      soundManager.playSuccess();
    }, 1200);
  };

  const handleRemovePod = () => {
    if (pods.length <= 3) return;
    soundManager.playBlip(600);
    const podToRemove = pods[0];

    // Mark as terminating
    setPods((prev) =>
      prev.map((p) => (p.id === podToRemove.id ? { ...p, status: 'Terminating' } : p))
    );

    setTimeout(() => {
      setPods((prev) => prev.filter((p) => p.id !== podToRemove.id));
    }, 1000);
  };

  // Chaos Monkey Simulator: Kill random pod & auto-heal
  const triggerChaosMonkey = () => {
    if (pods.length === 0) return;
    soundManager.playPodKill();

    const runningPods = pods.filter((p) => p.status === 'Running');
    if (runningPods.length === 0) return;

    const targetPod = runningPods[Math.floor(Math.random() * runningPods.length)];
    setChaosLog(` CHAOS MONKEY INJECTED: SIGKILL sent to ${targetPod.name} on ${targetPod.node}`);

    // Mark target as CrashLoopBackOff / Terminating
    setPods((prev) =>
      prev.map((p) => (p.id === targetPod.id ? { ...p, status: 'CrashLoopBackOff', restarts: p.restarts + 1 } : p))
    );

    // After 1.5 seconds, auto-heal replica replacement
    setTimeout(() => {
      soundManager.playDeploy();
      const baseName = targetPod?.name ? targetPod.name.split('-')[0] : 'service';
      setChaosLog(`🔄 K8s REPLICA-SET HEALING: Spawning new healthy pod replica for ${baseName}...`);

      setPods((prev) =>
        prev.map((p) => {
          if (p.id === targetPod.id) {
            const currentBase = p?.name ? p.name.split('-')[0] : 'service';
            return {
              ...p,
              name: `${currentBase}-${Math.random().toString(36).substring(2, 7)}`,
              status: 'ContainerCreating',
              age: '1s',
            };
          }
          return p;
        })
      );

      setTimeout(() => {
        setPods((prev) =>
          prev.map((p) => (p.id === targetPod.id ? { ...p, status: 'Running' } : p))
        );
        soundManager.playSuccess();
        setChaosLog(` REPLICA-SET RECOVERED: Cluster topology 100% nominal. Zero traffic dropped.`);
      }, 1500);
    }, 1800);
  };

  return (
    <section id="cluster" style={{ padding: '6rem 0', position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Globe size={14} />
            <span>Multi-Region Mesh Topology</span>
          </div>
          <h2 className="section-title">Kubernetes Cluster & Chaos Engine</h2>
          <p className="section-desc">
            Monitor dynamic pod distribution across cloud worker nodes, scale microservice replicas on-the-fly, and test self-healing resilience with Chaos Engineering.
          </p>
        </div>

        {/* Top Control HUD */}
        <div className="glass-panel" style={{
          padding: '1.25rem 1.75rem',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          border: '1px solid rgba(0, 245, 160, 0.25)',
        }}>
          {/* Namespace Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              NAMESPACE:
            </span>
            <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(0,0,0,0.4)', padding: '0.3rem', borderRadius: 'var(--radius-md)' }}>
              {(['production', 'staging', 'kube-system'] as const).map((ns) => (
                <button
                  key={ns}
                  onClick={() => { setSelectedNamespace(ns); soundManager.playBlip(700); }}
                  style={{
                    padding: '0.35rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: selectedNamespace === ns ? 'var(--accent-emerald)' : 'transparent',
                    color: selectedNamespace === ns ? '#04100c' : 'var(--text-secondary)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {ns}
                </button>
              ))}
            </div>
          </div>

          {/* Pod Scaling & Chaos Triggers */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Scale Controls */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '0.3rem 0.6rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginRight: '0.3rem' }}>
                Replicas ({pods.length}):
              </span>
              <button
                onClick={handleRemovePod}
                className="btn btn-secondary"
                style={{ padding: '0.35rem 0.6rem', height: '28px', minWidth: '28px' }}
                title="Scale In (-1 Pod)"
              >
                <Minus size={14} />
              </button>
              <button
                onClick={handleAddPod}
                className="btn btn-emerald"
                style={{ padding: '0.35rem 0.6rem', height: '28px', minWidth: '28px' }}
                title="Scale Out (+1 Pod)"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Chaos Monkey Button */}
            <button
              onClick={triggerChaosMonkey}
              className="btn btn-chaos"
              style={{ padding: '0.55rem 1.2rem', fontSize: '0.85rem' }}
            >
              <Skull size={16} />
              <span>Inject Chaos Disruption</span>
            </button>
          </div>
        </div>

        {/* Chaos Banner (if active) */}
        {chaosLog && (
          <div style={{
            padding: '0.85rem 1.4rem',
            background: chaosLog.includes('💥') ? 'rgba(255, 0, 127, 0.15)' : 'rgba(0, 245, 160, 0.15)',
            border: `1px solid ${chaosLog.includes('💥') ? 'rgba(255, 0, 127, 0.4)' : 'rgba(0, 245, 160, 0.4)'}`,
            borderRadius: 'var(--radius-md)',
            marginBottom: '2rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            color: chaosLog.includes('💥') ? '#ff79b8' : 'var(--accent-emerald)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            animation: 'pulseGlow 2s infinite',
          }}>
            <span>{chaosLog}</span>
            <button
              onClick={() => setChaosLog(null)}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.6 }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Worker Node Layout Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.75rem',
          marginBottom: '2.5rem',
        }}>
          {nodes.map((node) => {
            const nodePods = pods.filter((p) => p.node === node.name);
            return (
              <div
                key={node.id}
                className="glass-panel glow-emerald-hover"
                style={{
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                {/* Node Title & Status */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Server size={18} color="var(--accent-emerald)" />
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                        {node.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {node.region}
                      </div>
                    </div>
                  </div>
                  <span className="badge badge-emerald">Ready</span>
                </div>

                {/* Node Utilization Meters */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.8rem',
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.2rem',
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      <span>CPU Load</span>
                      <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{node.cpuUsage}%</span>
                    </div>
                    <div style={{ height: '5px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${node.cpuUsage}%`, background: 'var(--accent-cyan)' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      <span>Memory</span>
                      <span style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>{node.memUsage}%</span>
                    </div>
                    <div style={{ height: '5px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${node.memUsage}%`, background: 'var(--accent-purple)' }} />
                    </div>
                  </div>
                </div>

                {/* Hosted Pods Grid */}
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
                    Hosted Pod Replicas ({nodePods.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {nodePods.length === 0 ? (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontStyle: 'italic', padding: '0.5rem 0' }}>
                        No active pods on this node
                      </div>
                    ) : (
                      nodePods.map((pod) => {
                        let podBadgeClass = 'badge-emerald';
                        if (pod.status === 'CrashLoopBackOff' || pod.status === 'Terminating') podBadgeClass = 'badge-rose';
                        if (pod.status === 'ContainerCreating' || pod.status === 'Pending') podBadgeClass = 'badge-amber';

                        return (
                          <div
                            key={pod.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.55rem 0.8rem',
                              background: 'rgba(255, 255, 255, 0.03)',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid rgba(255, 255, 255, 0.04)',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.8rem',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Layers size={14} color="var(--accent-cyan)" />
                              <span style={{ color: '#fff', fontWeight: 500 }}>{pod.name}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{pod.memory}MB</span>
                              <span className={`badge ${podBadgeClass}`} style={{ fontSize: '0.65rem' }}>
                                {pod.status}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
