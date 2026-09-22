'use client';

import React, { useState } from 'react';
import { soundManager } from '@/lib/sound';
import { DoraMetric } from '@/lib/types';
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Zap, 
  Clock, 
  ShieldCheck, 
  AlertTriangle,
  BarChart3,
  Sparkles
} from 'lucide-react';

const DORA_METRICS: DoraMetric[] = [
  {
    id: 'deploy-freq',
    title: 'Deployment Frequency',
    value: '48.2 / day',
    subtext: 'Multiple deploys per day on-demand',
    tier: 'Elite',
    change: '+18.4% vs last week',
    isPositive: true,
    history: [28, 34, 39, 41, 44, 46, 48.2],
    unit: 'deploys'
  },
  {
    id: 'lead-time',
    title: 'Lead Time for Changes',
    value: '14.5 mins',
    subtext: 'Commit to production runtime',
    tier: 'Elite',
    change: '-22.1% faster cycle',
    isPositive: true,
    history: [24, 21, 19, 17, 16, 15, 14.5],
    unit: 'minutes'
  },
  {
    id: 'mttr',
    title: 'Mean Time to Restore (MTTR)',
    value: '3.8 mins',
    subtext: 'Incident to full recovery',
    tier: 'Elite',
    change: '-34.0% recovery time',
    isPositive: true,
    history: [8.5, 7.2, 5.8, 5.1, 4.4, 4.0, 3.8],
    unit: 'minutes'
  },
  {
    id: 'change-fail',
    title: 'Change Failure Rate',
    value: '0.42%',
    subtext: 'Rollbacks or patch triggers',
    tier: 'Elite',
    change: '-0.15% failure rate',
    isPositive: true,
    history: [1.2, 0.9, 0.8, 0.6, 0.5, 0.45, 0.42],
    unit: 'percent'
  }
];

export default function DoraMetrics() {
  const [selectedMetric, setSelectedMetric] = useState<string>('deploy-freq');

  return (
    <section id="dora" style={{ padding: '6rem 0', position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Award size={14} />
            <span>State of DevOps 2026</span>
          </div>
          <h2 className="section-title">DORA Telemetry Command Center</h2>
          <p className="section-desc">
            Standardized Google DORA (DevOps Research and Assessment) benchmarks measuring software delivery throughput, stability, and engineering velocity.
          </p>
        </div>

        {/* Global Elite Performer Badge Banner */}
        <div className="glass-panel" style={{
          padding: '1.5rem 2rem',
          marginBottom: '2.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.1) 0%, rgba(157, 78, 221, 0.1) 100%)',
          border: '1px solid rgba(0, 242, 254, 0.3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #00f2fe 0%, #00f5a0 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(0, 242, 254, 0.5)',
            }}>
              <Sparkles size={26} color="#030814" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
                  GLOBAL ELITE TIER PERFORMER
                </h3>
                <span className="badge badge-emerald">TOP 3% INDUSTRY</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                All 4 core delivery metrics exceed standard high-velocity enterprise thresholds.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Overall Velocity Score
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.6rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>
                98.6 / 100
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Availability SLA
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.6rem', fontWeight: 900, color: 'var(--accent-emerald)' }}>
                99.999%
              </div>
            </div>
          </div>
        </div>

        {/* 4 DORA Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}>
          {DORA_METRICS.map((metric) => {
            const isSelected = selectedMetric === metric.id;
            // Generate SVG path for sparkline
            const min = Math.min(...metric.history);
            const max = Math.max(...metric.history);
            const range = max - min || 1;
            const points = metric.history.map((val, idx) => {
              const x = (idx / (metric.history.length - 1)) * 240;
              const y = 60 - ((val - min) / range) * 45;
              return `${x},${y}`;
            }).join(' ');

            return (
              <div
                key={metric.id}
                onClick={() => {
                  setSelectedMetric(metric.id);
                  soundManager.playBlip(750);
                }}
                className="glass-panel"
                style={{
                  padding: '1.6rem',
                  cursor: 'pointer',
                  border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: isSelected ? '0 10px 30px rgba(0, 242, 254, 0.2)' : 'var(--shadow-card)',
                  transform: isSelected ? 'translateY(-4px)' : 'none',
                  transition: 'all 0.25s ease',
                }}
              >
                {/* Top Badge & Tier */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span className="badge badge-emerald">ELITE TIER</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                    <TrendingUp size={14} />
                    <span>{metric.change}</span>
                  </div>
                </div>

                {/* Metric Title & Value */}
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 500 }}>
                  {metric.title}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '2.2rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  marginBottom: '0.4rem',
                  letterSpacing: '-0.02em',
                }}>
                  {metric.value}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.4rem' }}>
                  {metric.subtext}
                </div>

                {/* SVG Sparkline Chart */}
                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.6rem',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem', fontFamily: 'var(--font-mono)' }}>
                    7-DAY TREND
                  </div>
                  <svg width="100%" height="65" viewBox="0 0 240 65" style={{ overflow: 'visible' }}>
                    <polyline
                      fill="none"
                      stroke="url(#cyanGrad)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={points}
                    />
                    <defs>
                      <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00f2fe" />
                        <stop offset="100%" stopColor="#00f5a0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
