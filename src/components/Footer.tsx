'use client';

import React from 'react';
import { Terminal, Shield, GitCommit, Heart, Sparkles } from 'lucide-react';
import { soundManager } from '@/lib/sound';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      background: 'rgba(3, 5, 10, 0.95)',
      padding: '4rem 0 2rem',
      position: 'relative',
      zIndex: 10,
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem',
        }}>
          {/* Col 1: Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #00f2fe 0%, #7928ca 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Terminal size={16} color="#fff" />
              </div>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                fontSize: '1.1rem',
                background: 'linear-gradient(90deg, #00f2fe, #00f5a0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                SYNAPSE DEVOPS
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.2rem' }}>
              Next-generation autonomous CI/CD control plane, GitOps declarative synchronization, and high-frequency cloud native delivery.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
              <span className="live-indicator" />
              <span>Kubernetes v1.31.0 • Global Mesh Online</span>
            </div>
          </div>

          {/* Col 2: Architecture Principles */}
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Core Tenets
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <li>• Immutable Infrastructure via OpenTofu/Terraform</li>
              <li>• Declarative GitOps Reconcile (ArgoCD)</li>
              <li>• Zero-Trust Shift-Left Security Gate (SAST/DAST)</li>
              <li>• DORA Metrics Continuous Telemetry</li>
            </ul>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Control Modules
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li><a href="#pipeline" onClick={() => soundManager.playBlip(700)} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>CI/CD Pipeline Simulator</a></li>
              <li><a href="#cluster" onClick={() => soundManager.playBlip(700)} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Kubernetes Mesh & Chaos</a></li>
              <li><a href="#dora" onClick={() => soundManager.playBlip(700)} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>DORA Telemetry Center</a></li>
              <li><a href="#gitops" onClick={() => soundManager.playBlip(700)} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>GitOps & IaC Engine</a></li>
              <li><a href="#warroom" onClick={() => soundManager.playBlip(700)} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>SRE Incident War Room</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
        }}>
          <div>
            SYNAPSE Control Plane © {new Date().getFullYear()} • High Velocity Continuous Delivery
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>Built for Modern Cloud Engineering</span>
            <Sparkles size={14} color="var(--accent-cyan)" />
          </div>
        </div>
      </div>
    </footer>
  );
}
