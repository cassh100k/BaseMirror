// next.config.js
const fs = require("fs");
function warnLegacyIndex() {
  const candidates = ["pages/index.tsx","pages/index.jsx","index.tsx","index.jsx"];
  for (const p of candidates) if (fs.existsSync(p)) console.warn(`\n[BaseMirror] Warning: Found legacy file: ${p}. Delete it.\n`);
}
warnLegacyIndex();
module.exports = { reactStrictMode: true };
