import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // 直接使用CSS变量，不需要hsl包装
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        destructive: "var(--destructive)",
        "destructive-foreground": "var(--destructive-foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        popover: "var(--popover)",
        "popover-foreground": "var(--popover-foreground)",

        // Motia 特定颜色
        "accent-1000": "var(--accent-1000)",
        "accent-900": "var(--accent-900)",
        "accent-800": "var(--accent-800)",
        "accent-200": "var(--accent-200)",
        "light-1000": "var(--light-1000)",
        error: "var(--error)",

        // 语义化颜色
        "surface-content": "var(--surface-content)",
        "surface-component": "var(--surface-component)",
        "states-hover": "var(--states-hover)",
        "states-selected": "var(--states-selected)",
        "text-header": "var(--text-header)",
        "text-body": "var(--text-body)",
        "text-placeholder": "var(--text-placeholder)",
        "text-accent": "var(--text-accent)",
        "icon-active": "var(--icon-active)",
        "icon-light": "var(--icon-light)",
        "icon-accent": "var(--icon-accent)",
      },
      borderRadius: {
        lg: "8px",
        md: "6px",
        sm: "4px",
      },
    },
  },
  plugins: [],
} satisfies Config;
