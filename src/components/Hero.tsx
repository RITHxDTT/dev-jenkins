'use client';

import React, { useEffect, useRef, useState } from 'react';
import { soundManager } from '@/lib/sound';
import confetti from 'canvas-confetti';
import { 
  Rocket, 
  Terminal, 
  ShieldCheck, 
  GitPullRequest, 
  Server, 
  Zap, 
  ArrowRight,
  Layers,
  Cpu,
  CheckCircle2,
  Play
} from 'lucide-react';

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [deployCount, setDeployCount] = useState(2491820);
  const [isDeploying, setIsDeploying] = useState(false);
  const [currentCommit, setCurrentCommit] = useState('feat(core): dynamic-canary-mesh #7a9c2');

  // Canvas particle & cyber grid network effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight * 0.9);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight * 0.9;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes for DevOps network mesh
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      pulse: number;
    }> = [];

    const colors = ['#00f2fe', '#9d4edd', '#00f5a0', '#4facfe'];
    const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2.5 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connecting mesh lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 160) {
            const alpha = (1 - dist / 160) * 0.25;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particle nodes
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.03;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const currentRadius = p.radius + Math.sin(p.pulse) * 0.8;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Trigger Instant Deployment simulation
  const handleTriggerDeploy = () => {
    if (isDeploying) return;
    setIsDeploying(true);
    soundManager.playDeploy();

    // Trigger celebratory cyber confetti
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#00f2fe', '#00f5a0', '#9d4edd', '#ffffff']
    });

    const randomHash = Math.random().toString(36).substring(2, 7);
    setCurrentCommit(`deploy(release): v2.4.${Math.floor(Math.random() * 90) + 10} #${randomHash}`);
    setDeployCount((prev) => prev + 1);

    setTimeout(() => {
      setIsDeploying(false);
      soundManager.playSuccess();
    }, 1800);
  };

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      paddingTop: '7rem',
      paddingBottom: '4rem',
      overflow: 'hidden'
    }}>
      {/* Dynamic Animated Canvas Grid */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.75,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3.5rem',
          alignItems: 'center',
        }}>
          {/* Left Column: Hero Content */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(0, 242, 254, 0.08)',
              border: '1px solid rgba(0, 242, 254, 0.25)',
              marginBottom: '1.5rem',
              backdropFilter: 'blur(10px)',
            }}>
              <Zap size={14} color="#00f2fe" />
              <span style={{ 
                fontFamily: 'var(--font-mono)', 
                fontSize: '0.8rem', 
                color: 'var(--accent-cyan)',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}>
                Autonomous Continuous Delivery 3.0
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              marginBottom: '1.4rem',
            }}>
              Engineering Velocity <br />
              <span style={{
                background: 'linear-gradient(135deg, #00f2fe 0%, #00f5a0 50%, #9d4edd 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}>
                Powered by GitOps.
              </span>
            </h1>

            <p style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: '2.2rem',
              maxWidth: '560px',
            }}>
              Orchestrate high-frequency pipelines, zero-downtime canary rollouts, and self-healing multi-cloud Kubernetes clusters with real-time telemetry and automated security scanning.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}>
              <button
                onClick={handleTriggerDeploy}
                className="btn btn-primary"
                style={{
                  padding: '0.9rem 1.8rem',
                  fontSize: '1rem',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                disabled={isDeploying}
              >
                {isDeploying ? (
                  <>
                    <span className="animate-spin-slow" style={{ display: 'inline-block' }}>⚙️</span>
                    <span>Reconciling Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Play size={18} fill="#030814" />
                    <span>Trigger Production Deploy</span>
                  </>
                )}
              </button>

              <a
                href="#pipeline"
                onClick={() => soundManager.playBlip(600)}
                className="btn btn-secondary"
                style={{ padding: '0.9rem 1.6rem', fontSize: '1rem' }}
              >
                <span>Explore Live Pipeline</span>
                <ArrowRight size={16} />
              </a>
            </div>

            {/* Quick Metrics Ticker */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '1.5rem',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
                  {deployCount.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Global Deploys
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                  11.4 min
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Lead Time to Prod
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                  99.998%
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Pipeline Success
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Holographic DevOps HUD Card */}
          <div style={{ position: 'relative' }}>
            {/* Ambient Backlight */}
            <div style={{
              position: 'absolute',
              inset: '-10%',
              background: 'radial-gradient(circle, rgba(0, 242, 254, 0.2) 0%, rgba(157, 78, 221, 0.15) 50%, transparent 70%)',
              filter: 'blur(40px)',
              zIndex: -1,
            }} />

            {/* Main Interactive Hologram Panel */}
            <div className="glass-panel" style={{
              padding: '1.75rem',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.7), 0 0 30px rgba(0, 242, 254, 0.15)',
            }}>
              {/* Header HUD */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                paddingBottom: '1rem',
                marginBottom: '1.2rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: isDeploying ? 'var(--accent-amber)' : 'var(--accent-emerald)',
                    boxShadow: isDeploying ? '0 0 10px var(--accent-amber)' : '0 0 10px var(--accent-emerald)',
                  }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700 }}>
                    {isDeploying ? 'RECONCILING PIPELINE' : 'CLUSTER STATE: SYNCED'}
                  </span>
                </div>
                <span className="badge badge-cyan">v2.4-k8s-prod</span>
              </div>

              {/* Commit Stream Card */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.4)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                marginBottom: '1.2rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  <GitPullRequest size={14} color="#00f2fe" />
                  <span>Active Release Hash</span>
                </div>
                <div style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
                  {currentCommit}
                </div>
              </div>

              {/* Mini Pipeline Progression Preview */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span>Security Scan (Trivy + Snyk)</span>
                  <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>0 Vulnerabilities</span>
                </div>
                <div style={{
                  height: '6px',
                  borderRadius: '3px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: isDeploying ? '70%' : '100%',
                    background: 'linear-gradient(90deg, #00f2fe, #00f5a0)',
                    borderRadius: '3px',
                    transition: 'width 0.5s ease',
                  }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                  <span>Canary Weight (Argo Rollouts)</span>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{isDeploying ? 'Canary 25%' : '100% Live'}</span>
                </div>
                <div style={{
                  height: '6px',
                  borderRadius: '3px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: isDeploying ? '25%' : '100%',
                    background: 'linear-gradient(90deg, #9d4edd, #00f2fe)',
                    borderRadius: '3px',
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>

              {/* Cluster Nodes Mini Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
              }}>
                {[
                  { name: 'us-east-1a', pods: '12 Pods', load: '38% CPU' },
                  { name: 'eu-central-1', pods: '16 Pods', load: '44% CPU' },
                  { name: 'ap-south-1', pods: '8 Pods', load: '22% CPU' },
                ].map((node) => (
                  <div key={node.name} style={{
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff', marginBottom: '0.2rem' }}>
                      {node.name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                      {node.pods}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                      {node.load}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Satellite Badges */}
            <div className="animate-float" style={{
              position: 'absolute',
              top: '-1.5rem',
              right: '-1.5rem',
              background: 'rgba(10, 16, 30, 0.95)',
              border: '1px solid rgba(0, 245, 160, 0.4)',
              borderRadius: 'var(--radius-md)',
              padding: '0.6rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(12px)',
            }}>
              <CheckCircle2 size={16} color="#00f5a0" />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                <span style={{ color: '#fff', fontWeight: 600 }}>DORA Elite Tier</span>
                <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.65rem' }}>MTTR &lt; 5 mins</span>
              </div>
            </div>

            <div className="animate-float" style={{
              animationDelay: '2.5s',
              position: 'absolute',
              bottom: '-1.5rem',
              left: '-1.5rem',
              background: 'rgba(10, 16, 30, 0.95)',
              border: '1px solid rgba(157, 78, 221, 0.4)',
              borderRadius: 'var(--radius-md)',
              padding: '0.6rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(12px)',
            }}>
              <Layers size={16} color="#9d4edd" />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                <span style={{ color: '#fff', fontWeight: 600 }}>Terraform IaC</span>
                <span style={{ display: 'block', color: 'var(--accent-emerald)', fontSize: '0.65rem' }}>0 State Drift</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
