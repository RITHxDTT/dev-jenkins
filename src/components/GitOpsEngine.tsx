'use client';

import React, { useState } from 'react';
import { soundManager } from '@/lib/sound';
import { 
  GitBranch, 
  RefreshCw, 
  CheckCircle, 
  FileCode, 
  Layers, 
  Zap, 
  Diff, 
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

const K8S_YAML = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: synapse-microservice-core
  namespace: production
  labels:
    app.kubernetes.io/name: synapse-core
    app.kubernetes.io/version: "2.4.8"
spec:
  replicas: 12
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 0
  selector:
    matchLabels:
      app: synapse-core
  template:
    metadata:
      labels:
        app: synapse-core
    spec:
      containers:
      - name: core-app
        image: registry.devops.io/synapse:v2.4.8
        resources:
          limits:
            cpu: "1000m"
            memory: "1024Mi"
          requests:
            cpu: "250m"
            memory: "256Mi"
        readinessProbe:
          httpGet:
            path: /healthz
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10`;

const TERRAFORM_HCL = `resource "aws_eks_cluster" "synapse_prod" {
  name     = "synapse-prod-cluster-us-east-1"
  role_arn = aws_iam_role.cluster_role.arn
  version  = "1.31"

  vpc_config {
    subnet_ids              = module.vpc.private_subnets
    endpoint_private_access = true
    endpoint_public_access  = false
  }

  encryption_config {
    provider {
      key_arn = aws_kms_key.eks.arn
    }
    resources = ["secrets"]
  }

  tags = {
    Environment = "production"
    ManagedBy   = "Terraform"
    GitOps      = "ArgoCD"
  }
}`;

export default function GitOpsEngine() {
  const [activeTab, setActiveTab] = useState<'k8s' | 'terraform'>('k8s');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [hasDrift, setHasDrift] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<'OutOfSync' | 'Synced'>('OutOfSync');
  const [syncCommit, setSyncCommit] = useState<string>('a9b8e21 (main)');

  const handleSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    soundManager.playDeploy();

    setTimeout(() => {
      setIsSyncing(false);
      setHasDrift(false);
      setSyncStatus('Synced');
      setSyncCommit('f47c09d (main - head)');
      soundManager.playSuccess();
    }, 1600);
  };

  const handleResetDrift = () => {
    soundManager.playBlip(600);
    setHasDrift(true);
    setSyncStatus('OutOfSync');
  };

  return (
    <section id="gitops" style={{ padding: '6rem 0', position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <GitBranch size={14} />
            <span>Git as the Single Source of Truth</span>
          </div>
          <h2 className="section-title">GitOps & Infrastructure-as-Code Engine</h2>
          <p className="section-desc">
            Continuous reconciliation between Git repository desired state and live multi-cloud infrastructure via ArgoCD and HashiCorp Terraform.
          </p>
        </div>

        {/* GitOps Top Bar */}
        <div className="glass-panel" style={{
          padding: '1.25rem 1.75rem',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          border: '1px solid rgba(157, 78, 221, 0.3)',
        }}>
          {/* File Switcher Tabs */}
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              onClick={() => { setActiveTab('k8s'); soundManager.playBlip(700); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: activeTab === 'k8s' ? 'var(--accent-purple)' : 'rgba(255, 255, 255, 0.05)',
                color: activeTab === 'k8s' ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.2s ease',
              }}
            >
              <FileCode size={15} />
              <span>k8s/deployment.yaml</span>
            </button>
            <button
              onClick={() => { setActiveTab('terraform'); soundManager.playBlip(700); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: activeTab === 'terraform' ? 'var(--accent-purple)' : 'rgba(255, 255, 255, 0.05)',
                color: activeTab === 'terraform' ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.2s ease',
              }}
            >
              <Layers size={15} />
              <span>terraform/main.tf</span>
            </button>
          </div>

          {/* Sync Status Badge & Action */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.8rem',
              borderRadius: 'var(--radius-full)',
              background: syncStatus === 'Synced' ? 'rgba(0, 245, 160, 0.12)' : 'rgba(255, 183, 3, 0.12)',
              border: `1px solid ${syncStatus === 'Synced' ? 'rgba(0, 245, 160, 0.3)' : 'rgba(255, 183, 3, 0.3)'}`,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: syncStatus === 'Synced' ? 'var(--accent-emerald)' : 'var(--accent-amber)',
            }}>
              {syncStatus === 'Synced' ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
              <span>{syncStatus === 'Synced' ? 'DESIRED == LIVE (SYNCED)' : 'DRIFT DETECTED'}</span>
            </div>

            <button
              onClick={handleSync}
              disabled={isSyncing || syncStatus === 'Synced'}
              className="btn btn-primary"
              style={{
                background: 'linear-gradient(135deg, #9d4edd 0%, #00f2fe 100%)',
                padding: '0.55rem 1.3rem',
                fontSize: '0.85rem',
              }}
            >
              {isSyncing ? (
                <>
                  <RefreshCw size={15} className="animate-spin-slow" />
                  <span>Reconciling Drift...</span>
                </>
              ) : syncStatus === 'Synced' ? (
                <>
                  <CheckCircle size={15} />
                  <span>Cluster in Sync</span>
                </>
              ) : (
                <>
                  <RefreshCw size={15} />
                  <span>Sync to Cluster</span>
                </>
              )}
            </button>

            {syncStatus === 'Synced' && (
              <button
                onClick={handleResetDrift}
                className="btn btn-secondary"
                style={{ padding: '0.45rem 0.8rem', fontSize: '0.75rem' }}
                title="Simulate Drift"
              >
                Simulate Drift
              </button>
            )}
          </div>
        </div>

        {/* Declarative Code Display & Live Diff */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem',
        }}>
          {/* Code Manifest Box */}
          <div className="terminal-box" style={{ minHeight: '380px' }}>
            <div className="terminal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FileCode size={14} color="var(--accent-purple)" />
                <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                  git://github.com/synapse-devops/infra-repo/{activeTab === 'k8s' ? 'k8s/deployment.yaml' : 'terraform/main.tf'}
                </span>
              </div>
              <span className="badge badge-purple">{syncCommit}</span>
            </div>
            <div className="terminal-body" style={{ maxHeight: '350px' }}>
              <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.82rem', lineHeight: '1.6' }}>
                <code>{activeTab === 'k8s' ? K8S_YAML : TERRAFORM_HCL}</code>
              </pre>
            </div>
          </div>

          {/* Drift Analyzer & State Verification */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Diff size={18} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                  ArgoCD Drift Reconciliation Inspector
                </h3>
              </div>
              <span className="badge badge-cyan">Automated Self-Heal</span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {hasDrift
                ? '⚠️ Manual override detected on node edge-worker-us-east-1a (replicas: 8 instead of declared 12). ArgoCD has flagged an uncommitted state drift.'
                : '✅ Declarative state strictly matches runtime cluster topology across all 3 cloud regions. Zero configuration drift detected.'}
            </p>

            {/* Visual Diff Box */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: 'var(--radius-md)',
              padding: '1.2rem',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: '0.6rem', fontSize: '0.75rem' }}>
                DIFF COMPARISON (Git Head vs Live Cluster):
              </div>
              {hasDrift ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <div style={{ color: '#ff7b72', background: 'rgba(255,0,0,0.1)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
                    - spec.replicas: 8 (live cluster state)
                  </div>
                  <div style={{ color: '#7ee787', background: 'rgba(0,255,0,0.1)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
                    + spec.replicas: 12 (git source target)
                  </div>
                  <div style={{ color: '#ff7b72', background: 'rgba(255,0,0,0.1)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
                    - image: registry.devops.io/synapse:v2.4.7
                  </div>
                  <div style={{ color: '#7ee787', background: 'rgba(0,255,0,0.1)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
                    + image: registry.devops.io/synapse:v2.4.8
                  </div>
                </div>
              ) : (
                <div style={{ color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} />
                  <span>No diff detected. Live runtime matches Git commit SHA.</span>
                </div>
              )}
            </div>

            {/* Key benefits badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              <span className="badge badge-purple">Immutable Infrastructure</span>
              <span className="badge badge-cyan">Automated Rollbacks</span>
              <span className="badge badge-emerald">Disaster Recovery Ready</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
