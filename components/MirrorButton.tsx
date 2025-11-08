"use client";

type Props = { label: string; onClick: () => void };

export default function MirrorButton({ label, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl px-4 py-3 text-sm font-medium border border-white/10 bg-white/5 hover:bg-white/10 active:bg-white/15 transition"
    >
      {label}
    </button>
  );
}
