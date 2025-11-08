import "../styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BaseMirror - See your mind on Base",
  description: "Daily AI reflections for Farcaster builders on Base",
  appleWebApp: { capable: true },
  formatDetection: { telephone: false }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-bm-ink">
      <body className="min-h-screen text-white bg-bm-ink bg-mirror selection:bg-bm-glow/20 selection:text-white antialiased">
        {children}
      </body>
    </html>
  );
}

