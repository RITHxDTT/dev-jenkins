import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'SYNAPSE // Next-Gen Autonomous DevOps & CI/CD Platform',
  description: 'High-velocity Continuous Delivery, interactive Kubernetes cluster topology visualizer, real-time DORA metrics, GitOps drift engine, and SRE incident response center.',
  keywords: ['DevOps', 'CI/CD', 'Kubernetes', 'Docker', 'GitOps', 'ArgoCD', 'Terraform', 'DORA Metrics', 'SRE'],
  authors: [{ name: 'DevOps Engineering Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#030509',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="cyber-grid-bg" />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
