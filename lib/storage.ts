import fs from "fs";import path from "path";
const DATA_DIR = path.join(process.cwd(), ".data"); const FILE = path.join(DATA_DIR, "reflections.json");
type Record = { [username: string]: { lastDate: string; streak: number; byDate: { [ymd: string]: string } } };
function ensure(){ if(!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR,{recursive:true}); if(!fs.existsSync(FILE)) fs.writeFileSync(FILE, JSON.stringify({}), "utf8"); }
export function loadStore(): Record { ensure(); try { return JSON.parse(fs.readFileSync(FILE,"utf8")) as Record; } catch { return {}; } }
export function saveStore(rec: Record){ ensure(); fs.writeFileSync(FILE, JSON.stringify(rec,null,2), "utf8"); }
export function todayUTC(){ const d=new Date(); return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`; }
export function yesterdayUTC(){ const d=new Date(); d.setUTCDate(d.getUTCDate()-1); return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`; }
export function getDaily(username: string){ const store=loadStore(); const u=store[username]; const today=todayUTC(); const quote=u?.byDate?.[today]; return { quote, streak: u?.streak||0 }; }
export function setDaily(username: string, quote: string){ const store=loadStore(); const today=todayUTC(); const yest=yesterdayUTC(); const u=store[username]||{ lastDate:'', streak:0, byDate:{} }; if(!u.byDate[today]){ const newStreak=u.byDate[yest]? (u.streak||0)+1:1; u.byDate[today]=quote; u.lastDate=today; u.streak=newStreak; } else { u.byDate[today]=quote; } store[username]=u; saveStore(store); return { quote: u.byDate[today], streak: u.streak }; }