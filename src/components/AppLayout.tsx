import React from 'react';
import AppNav from './AppNav';

interface AppLayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

export default function AppLayout({ children, hideNav = false }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--background)' }}>
      {!hideNav && <AppNav />}
      <main className="flex-1">{children}</main>
    </div>
  );
}