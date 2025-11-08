"use client";
import { forwardRef } from "react";
import { motion } from "framer-motion";

type Props = {
  username: string;
  quote: string;
  loading?: boolean;
};

const MirrorCard = forwardRef<HTMLDivElement, Props>(function MirrorCard(
  { username, quote, loading },
  ref
) {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl"
      style={{
        boxShadow: "0 20px 80px rgba(0,0,0,0.45)"
      }}
    >
      {/* gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />

      <div className="mb-5 text-[11px] uppercase tracking-widest text-white/50">
        Daily reflection
      </div>

      <div className="min-h-[120px] flex items-center">
        <p className="text-xl sm:text-2xl leading-snug text-white/95">
          {loading ? "…" : `“${quote}”`}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between text-xs text-white/50">
        <span>for @{username || "Guest"}</span>
        <span>BaseMirror • basequote.today</span>
      </div>
    </motion.div>
  );
});

export default MirrorCard;
