import * as React from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OmniTask AI — Full-Stack Monorepo Task Manager",
  description: "AI-powered task management, decomposition, and planning built on an enterprise TypeScript monorepo."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
