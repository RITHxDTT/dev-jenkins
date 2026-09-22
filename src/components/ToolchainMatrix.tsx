'use client';

import React, { useState } from 'react';
import { soundManager } from '@/lib/sound';
import { ToolItem } from '@/lib/types';
import { 
  Box, 
  Server, 
  Layers, 
  GitBranch, 
  Activity, 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  CheckCircle,
  ExternalLink,
  Code2
} from 'lucide-react';

const TOOLS: ToolItem[] = [
  {
    name: 'Kubernetes (K8s)',
    category: 'orchestration',
    icon: 'Server',
    tagline: 'Production-Grade Container Orchestration',
    description: 'Automates deployment, scaling, and operational lifecycle of containerized microservices across multi-region clusters.',
    role: 'Workload Scheduler & Auto-scaler',
    version: 'v1.31.0',
    popularity: '98% Cloud Native Adoption',
  },
  {
    name: 'Docker & OCI',
    category: 'containers',
    icon: 'Box',
    tagline: 'Standardized Lightweight Packaging',
    description: 'Package applications and all runtime dependencies into immutable, deterministic container images for predictable execution.',
    role: 'Containerization & BuildKit',
    version: 'v27.3.1',
    popularity: 'De-facto Standard',
  },
  {
    name: 'HashiCorp Terraform',
    category: 'iac',
    icon: 'Layers',
    tagline: 'Declarative Multi-Cloud Infrastructure',
    description: 'Define and provision cloud resources (AWS, GCP, Azure, Cloudflare) safely and predictably using declarative HCL state files.',
    role: 'Infrastructure as Code (IaC)',
    version: 'v1.9.5',
    popularity: 'Industry Standard',
  },
  {
    name: 'ArgoCD & Rollouts',
    category: 'cicd',
    icon: 'GitBranch',
    tagline: 'Declarative GitOps Continuous Delivery',
    description: 'Automates application deployment with progressive delivery strategies including Blue-Green, Canary analysis, and automated rollback.',
    role: 'GitOps Continuous Delivery',
    version: 'v2.12.4',
    popularity: 'Top CNCF Project',
  },
  {
    name: 'Prometheus & Grafana',
    category: 'observability',
    icon: 'Activity',
    tagline: 'Full-Stack Observability & Telemetry',
    description: 'High-dimensional time-series monitoring, dynamic PromQL querying, alert manager dispatching, and rich telemetry dashboards.',
    role: 'Metrics & SRE Observability',
    version: 'v3.0.0',
    popularity: 'Cloud Standard',
  },
  {
    name: 'HashiCorp Vault',
    category: 'security',
    icon: 'ShieldCheck',
    tagline: 'Zero-Trust Secrets & Key Management',
    description: 'Secure, store, and tightly control access to API tokens, TLS certificates, database credentials, and dynamic encryption keys.',
    role: 'Secrets Management & PKI',
    version: 'v1.17.2',
    popularity: 'Enterprise Security',
  },
  {
    name: 'Trivy & Snyk',
    category: 'security',
    icon: 'ShieldCheck',
    tagline: 'Comprehensive Security & SBOM Scanner',
    description: 'Scans container images, git repositories, Kubernetes configs, and software supply chains for known CVE vulnerabilities.',
    role: 'DevSecOps & SAST/DAST',
    version: 'v0.55.0',
    popularity: 'Shift-Left Security',
  },
  {
    name: 'GitHub Actions & GitLab CI',
    category: 'cicd',
    icon: 'GitBranch',
    tagline: 'Automated CI/CD Workflow Automation',
    description: 'Matrix testing, container image building, artifact signing, and deployment dispatch directly from Git commit webhooks.',
    role: 'Continuous Integration Engine',
    version: 'Cloud Native',
    popularity: 'Ubiquitous',
  },
  {
    name: 'OpenTelemetry (OTel)',
    category: 'observability',
    icon: 'Activity',
    tagline: 'Unified Telemetry Standard',
    description: 'Vendor-agnostic distributed tracing, metrics, and logs collection across polyglot microservice architectures.',
    role: 'Distributed Tracing & APM',
    version: 'v1.28.0',
    popularity: 'CNCF Standard',
  },
];

export default function ToolchainMatrix() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTools = selectedCategory === 'all'
    ? TOOLS
    : TOOLS.filter((t) => t.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'All Ecosystem' },
    { id: 'orchestration', label: 'Orchestration' },
    { id: 'cicd', label: 'CI/CD & GitOps' },
    { id: 'containers', label: 'Containers' },
    { id: 'iac', label: 'IaC & Provisioning' },
    { id: 'observability', label: 'Observability' },
    { id: 'security', label: 'DevSecOps' },
  ];

  return (
    <section id="toolchain" style={{ padding: '6rem 0', position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Cpu size={14} />
            <span>Modern Stack Architecture</span>
          </div>
          <h2 className="section-title">DevOps Toolchain Matrix</h2>
          <p className="section-desc">
            The modern cloud-native ecosystem powering high-velocity engineering, declarative orchestration, zero-trust security, and full-stack observability.
          </p>
        </div>

        {/* Category Filters */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.6rem',
          justifyContent: 'center',
          marginBottom: '3rem',
        }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                soundManager.playBlip(700);
              }}
              style={{
                padding: '0.5rem 1.1rem',
                borderRadius: 'var(--radius-full)',
                border: selectedCategory === cat.id ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                background: selectedCategory === cat.id ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: selectedCategory === cat.id ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Tool Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}>
          {filteredTools.map((tool) => (
            <div
              key={tool.name}
              className="glass-panel glow-cyan-hover"
              style={{
                padding: '1.6rem',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                {/* Header info */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span className="badge badge-cyan">{tool.role}</span>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {tool.version}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '0.3rem' }}>
                  {tool.name}
                </h3>

                <div style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', fontWeight: 600, marginBottom: '0.8rem' }}>
                  {tool.tagline}
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.4rem' }}>
                  {tool.description}
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.8rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
              }}>
                <span>{tool.popularity}</span>
                <span style={{ color: 'var(--accent-cyan)' }}>Cloud Ready ✓</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
