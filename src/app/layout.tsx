import type { Metadata } from 'next';
import './globals.css';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Terevita | Proteção inteligente',
  description: 'Landing page externa da Terevita integrada ao CRM OnClickWise.',
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning className="bg-[#f6ecdf] text-[#1f1711] antialiased">
        {children}
      </body>
    </html>
  );
}
