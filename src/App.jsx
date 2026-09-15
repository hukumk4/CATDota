import React, { useState, useEffect, useRef, useCallback } from "react";
import { Shield, Swords, Eye, Copy, Check, RefreshCw, Play, LogOut, Plus, LogIn, Ban, Crown, Dices, AlertTriangle, Clock } from "lucide-react";
import { db } from "./firebase";
import { ref, get, set, onValue, runTransaction } from "firebase/database";

const HEROES=[{id:102,n:"Abaddon",img:"abaddon",a:"all"},{id:73,n:"Alchemist",img:"alchemist",a:"str"},{id:68,n:"Ancient Apparition",img:"ancient_apparition",a:"int"},{id:1,n:"Anti-Mage",img:"antimage",a:"agi"},{id:113,n:"Arc Warden",img:"arc_warden",a:"all"},{id:2,n:"Axe",img:"axe",a:"str"},{id:3,n:"Bane",img:"bane",a:"all"},{id:65,n:"Batrider",img:"batrider",a:"all"},{id:38,n:"Beastmaster",img:"beastmaster",a:"all"},{id:4,n:"Bloodseeker",img:"bloodseeker",a:"agi"},{id:62,n:"Bounty Hunter",img:"bounty_hunter",a:"agi"},{id:78,n:"Brewmaster",img:"brewmaster",a:"all"},{id:99,n:"Bristleback",img:"bristleback",a:"str"},{id:61,n:"Broodmother",img:"broodmother",a:"agi"},{id:96,n:"Centaur Warrunner",img:"centaur",a:"str"},{id:81,n:"Chaos Knight",img:"chaos_knight",a:"str"},{id:66,n:"Chen",img:"chen",a:"int"},{id:56,n:"Clinkz",img:"clinkz",a:"agi"},{id:51,n:"Clockwerk",img:"rattletrap",a:"str"},{id:5,n:"Crystal Maiden",img:"crystal_maiden",a:"int"},{id:55,n:"Dark Seer",img:"dark_seer",a:"int"},{id:119,n:"Dark Willow",img:"dark_willow",a:"int"},{id:135,n:"Dawnbreaker",img:"dawnbreaker",a:"str"},{id:50,n:"Dazzle",img:"dazzle",a:"all"},{id:43,n:"Death Prophet",img:"death_prophet",a:"all"},{id:87,n:"Disruptor",img:"disruptor",a:"int"},{id:69,n:"Doom",img:"doom_bringer",a:"str"},{id:49,n:"Dragon Knight",img:"dragon_knight",a:"str"},{id:6,n:"Drow Ranger",img:"drow_ranger",a:"agi"},{id:107,n:"Earth Spirit",img:"earth_spirit",a:"str"},{id:7,n:"Earthshaker",img:"earthshaker",a:"str"},{id:103,n:"Elder Titan",img:"elder_titan",a:"str"},{id:106,n:"Ember Spirit",img:"ember_spirit",a:"agi"},{id:58,n:"Enchantress",img:"enchantress",a:"int"},{id:33,n:"Enigma",img:"enigma",a:"all"},{id:41,n:"Faceless Void",img:"faceless_void",a:"agi"},{id:121,n:"Grimstroke",img:"grimstroke",a:"int"},{id:72,n:"Gyrocopter",img:"gyrocopter",a:"agi"},{id:123,n:"Hoodwink",img:"hoodwink",a:"agi"},{id:59,n:"Huskar",img:"huskar",a:"str"},{id:74,n:"Invoker",img:"invoker",a:"int"},{id:91,n:"Io",img:"wisp",a:"all"},{id:64,n:"Jakiro",img:"jakiro",a:"int"},{id:8,n:"Juggernaut",img:"juggernaut",a:"agi"},{id:90,n:"Keeper of the Light",img:"keeper_of_the_light",a:"int"},{id:145,n:"Kez",img:"kez",a:"agi"},{id:23,n:"Kunkka",img:"kunkka",a:"str"},{id:155,n:"Largo",img:"largo",a:"str"},{id:104,n:"Legion Commander",img:"legion_commander",a:"str"},{id:52,n:"Leshrac",img:"leshrac",a:"int"},{id:31,n:"Lich",img:"lich",a:"int"},{id:54,n:"Lifestealer",img:"life_stealer",a:"str"},{id:25,n:"Lina",img:"lina",a:"int"},{id:26,n:"Lion",img:"lion",a:"int"},{id:80,n:"Lone Druid",img:"lone_druid",a:"agi"},{id:48,n:"Luna",img:"luna",a:"agi"},{id:77,n:"Lycan",img:"lycan",a:"str"},{id:97,n:"Magnus",img:"magnataur",a:"all"},{id:136,n:"Marci",img:"marci",a:"all"},{id:129,n:"Mars",img:"mars",a:"str"},{id:94,n:"Medusa",img:"medusa",a:"agi"},{id:82,n:"Meepo",img:"meepo",a:"agi"},{id:9,n:"Mirana",img:"mirana",a:"agi"},{id:114,n:"Monkey King",img:"monkey_king",a:"agi"},{id:10,n:"Morphling",img:"morphling",a:"agi"},{id:138,n:"Muerta",img:"muerta",a:"int"},{id:89,n:"Naga Siren",img:"naga_siren",a:"agi"},{id:53,n:"Nature's Prophet",img:"furion",a:"all"},{id:36,n:"Necrophos",img:"necrolyte",a:"int"},{id:60,n:"Night Stalker",img:"night_stalker",a:"str"},{id:88,n:"Nyx Assassin",img:"nyx_assassin",a:"all"},{id:84,n:"Ogre Magi",img:"ogre_magi",a:"str"},{id:57,n:"Omniknight",img:"omniknight",a:"str"},{id:111,n:"Oracle",img:"oracle",a:"int"},{id:76,n:"Outworld Devourer",img:"obsidian_destroyer",a:"int"},{id:120,n:"Pangolier",img:"pangolier",a:"all"},{id:44,n:"Phantom Assassin",img:"phantom_assassin",a:"agi"},{id:12,n:"Phantom Lancer",img:"phantom_lancer",a:"agi"},{id:110,n:"Phoenix",img:"phoenix",a:"str"},{id:137,n:"Primal Beast",img:"primal_beast",a:"str"},{id:13,n:"Puck",img:"puck",a:"int"},{id:14,n:"Pudge",img:"pudge",a:"str"},{id:45,n:"Pugna",img:"pugna",a:"int"},{id:39,n:"Queen of Pain",img:"queenofpain",a:"int"},{id:15,n:"Razor",img:"razor",a:"agi"},{id:32,n:"Riki",img:"riki",a:"agi"},{id:131,n:"Ring Master",img:"ringmaster",a:"int"},{id:86,n:"Rubick",img:"rubick",a:"int"},{id:16,n:"Sand King",img:"sand_king",a:"all"},{id:79,n:"Shadow Demon",img:"shadow_demon",a:"int"},{id:11,n:"Shadow Fiend",img:"nevermore",a:"agi"},{id:27,n:"Shadow Shaman",img:"shadow_shaman",a:"int"},{id:75,n:"Silencer",img:"silencer",a:"int"},{id:101,n:"Skywrath Mage",img:"skywrath_mage",a:"int"},{id:28,n:"Slardar",img:"slardar",a:"str"},{id:93,n:"Slark",img:"slark",a:"agi"},{id:128,n:"Snapfire",img:"snapfire",a:"all"},{id:35,n:"Sniper",img:"sniper",a:"agi"},{id:67,n:"Spectre",img:"spectre",a:"agi"},{id:71,n:"Spirit Breaker",img:"spirit_breaker",a:"str"},{id:17,n:"Storm Spirit",img:"storm_spirit",a:"int"},{id:18,n:"Sven",img:"sven",a:"str"},{id:105,n:"Techies",img:"techies",a:"all"},{id:46,n:"Templar Assassin",img:"templar_assassin",a:"agi"},{id:109,n:"Terrorblade",img:"terrorblade",a:"agi"},{id:29,n:"Tidehunter",img:"tidehunter",a:"str"},{id:98,n:"Timbersaw",img:"shredder",a:"str"},{id:34,n:"Tinker",img:"tinker",a:"int"},{id:19,n:"Tiny",img:"tiny",a:"str"},{id:83,n:"Treant Protector",img:"treant",a:"str"},{id:95,n:"Troll Warlord",img:"troll_warlord",a:"agi"},{id:100,n:"Tusk",img:"tusk",a:"str"},{id:108,n:"Underlord",img:"abyssal_underlord",a:"str"},{id:85,n:"Undying",img:"undying",a:"str"},{id:70,n:"Ursa",img:"ursa",a:"agi"},{id:20,n:"Vengeful Spirit",img:"vengefulspirit",a:"agi"},{id:40,n:"Venomancer",img:"venomancer",a:"all"},{id:47,n:"Viper",img:"viper",a:"agi"},{id:92,n:"Visage",img:"visage",a:"all"},{id:126,n:"Void Spirit",img:"void_spirit",a:"all"},{id:37,n:"Warlock",img:"warlock",a:"int"},{id:63,n:"Weaver",img:"weaver",a:"agi"},{id:21,n:"Windranger",img:"windrunner",a:"all"},{id:112,n:"Winter Wyvern",img:"winter_wyvern",a:"int"},{id:30,n:"Witch Doctor",img:"witch_doctor",a:"int"},{id:42,n:"Wraith King",img:"skeleton_king",a:"str"},{id:22,n:"Zeus",img:"zuus",a:"int"}];
const HERO_MAP = Object.fromEntries(HEROES.map(h => [h.id, h]));
const asArr = (x) => Array.isArray(x) ? x : (x && typeof x === "object" ? Object.values(x) : []);
const ATTR_COLOR = { str: "#e0554c", agi: "#4caf50", int: "#5bb3e0", all: "#c58fe0" };

const C = {
  bg: "#0e1420", panel: "#161d2b", panel2: "#1d2634", line: "#2a3547",
  gold: "#d4af37", goldSoft: "#e8c86a", text: "#e6ecf5", dim: "#8a97ab",
  radiant: "#5aab4f", radiantDk: "#274a24", dire: "#c0392b", direDk: "#4a201b",
};
const genCode = () => Array.from({ length: 5 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("");
const mref = (code) => ref(db, "matches/" + code);

async function loadMatch(code) {
  try { const s = await get(mref(code)); return s.exists() ? s.val() : null; }
  catch (e) { return null; }
}
async function saveMatch(code, obj) {
  try { await set(mref(code), obj); return true; }
  catch (e) { return false; }
}
function rollPool(size) {
  const ids = HEROES.map(h => h.id);
  for (let i = ids.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[ids[i], ids[j]] = [ids[j], ids[i]]; }
  return ids.slice(0, size).sort((a, b) => HERO_MAP[a].n.localeCompare(HERO_MAP[b].n));
}
function buildSequence(bans, picks, first) {
  const second = first === "radiant" ? "dire" : "radiant";
  const seq = [];
  for (let i = 0; i < bans * 2; i++) seq.push({ team: i % 2 === 0 ? first : second, type: "ban" });
  for (let i = 0; i < picks * 2; i++) seq.push({ team: i % 2 === 0 ? second : first, type: "pick" });
  return seq;
}

// ---------- small UI helpers ----------
const Btn = ({ children, onClick, disabled, variant = "gold", style = {} }) => {
  const base = { border: "none", borderRadius: 8, padding: "11px 18px", fontWeight: 700, fontSize: 14, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.45 : 1, display: "inline-flex", alignItems: "center", gap: 8, transition: "filter .15s", ...style };
  const v = {
    gold: { background: `linear-gradient(180deg,${C.goldSoft},${C.gold})`, color: "#1a1206" },
    dark: { background: C.panel2, color: C.text, border: `1px solid ${C.line}` },
    radiant: { background: `linear-gradient(180deg,#6fbf63,${C.radiant})`, color: "#0c1a09" },
    dire: { background: `linear-gradient(180deg,#d9584a,${C.dire})`, color: "#180605" },
    ghost: { background: "transparent", color: C.dim, border: `1px solid ${C.line}` },
  }[variant];
  return <button onMouseDown={e => e.preventDefault()} onClick={disabled ? undefined : onClick} disabled={disabled} style={{ ...base, ...v }}>{children}</button>;
};
const Field = ({ label, ...p }) => (
  <label style={{ display: "block", marginBottom: 12 }}>
    <div style={{ color: C.dim, fontSize: 12, marginBottom: 5, fontWeight: 600, letterSpacing: .3 }}>{label}</div>
    <input {...p} style={{ width: "100%", boxSizing: "border-box", background: C.bg, border: `1px solid ${C.line}`, color: C.text, borderRadius: 8, padding: "10px 12px", fontSize: 14, outline: "none" }} />
  </label>
);
const HeroImg = ({ h, style }) => {
  const [err, setErr] = useState(false);
  if (!err) return <img src={`heroes/${h.id}.webp`} onError={() => setErr(true)} alt={h.n} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...style }} />;
  return <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: `linear-gradient(135deg,#0a0f18,${ATTR_COLOR[h.a]}44)`, color: ATTR_COLOR[h.a], fontWeight: 800, fontSize: 10, lineHeight: 1.1, textAlign: "center", padding: 3, boxSizing: "border-box", ...style }}>{h.n}</div>;
};

// =================================================================
export default function App() {
  const [view, setView] = useState("home"); // home | create | join | draft
  const [session, setSession] = useState(null); // {code, role}
  const wrap = { minHeight: "100%", background: `radial-gradient(1200px 600px at 50% -10%, #1b2942 0%, ${C.bg} 60%)`, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif" };

  return (
    <div style={wrap}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "18px 16px 60px" }}>
        <Header />
        {view === "home" && <Home go={setView} />}
        {view === "create" && <CreateMatch go={setView} enter={(s) => { setSession(s); setView("draft"); }} />}
        {view === "join" && <JoinMatch go={setView} enter={(s) => { setSession(s); setView("draft"); }} />}
        {view === "draft" && session && <DraftRoom session={session} leave={() => { setSession(null); setView("home"); }} />}
      </div>
    </div>
  );
}

function Header() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
      <div style={{ width: 40, height: 40, borderRadius: 9, background: `linear-gradient(135deg,${C.gold},#8a6d1e)`, display: "grid", placeItems: "center" }}>
        <Swords size={22} color="#1a1206" />
      </div>
      <div>
        <div style={{ fontWeight: 800, fontSize: 19, letterSpacing: .5 }}>STREAMERS BATTLE — DRAFT</div>
        <div style={{ color: C.dim, fontSize: 12 }}>Random Draft пул + Captains Mode бан/пик</div>
      </div>
    </div>
  );
}

// ---------------- HOME ----------------
function Home({ go }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, marginTop: 30 }}>
      <Card onClick={() => go("create")} icon={<Plus size={26} />} title="Создать матч" desc="Организатор задаёт настройки пула, порядок бан/пик и пароли для двух капитанов и наблюдателя." cta="Создать" />
      <Card onClick={() => go("join")} icon={<LogIn size={26} />} title="Войти в матч" desc="Введите код комнаты, выберите роль (капитан Radiant / Dire / наблюдатель) и пароль." cta="Войти" />
    </div>
  );
}
const Card = ({ icon, title, desc, cta, onClick }) => (
  <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 14, padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
    <div style={{ width: 52, height: 52, borderRadius: 12, background: C.panel2, display: "grid", placeItems: "center", color: C.gold }}>{icon}</div>
    <div style={{ fontWeight: 800, fontSize: 20 }}>{title}</div>
    <div style={{ color: C.dim, fontSize: 14, lineHeight: 1.5, flex: 1 }}>{desc}</div>
    <div><Btn onClick={onClick}>{cta}</Btn></div>
  </div>
);

// ---------------- CREATE ----------------
function CreateMatch({ go, enter }) {
  const POOL_SIZE = 45;
  const [cfg, setCfg] = useState({ radiantName: "Radiant", direName: "Dire", poolSize: POOL_SIZE, bansPerTeam: 2, picksPerTeam: 5, timerSec: 30, firstSide: "radiant" });
  const [pw, setPw] = useState({ radiant: "rad" + Math.floor(Math.random() * 900 + 100), dire: "dire" + Math.floor(Math.random() * 900 + 100), observer: "obs" + Math.floor(Math.random() * 900 + 100) });
  const [created, setCreated] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = (k, v) => setCfg(c => ({ ...c, [k]: v }));
  const totalNeeded = cfg.bansPerTeam * 2 + cfg.picksPerTeam * 2;

  const create = async () => {
    setErr("");
    if (cfg.poolSize < totalNeeded) { setErr(`Пул слишком мал: нужно минимум ${totalNeeded} героев (баны+пики). Увеличьте пул.`); return; }
    if (cfg.poolSize > HEROES.length) { setErr(`Максимум ${HEROES.length} героев.`); return; }
    if (!pw.radiant || !pw.dire || !pw.observer) { setErr("Заполните все три пароля."); return; }
    setBusy(true);
    let code = genCode();
    for (let i = 0; i < 5; i++) { if (!(await loadMatch(code))) break; code = genCode(); }
    const first = cfg.firstSide === "random" ? (Math.random() < 0.5 ? "radiant" : "dire") : cfg.firstSide;
    const match = {
      code, createdAt: Date.now(), game: 1,
      config: { ...cfg, firstSide: first },
      auth: { radiant: pw.radiant, dire: pw.dire, observer: pw.observer },
      pool: rollPool(cfg.poolSize),
      sequence: buildSequence(cfg.bansPerTeam, cfg.picksPerTeam, first),
      actions: [], step: 0, status: "ready", turnStartedAt: 0, version: 1,
    };
    const ok = await saveMatch(code, match);
    setBusy(false);
    if (!ok) { setErr("Не удалось сохранить матч. Попробуйте ещё раз."); return; }
    setCreated({ code, first });
  };

  if (created) return <CreatedScreen cfg={cfg} pw={pw} code={created.code} first={created.first} enter={enter} go={go} />;

  return (
    <div style={{ marginTop: 20 }}>
      <BackBar go={go} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 16 }}>
        <Panel title="Команды и формат" icon={<Shield size={18} />}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Название Radiant" value={cfg.radiantName} onChange={e => set("radiantName", e.target.value)} />
            <Field label="Название Dire" value={cfg.direName} onChange={e => set("direName", e.target.value)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <NumField label="Банов / команду" v={cfg.bansPerTeam} set={v => set("bansPerTeam", v)} min={0} max={7} />
            <NumField label="Пиков / команду" v={cfg.picksPerTeam} set={v => set("picksPerTeam", v)} min={1} max={5} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <NumField label="Таймер на ход, сек (0 = выкл)" v={cfg.timerSec} set={v => set("timerSec", v)} min={0} max={120} />
            <label style={{ display: "block", marginBottom: 12 }}>
              <div style={{ color: C.dim, fontSize: 12, marginBottom: 5, fontWeight: 600 }}>Первый ход</div>
              <select value={cfg.firstSide} onChange={e => set("firstSide", e.target.value)} style={{ width: "100%", background: C.bg, border: `1px solid ${C.line}`, color: C.text, borderRadius: 8, padding: "10px 12px", fontSize: 14 }}>
                <option value="radiant">Radiant банит первым</option>
                <option value="dire">Dire банит первым</option>
                <option value="random">Случайно</option>
              </select>
            </label>
          </div>
          <div style={{ background: C.bg, border: `1px solid ${C.line}`, borderRadius: 8, padding: "10px 12px", fontSize: 12.5, color: C.dim }}>
            Пул: <b style={{ color: C.gold }}>{POOL_SIZE}</b> случайных героев. Всего действий: <b style={{ color: C.text }}>{totalNeeded}</b> ({cfg.bansPerTeam * 2} банов + {cfg.picksPerTeam * 2} пиков). Останется свободных: <b style={{ color: POOL_SIZE - totalNeeded >= 0 ? C.radiant : C.dire }}>{POOL_SIZE - totalNeeded}</b>.
          </div>
        </Panel>

        <Panel title="Доступы (логины по ролям)" icon={<Crown size={18} />}>
          <div style={{ fontSize: 12.5, color: C.dim, marginBottom: 14 }}>Логин определяется выбором роли при входе. Задайте пароль для каждой роли — раздайте их капитанам и наблюдателю.</div>
          <Field label={`Пароль — капитан Radiant`} value={pw.radiant} onChange={e => setPw(p => ({ ...p, radiant: e.target.value }))} />
          <Field label={`Пароль — капитан Dire`} value={pw.dire} onChange={e => setPw(p => ({ ...p, dire: e.target.value }))} />
          <Field label={`Пароль — наблюдатель`} value={pw.observer} onChange={e => setPw(p => ({ ...p, observer: e.target.value }))} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.goldSoft, fontSize: 11.5, marginTop: 4 }}>
            <AlertTriangle size={14} /> Пароли — простая защита от «зайти не туда», не крипто-секрет.
          </div>
        </Panel>
      </div>
      {err && <ErrBox>{err}</ErrBox>}
      <div style={{ marginTop: 16 }}><Btn onClick={create} disabled={busy}>{busy ? "Создаём…" : "Создать матч"}</Btn></div>
    </div>
  );
}

function CreatedScreen({ cfg, pw, code, first, enter, go }) {
  const [copied, setCopied] = useState("");
  const copy = (label, text) => { navigator.clipboard?.writeText(text); setCopied(label); setTimeout(() => setCopied(""), 1200); };
  const rows = [
    { role: "radiant", label: `Капитан «${cfg.radiantName}» (Radiant)`, pass: pw.radiant, color: C.radiant },
    { role: "dire", label: `Капитан «${cfg.direName}» (Dire)`, pass: pw.dire, color: C.dire },
    { role: "observer", label: "Наблюдатель", pass: pw.observer, color: C.gold },
  ];
  return (
    <div style={{ marginTop: 20 }}>
      <Panel title="Матч создан ✓" icon={<Check size={18} />}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 18 }}>
          <div style={{ color: C.dim, fontSize: 13 }}>Код комнаты:</div>
          <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: 6, color: C.gold, fontFamily: "monospace" }}>{code}</div>
          <Btn variant="dark" onClick={() => copy("code", code)}>{copied === "code" ? <Check size={16} /> : <Copy size={16} />} Копировать код</Btn>
        </div>
        <div style={{ color: C.dim, fontSize: 13, marginBottom: 10 }}>Раздайте участникам код + их пароль. {first === "radiant" ? cfg.radiantName : cfg.direName} банит первым.</div>
        <div style={{ display: "grid", gap: 10 }}>
          {rows.map(r => (
            <div key={r.role} style={{ display: "flex", alignItems: "center", gap: 12, background: C.bg, border: `1px solid ${C.line}`, borderLeft: `4px solid ${r.color}`, borderRadius: 8, padding: "12px 14px", flexWrap: "wrap" }}>
              <div style={{ fontWeight: 700, minWidth: 220 }}>{r.label}</div>
              <div style={{ color: C.dim, fontSize: 13 }}>пароль: <span style={{ color: C.text, fontFamily: "monospace", fontWeight: 700 }}>{r.pass}</span></div>
              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <Btn variant="ghost" onClick={() => copy(r.role + "p", `Код: ${code}\nРоль: ${r.label}\nПароль: ${r.pass}`)}>{copied === r.role + "p" ? <Check size={15} /> : <Copy size={15} />} Инвайт</Btn>
                <Btn variant="dark" onClick={() => enter({ code, role: r.role })}>Войти как эта роль</Btn>
              </div>
            </div>
          ))}
        </div>
      </Panel>
      <div style={{ marginTop: 16 }}><Btn variant="ghost" onClick={() => go("home")}>← На главную</Btn></div>
    </div>
  );
}

// ---------------- JOIN ----------------
function JoinMatch({ go, enter }) {
  const [code, setCode] = useState("");
  const [role, setRole] = useState("observer");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const roles = [
    { k: "radiant", label: "Капитан Radiant", icon: <Shield size={18} />, col: C.radiant },
    { k: "dire", label: "Капитан Dire", icon: <Swords size={18} />, col: C.dire },
    { k: "observer", label: "Наблюдатель", icon: <Eye size={18} />, col: C.gold },
  ];
  const join = async () => {
    setErr(""); setBusy(true);
    const m = await loadMatch(code.trim().toUpperCase());
    setBusy(false);
    if (!m) { setErr("Матч с таким кодом не найден."); return; }
    if (m.auth[role] !== pass) { setErr("Неверный пароль для выбранной роли."); return; }
    enter({ code: code.trim().toUpperCase(), role });
  };
  return (
    <div style={{ marginTop: 20, maxWidth: 460 }}>
      <BackBar go={go} />
      <Panel title="Вход в матч" icon={<LogIn size={18} />}>
        <Field label="Код комнаты" value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="напр. K7QX2" maxLength={6} />
        <div style={{ color: C.dim, fontSize: 12, margin: "2px 0 6px", fontWeight: 600 }}>Роль</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
          {roles.map(r => (
            <button key={r.k} onClick={() => setRole(r.k)} style={{ cursor: "pointer", background: role === r.k ? C.panel2 : C.bg, border: `1.5px solid ${role === r.k ? r.col : C.line}`, borderRadius: 10, padding: "12px 6px", color: role === r.k ? C.text : C.dim, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600 }}>
              <span style={{ color: r.col }}>{r.icon}</span>{r.label}
            </button>
          ))}
        </div>
        <Field label="Пароль" type="password" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && join()} />
        {err && <ErrBox>{err}</ErrBox>}
        <div style={{ marginTop: 10 }}><Btn onClick={join} disabled={busy || !code || !pass}>{busy ? "Проверяем…" : "Войти"}</Btn></div>
      </Panel>
    </div>
  );
}

// ---------------- DRAFT ROOM ----------------
function DraftRoom({ session, leave }) {
  const { code, role } = session;
  const [match, setMatch] = useState(null);
  const [selected, setSelected] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [busy, setBusy] = useState(false);
  const autoRef = useRef(false);

  // realtime subscription
  useEffect(() => {
    const unsub = onValue(mref(code), (snap) => {
      const v = snap.val();
      if (v) {
        v.actions = asArr(v.actions);
        v.pool = asArr(v.pool);
        v.sequence = asArr(v.sequence);
        setMatch(v);
      }
    });
    return () => unsub();
  }, [code]);
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 250); return () => clearInterval(t); }, []);
  useEffect(() => { setSelected(null); }, [match?.step]);

  const commit = useCallback(async (heroId) => {
    setBusy(true);
    try {
      await runTransaction(mref(code), (m) => {
        if (!m) return;                      // abort & retry with server value
        if (m.status !== "active") return;
        const cur = m.sequence[m.step];
        const actions = asArr(m.actions);
        if (!cur || cur.team !== role) return;
        if (actions.some(a => a.heroId === heroId)) return;
        if (!m.pool.includes(heroId)) return;
        actions.push({ step: m.step, team: cur.team, type: cur.type, heroId, ts: Date.now() });
        m.actions = actions;
        m.step += 1; m.turnStartedAt = Date.now(); m.version = (m.version || 0) + 1;
        if (m.step >= m.sequence.length) m.status = "done";
        return m;
      });
    } catch (e) { /* ignore */ }
    setSelected(null); setBusy(false);
  }, [code, role]);

  const cur = match?.sequence?.[match.step] || null;
  const myTurn = match?.status === "active" && cur && cur.team === role;
  const usedIds = new Set((match?.actions || []).map(a => a.heroId));

  // timer auto-random pick (enforced only by the active captain's client)
  const timerSec = match?.config?.timerSec || 0;
  const remaining = (match?.status === "active" && timerSec > 0 && match.turnStartedAt) ? Math.max(0, timerSec - Math.floor((now - match.turnStartedAt) / 1000)) : null;
  useEffect(() => {
    if (myTurn && timerSec > 0 && remaining === 0 && !autoRef.current && match) {
      autoRef.current = true;
      const avail = asArr(match.pool).filter(id => !usedIds.has(id));
      if (avail.length) commit(avail[Math.floor(Math.random() * avail.length)]);
    }
    if (remaining !== 0) autoRef.current = false;
  }, [remaining, myTurn, timerSec]); // eslint-disable-line

  const startDraft = async () => {
    await runTransaction(mref(code), (m) => {
      if (!m || m.status !== "ready") return;
      m.status = "active"; m.turnStartedAt = Date.now(); m.version = (m.version || 0) + 1; return m;
    });
  };
  const nextGame = async () => {
    await runTransaction(mref(code), (m) => {
      if (!m) return;
      const first = m.config.firstSide;
      m.game = (m.game || 1) + 1; m.pool = rollPool(m.config.poolSize);
      m.sequence = buildSequence(m.config.bansPerTeam, m.config.picksPerTeam, first);
      m.actions = []; m.step = 0; m.status = "ready"; m.turnStartedAt = 0; m.version = (m.version || 0) + 1;
      return m;
    });
  };

  if (!match) return <div style={{ marginTop: 40, color: C.dim }}>Загрузка матча {code}…</div>;
  const cfg = match.config;
  const teamOf = (t) => t === "radiant" ? cfg.radiantName : cfg.direName;
  const picksOf = (t) => asArr(match.actions).filter(a => a.team === t && a.type === "pick");
  const bansOf = (t) => asArr(match.actions).filter(a => a.team === t && a.type === "ban");

  return (
    <div>
      {/* top bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: "10px 14px", marginBottom: 14 }}>
        <RoleBadge role={role} />
        <div style={{ color: C.dim, fontSize: 13 }}>Игра {match.game || 1}</div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {match.status === "done" && (role === "radiant" || role === "dire") && <Btn variant="gold" onClick={nextGame}><RefreshCw size={15} /> Следующая игра</Btn>}
          <Btn variant="ghost" onClick={leave}><LogOut size={15} /> Выйти</Btn>
        </div>
      </div>

      {/* phase banner */}
      <PhaseBanner match={match} cur={cur} teamOf={teamOf} remaining={remaining} timerSec={timerSec} />

      {/* sequence strip */}
      <SequenceStrip match={match} teamOf={teamOf} />

      {/* main grid: radiant | pool | dire */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(150px,200px) 1fr minmax(150px,200px)", gap: 14, marginTop: 14, alignItems: "start" }}>
        <TeamColumn side="radiant" name={cfg.radiantName} picks={picksOf("radiant")} bans={bansOf("radiant")} slots={cfg.picksPerTeam} active={cur?.team === "radiant" && match.status === "active"} />
        <PoolArea match={match} cur={cur} myTurn={myTurn} usedIds={usedIds} selected={selected} setSelected={setSelected} commit={commit} busy={busy} role={role} startDraft={startDraft} teamOf={teamOf} />
        <TeamColumn side="dire" name={cfg.direName} picks={picksOf("dire")} bans={bansOf("dire")} slots={cfg.picksPerTeam} active={cur?.team === "dire" && match.status === "active"} />
      </div>
    </div>
  );
}

function RoleBadge({ role }) {
  const map = { radiant: { t: "Капитан Radiant", c: C.radiant, i: <Shield size={15} /> }, dire: { t: "Капитан Dire", c: C.dire, i: <Swords size={15} /> }, observer: { t: "Наблюдатель", c: C.gold, i: <Eye size={15} /> } }[role];
  return <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: C.bg, border: `1px solid ${map.c}`, color: map.c, borderRadius: 20, padding: "5px 12px", fontSize: 12.5, fontWeight: 700 }}>{map.i}{map.t}</div>;
}

function PhaseBanner({ match, cur, teamOf, remaining, timerSec }) {
  let text, sub, col = C.gold;
  if (match.status === "ready") { text = "Пул сформирован — ожидание старта"; sub = "Капитан может нажать «Начать драфт»"; }
  else if (match.status === "done") { text = "Драфт завершён"; sub = "Составы собраны"; col = C.radiant; }
  else if (cur) { col = cur.team === "radiant" ? C.radiant : C.dire; text = `${cur.type === "ban" ? "БАН" : "ПИК"} — ${teamOf(cur.team)}`; sub = cur.type === "ban" ? "Капитан выбирает героя для бана" : "Капитан выбирает героя в состав"; }
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, background: `linear-gradient(90deg, ${col}22, transparent)`, border: `1px solid ${C.line}`, borderLeft: `4px solid ${col}`, borderRadius: 10, padding: "12px 16px" }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 800, fontSize: 17, color: col }}>{text}</div>
        <div style={{ color: C.dim, fontSize: 12.5 }}>{sub}</div>
      </div>
      {remaining !== null && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: remaining <= 5 ? C.dire : C.text, fontWeight: 800, fontSize: 26, fontFamily: "monospace" }}>
          <Clock size={20} />{String(remaining).padStart(2, "0")}
        </div>
      )}
    </div>
  );
}

function SequenceStrip({ match, teamOf }) {
  return (
    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 12 }}>
      {asArr(match.sequence).map((s, i) => {
        const done = asArr(match.actions)[i];
        const isCur = match.status === "active" && i === match.step;
        const col = s.team === "radiant" ? C.radiant : C.dire;
        const h = done ? HERO_MAP[done.heroId] : null;
        return (
          <div key={i} title={`${s.type === "ban" ? "Бан" : "Пик"} · ${teamOf(s.team)}`} style={{ width: 40, height: 40, borderRadius: 6, overflow: "hidden", position: "relative", border: `2px solid ${isCur ? C.gold : col}`, boxShadow: isCur ? `0 0 0 2px ${C.gold}66` : "none", background: C.bg, flex: "0 0 auto" }}>
            {h ? (
              <>
                <HeroImg h={h} />
                {s.type === "ban" && <div style={{ position: "absolute", inset: 0, background: "rgba(10,10,12,.62)", display: "grid", placeItems: "center" }}><Ban size={18} color={C.dire} /></div>}
              </>
            ) : (
              <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: col, opacity: .8 }}>{s.type === "ban" ? <Ban size={15} /> : <Crown size={15} />}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TeamColumn({ side, name, picks, bans, slots, active }) {
  const col = side === "radiant" ? C.radiant : C.dire;
  return (
    <div style={{ background: C.panel, border: `1px solid ${active ? col : C.line}`, borderRadius: 12, padding: 12, boxShadow: active ? `0 0 0 2px ${col}44` : "none" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        {side === "radiant" ? <Shield size={16} color={col} /> : <Swords size={16} color={col} />}
        <div style={{ fontWeight: 800, color: col, fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
      </div>
      <div style={{ display: "grid", gap: 7 }}>
        {Array.from({ length: slots }).map((_, i) => {
          const p = picks[i]; const h = p ? HERO_MAP[p.heroId] : null;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: C.bg, borderRadius: 8, border: `1px solid ${C.line}`, padding: 4, minHeight: 42 }}>
              <div style={{ width: 66, height: 37, borderRadius: 5, overflow: "hidden", background: "#0a0f18", flex: "0 0 auto", border: h ? `1px solid ${col}` : "none" }}>{h && <HeroImg h={h} />}</div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: h ? C.text : C.dim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h ? h.n : `Слот ${i + 1}`}</div>
            </div>
          );
        })}
      </div>
      {bans.length > 0 && (
        <>
          <div style={{ color: C.dim, fontSize: 11, fontWeight: 700, margin: "12px 0 6px", letterSpacing: .4 }}>БАНЫ</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {bans.map((b, i) => {
              const h = HERO_MAP[b.heroId];
              return <div key={i} title={h.n} style={{ width: 34, height: 34, borderRadius: 5, overflow: "hidden", position: "relative", border: `1px solid ${C.line}` }}>
                <HeroImg h={h} style={{ filter: "grayscale(1) brightness(.6)" }} />
                <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}><Ban size={14} color={C.dire} /></div>
              </div>;
            })}
          </div>
        </>
      )}
    </div>
  );
}

function PoolArea({ match, cur, myTurn, usedIds, selected, setSelected, commit, busy, role, startDraft, teamOf }) {
  const pool = asArr(match.pool).map(id => HERO_MAP[id]);
  const canAct = myTurn && !busy;
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 14 }}>
          <Dices size={17} color={C.gold} /> Пул Random Draft <span style={{ color: C.dim, fontWeight: 500 }}>({pool.length} героев)</span>
        </div>
        {match.status === "ready" && (role === "radiant" || role === "dire") && (
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="gold" onClick={startDraft}><Play size={15} /> Начать драфт</Btn>
          </div>
        )}
      </div>

      {/* status line for non-active */}
      {match.status === "active" && !myTurn && (
        <div style={{ background: C.bg, border: `1px solid ${C.line}`, borderRadius: 8, padding: "8px 12px", marginBottom: 10, color: C.dim, fontSize: 13 }}>
          {role === "observer" ? "Режим наблюдателя — вы видите драфт в реальном времени." : `Ход соперника: ${teamOf(cur?.team)} ${cur?.type === "ban" ? "банит" : "пикает"}…`}
        </div>
      )}
      {match.status === "ready" && role === "observer" && (
        <div style={{ background: C.bg, border: `1px solid ${C.line}`, borderRadius: 8, padding: "8px 12px", marginBottom: 10, color: C.dim, fontSize: 13 }}>Ожидание старта драфта капитанами…</div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(96px,1fr))", gap: 7 }}>
        {pool.map(h => {
          const used = usedIds.has(h.id);
          const act = asArr(match.actions).find(a => a.heroId === h.id);
          const isSel = selected === h.id;
          const clickable = canAct && !used;
          return (
            <div key={h.id} onClick={() => clickable && setSelected(isSel ? null : h.id)}
              style={{
                position: "relative", borderRadius: 8, overflow: "hidden", aspectRatio: "16/9",
                border: `2px solid ${isSel ? C.gold : used ? "transparent" : C.line}`,
                cursor: clickable ? "pointer" : "default", opacity: used ? 0.9 : 1,
                boxShadow: isSel ? `0 0 0 2px ${C.gold}88` : "none", transition: "border-color .12s, transform .12s",
                transform: isSel ? "translateY(-2px)" : "none",
              }}>
              <HeroImg h={h} style={used ? { filter: "grayscale(1) brightness(.4)" } : {}} />
              <div style={{ position: "absolute", left: 0, bottom: 0, right: 0, height: 3, background: ATTR_COLOR[h.a] }} />
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 3, background: "linear-gradient(transparent, rgba(6,9,14,.92))", color: "#fff", fontSize: 9.5, fontWeight: 600, padding: "8px 3px 2px", textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{h.n}</div>
              {used && (
                <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                  {act?.type === "ban"
                    ? <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, color: C.dire }}><Ban size={20} /><span style={{ fontSize: 8, fontWeight: 800 }}>BAN</span></div>
                    : <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, color: act?.team === "radiant" ? C.radiant : C.dire }}><Crown size={18} /><span style={{ fontSize: 8, fontWeight: 800 }}>{act?.team === "radiant" ? "RAD" : "DIRE"}</span></div>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* action bar */}
      {myTurn && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14, padding: "12px 14px", background: C.bg, border: `1px solid ${cur.type === "ban" ? C.dire : C.gold}`, borderRadius: 10, flexWrap: "wrap" }}>
          <div style={{ fontSize: 14, color: C.text }}>
            {selected ? <>Ваш выбор: <b style={{ color: cur.type === "ban" ? C.dire : C.gold }}>{HERO_MAP[selected].n}</b></> : <span style={{ color: C.dim }}>Выберите героя в пуле…</span>}
          </div>
          <div style={{ marginLeft: "auto" }}>
            <Btn variant={cur.type === "ban" ? "dire" : "gold"} disabled={!selected || busy} onClick={() => commit(selected)}>
              {cur.type === "ban" ? <><Ban size={16} /> Забанить</> : <><Crown size={16} /> Взять в состав</>}
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- shared bits ----------
const Panel = ({ title, icon, children }) => (
  <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 14, padding: 20 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16, color: C.gold, fontWeight: 800, fontSize: 15 }}>{icon}{title}</div>
    {children}
  </div>
);
const NumField = ({ label, v, set, min, max }) => (
  <label style={{ display: "block", marginBottom: 12 }}>
    <div style={{ color: C.dim, fontSize: 12, marginBottom: 5, fontWeight: 600 }}>{label}</div>
    <input type="number" value={v} min={min} max={max} onChange={e => { let n = parseInt(e.target.value || "0", 10); if (isNaN(n)) n = min; set(Math.max(min, Math.min(max, n))); }}
      style={{ width: "100%", boxSizing: "border-box", background: C.bg, border: `1px solid ${C.line}`, color: C.text, borderRadius: 8, padding: "10px 12px", fontSize: 14, outline: "none" }} />
  </label>
);
const BackBar = ({ go }) => <div style={{ marginBottom: 14 }}><Btn variant="ghost" onClick={() => go("home")}>← Назад</Btn></div>;
const ErrBox = ({ children }) => <div style={{ display: "flex", alignItems: "center", gap: 8, background: `${C.dire}22`, border: `1px solid ${C.dire}`, color: "#f3b4ac", borderRadius: 8, padding: "10px 12px", marginTop: 12, fontSize: 13 }}><AlertTriangle size={16} />{children}</div>;
