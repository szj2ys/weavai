import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WeavAI - AI Flowchart Generator",
  description: "An intelligent online tool for generating flowcharts using AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
