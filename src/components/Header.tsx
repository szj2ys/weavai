"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";

export function Header() {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="min-h-16 px-4 gap-1 flex items-center bg-background text-foreground border-b border-border">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
          <span className="text-accent-foreground font-bold text-sm">AI</span>
        </div>
        <h1 className="text-lg font-semibold text-foreground">
          AI 流程图生成器
        </h1>
      </div>
      <div className="flex-1" />
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg hover:bg-states-hover transition-colors"
        aria-label="切换主题"
      >
        {isDark ? (
          <Sun className="h-5 w-5 text-muted-foreground" />
        ) : (
          <Moon className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
    </header>
  );
}
