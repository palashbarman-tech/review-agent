import { useState, useMemo, useEffect, useRef } from "react";
import {
  Store, SlidersHorizontal, AlertTriangle, Smile, Meh, Frown,
  Sparkles, RefreshCcw, Send, Copy, Check, Clock, X, Moon, Sun
} from "lucide-react";

const PLATFORMS = ["Google", "Yelp", "Facebook", "Instagram", "Threads"];

const PLATFORM_META = {
  Google: { badge: "G", bg: "#4285F4" },
  Yelp: { badge: "Y", bg: "#D32323" },
  Facebook: { badge: "f", bg: "#1877F2" },
  Instagram: { badge: "IG", bg: "#C1367B" },
  Threads: { badge: "@", bg: "#111827" },
};

function PlatformBadge({ platform, size = 16 }) {
  const meta = PLATFORM_META[platform] || { badge: platform[0], bg: "#7A7568" };
  return (
    <span
      className="eo-platform-badge"
      style={{ width: size, height: size, background: meta.bg, fontSize: Math.round(size * 0.52) }}
    >
      {meta.badge}
    </span>
  );
}

const RAW_REVIEWS = [
  { id: "r1", platform: "Google", author: "rakhi singh", rating: 5, date: "Aug 27",
    text: "Best oat milk latte in town — the staff remembered my order after just one visit.",
    tags: [] },
  { id: "r2", platform: "Yelp", author: "himanshu singh", rating: 2, date: "Aug 27",
    text: "Waited 25 minutes for a coffee, then got handed someone else's order. Second time this month.",
    tags: ["slow service", "wrong order"] },
  { id: "r3", platform: "Facebook", author: "salman khan", rating: 4, date: "Aug 26",
    text: "Lovely cozy corner to get work done. Wifi could be a bit faster during busy hours.",
    tags: ["wifi"] },
  { id: "r4", platform: "Instagram", author: "karan aujla", rating: 1, date: "Aug 26",
    text: "Barista was rude when I asked for a refund on a stone-cold cappuccino. Never going back.",
    tags: ["rude staff", "temperature"] },
  { id: "r5", platform: "Google", author: "Sana Sheikh", rating: 5, date: "Aug 25",
    text: "Their weekend brunch special is unbeatable — generous portions and always fresh.",
    tags: [] },
  { id: "r6", platform: "Yelp", author: "ranveer singh", rating: 3, date: "Aug 25",
    text: "Coffee's genuinely good, but it's too loud to hold a conversation, especially weekend mornings.",
    tags: ["noise/seating"] },
  { id: "r7", platform: "Facebook", author: "Riya Kapoor", rating: 2, date: "Aug 24",
    text: "Prices went up again and portions got smaller. Starting to feel overpriced for what it is.",
    tags: ["pricing"] },
  { id: "r8", platform: "Google", author: "ranveer kapoor", rating: 5, date: "Aug 23",
    text: "Staff went out of their way to make my kid's birthday order special. Genuinely thank you.",
    tags: [] },
  { id: "r9", platform: "Instagram", author: "aditya dhaar", rating: 1, date: "Aug 23",
    text: "Found a hair in my sandwich. The manager didn't seem to care much when I mentioned it.",
    tags: ["cleanliness", "rude staff"] },
  { id: "r10", platform: "Yelp", author: "samay raina", rating: 4, date: "Aug 22",
    text: "Great espresso. Seating gets tight during the lunch rush though — plan around it.",
    tags: ["noise/seating"] },
  { id: "r11", platform: "Google", author: "Aditi Rao", rating: 2, date: "Aug 21",
    text: "Ordered ahead on the app and still waited 20 minutes in store. What's the point of ordering ahead?",
    tags: ["slow service"] },
  { id: "r12", platform: "Facebook", author: "Diljit Dosanjh", rating: 3, date: "Aug 20",
    text: "Decent spot overall, but parking nearby is a nightmare on weekends.",
    tags: ["parking"] },
  { id: "r13", platform: "Threads", author: "neha malhotra", rating: 4, date: "Aug 28",
    text: "Cute little spot, great for a quick catch-up with friends. Would love more vegan options though.",
    tags: ["menu variety"] },
];

const URGENT_KEYWORDS = ["refund", "manager", "never going back", "hair in", "second time"];

function sentimentOf(review) {
  if (review.rating >= 4) return "positive";
  if (review.rating === 3) return "neutral";
  return "negative";
}
function isUrgent(review) {
  if (review.rating > 2) return false;
  const lower = review.text.toLowerCase();
  return URGENT_KEYWORDS.some((k) => lower.includes(k));
}

const SENTIMENT_META = {
  positive: { label: "POSITIVE", color: "#3F7A54", icon: Smile },
  neutral: { label: "NEUTRAL", color: "#B4791A", icon: Meh },
  negative: { label: "NEGATIVE", color: "#A83A2B", icon: Frown },
};

const TONES = [
  { id: "warm", label: "Warm" },
  { id: "professional", label: "Professional" },
  { id: "apologetic", label: "Apologetic" },
];

function AnimatedNumber({ value, decimals = 0 }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);
  useEffect(() => {
    const start = prevRef.current;
    const end = value;
    const duration = 550;
    let startTime = null;
    let raf;
    function step(ts) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + (end - start) * eased);
      if (progress < 1) raf = requestAnimationFrame(step);
      else prevRef.current = end;
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{display.toFixed(decimals)}</>;
}

function RatingDots({ rating }) {
  return (
    <span style={{ letterSpacing: "2px", fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px" }}>
      {"●".repeat(rating)}
      <span style={{ opacity: 0.25 }}>{"●".repeat(5 - rating)}</span>
    </span>
  );
}

function Stamp({ sentiment, urgent }) {
  const meta = SENTIMENT_META[sentiment];
  const Icon = meta.icon;
  return (
    <div className="eo-stamp-wrap">
      <div className="eo-stamp stamp-pop" style={{ color: meta.color, borderColor: meta.color }}>
        <Icon size={12} strokeWidth={2.5} />
        {meta.label}
      </div>
      {urgent && (
        <div className="eo-urgent-ribbon stamp-pop">
          <AlertTriangle size={11} strokeWidth={2.5} />
          URGENT
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [reviews, setReviews] = useState(RAW_REVIEWS);
  const [platformActive, setPlatformActive] = useState(new Set(PLATFORMS));
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [tone, setTone] = useState("warm");
  const [copiedId, setCopiedId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const decorated = useMemo(
    () => reviews.map((r) => ({ ...r, sentiment: sentimentOf(r), urgent: isUrgent(r) })),
    [reviews]
  );

  const stats = useMemo(() => {
    const total = decorated.length;
    const avg = (decorated.reduce((s, r) => s + r.rating, 0) / total).toFixed(1);
    const urgentOpen = decorated.filter((r) => r.urgent && r.status !== "responded").length;
    const responded = decorated.filter((r) => r.status === "responded").length;
    return { total, avg, urgentOpen, responseRate: Math.round((responded / total) * 100) };
  }, [decorated]);

  const sentimentTally = useMemo(() => {
    const t = { positive: 0, neutral: 0, negative: 0 };
    decorated.forEach((r) => t[r.sentiment]++);
    return t;
  }, [decorated]);

  const recurringIssues = useMemo(() => {
    const counts = {};
    decorated.forEach((r) => {
      if (r.sentiment === "positive") return;
      r.tags.forEach((t) => (counts[t] = (counts[t] || 0) + 1));
    });
    const arr = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const max = arr.length ? arr[0][1] : 1;
    return arr.map(([label, count]) => ({ label, count, pct: Math.round((count / max) * 100) }));
  }, [decorated]);

  const filtered = useMemo(() => {
    return decorated
      .filter((r) => platformActive.has(r.platform))
      .filter((r) => {
        if (filter === "urgent") return r.urgent && r.status !== "responded";
        if (filter === "needsReply") return r.status !== "responded";
        if (filter === "positive") return r.sentiment === "positive";
        if (filter === "responded") return r.status === "responded";
        return true;
      });
  }, [decorated, platformActive, filter]);

  const selected = decorated.find((r) => r.id === selectedId) || null;
  const selectedDraft = selectedId ? drafts[selectedId] : null;

  function togglePlatform(p) {
    setPlatformActive((prev) => {
      const next = new Set(prev);
      next.has(p) ? next.delete(p) : next.add(p);
      return next.size ? next : new Set([p]);
    });
  }

  function markResponded(id) {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: "responded" } : r)));
  }

  async function generateDraft(review, useTone) {
    setDrafts((prev) => ({ ...prev, [review.id]: { ...prev[review.id], loading: true, error: null } }));
    try {
      const res = await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system:
            `You are the owner of Palash cafe home, a neighborhood coffee shop, replying publicly ` +
            `to a customer review. Write ONE reply, under 70 words, in a ${useTone} tone. Reference something ` +
            `specific from the review. Avoid generic phrases like "we value your feedback". No greeting, no ` +
            `sign-off, no quotation marks. Output only the reply text.`,
          messages: [
            {
              role: "user",
              content: `Platform: ${review.platform}\nReviewer: ${review.author}\nRating: ${review.rating}/5\nReview: "${review.text}"`,
            },
          ],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "request failed");
      const block = data.content?.find((b) => b.type === "text");
      if (!block) throw new Error("empty response");
      setDrafts((prev) => ({ ...prev, [review.id]: { text: block.text.trim(), loading: false, error: null, tone: useTone } }));
    } catch (e) {
      setDrafts((prev) => ({
        ...prev,
        [review.id]: { ...prev[review.id], text: prev[review.id]?.text || "", loading: false, error: "Couldn't draft a reply — try again." },
      }));
    }
  }

  function copyDraft(id, text) {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  const FILTER_TABS = [
    { id: "all", label: "All" },
    { id: "urgent", label: "Urgent" },
    { id: "needsReply", label: "Needs reply" },
    { id: "positive", label: "Positive" },
    { id: "responded", label: "Responded" },
  ];

  return (
    <div className={`eo-app ${darkMode ? "eo-dark" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500..800&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

        .eo-app{
          --ink:#1B2430; --ink-soft:#5B5648; --paper:#EFEAD9; --paper-dim:#E4DEC9;
          --line:#D6CCAF; --teal:#0F6B5C; --brick:#A83A2B; --ochre:#B4791A; --sage:#3F7A54;
          --card-bg:#FBF9F1; --stamp-bg:rgba(255,255,255,0.5);
          font-family:'IBM Plex Sans',sans-serif; color:var(--ink); background:var(--paper);
          min-height:100vh; width:100%; transition:background 0.2s,color 0.2s;
        }
        .eo-app.eo-dark{
          --ink:#EFEAD9; --ink-soft:#A9A08C; --paper:#161C26; --paper-dim:#1F2733;
          --line:#3A4656; --teal:#3FBF9F; --brick:#E07A63; --ochre:#E0A83D; --sage:#7BCB93;
          --card-bg:#1F2733; --stamp-bg:rgba(0,0,0,0.3);
        }
        .eo-theme-toggle{
          display:inline-flex; align-items:center; justify-content:center; width:34px; height:34px;
          border-radius:9px; border:1px solid var(--line); background:var(--card-bg); color:var(--ink);
          cursor:pointer; transition:background 0.2s, transform 0.15s;
        }
        .eo-theme-toggle:hover{ background:var(--paper-dim); transform:translateY(-1px) rotate(-8deg); }
        .eo-theme-toggle:active{ transform:scale(0.92); }
        .eo-display{ font-family:'Fraunces',serif; }
        .eo-mono{ font-family:'IBM Plex Mono',monospace; }

        .eo-card{ background:var(--card-bg); border:1px solid var(--line); border-radius:14px; transition:background 0.2s; }
        .eo-ticket{
          position:relative; background:var(--card-bg); border:1px solid var(--line); border-radius:10px;
          border-left:none; padding-left:22px;
        }
        .eo-ticket::before{
          content:''; position:absolute; left:0; top:8px; bottom:8px; width:2px;
          background-image:linear-gradient(var(--line) 60%, transparent 0%);
          background-size:2px 8px; background-repeat:repeat-y;
        }
        .eo-ticket.selected{ outline:2px solid var(--ink); outline-offset:-2px; }

        .eo-stamp-wrap{ display:flex; flex-direction:column; align-items:flex-end; gap:4px; }
        .eo-stamp{
          font-family:'IBM Plex Mono',monospace; font-size:10px; font-weight:600; letter-spacing:0.06em;
          border:1.5px solid; border-radius:5px; padding:2px 6px; display:flex; align-items:center; gap:4px;
          transform:rotate(-4deg); background:var(--stamp-bg);
        }
        .eo-urgent-ribbon{
          font-family:'IBM Plex Mono',monospace; font-size:9.5px; font-weight:600; letter-spacing:0.08em;
          color:#fff; background:var(--brick); border-radius:4px; padding:2px 6px;
          display:flex; align-items:center; gap:3px; transform:rotate(-4deg);
        }
        @keyframes stampPop{ 0%{ transform:scale(0.6) rotate(-4deg); opacity:0; } 70%{ transform:scale(1.08) rotate(-4deg); opacity:1; } 100%{ transform:scale(1) rotate(-4deg); } }
        .stamp-pop{ animation:stampPop 0.35s ease-out; }
        @media (prefers-reduced-motion: reduce){ .stamp-pop{ animation:none; } }

        @keyframes eoCardIn{ from{ opacity:0; transform:translateY(12px) scale(1); } to{ opacity:1; transform:translateY(0) scale(1); } }
        .eo-ticket{ animation:eoCardIn 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .eo-ticket{ transition:box-shadow 0.25s ease, transform 0.28s cubic-bezier(0.34,1.56,0.64,1); }
        .eo-ticket:hover{ box-shadow:0 6px 18px rgba(27,36,48,0.08); transform:translateY(-2px); }

        @keyframes eoSelectZoom{
          0%{ transform:scale(1); }
          45%{ transform:scale(1.045); }
          70%{ transform:scale(0.99); }
          100%{ transform:scale(1.02); }
        }
        .eo-ticket.selected{
          animation:eoSelectZoom 0.45s cubic-bezier(0.34,1.56,0.64,1) both;
          transform:scale(1.02);
          outline:2px solid var(--ink); outline-offset:-2px;
          box-shadow:0 12px 26px rgba(27,36,48,0.14);
          position:relative; z-index:2;
        }

        @keyframes eoFadeIn{ from{ opacity:0; transform:translateY(8px); } to{ opacity:1; transform:translateY(0); } }
        .eo-fade-in{ animation:eoFadeIn 0.4s cubic-bezier(0.16,1,0.3,1) both; }

        @keyframes eoPulse{ 0%,100%{ opacity:1; transform:scale(1) rotate(0deg); } 50%{ opacity:0.55; transform:scale(0.85) rotate(15deg); } }
        .eo-loading-icon{ animation:eoPulse 1s ease-in-out infinite; }

        @keyframes eoIconPop{ from{ opacity:0; transform:scale(0.5) rotate(-45deg); } to{ opacity:1; transform:scale(1) rotate(0deg); } }
        .eo-icon-pop{ display:inline-flex; animation:eoIconPop 0.35s cubic-bezier(0.16,1,0.3,1) both; }

        @media (prefers-reduced-motion: reduce){
          .eo-ticket, .eo-fade-in, .eo-loading-icon, .eo-icon-pop{ animation:none !important; }
        }

        .eo-tab{
          font-family:'IBM Plex Mono',monospace; font-size:12px; padding:6px 12px; border-radius:999px;
          border:1px solid var(--line); background:transparent; color:var(--ink-soft); cursor:pointer;
          white-space:nowrap; transition:background 0.25s cubic-bezier(0.16,1,0.3,1), color 0.25s, border-color 0.25s, transform 0.2s;
        }
        .eo-tab.active{ background:var(--ink); color:var(--paper); border-color:var(--ink); transform:translateY(-1px); }
        .eo-tab:hover:not(.active){ border-color:var(--ink-soft); color:var(--ink); }

        .eo-platform-row{
          display:flex; align-items:center; justify-content:space-between; padding:7px 10px; border-radius:8px;
          cursor:pointer; font-size:13px; border:1px solid transparent;
        }
        .eo-platform-row.active{ background:rgba(255,255,255,0.55); border-color:var(--line); }
        .eo-platform-row:hover{ background:rgba(255,255,255,0.35); }

        .eo-dot{ width:8px; height:8px; border-radius:50%; display:inline-block; }
        .eo-platform-badge{
          display:inline-flex; align-items:center; justify-content:center; border-radius:50%;
          font-family:'IBM Plex Sans',sans-serif; font-weight:700; line-height:1; flex-shrink:0; color:#fff;
        }

        .eo-btn{
          font-family:'IBM Plex Sans',sans-serif; font-size:13px; font-weight:500; border-radius:9px;
          padding:8px 13px; display:inline-flex; align-items:center; gap:6px; cursor:pointer; border:1px solid var(--line);
          background:var(--card-bg); color:var(--ink); transition:transform 0.15s cubic-bezier(0.16,1,0.3,1), background 0.2s, box-shadow 0.2s;
        }
        .eo-btn:hover{ background:var(--paper-dim); transform:translateY(-1px); box-shadow:0 4px 10px rgba(27,36,48,0.08); }
        .eo-btn:active{ transform:scale(0.97) translateY(0); box-shadow:none; }
        .eo-btn-primary{ background:var(--ink); color:var(--paper); border-color:var(--ink); }
        .eo-btn-primary:hover{ background:#2B384A; }
        .eo-btn:disabled{ opacity:0.55; cursor:default; transform:none; box-shadow:none; }

        .eo-tone-chip{
          font-family:'IBM Plex Mono',monospace; font-size:11.5px; padding:4px 10px; border-radius:999px;
          border:1px solid var(--line); background:transparent; cursor:pointer; color:var(--ink-soft);
        }
        .eo-tone-chip.active{ background:var(--teal); color:#fff; border-color:var(--teal); }

        .eo-bar-track{ background:var(--paper-dim); border-radius:4px; height:6px; overflow:hidden; }
        .eo-bar-fill{ background:var(--ochre); height:100%; border-radius:4px; }

        .eo-scroll::-webkit-scrollbar{ width:8px; }
        .eo-scroll::-webkit-scrollbar-thumb{ background:var(--line); border-radius:4px; }

        textarea.eo-draft{
          width:100%; resize:vertical; min-height:120px; font-family:'IBM Plex Sans',sans-serif; font-size:13.5px;
          line-height:1.55; padding:10px; border-radius:9px; border:1px solid var(--line); background:var(--card-bg); color:var(--ink);
        }
        textarea.eo-draft:focus{ outline:2px solid var(--ink); outline-offset:1px; }
      `}</style>

      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="eo-card" style={{ padding: "8px", borderRadius: "10px" }}>
              <Store size={20} strokeWidth={1.8} />
            </div>
            <div>
              <div className="eo-display" style={{ fontSize: "22px", fontWeight: 700, lineHeight: 1 }}>
                Palash Cafe
              </div>
              <div className="eo-mono" style={{ fontSize: "11px", color: "var(--ink-soft)", letterSpacing: "0.08em" }}>
                REPUTATION DESK
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="eo-mono hidden sm:block" style={{ fontSize: "11px", color: "var(--ink-soft)" }}>
              WEEK OF AUG 20–27
            </div>
            <button
              className="eo-theme-toggle"
              onClick={() => setDarkMode((d) => !d)}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              title={darkMode ? "Light mode" : "Dark mode"}
            >
              {darkMode ? <Sun key="sun" size={16} className="eo-icon-pop" /> : <Moon key="moon" size={16} className="eo-icon-pop" />}
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="eo-card grid grid-cols-2 sm:grid-cols-4 divide-x mb-5" style={{ borderColor: "var(--line)" }}>
          {[
            ["Reviews this week", stats.total, "", 0],
            ["Average rating", Number(stats.avg), "/5", 1],
            ["Urgent open", stats.urgentOpen, "", 0],
            ["Response rate", stats.responseRate, "%", 0],
          ].map(([label, val, suffix, decimals], i) => (
            <div key={i} className="p-4" style={{ borderColor: "var(--line)" }}>
              <div className="eo-mono" style={{ fontSize: "11px", color: "var(--ink-soft)" }}>{label.toUpperCase()}</div>
              <div className="eo-display" style={{ fontSize: "26px", fontWeight: 700, marginTop: "2px" }}>
                <AnimatedNumber value={val} decimals={decimals} /><span style={{ fontSize: "14px", color: "var(--ink-soft)" }}>{suffix}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-5">
          {/* Left rail */}
          <div className="lg:w-56 flex-shrink-0 flex flex-col gap-4">
            <div className="eo-card p-3">
              <div className="flex items-center gap-2 mb-2 px-1">
                <SlidersHorizontal size={13} />
                <span className="eo-mono" style={{ fontSize: "11px", letterSpacing: "0.06em", color: "var(--ink-soft)" }}>PLATFORMS</span>
              </div>
              {PLATFORMS.map((p) => {
                const count = decorated.filter((r) => r.platform === p).length;
                const active = platformActive.has(p);
                return (
                  <div key={p} className={`eo-platform-row ${active ? "active" : ""}`} onClick={() => togglePlatform(p)}>
                    <span className="flex items-center gap-2" style={{ opacity: active ? 1 : 0.45 }}>
                      <PlatformBadge platform={p} size={14} />
                      {p}
                    </span>
                    <span className="eo-mono" style={{ fontSize: "11px", opacity: active ? 1 : 0.4 }}>{count}</span>
                  </div>
                );
              })}
            </div>

            <div className="eo-card p-4">
              <div className="eo-mono mb-3" style={{ fontSize: "11px", letterSpacing: "0.06em", color: "var(--ink-soft)" }}>SENTIMENT SPLIT</div>
              {(["positive", "neutral", "negative"]).map((s) => (
                <div key={s} className="flex items-center justify-between mb-2 text-sm">
                  <span className="flex items-center gap-2">
                    <span className="eo-dot" style={{ background: SENTIMENT_META[s].color }} />
                    <span style={{ textTransform: "capitalize" }}>{s}</span>
                  </span>
                  <span className="eo-mono">{sentimentTally[s]}</span>
                </div>
              ))}
            </div>

            <div className="eo-card p-4">
              <div className="eo-mono mb-3" style={{ fontSize: "11px", letterSpacing: "0.06em", color: "var(--ink-soft)" }}>RECURRING ISSUES</div>
              {recurringIssues.length === 0 && (
                <div className="text-sm" style={{ color: "var(--ink-soft)" }}>No repeated themes flagged yet.</div>
              )}
              {recurringIssues.map((issue) => (
                <div key={issue.label} className="mb-2.5">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span style={{ textTransform: "capitalize" }}>{issue.label}</span>
                    <span className="eo-mono" style={{ color: "var(--ink-soft)" }}>{issue.count}</span>
                  </div>
                  <div className="eo-bar-track"><div className="eo-bar-fill" style={{ width: issue.pct + "%" }} /></div>
                </div>
              ))}
            </div>
          </div>

          {/* Center feed */}
          <div className="flex-1 min-w-0">
            <div className="flex gap-2 mb-4 overflow-x-auto eo-scroll pb-1">
              {FILTER_TABS.map((t) => (
                <button key={t.id} className={`eo-tab ${filter === t.id ? "active" : ""}`} onClick={() => setFilter(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {filtered.length === 0 && (
                <div className="eo-card p-8 text-center" style={{ color: "var(--ink-soft)" }}>
                  Nothing here. Try another filter or platform.
                </div>
              )}
              {filtered.map((r, idx) => (
                <div
                  key={r.id}
                  className={`eo-ticket p-4 cursor-pointer ${selectedId === r.id ? "selected" : ""}`}
                  style={{ animationDelay: `${Math.min(idx * 45, 400)}ms` }}
                  onClick={() => setSelectedId(r.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <PlatformBadge platform={r.platform} size={16} />
                        <span className="eo-mono" style={{ fontSize: "11px", letterSpacing: "0.06em", color: "var(--ink-soft)" }}>
                          {r.platform.toUpperCase()}
                        </span>
                        <span style={{ color: "var(--line)" }}>·</span>
                        <span className="eo-mono" style={{ fontSize: "11px", color: "var(--ink-soft)" }}>{r.date}</span>
                        {r.status === "responded" && (
                          <span className="eo-mono flex items-center gap-1" style={{ fontSize: "10.5px", color: "var(--sage)" }}>
                            <Check size={11} /> REPLIED
                          </span>
                        )}
                      </div>
                      <div className="eo-display" style={{ fontWeight: 600, fontSize: "15px", marginTop: "4px" }}>{r.author}</div>
                      <div className="mt-0.5"><RatingDots rating={r.rating} /></div>
                      <p className="text-sm mt-2" style={{ lineHeight: 1.5 }}>{r.text}</p>
                      {r.tags.length > 0 && (
                        <div className="flex gap-1.5 mt-2 flex-wrap">
                          {r.tags.map((t) => (
                            <span key={t} className="eo-mono" style={{ fontSize: "10px", color: "var(--ink-soft)", border: "1px solid var(--line)", borderRadius: "999px", padding: "1px 7px" }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <Stamp sentiment={r.sentiment} urgent={r.urgent && r.status !== "responded"} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right rail: drafts */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="eo-card p-4 sticky top-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} />
                <span className="eo-mono" style={{ fontSize: "11px", letterSpacing: "0.06em", color: "var(--ink-soft)" }}>AI DRAFT WORKSPACE</span>
              </div>

              {!selected && (
                <div className="text-sm py-8 text-center" style={{ color: "var(--ink-soft)" }}>
                  Select a review from the feed to draft a reply.
                </div>
              )}

              {selected && (
                <div key={selected.id} className="eo-fade-in">
                  <div className="mb-3 pb-3" style={{ borderBottom: "1px solid var(--line)" }}>
                    <div className="eo-display" style={{ fontWeight: 600, fontSize: "14px" }}>{selected.author}</div>
                    <div className="eo-mono flex items-center gap-1.5" style={{ fontSize: "11px", color: "var(--ink-soft)" }}>
                      <PlatformBadge platform={selected.platform} size={13} />
                      {selected.platform.toUpperCase()} · {selected.rating}/5
                    </div>
                  </div>

                  <div className="flex gap-2 mb-3 flex-wrap">
                    {TONES.map((t) => (
                      <button
                        key={t.id}
                        className={`eo-tone-chip ${tone === t.id ? "active" : ""}`}
                        onClick={() => setTone(t.id)}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  <textarea
                    className="eo-draft"
                    placeholder="No draft yet — generate one below."
                    value={selectedDraft?.text || ""}
                    onChange={(e) =>
                      setDrafts((prev) => ({ ...prev, [selected.id]: { ...prev[selected.id], text: e.target.value } }))
                    }
                  />
                  {selectedDraft?.error && (
                    <div className="text-xs mt-1" style={{ color: "var(--brick)" }}>{selectedDraft.error}</div>
                  )}

                  <div className="flex gap-2 mt-3 flex-wrap">
                    <button className="eo-btn eo-btn-primary" disabled={selectedDraft?.loading} onClick={() => generateDraft(selected, tone)}>
                      {selectedDraft?.loading ? <Sparkles size={14} className="eo-loading-icon" /> : <Sparkles size={14} />}
                      {selectedDraft?.loading ? "Drafting…" : selectedDraft?.text ? "Regenerate" : "Generate draft"}
                    </button>
                    <button className="eo-btn" onClick={() => copyDraft(selected.id, selectedDraft?.text)}>
                      {copiedId === selected.id ? <Check size={14} /> : <Copy size={14} />}
                      {copiedId === selected.id ? "Copied" : "Copy"}
                    </button>
                    <button
                      className="eo-btn"
                      disabled={!selectedDraft?.text || selected.status === "responded"}
                      onClick={() => markResponded(selected.id)}
                    >
                      <Send size={14} />
                      {selected.status === "responded" ? "Sent" : "Mark as sent"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
