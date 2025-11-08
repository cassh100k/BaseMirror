import { describe, it, expect } from "vitest";import { sanitizeQuote } from "@/lib/mirror";
describe("sanitizeQuote", () => {
  it("removes wrapping quotes and newlines", () => { expect(sanitizeQuote('"hello\nworld"')).toBe("hello world"); });
  it("collapses extra whitespace", () => { expect(sanitizeQuote("  many    spaces \n here ")).toBe("many spaces here"); });
  it("handles empty input", () => { expect(sanitizeQuote("")).toBe(""); });
});