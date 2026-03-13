import { useState, useEffect, useMemo } from "react";

const C = {
  bg: "#0f1117", card: "#1a1d27", border: "#2a2d3a",
  accent: "#6c5ce7", accentLight: "#a29bfe",
  concl: "#55efc4", conclBg: "rgba(85,239,196,0.10)",
  ok: "#55efc4", fail: "#ff7675", failBg: "rgba(255,118,117,0.10)",
  assum: "#fdcb6e", assumBg: "rgba(253,203,110,0.12)",
  text: "#e2e2e8", muted: "#8b8d9a", white: "#fff",
  ps: "#74b9ff", psBg: "rgba(116,185,255,0.10)",
  calc: "#fdcb6e",
  fCC: "#a29bfe", fSS: "#fd79a8", fCS: "#55efc4", fSC: "#fdcb6e",
};
const mathFont = "'Cambria Math','Latin Modern Math','STIX Two Math',Georgia,serif";

const stepsMeta = [
  { id: 0, label: "Read", title: "Read the Question" },
  { id: 1, label: "Setup", title: "Identify the Approach" },
  { id: 2, label: "Solve", title: "Match Each Function" },
  { id: 3, label: "Verify", title: "Compare the Graphs" },
  { id: 4, label: "Answer", title: "Confirm the Answer" },
];

// Functions (safe for 0 < x < pi/2)
const fCC = (x) => { const c = Math.cos(x); return c > 0 ? Math.pow(c, c) : 1; };
const fSS = (x) => { const s = Math.sin(x); return s > 0 ? Math.pow(s, s) : 1; };
const fCS = (x) => { const c = Math.cos(x), s = Math.sin(x); return c > 0 ? Math.pow(c, s) : 0; };
const fSC = (x) => { const s = Math.sin(x), c = Math.cos(x); return s > 0 ? Math.pow(s, c) : 0; };

const FNS = [
  { fn: fCC, label: "(cos x)^(cos x)", short: "cos^cos", color: C.fCC, graph: "R" },
  { fn: fSS, label: "(sin x)^(sin x)", short: "sin^sin", color: C.fSS, graph: "S" },
  { fn: fCS, label: "(cos x)^(sin x)", short: "cos^sin", color: C.fCS, graph: "P" },
  { fn: fSC, label: "(sin x)^(cos x)", short: "sin^cos", color: C.fSC, graph: "Q" },
];

function QuestionSummary() {
  return (
    <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 18px", marginBottom: 16, textAlign: "center" }}>
      <p style={{ margin: "0 0 6px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
        <span style={{ fontWeight: 700, color: C.muted, letterSpacing: 0.5, marginRight: 6 }}>Q18</span>
        Match graphs P, Q, R, S to (cos x)<sup>cos x</sup>, (sin x)<sup>sin x</sup>, (cos x)<sup>sin x</sup>, (sin x)<sup>cos x</sup> on 0 {"<"} x {"<"} {"\u03C0"}/2.
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, fontSize: 10, fontWeight: 600, color: C.muted, flexWrap: "wrap" }}>
        <span>A: P,Q,R,S</span><span>B: P,Q,S,R</span><span>C: Q,P,R,S</span><span>D: Q,P,S,R</span><span>E: R,S,P,Q</span><span>F: R,S,Q,P</span><span>G: S,R,P,Q</span><span>H: S,R,Q,P</span>
      </div>
    </div>
  );
}

/* ───── Graph Component ───── */
function FunctionGraph({ visibleFns, compact }) {
  const mL = compact ? 28 : 40, mR = compact ? 12 : 20;
  const mT = compact ? 12 : 16, mB = compact ? 22 : 28;
  const pW = compact ? 220 : 420, pH = compact ? 140 : 240;
  const w = mL + pW + mR, h = mT + pH + mB;

  const xMinM = 0, xMaxM = Math.PI / 2;
  const yMinM = -0.05, yMaxM = 1.1;

  const toSx = (x) => mL + ((x - xMinM) / (xMaxM - xMinM)) * pW;
  const toSy = (y) => mT + ((yMaxM - y) / (yMaxM - yMinM)) * pH;
  const sfs = compact ? 7 : 9;
  const textRectW = (str, fs) => str.length * fs * 0.65 + (compact ? 6 : 10);

  const N = 500;
  const paths = useMemo(() => FNS.map(f => {
    const pts = [];
    for (let i = 1; i < N; i++) {
      const x = 0.001 + (xMaxM - 0.002) * i / N;
      const y = f.fn(x);
      if (isFinite(y) && y >= yMinM - 0.1 && y <= yMaxM + 0.1) {
        pts.push(`${toSx(x).toFixed(1)},${toSy(y).toFixed(1)}`);
      }
    }
    return pts.join(" ");
  }), [compact]);

  const yGridVals = [0, 0.5, 1];
  const xGridVals = [Math.PI / 6, Math.PI / 3, Math.PI / 2];
  const xLabels = ["\u03C0/6", "\u03C0/3", "\u03C0/2"];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", display: "block" }}>
      {/* Horizontal gridlines */}
      {yGridVals.map(v => (
        <g key={"yg" + v}>
          <line x1={mL} y1={toSy(v)} x2={mL + pW} y2={toSy(v)}
            stroke={v === 0 ? C.muted : C.border} strokeWidth={v === 0 ? 0.8 : 0.5}
            strokeDasharray={v === 0 ? "none" : "4,4"} opacity={v === 0 ? 0.5 : 0.4} />
          <text x={mL - 5} y={toSy(v) + 3} fill={C.muted} fontSize={sfs}
            textAnchor="end" opacity={0.6} fontFamily={mathFont}>{v}</text>
        </g>
      ))}
      {/* Vertical gridlines */}
      {xGridVals.map((v, i) => (
        <g key={"xg" + i}>
          <line x1={toSx(v)} y1={mT} x2={toSx(v)} y2={mT + pH}
            stroke={C.border} strokeWidth={0.5} strokeDasharray="4,4" opacity={0.4} />
          <text x={toSx(v)} y={mT + pH + 14} fill={C.muted} fontSize={sfs}
            textAnchor="middle" opacity={0.6} fontFamily={mathFont}>{xLabels[i]}</text>
        </g>
      ))}
      {/* Y-axis */}
      <line x1={mL} y1={mT} x2={mL} y2={mT + pH} stroke={C.muted} strokeWidth={0.8} opacity={0.4} />

      {/* Curves */}
      {FNS.map((f, i) => visibleFns.has(i) ? (
        <polyline key={i} points={paths[i]} fill="none" stroke={f.color}
          strokeWidth={compact ? 2 : 2.5} opacity={0.9} strokeLinejoin="round" />
      ) : null)}

      {/* Legend labels at right edge */}
      {FNS.map((f, i) => {
        if (!visibleFns.has(i)) return null;
        const endX = xMaxM - 0.05;
        const endY = f.fn(endX);
        const ly = toSy(endY);
        const lbl = f.short;
        const rw = textRectW(lbl, sfs);
        return (
          <g key={"lbl" + i}>
            <rect x={mL + pW - rw - 2} y={ly - 7} width={rw} height={14} rx={3}
              fill={C.bg} fillOpacity={0.9} />
            <text x={mL + pW - 2 - rw / 2} y={ly + 4} fill={f.color} fontSize={sfs}
              fontWeight={600} textAnchor="middle" fontFamily={mathFont}>{lbl}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ───── Solve Step ───── */
function SolveStep() {
  const [revealed, setRevealed] = useState(0);
  const steps = [
    {
      label: "Evaluate at x = 0",
      text: "At x = 0, cos 0 = 1 and sin 0 = 0. Substitute into each function to see which starts at 0.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>(cos x)<sup>cos x</sup> = 1<sup>1</sup> = 1</span>
          <span>(sin x)<sup>sin x</sup> = 0<sup>0</sup> {"\u2192"} 1 (limit)</span>
          <span>(cos x)<sup>sin x</sup> = 1<sup>0</sup> = 1</span>
          <span style={{ color: C.fSC }}>(sin x)<sup>cos x</sup> = 0<sup>1</sup> = 0</span>
          <span style={{ color: C.muted, fontSize: 13 }}>Only (sin x)<sup>cos x</sup> starts at 0</span>
          <span style={{ color: C.fSC }}>Graph Q starts at 0, so Q = (sin x)<sup>cos x</sup></span>
        </div>
      ),
      color: C.fSC,
    },
    {
      label: <span>Evaluate at x = {"\u03C0"}/2</span>,
      text: <span>At x = {"\u03C0"}/2, cos({"\u03C0"}/2) = 0 and sin({"\u03C0"}/2) = 1. Check which function approaches 0.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>(cos x)<sup>cos x</sup> = 0<sup>0</sup> {"\u2192"} 1 (limit)</span>
          <span>(sin x)<sup>sin x</sup> = 1<sup>1</sup> = 1</span>
          <span style={{ color: C.fCS }}>(cos x)<sup>sin x</sup> = 0<sup>1</sup> = 0</span>
          <span>(sin x)<sup>cos x</sup> = 1<sup>0</sup> = 1</span>
          <span style={{ color: C.muted, fontSize: 13 }}>Only (cos x)<sup>sin x</sup> ends at 0</span>
          <span style={{ color: C.fCS }}>Graph P ends at 0, so P = (cos x)<sup>sin x</sup></span>
        </div>
      ),
      color: C.fCS,
    },
    {
      label: "Distinguish R and S by symmetry",
      text: <span>R and S are (cos x)<sup>cos x</sup> and (sin x)<sup>sin x</sup>. Both reach 1 at the endpoints. Since sin x is small near x = 0, (sin x)<sup>sin x</sup> dips early (left side). Since cos x is small near x = {"\u03C0"}/2, (cos x)<sup>cos x</sup> dips late (right side). These are mirror images of each other.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ color: C.muted, fontSize: 13 }}>sin x is small near 0 {"\u2192"} sin<sup>sin</sup> dips on the left</span>
          <span style={{ color: C.muted, fontSize: 13 }}>cos x is small near {"\u03C0"}/2 {"\u2192"} cos<sup>cos</sup> dips on the right</span>
          <span style={{ color: C.fSS }}>S dips on the left {"\u2192"} S = (sin x)<sup>sin x</sup></span>
          <span style={{ color: C.fCC }}>R dips on the right {"\u2192"} R = (cos x)<sup>cos x</sup></span>
        </div>
      ),
      color: C.fCC,
    },
  ];

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 16 }}>Step-by-step solution</span>
      {steps.map((s, i) => {
        if (i > revealed) return null;
        return (
          <div key={i} style={{ marginBottom: 22, animation: "fadeSlideIn 0.4s ease-out" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", flexShrink: 0, background: s.color + "22", border: `2px solid ${s.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: s.color }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: s.color, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
                <p style={{ margin: "0 0 8px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{s.text}</p>
                <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", fontSize: 15, color: C.white, fontFamily: mathFont, textAlign: "center", letterSpacing: 0.5, lineHeight: 2 }}>{s.math}</div>
                {i === steps.length - 1 && <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: C.conclBg, border: `1px solid ${C.ok}44`, fontSize: 13.5, color: C.ok, fontWeight: 600, lineHeight: 1.5 }}>P = (cos x)<sup>sin x</sup>, Q = (sin x)<sup>cos x</sup>, R = (cos x)<sup>cos x</sup>, S = (sin x)<sup>sin x</sup>. The answer is E.</div>}
              </div>
            </div>
            {i < revealed && i < steps.length - 1 && <div style={{ marginLeft: 14, width: 2, height: 12, background: C.border }} />}
          </div>
        );
      })}
      {revealed < steps.length - 1 && (
        <button onClick={() => setRevealed(p => p + 1)} style={{ marginTop: 4, padding: "11px 22px", borderRadius: 10, border: "none", background: `linear-gradient(135deg,${C.accent},${C.accentLight})`, color: C.white, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, marginLeft: 42, boxShadow: "0 4px 16px rgba(108,92,231,0.25)" }}>Reveal next step {"\u2192"}</button>
      )}
      <style>{`@keyframes fadeSlideIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

/* ───── Interactive Explorer ───── */
function GraphExplorer() {
  const [visible, setVisible] = useState(new Set());

  const toggle = (i) => {
    setVisible(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const showAll = () => setVisible(new Set([0, 1, 2, 3]));
  const clearAll = () => setVisible(new Set());

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 12 }}>Toggle functions on/off</span>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
          {FNS.map((f, i) => (
            <button key={i} onClick={() => toggle(i)} style={{
              padding: "10px 12px", borderRadius: 10, cursor: "pointer",
              border: `2px solid ${visible.has(i) ? f.color : C.border}`,
              background: visible.has(i) ? f.color + "18" : C.card,
              color: visible.has(i) ? f.color : C.muted,
              fontSize: 12, fontWeight: 700, transition: "all 0.15s",
              textAlign: "left", display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: visible.has(i) ? f.color : C.border, flexShrink: 0 }}></span>
              <span style={{ fontFamily: mathFont }}>{f.label}</span>
              <span style={{ marginLeft: "auto", fontSize: 11, opacity: 0.7 }}>= {f.graph}</span>
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={showAll} style={{ flex: 1, padding: "8px", borderRadius: 8, cursor: "pointer", border: `1px solid ${C.border}`, background: C.card, color: C.muted, fontSize: 11, fontWeight: 700 }}>Show all</button>
          <button onClick={clearAll} style={{ flex: 1, padding: "8px", borderRadius: 8, cursor: "pointer", border: `1px solid ${C.border}`, background: C.card, color: C.muted, fontSize: 11, fontWeight: 700 }}>Clear all</button>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 18 }}>
        <FunctionGraph visibleFns={visible} compact={false} />
      </div>

      {/* Value table at key x values */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 20px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 10 }}>Values at key points</span>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr 1fr", gap: "6px 14px", fontSize: 12, fontFamily: mathFont }}>
          <span style={{ color: C.muted, fontSize: 10, fontWeight: 700 }}>Function</span>
          <span style={{ color: C.muted, fontSize: 10, fontWeight: 700, textAlign: "center" }}>x {"\u2192"} 0</span>
          <span style={{ color: C.muted, fontSize: 10, fontWeight: 700, textAlign: "center" }}>x = {"\u03C0"}/6</span>
          <span style={{ color: C.muted, fontSize: 10, fontWeight: 700, textAlign: "center" }}>x {"\u2192"} {"\u03C0"}/2</span>
          {FNS.map((f, i) => {
            const v0 = i === 3 ? 0 : 1; // sin^cos -> 0, others -> 1
            const vMid = f.fn(Math.PI / 6);
            const vEnd = i === 2 ? 0 : 1; // cos^sin -> 0, others -> 1
            return (
              <React.Fragment key={i}>
                <span style={{ color: f.color, fontWeight: 600, fontSize: 11 }}>{f.short}</span>
                <span style={{ color: v0 === 0 ? C.fSC : C.white, textAlign: "center", fontWeight: v0 === 0 ? 700 : 400 }}>{v0}</span>
                <span style={{ color: C.white, textAlign: "center" }}>{vMid.toFixed(3)}</span>
                <span style={{ color: vEnd === 0 ? C.fCS : C.white, textAlign: "center", fontWeight: vEnd === 0 ? 700 : 400 }}>{vEnd}</span>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 18px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ background: C.assumBg, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.assum, fontWeight: 700, whiteSpace: "nowrap" }}>HINT</span>
          <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, margin: 0 }}>Start with none selected, then add one at a time. Compare each curve's behaviour at x = 0 and x = {"\u03C0"}/2 against graphs P, Q, R, S in the question. The value table below the graph confirms the endpoint analysis.</p>
        </div>
      </div>
    </div>
  );
}

/* ───── Option Card ───── */
function OptionCard({ o, expanded, animate, onClick }) {
  return (
    <div onClick={onClick} style={{ background: C.card, border: `1px solid ${expanded ? (o.ok ? C.ok + "66" : C.fail + "66") : C.border}`, borderRadius: 12, padding: "14px 18px", cursor: "pointer", transition: "all 0.3s", opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(12px)" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <span style={{ background: expanded ? (o.ok ? C.ok : C.fail) : C.accent, borderRadius: 6, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: C.white, flexShrink: 0 }}>{expanded ? (o.ok ? "\u2713" : "\u2717") : o.letter}</span>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 14, color: C.text, lineHeight: 1.6 }}>{o.text}</p>
          {expanded && (
            <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, fontSize: 13, lineHeight: 1.6, background: o.ok ? C.conclBg : C.failBg, color: o.ok ? C.ok : C.fail, borderLeft: `3px solid ${o.ok ? C.ok : C.fail}` }}>
              {o.ok ? <span style={{ fontWeight: 700 }}>CORRECT: </span> : <span style={{ fontWeight: 700 }}>INCORRECT: </span>}{o.expl}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const opts = [
  { letter: "A", text: <span>cos<sup>cos</sup>=P, sin<sup>sin</sup>=Q, cos<sup>sin</sup>=R, sin<sup>cos</sup>=S</span>, ok: false, expl: "P goes to 0 at x=\u03C0/2, so P must be cos^sin (not cos^cos). Q starts at 0, so Q must be sin^cos." },
  { letter: "B", text: <span>cos<sup>cos</sup>=P, sin<sup>sin</sup>=Q, cos<sup>sin</sup>=S, sin<sup>cos</sup>=R</span>, ok: false, expl: "P ends at 0 and Q starts at 0, which is correct for cos^sin and sin^cos. But cos^cos is not P." },
  { letter: "C", text: <span>cos<sup>cos</sup>=Q, sin<sup>sin</sup>=P, cos<sup>sin</sup>=R, sin<sup>cos</sup>=S</span>, ok: false, expl: "Q starts at 0, but cos^cos starts at 1. Q must be sin^cos." },
  { letter: "D", text: <span>cos<sup>cos</sup>=Q, sin<sup>sin</sup>=P, cos<sup>sin</sup>=S, sin<sup>cos</sup>=R</span>, ok: false, expl: "Same issue: Q starts at 0 but cos^cos starts at 1." },
  { letter: "E", text: <span>cos<sup>cos</sup>=R, sin<sup>sin</sup>=S, cos<sup>sin</sup>=P, sin<sup>cos</sup>=Q</span>, ok: true, expl: "Q starts at 0 (sin^cos), P ends at 0 (cos^sin), S dips lower early (sin^sin), R stays high early (cos^cos)." },
  { letter: "F", text: <span>cos<sup>cos</sup>=R, sin<sup>sin</sup>=S, cos<sup>sin</sup>=Q, sin<sup>cos</sup>=P</span>, ok: false, expl: "P ends at 0 (correct for cos^sin), but this assigns cos^sin to Q. Q starts at 0, which matches sin^cos, not cos^sin." },
  { letter: "G", text: <span>cos<sup>cos</sup>=S, sin<sup>sin</sup>=R, cos<sup>sin</sup>=P, sin<sup>cos</sup>=Q</span>, ok: false, expl: "R and S are swapped. S dips lower near x=\u03C0/6, matching sin^sin. R stays higher, matching cos^cos." },
  { letter: "H", text: <span>cos<sup>cos</sup>=S, sin<sup>sin</sup>=R, cos<sup>sin</sup>=Q, sin<sup>cos</sup>=P</span>, ok: false, expl: "Multiple errors: P ends at 0 (must be cos^sin, not sin^cos), and R/S are swapped." },
];

/* ───── Main App ───── */
export default function App() {
  const [step, setStep] = useState(0);
  const [expanded, setExpanded] = useState(null);
  const [optAnim, setOptAnim] = useState(opts.map(() => false));

  useEffect(() => {
    if (step === 4) {
      opts.forEach((_, i) => { setTimeout(() => setOptAnim(p => { const n = [...p]; n[i] = true; return n; }), i * 100); });
    } else {
      setOptAnim(opts.map(() => false));
      setExpanded(null);
    }
  }, [step]);

  const lastStep = stepsMeta.length - 1;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Gill Sans','Trebuchet MS',Calibri,sans-serif", letterSpacing: 0.2, padding: "24px 16px" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>

        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ background: `linear-gradient(135deg,${C.accent},${C.accentLight})`, borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: C.white, letterSpacing: 1 }}>TMUA</span>
            <span style={{ fontSize: 12, color: C.muted }}>Paper 2</span>
            <span style={{ fontSize: 12, color: C.muted }}>{"\u00B7"}</span>
            <span style={{ fontSize: 12, color: C.ps }}>Functions and Graph Matching</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TMUA 2022 {"\u00B7"} Paper 2 {"\u00B7"} Question 18</p>
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
          {stepsMeta.map(s => (
            <button key={s.id} onClick={() => setStep(s.id)} style={{
              flex: 1, minWidth: 0,
              background: step === s.id ? C.accent : step > s.id ? "rgba(108,92,231,0.15)" : "#1e2030",
              border: `1px solid ${step === s.id ? C.accent : step > s.id ? C.accent + "44" : C.border}`,
              borderRadius: 10, padding: "10px 4px", cursor: "pointer", transition: "all 0.3s",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: step === s.id ? C.white : step > s.id ? C.accentLight : C.muted, lineHeight: 1 }}>{s.id + 1}</span>
              <span style={{ fontSize: 10, fontWeight: step === s.id ? 700 : 500, color: step === s.id ? C.white : step > s.id ? C.accentLight : C.muted, whiteSpace: "nowrap" }}>{s.label}</span>
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span style={{ background: C.accent, borderRadius: 6, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: C.white }}>{step + 1}</span>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: C.white, margin: 0 }}>{stepsMeta[step].title}</h2>
        </div>

        {/* Step 0: Read */}
        {step === 0 && (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question 18</span>
            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: "0 0 8px" }}>P, Q, R and S show the graphs of</p>
              <div style={{ textAlign: "center", fontFamily: mathFont, fontSize: 16, margin: "8px 0", lineHeight: 2 }}>
                <span>y = (cos x)<sup>cos x</sup>, y = (sin x)<sup>sin x</sup>, y = (cos x)<sup>sin x</sup>, y = (sin x)<sup>cos x</sup></span>
              </div>
              <p style={{ margin: "0 0 8px" }}>for 0 {"<"} x {"<"} {"\u03C0"}/2 in some order.</p>
              <p style={{ margin: 0 }}>Which row in the table <strong style={{ color: C.assum }}>correctly identifies the graphs</strong>?</p>
            </div>
          </div>
        )}

        {/* Step 1: Setup */}
        {step === 1 && (
          <>
            <QuestionSummary />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>What do we know?</span>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 10px" }}>
                On the interval 0 {"<"} x {"<"} {"\u03C0"}/2, both sin x and cos x are between 0 and 1. All four functions are of the form (base)<sup>exponent</sup> where both base and exponent vary with x.
              </p>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 10px" }}>
                The key is to check the endpoint behaviour. At x = 0: cos 0 = 1, sin 0 = 0. At x = {"\u03C0"}/2: cos({"\u03C0"}/2) = 0, sin({"\u03C0"}/2) = 1. This immediately distinguishes two of the four functions.
              </p>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>STRATEGY</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Substitute x = 0 to find which function equals 0 there (identifying Q). Substitute x = {"\u03C0"}/2 to find which equals 0 there (identifying P). Then use an intermediate value like x = {"\u03C0"}/6 to distinguish R and S.</p>
              </div>
            </div>
          </>
        )}

        {/* Step 2: Solve */}
        {step === 2 && <><QuestionSummary /><SolveStep /></>}

        {/* Step 3: Verify */}
        {step === 3 && (
          <>
            <QuestionSummary />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>TRY IT</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Toggle each function on and off to see its graph. Compare the shape, endpoints, and middle values against graphs P, Q, R, S from the question paper.</p>
              </div>
            </div>
            <GraphExplorer />
          </>
        )}

        {/* Step 4: Answer */}
        {step === 4 && (
          <>
            <QuestionSummary />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6, fontStyle: "italic" }}>"Which row correctly identifies the graphs?"</div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Matching</span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
                {FNS.map(f => (
                  <div key={f.graph} style={{ background: f.color + "12", borderRadius: 8, padding: "12px 10px", textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: f.color, marginBottom: 4 }}>{f.graph}</div>
                    <div style={{ fontSize: 11, color: f.color, fontFamily: mathFont }}>{f.short}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 14 }}>
              <p style={{ color: C.muted, fontSize: 14, margin: 0 }}><strong style={{ color: C.assum }}>Click each option</strong> to see the reasoning:</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {opts.map((o, i) => <OptionCard key={o.letter} o={o} expanded={expanded === o.letter} animate={optAnim[i]} onClick={() => setExpanded(p => p === o.letter ? null : o.letter)} />)}
            </div>
          </>
        )}

        <div style={{ display: "flex", gap: 12, paddingBottom: 32 }}>
          <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{ flex: 1, padding: "13px 20px", borderRadius: 10, border: `1px solid ${C.border}`, background: step === 0 ? C.card : "#1e2030", color: step === 0 ? C.muted : C.text, fontSize: 14, fontWeight: 600, cursor: step === 0 ? "not-allowed" : "pointer", opacity: step === 0 ? 0.4 : 1 }}>{"\u2190"} Previous</button>
          {step < lastStep ? (
            <button onClick={() => setStep(step + 1)} style={{ flex: 1, padding: "13px 20px", borderRadius: 10, border: "none", background: `linear-gradient(135deg,${C.accent},${C.accentLight})`, color: C.white, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Next {"\u2192"}</button>
          ) : (
            <button style={{ flex: 1, padding: "13px 20px", borderRadius: 10, border: "none", background: `linear-gradient(135deg,${C.ok},#2ecc71)`, color: C.white, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>Complete</button>
          )}
        </div>
      </div>
    </div>
  );
}
