'use client';

import React, { useState } from 'react';
import { soundManager } from '@/lib/sound';
import { 
  Activity, 
  Cpu, 
  Volume2, 
  VolumeX, 
  GitBranch, 
  ShieldCheck, 
  Terminal, 
  Server,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    soundManager.enabled = nextState;
    if (nextState) {
      soundManager.playSuccess();
    }
  };

  const navLinks = [
    { label: 'Pipeline', href: '#pipeline', icon: GitBranch },
    { label: 'Cluster Mesh', href: '#cluster', icon: Server },
    { label: 'DORA Metrics', href: '#dora', icon: Activity },
    { label: 'GitOps Engine', href: '#gitops', icon: Terminal },
    { label: 'Toolchain', href: '#toolchain', icon: Cpu },
    { label: 'War Room', href: '#warroom', icon: ShieldCheck },
  ];

  return (
    <header style={{
      position: 'fixed',
      top: '1rem',
      left: 0,
      right: 0,
      zIndex: 100,
      padding: '0 1.5rem',
      pointerEvents: 'none'
    }}>
      <div className="container" style={{ padding: 0 }}>
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(7, 11, 22, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 242, 254, 0.2)',
          borderRadius: 'var(--radius-full)',
          padding: '0.6rem 1.4rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 242, 254, 0.15)',
          pointerEvents: 'auto',
          position: 'relative',
        }}>
          {/* Brand Logo */}
          <a 
            href="#" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              textDecoration: 'none',
              color: 'var(--text-primary)'
            }}
            onClick={() => soundManager.playBlip(900)}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #00f2fe 0%, #7928ca 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(0, 242, 254, 0.5)',
              position: 'relative',
            }}>
              <Terminal size={18} color="#ffffff" />
              <div style={{
                position: 'absolute',
                inset: -2,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #00f2fe, #ff007f)',
                zIndex: -1,
                opacity: 0.6,
                filter: 'blur(4px)'
              }} />
            </div>
            <div>
              <div style={{ 
                fontFamily: 'var(--font-mono)', 
                fontWeight: 800, 
                fontSize: '1.1rem',
                letterSpacing: '-0.03em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <span style={{ 
                  background: 'linear-gradient(90deg, #00f2fe, #00f5a0)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent' 
                }}>SYNAPSE</span>
                <span style={{ color: '#fff', fontSize: '0.85rem', opacity: 0.8 }}>DEVOPS</span>
              </div>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.4rem',
            padding: '0.2rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }} className="desktop-nav">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => soundManager.playBlip(750)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--accent-cyan)';
                    e.currentTarget.style.background = 'rgba(0, 242, 254, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <Icon size={14} />
                  <span>{link.label}</span>
                </a>
              );
            })}
          </div>

          {/* Right Action Tools */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            {/* Live System Beacon */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(0, 245, 160, 0.08)',
              border: '1px solid rgba(0, 245, 160, 0.25)',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent-emerald)',
            }}>
              <span className="live-indicator" />
              <span style={{ fontWeight: 600 }}>99.999% SLA</span>
            </div>

            {/* Audio Toggle Button */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Disable Audio FX' : 'Enable Sci-Fi Audio FX'}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: soundEnabled ? 'rgba(0, 242, 254, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                border: soundEnabled ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                color: soundEnabled ? 'var(--accent-cyan)' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            {/* Quick Deploy CTA */}
            <a
              href="#pipeline"
              onClick={() => soundManager.playDeploy()}
              className="btn btn-primary"
              style={{
                padding: '0.45rem 1rem',
                fontSize: '0.85rem',
                borderRadius: 'var(--radius-full)',
              }}
            >
              <Sparkles size={14} />
              <span>Launch CI/CD</span>
            </a>
          </div>
        </nav>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .desktop-nav {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
