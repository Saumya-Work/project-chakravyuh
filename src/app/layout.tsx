import type { Metadata } from 'next';
import './globals.css';
import { ChakravyuhProvider } from '@/context/ChakravyuhContext';

export const metadata: Metadata = {
  title: 'PROJECT CHAKRAVYUH (प्रोजेक्ट चक्रव्यूह) — AI-Powered Crime Investigation & Digital Evidence Intelligence Platform',
  description:
    'Connect Evidence. Discover Relationships. Accelerate Investigations. Government Partnership Demonstration Environment — Synthetic Data Only.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#090D16] text-slate-100">
        <ChakravyuhProvider>{children}</ChakravyuhProvider>
      </body>
    </html>
  );
}

