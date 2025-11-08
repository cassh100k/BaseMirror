"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { sdk } from "@farcaster/miniapp-sdk";
import MirrorCard from "@/components/MirrorCard";
import MirrorButton from "@/components/MirrorButton";
import * as htmlToImage from "html-to-image";

export default function HomePage() {
  const [username, setUsername] = useState<string>("Guest");
  const [fid, setFid] = useState<number | null>(null);
  const [quote, setQuote] = useState<string>("Loading your reflection...");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "BaseMirror";

  // 🎯 Initialize Farcaster MiniApp context and load reflection
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await sdk.actions.ready();
        const context = await sdk.context;
        const user = context?.user;
        if (mounted && user) {
          if (user.username) setUsername(user.username);
          if (typeof user.fid === "number") setFid(user.fid);
        }
      } catch (_) {
        // ignore non-miniapp environments
      }
      await fetchQuote();
    })();
    return () => { mounted = false; };
  }, []);

  // 🪞 Fetch reflection
  async function fetchQuote() {
    try {
      setIsLoading(true);
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, fid })
      });
      const data = await res.json();
      setQuote(data.quote || "Take a breath. Start again.");
    } catch (err) {
      setQuote("Quiet minds still speak.");
    } finally {
      setIsLoading(false);
    }
  }

  // 💾 Save as image
  async function handleSavePNG() {
    if (!cardRef.current) return;
    const node = cardRef.current;
    const dataUrl = await htmlToImage.toPng(node, { pixelRatio: 2 });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `BaseMirror_${new Date().toISOString()}.png`;
    a.click();
  }

  // 📤 Share to Warpcast
  function handleShare() {
    const text = `"${quote}"\n— via ${appName} (basequote.today)`;
    const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }

  return (
    <main className="flex items-center justify-center min-h-[100svh] px-4 py-10 bg-bm-ink">
      <div className="w-full max-w-2xl">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-6 text-center"
        >
          <h1 className="text-3xl font-semibold tracking-tight">BaseMirror</h1>
          <p className="text-sm text-white/60">See your mind on Base</p>
        </motion.div>

        {/* Reflection Card */}
        <MirrorCard
          ref={cardRef}
          username={username}
          quote={quote}
          loading={isLoading}
        />

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <MirrorButton onClick={handleSavePNG} label="Save" />
          <MirrorButton onClick={handleShare} label="Share" />
          <MirrorButton onClick={fetchQuote} label="Reflect again" />
        </div>

        {/* Footer Info */}
        <p className="mt-4 text-center text-xs text-white/50">
          Signed in as{" "}
          <span className="text-white/80">{username}</span>
          {fid ? ` • fid ${fid}` : ""}
        </p>
        <p className="mt-1 text-center text-[11px] text-white/40">
          basequote.today
        </p>
      </div>
    </main>
  );
}
