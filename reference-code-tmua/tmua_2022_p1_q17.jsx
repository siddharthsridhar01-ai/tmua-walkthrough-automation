import { useState, useEffect } from "react";

const C = {
  bg: "#0f1117", card: "#1a1d27", border: "#2a2d3a",
  accent: "#6c5ce7", accentLight: "#a29bfe",
  concl: "#55efc4", conclBg: "rgba(85,239,196,0.10)",
  ok: "#55efc4", fail: "#ff7675", failBg: "rgba(255,118,117,0.10)",
  assum: "#fdcb6e", assumBg: "rgba(253,203,110,0.12)",
  text: "#e2e2e8", muted: "#8b8d9a", white: "#fff",
  ps: "#74b9ff", psBg: "rgba(116,185,255,0.10)",
  calc: "#fdcb6e",
  shaded: "#a29bfe", unshaded: "#2a2d3a",
};
const mathFont = "'Cambria Math','Latin Modern Math','STIX Two Math',Georgia,serif";

const stepsMeta = [
  { id: 0, label: "Read", title: "Read the Question" },
  { id: 1, label: "Setup", title: "Identify the Approach" },
  { id: 2, label: "Solve", title: "Compute the Total Shaded Area" },
  { id: 3, label: "Verify", title: "Build Up the Circles" },
  { id: 4, label: "Answer", title: "Confirm the Answer" },
];

// Circle Cn: centre (n,n), radius n*sqrt(2), area = 2*pi*n^2
const centreOf = (n) => ({ x: n, y: n });
const radiusOf = (n) => n * Math.sqrt(2);
const areaOf = (n) => 2 * Math.PI * n * n;

function QuestionSummary() {
  return (
    <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 18px", marginBottom: 16, textAlign: "center" }}>
      <p style={{ margin: "0 0 6px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
        <span style={{ fontWeight: 700, color: C.muted, letterSpacing: 0.5, marginRight: 6 }}>Q17</span>
        C<sub>n</sub>: x{"\u00B2"} + y{"\u00B2"} = 2n(x + y). Area between C<sub>1</sub>,C<sub>2</sub> shaded, then C<sub>3</sub>,C<sub>4</sub>, etc. 100 circles total. Find the <strong style={{ color: C.assum }}>total shaded area</strong>.
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 10, fontSize: 11, fontWeight: 600, color: C.muted, flexWrap: "wrap" }}>
        <span>A: 100{"\u03C0"}</span><span>B: 500{"\u03C0"}</span><span>C: 2500{"\u03C0"}</span><span>D: 5050{"\u03C0"}</span><span>E: 10100{"\u03C0"}</span><span>F: 40400{"\u03C0"}</span>
      </div>
    </div>
  );
}

/* ───── Circles Diagram ─────
   Draws nested circles with alternating shading.
   - maxN: how many circles to show
   - showLabels: label circles
   - showAxes: show coordinate axes
   - general: schematic mode (no specific values)
   - compact: smaller for solve pane
*/
function CirclesDiagram({ maxN, showLabels, showAxes, compact }) {
  const mL = compact ? 10 : 20, mR = compact ? 10 : 20;
  const mT = compact ? 10 : 16, mB = compact ? 10 : 16;
  const plotSize = compact ? 180 : 300;
  const w = mL + plotSize + mR, h = mT + plotSize + mB;

  // Map math coords to SVG: the largest circle Cn has centre (n,n) and radius n*sqrt(2)
  // Its extent goes from n - n*sqrt(2) to n + n*sqrt(2) in both axes
  const N = maxN;
  const maxR = radiusOf(N);
  const ctr = centreOf(N);
  // Bounding box in math coords
  const mathMin = Math.min(0, ctr.x - maxR) - 0.5;
  const mathMax = ctr.x + maxR + 0.5;
  const mathSpan = mathMax - mathMin;
  const scale = plotSize / mathSpan;

  const toSx = (x) => mL + (x - mathMin) * scale;
  const toSy = (y) => mT + (mathMax - y) * scale;
  const sfs = compact ? 7 : 9;

  // Draw circles from largest to smallest so shading layers correctly
  const circles = [];
  for (let n = N; n >= 1; n--) circles.push(n);

  // Determine which circles are "shaded ring outer" vs "shaded ring inner"
  // Pairs: (1,2), (3,4), (5,6), ... Shaded = area of even minus area of odd
  // So C2 is outer of first ring, C1 is inner. C4 outer, C3 inner, etc.
  const isRingOuter = (n) => n % 2 === 0 && n <= N;
  const isRingInner = (n) => n % 2 === 1 && n + 1 <= N;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", display: "block" }}>
      {/* Axes */}
      {showAxes && (
        <>
          <line x1={mL} y1={toSy(0)} x2={mL + plotSize} y2={toSy(0)} stroke={C.muted} strokeWidth={0.7} opacity={0.3} />
          <line x1={toSx(0)} y1={mT} x2={toSx(0)} y2={mT + plotSize} stroke={C.muted} strokeWidth={0.7} opacity={0.3} />
        </>
      )}

      {/* Draw shaded rings using clipPath approach:
          For each even n, fill circle n with shaded colour,
          then fill circle n-1 with background to "punch out" the inner part */}
      {circles.map(n => {
        const cx = toSx(centreOf(n).x);
        const cy = toSy(centreOf(n).y);
        const r = radiusOf(n) * scale;

        if (isRingOuter(n)) {
          // Shaded ring: fill the even circle
          return <circle key={"s" + n} cx={cx} cy={cy} r={r} fill={C.shaded + "30"} stroke={C.shaded} strokeWidth={compact ? 0.8 : 1.2} opacity={0.8} />;
        } else if (isRingInner(n)) {
          // Inner of a shaded ring: cover with bg to create the annulus
          return <circle key={"u" + n} cx={cx} cy={cy} r={r} fill={C.bg} stroke={C.shaded} strokeWidth={compact ? 0.5 : 0.8} opacity={0.9} strokeOpacity={0.4} />;
        } else if (n % 2 === 1 && n + 1 > N) {
          // Unpaired odd circle at the end (shouldn't happen with even N, but handle)
          return <circle key={"o" + n} cx={cx} cy={cy} r={r} fill="none" stroke={C.muted} strokeWidth={compact ? 0.5 : 0.8} opacity={0.3} />;
        }
        return null;
      })}

      {/* Labels on a few circles */}
      {showLabels && (() => {
        const labelsToShow = maxN <= 6 ? Array.from({ length: maxN }, (_, i) => i + 1) :
          [1, 2, 3, 4, maxN - 1, maxN];
        return labelsToShow.map(n => {
          // Place label at the rightmost point of the circle
          const cx = centreOf(n).x;
          const cy = centreOf(n).y;
          const r = radiusOf(n);
          const lx = toSx(cx + r * 0.7);
          const ly = toSy(cy + r * 0.7);
          const labelStr = `C${n}`;
          const rw = labelStr.length * sfs * 0.65 + 8;
          return (
            <g key={"l" + n}>
              <rect x={lx - rw / 2} y={ly - 7} width={rw} height={14} rx={3}
                fill={C.bg} fillOpacity={0.9} />
              <text x={lx} y={ly + 4} fill={C.white} fontSize={sfs} fontWeight={600}
                textAnchor="middle" fontFamily="'Gill Sans',sans-serif">
                C<tspan fontSize={sfs - 1} dy={1}>{n}</tspan>
              </text>
            </g>
          );
        });
      })()}
    </svg>
  );
}

/* ───── Solve Step ───── */
function SolveStep() {
  const [revealed, setRevealed] = useState(0);
  const steps = [
    {
      label: "Complete the square",
      text: "Rewrite x\u00B2 + y\u00B2 = 2n(x + y) in standard circle form.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>x{"\u00B2"} - 2nx + y{"\u00B2"} - 2ny = 0</span>
          <span>(x - n){"\u00B2"} + (y - n){"\u00B2"} = 2n{"\u00B2"}</span>
          <span style={{ color: C.muted, fontSize: 13 }}>Centre (n, n), radius n{"\u221A"}2</span>
        </div>
      ),
      graph: null,
      color: C.ps,
    },
    {
      label: "Area of each circle",
      text: <span>C<sub>n</sub> has radius n{"\u221A"}2, so its area is:</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>Area(C<sub>n</sub>) = {"\u03C0"}(n{"\u221A"}2){"\u00B2"} = 2{"\u03C0"}n{"\u00B2"}</span>
        </div>
      ),
      graph: null,
      color: C.calc,
    },
    {
      label: "Shaded area for each pair",
      text: <span>The k-th shaded ring is between C<sub>2k-1</sub> and C<sub>2k</sub>.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>= 2{"\u03C0"}(2k){"\u00B2"} - 2{"\u03C0"}(2k-1){"\u00B2"}</span>
          <span>= 2{"\u03C0"}[(2k){"\u00B2"} - (2k-1){"\u00B2"}]</span>
          <span>= 2{"\u03C0"}(4k - 1)</span>
        </div>
      ),
      graph: { maxN: 4 },
      color: C.shaded,
    },
    {
      label: "Sum over 50 pairs",
      text: "With 100 circles, there are 50 shaded pairs (k = 1 to 50).",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>Total = {"\u03A3"}<sub>k=1</sub><sup>50</sup> 2{"\u03C0"}(4k - 1)</span>
          <span>= 2{"\u03C0"}[4 {"\u00D7"} 50 {"\u00D7"} 51/2 - 50]</span>
          <span>= 2{"\u03C0"}[5100 - 50]</span>
          <span>= 2{"\u03C0"} {"\u00D7"} 5050</span>
          <span>= <strong style={{ color: C.ok }}>10100{"\u03C0"}</strong></span>
        </div>
      ),
      graph: null,
      color: C.ok,
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
                {s.graph ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <p style={{ margin: "0 0 8px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{s.text}</p>
                      <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", fontSize: 16, color: C.white, fontFamily: mathFont, textAlign: "center", letterSpacing: 0.5, lineHeight: 2 }}>{s.math}</div>
                    </div>
                    <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px", display: "flex", alignItems: "center" }}>
                      <CirclesDiagram maxN={s.graph.maxN} showLabels showAxes={false} compact />
                    </div>
                  </div>
                ) : (
                  <div>
                    <p style={{ margin: "0 0 8px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{s.text}</p>
                    <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", fontSize: 17, color: C.white, fontFamily: mathFont, textAlign: "center", letterSpacing: 0.5, lineHeight: 2 }}>{s.math}</div>
                  </div>
                )}
                {i === steps.length - 1 && <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: C.conclBg, border: `1px solid ${C.ok}44`, fontSize: 13.5, color: C.ok, fontWeight: 600, lineHeight: 1.5 }}>The answer is E: 10100{"\u03C0"}.</div>}
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
function PairsExplorer() {
  const [pairs, setPairs] = useState(2);
  const maxN = pairs * 2;

  // Compute running total
  const pairAreas = [];
  let runningTotal = 0;
  for (let k = 1; k <= pairs; k++) {
    const area = 2 * (4 * k - 1); // in units of pi
    runningTotal += area;
    pairAreas.push({ k, odd: 2 * k - 1, even: 2 * k, area, total: runningTotal });
  }

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Number of shaded pairs</span>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <input type="range" min={1} max={10} step={1} value={pairs} onChange={e => setPairs(parseInt(e.target.value))} style={{ flex: 1, accentColor: C.accent, height: 6 }} />
          <div style={{ minWidth: 100, textAlign: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.shaded }}>{pairs} pairs ({maxN} circles)</span>
          </div>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 18 }}>
        <CirclesDiagram maxN={maxN} showLabels showAxes compact={false} />
      </div>

      {/* Table of pair areas */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 20px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 10 }}>Shaded area breakdown</span>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr 1fr", gap: "6px 14px", fontSize: 12, fontFamily: mathFont }}>
          <span style={{ color: C.muted, fontWeight: 700, fontSize: 10 }}>Pair</span>
          <span style={{ color: C.muted, fontWeight: 700, fontSize: 10 }}>Circles</span>
          <span style={{ color: C.muted, fontWeight: 700, fontSize: 10 }}>Ring area</span>
          <span style={{ color: C.muted, fontWeight: 700, fontSize: 10 }}>Running total</span>
          {pairAreas.map(p => (
            <React.Fragment key={p.k}>
              <span style={{ color: C.white }}>{p.k}</span>
              <span style={{ color: C.text }}>C<sub>{p.odd}</sub>, C<sub>{p.even}</sub></span>
              <span style={{ color: C.shaded }}>{p.area}{"\u03C0"}</span>
              <span style={{ color: C.ok, fontWeight: p.k === pairs ? 700 : 400 }}>{p.total}{"\u03C0"}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, marginBottom: 4 }}>Circles drawn</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: C.white }}>{maxN}</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.ok}`, borderRadius: 14, padding: "14px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: C.ok, fontWeight: 700, marginBottom: 4 }}>Total shaded area</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: C.ok }}>{runningTotal}{"\u03C0"}</div>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 18px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ background: C.assumBg, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.assum, fontWeight: 700, whiteSpace: "nowrap" }}>HINT</span>
          <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, margin: 0 }}>Each pair contributes 2{"\u03C0"}(4k - 1) to the shaded area. With 50 pairs (100 circles), the total is 10100{"\u03C0"}. Watch the running total grow as you add pairs.</p>
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
  { letter: "A", text: <span>100{"\u03C0"}</span>, ok: false, expl: "This would be the area of C\u2081 alone (2\u03C0 \u00D7 1\u00B2 = 2\u03C0... actually not even that). Far too small for 50 shaded rings." },
  { letter: "B", text: <span>500{"\u03C0"}</span>, ok: false, expl: "This might come from forgetting the factor of 2 in the area formula. Area(C\u2099) = 2\u03C0n\u00B2, not \u03C0n\u00B2." },
  { letter: "C", text: <span>2500{"\u03C0"}</span>, ok: false, expl: "This is half the correct answer. Likely from an error in the summation or missing the factor of 2." },
  { letter: "D", text: <span>5050{"\u03C0"}</span>, ok: false, expl: <span>5050 is {"\u03A3"}n from 1 to 100. But the shaded area is not simply the sum of areas - it is the sum of differences between consecutive pairs.</span> },
  { letter: "E", text: <span>10100{"\u03C0"}</span>, ok: true, expl: <span>{"\u03A3"} 2{"\u03C0"}(4k-1) for k=1 to 50 = 2{"\u03C0"}(5100 - 50) = 10100{"\u03C0"}. Each pair (C<sub>2k-1</sub>, C<sub>2k</sub>) contributes 2{"\u03C0"}(4k-1).</span> },
  { letter: "F", text: <span>40400{"\u03C0"}</span>, ok: false, expl: "This is 4 times the correct answer. Possibly from squaring instead of using the difference of squares." },
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
            <span style={{ fontSize: 12, color: C.muted }}>Paper 1</span>
            <span style={{ fontSize: 12, color: C.muted }}>{"\u00B7"}</span>
            <span style={{ fontSize: 12, color: C.ps }}>Circles and Series</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TMUA 2022 {"\u00B7"} Paper 1 {"\u00B7"} Question 17</p>
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
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question 17</span>
            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: "0 0 8px" }}>A circle C<sub>n</sub> is defined by x{"\u00B2"} + y{"\u00B2"} = 2n(x + y), where n is a positive integer.</p>
              <p style={{ margin: "0 0 8px" }}>C<sub>1</sub> and C<sub>2</sub> are drawn and the area between them is shaded. Next, C<sub>3</sub> and C<sub>4</sub> are drawn and the area between them is shaded.</p>
              <p style={{ margin: "0 0 8px" }}>This process continues until 100 circles have been drawn.</p>
              <p style={{ margin: 0 }}>What is the <strong style={{ color: C.assum }}>total shaded area</strong>?</p>
            </div>
            <div style={{ marginTop: 16 }}>
              <CirclesDiagram maxN={4} showLabels showAxes compact={false} />
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
                The equation x{"\u00B2"} + y{"\u00B2"} = 2n(x + y) is not in standard form. We need to complete the square to find the centre and radius of each C<sub>n</sub>.
              </p>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 16px" }}>
                Once we know the area of C<sub>n</sub> as a function of n, the shaded area between each consecutive pair is a difference of areas. Summing 50 such differences gives the total.
              </p>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>STRATEGY</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Complete the square to find the radius of C<sub>n</sub>. Compute the area of each shaded ring as a difference. Express the k-th ring area in terms of k. Sum from k = 1 to 50.</p>
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
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Add pairs of circles and watch the shaded area build up. The table shows how each pair contributes 2{"\u03C0"}(4k - 1) and the running total grows.</p>
              </div>
            </div>
            <PairsExplorer />
          </>
        )}

        {/* Step 4: Answer */}
        {step === 4 && (
          <>
            <QuestionSummary />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6, fontStyle: "italic" }}>"What is the total shaded area?"</div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Summary</span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div style={{ background: C.shaded + "12", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: C.shaded, fontWeight: 700, marginBottom: 4 }}>Each ring (k-th)</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.shaded }}>2{"\u03C0"}(4k-1)</div>
                </div>
                <div style={{ background: C.calc + "12", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: C.calc, fontWeight: 700, marginBottom: 4 }}>Number of pairs</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: C.calc }}>50</div>
                </div>
                <div style={{ background: C.ok + "12", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: C.ok, fontWeight: 700, marginBottom: 4 }}>Total shaded</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: C.ok }}>10100{"\u03C0"}</div>
                </div>
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
