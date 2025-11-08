import { NextRequest, NextResponse } from "next/server";import OpenAI from "openai";
import { sanitizeQuote } from "@/lib/mirror";import { getDaily, setDaily } from "@/lib/storage";
const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
export async function POST(req: NextRequest){
  const body = await req.json().catch(() => ({}));
  const username = (body?.username || "Guest").toString();
  const existing = getDaily(username);
  if (existing.quote) return NextResponse.json({ quote: existing.quote, streak: existing.streak });
  let raw = "Quiet courage, gentle steps ahead.";
  if (client){
    try {
      const system = "You write one-line reflective messages, 4 to 14 words, gentle, poetic, not cheesy. Avoid emojis and hashtags.";
      const userMsg = `User: ${username}. Create one reflective line only.`;
      const resp = await client.chat.completions.create({ model: "gpt-4o-mini", messages: [{ role: "system", content: system }, { role: "user", content: userMsg }], temperature: 0.7, max_tokens: 50 });
      raw = resp.choices?.[0]?.message?.content?.trim() || raw;
    } catch {}
  }
  const quote = sanitizeQuote(raw);
  const saved = setDaily(username, quote);
  return NextResponse.json({ quote: saved.quote, streak: saved.streak });
}