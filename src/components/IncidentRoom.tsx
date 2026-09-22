'use client';

import React, { useState } from 'react';
import { soundManager } from '@/lib/sound';
import { IncidentAlert } from '@/lib/types';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Clock, 
  Flame, 
  ShieldCheck, 
  RotateCcw,
  Zap,
  Radio,
  Sparkles
} from 'lucide-react';

const INITIAL_INCIDENTS: IncidentAlert[] = [
  {
    id: 'inc-101',
    severity: 'critical',
    title: 'p99 Latency Spike on /v2/checkout (480ms > 50ms SLA)',
    service: 'checkout-service (us-east-1a)',
    timestamp: '2 mins ago',
    status: 'active',
    description: 'Database connection pool saturation detected. Connection queue depth reached 128/128.',
    mitigationAction: 'Trip Circuit Breaker & Enable Read-Replica Fallback',
  },
  {
    id: 'inc-102',
    severity: 'warning',
    title: 'Memory Utilization > 88% on worker-node-eu-west-1b',
    service: 'analytics-worker-daemon',
    timestamp: '6 mins ago',
    status: 'active',
    description: 'JVM heap growth rate abnormal following batch ETL job ingestion.',
    mitigationAction: 'Drain Node & Restart Garbage Collector',
  },
  {
    id: 'inc-103',
    severity: 'info',
    title: 'TLS Certificate Auto-Renewal Triggered',
    service: 'cert-manager (Let’s Encrypt)',
    timestamp: '14 mins ago',
    status: 'resolved',
    description: 'Wildcard domain *.synapse.dev renewed with zero traffic interruption.',
    mitigationAction: 'Automated Renewal Complete',
  },
];

export default function IncidentRoom() {
  const [incidents, setIncidents] = useState<IncidentAlert[]>(INITIAL_INCIDENTS);
  const [resolvedCount, setResolvedCount] = useState<number>(1);
  const [mitigatingId, setMitigatingId] = useState<string | null>(null);

  const handleMitigate = (incidentId: string) => {
    setMitigatingId(incidentId);
    soundManager.playAlert();

    setTimeout(() => {
      setIncidents((prev) =>
        prev.map((inc) =>
          inc.id === incidentId
            ? { ...inc, status: 'resolved' as const }
            : inc
        )
      );
      setMitigatingId(null);
      setResolvedCount((c) => c + 1);
      soundManager.playSuccess();
    }, 1400);
  };

  const handleReset = () => {
    soundManager.playBlip(600);
    setIncidents(INITIAL_INCIDENTS);
    setResolvedCount(1);
  };

  return (
    <section id="warroom" style={{ padding: '6rem 0', position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <ShieldAlert size={14} />
            <span>Reliability Engineering</span>
          </div>
          <h2 className="section-title">SRE Incident & Chaos War Room</h2>
          <p className="section-desc">
            Real-time observability alert stream with automated self-healing triggers, circuit breakers, and rapid automated incident triage.
          </p>
        </div>

        {/* War Room Overview HUD */}
        <div className="glass-panel" style={{
          padding: '1.5rem 2rem',
          marginBottom: '2.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          border: '1px solid rgba(255, 0, 127, 0.3)',
          background: 'linear-gradient(135deg, rgba(255, 0, 127, 0.08) 0%, rgba(13, 19, 33, 0.9) 100%)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'rgba(255, 0, 127, 0.2)',
              border: '1px solid rgba(255, 0, 127, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-rose)'
            }}>
              <Flame size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span>ON-CALL SRE CONTROL PLANE</span>
                <span className="badge badge-rose">LIVE INCIDENT STREAM</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Target Mean-Time-to-Recovery (MTTR): &lt; 5.0 minutes
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ACTIVE ALERTS</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
                {incidents.filter((i) => i.status === 'active').length} PENDING
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AUTO-HEALED</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                {resolvedCount} RESOLVED
              </div>
            </div>
            <button
              onClick={handleReset}
              className="btn btn-secondary"
              style={{ padding: '0.45rem 0.8rem', fontSize: '0.8rem' }}
              title="Reset Incidents"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Incident Alert Stream List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {incidents.map((incident) => {
            const isCritical = incident.severity === 'critical';
            const isWarning = incident.severity === 'warning';
            const isResolved = incident.status === 'resolved';
            const isMitigating = mitigatingId === incident.id;

            return (
              <div
                key={incident.id}
                className="glass-panel"
                style={{
                  padding: '1.5rem',
                  border: isResolved
                    ? '1px solid rgba(0, 245, 160, 0.25)'
                    : isCritical
                    ? '1px solid rgba(255, 0, 127, 0.4)'
                    : '1px solid rgba(255, 183, 3, 0.4)',
                  background: isResolved
                    ? 'rgba(7, 14, 22, 0.7)'
                    : 'var(--bg-glass)',
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}>
                  {/* Left Incident Info */}
                  <div style={{ maxWidth: '750px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                      <span className={`badge ${
                        isResolved ? 'badge-emerald' : isCritical ? 'badge-rose' : isWarning ? 'badge-amber' : 'badge-cyan'
                      }`}>
                        {isResolved ? 'RESOLVED' : incident.severity.toUpperCase()}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {incident.service}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={12} />
                        {incident.timestamp}
                      </span>
                    </div>

                    <h3 style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: isResolved ? 'var(--text-secondary)' : '#ffffff',
                      marginBottom: '0.4rem',
                      textDecoration: isResolved ? 'line-through' : 'none',
                    }}>
                      {incident.title}
                    </h3>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {incident.description}
                    </p>
                  </div>

                  {/* Right Mitigation Action */}
                  <div>
                    {isResolved ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--accent-emerald)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        fontFamily: 'var(--font-mono)',
                      }}>
                        <CheckCircle2 size={16} />
                        <span>Incident Mitigated</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleMitigate(incident.id)}
                        disabled={isMitigating}
                        className={isCritical ? 'btn btn-chaos' : 'btn btn-emerald'}
                        style={{ padding: '0.65rem 1.2rem', fontSize: '0.85rem' }}
                      >
                        {isMitigating ? (
                          <>
                            <span className="animate-spin-slow">⚙️</span>
                            <span>Applying Mitigation...</span>
                          </>
                        ) : (
                          <>
                            <Zap size={15} />
                            <span>{incident.mitigationAction}</span>
                          </>
                        )}
                      </button>
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
