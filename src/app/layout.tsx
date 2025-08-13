import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 流程图生成器",
  description: "使用AI智能生成流程图的在线工具",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
