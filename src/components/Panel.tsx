"use client";

import { ReactNode } from "react";

interface PanelProps {
  children: ReactNode;
  className?: string;
}

export function Panel({ children, className = "" }: PanelProps) {
  return (
    <div
      className={`bg-background border border-border rounded-lg overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

interface PanelHeaderProps {
  children: ReactNode;
  className?: string;
}

export function PanelHeader({ children, className = "" }: PanelHeaderProps) {
  return (
    <div className={`px-4 py-3 border-b border-border bg-card ${className}`}>
      {children}
    </div>
  );
}

interface PanelContentProps {
  children: ReactNode;
  className?: string;
}

export function PanelContent({ children, className = "" }: PanelContentProps) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
