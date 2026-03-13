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
  step: "#a29bfe", area: "#6c5ce7",
};
const mathFont = "'Cambria Math','Latin Modern Math','STIX Two Math',Georgia,serif";

const stepsMeta = [
  { id: 0, label: "Read", title: "Read the Question" },
  { id: 1, label: "Setup", title: "Identify the Approach" },
  { id: 2, label: "Solve", title: "Evaluate the Integral" },
  { id: 3, label: "Verify", title: "Build Up the Rectangles" },
  { id: 4, label: "Answer", title: "Confirm the Answer" },
];

function QuestionSummary() {
  return (
    <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 18px", marginBottom: 16, textAlign: "center" }}>
      <p style={{ margin: "0 0 6px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
        <span style={{ fontWeight: 700, color: C.muted, letterSpacing: 0.5, marginRight: 6 }}>Q17</span>
        {"\u2308"}x{"\u2309"} is the ceiling of x (round up). Find <strong style={{ color: C.assum }}>{"\u222B"}<sub>0</sub><sup>99</sup> 2<sup>{"\u2308"}x{"\u2309"}</sup> dx</strong>.
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, fontSize: 11, fontWeight: 600, color: C.muted, flexWrap: "wrap" }}>
        <span>A: 2<sup>99</sup></span><span>B: 2<sup>99</sup>-1</span><span>C: 2<sup>99</sup>-2</span><span>D: 2<sup>100</sup></span><span>E: 2<sup>100</sup>-1</span><span>F: 2<sup>100</sup>-2</span>
      </div>
    </div>
  );
}

/* ───── Step Function Graph ─────
   Shows 2^ceil(x) as a step function with shaded rectangles.
   - maxSteps: how many steps to show
   - showArea: shade the rectangles
   - compact: smaller
*/
function StepGraph({ maxSteps, showArea, compact }) {
  const mL = compact ? 28 : 40, mR = compact ? 16 : 24;
  const mT = compact ? 12 : 16, mB = compact ? 22 : 28;
  const pW = compact ? 220 : 400, pH = compact ? 140 : 220;
  const w = mL + pW + mR, h = mT + pH + mB;

  const n = Math.min(maxSteps, 8); // only show up to 8 steps visually (representative)
  const xMinM = -0.3, xMaxM = n + 0.5;
  const yMinM = -0.5, yMaxM = Math.pow(2, n) * 1.15;

  const toSx = (x) => mL + ((x - xMinM) / (xMaxM - xMinM)) * pW;
  const toSy = (y) => mT + ((yMaxM - y) / (yMaxM - yMinM)) * pH;
  const sfs = compact ? 7 : 9;
  const textRectW = (str, fs) => str.length * fs * 0.65 + (compact ? 6 : 10);

  // Gridlines at powers of 2
  const yTicks = [];
  for (let i = 0; i <= n; i++) yTicks.push(Math.pow(2, i));

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", display: "block" }}>
      {/* Y gridlines at powers of 2 */}
      {yTicks.map(v => (
        <g key={"yg" + v}>
          <line x1={mL} y1={toSy(v)} x2={mL + pW} y2={toSy(v)}
            stroke={C.border} strokeWidth={0.5} strokeDasharray="4,4" opacity={0.3} />
          <text x={mL - 5} y={toSy(v) + 3} fill={C.muted} fontSize={sfs}
            textAnchor="end" opacity={0.6} fontFamily={mathFont}>
            {v <= 16 ? v : `2${"\u2076"}`}
          </text>
        </g>
      ))}
      {/* X axis */}
      <line x1={mL} y1={toSy(0)} x2={mL + pW} y2={toSy(0)} stroke={C.muted} strokeWidth={0.8} opacity={0.5} />
      {/* Y axis */}
      <line x1={toSx(0)} y1={mT} x2={toSx(0)} y2={mT + pH} stroke={C.muted} strokeWidth={0.8} opacity={0.4} />
      {/* X ticks */}
      {Array.from({ length: n + 1 }, (_, i) => i).map(v => (
        <g key={"xt" + v}>
          <line x1={toSx(v)} y1={toSy(0) - 3} x2={toSx(v)} y2={toSy(0) + 3} stroke={C.muted} strokeWidth={0.5} opacity={0.4} />
          <text x={toSx(v)} y={toSy(0) + 14} fill={C.muted} fontSize={sfs}
            textAnchor="middle" opacity={0.6} fontFamily={mathFont}>{v}</text>
        </g>
      ))}

      {/* Shaded rectangles */}
      {showArea && Array.from({ length: n }, (_, i) => i + 1).map(k => {
        const height = Math.pow(2, k);
        return (
          <rect key={"r" + k} x={toSx(k - 1)} y={toSy(height)}
            width={toSx(k) - toSx(k - 1)} height={toSy(0) - toSy(height)}
            fill={C.area} fillOpacity={0.15} stroke={C.area} strokeWidth={0.5} strokeOpacity={0.3} />
        );
      })}

      {/* Step function line */}
      {Array.from({ length: n }, (_, i) => i + 1).map(k => {
        const height = Math.pow(2, k);
        const x1 = k - 1, x2 = k;
        return (
          <g key={"s" + k}>
            {/* Horizontal step */}
            <line x1={toSx(x1)} y1={toSy(height)} x2={toSx(x2)} y2={toSy(height)}
              stroke={C.step} strokeWidth={compact ? 2 : 2.5} />
            {/* Vertical jump (dashed) */}
            {k < n && (
              <line x1={toSx(x2)} y1={toSy(height)} x2={toSx(x2)} y2={toSy(Math.pow(2, k + 1))}
                stroke={C.step} strokeWidth={1} strokeDasharray="3,3" opacity={0.4} />
            )}
            {/* Area label inside rectangle */}
            {showArea && height <= yMaxM * 0.8 && (
              (() => {
                const lbl = `2${k <= 9 ? String.fromCharCode(8304 + k) : "\u207F"}`;
                const midX = toSx((x1 + x2) / 2);
                const midY = toSy(height / 2);
                return (
                  <text x={midX} y={midY + 3} fill={C.area} fontSize={compact ? 7 : 9}
                    fontWeight={600} textAnchor="middle" fontFamily={mathFont} opacity={0.7}>
                    2<tspan dy={-3} fontSize={compact ? 5 : 7}>{k}</tspan>
                  </text>
                );
              })()
            )}
          </g>
        );
      })}

      {/* Label: y = 2^ceil(x) */}
      {!compact && (() => {
        const lbl = "y = 2^(\u2308x\u2309)";
        const rw = textRectW(lbl, 10);
        return (
          <g>
            <rect x={mL + 8} y={mT + 4} width={rw} height={16} rx={3} fill={C.bg} fillOpacity={0.9} />
            <text x={mL + 8 + rw / 2} y={mT + 15} fill={C.step} fontSize={10} fontWeight={600} textAnchor="middle" fontFamily={mathFont}>{lbl}</text>
          </g>
        );
      })()}
    </svg>
  );
}

/* ───── Solve Step ───── */
function SolveStep() {
  const [revealed, setRevealed] = useState(0);
  const steps = [
    {
      label: "Break into unit intervals",
      text: <span>The ceiling function {"\u2308"}x{"\u2309"} is constant on each interval (n-1, n], where it equals n. So 2<sup>{"\u2308"}x{"\u2309"}</sup> is a step function.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>0 {"<"} x {"\u2264"} 1: {"\u2308"}x{"\u2309"} = 1, so 2<sup>{"\u2308"}x{"\u2309"}</sup> = 2</span>
          <span>1 {"<"} x {"\u2264"} 2: {"\u2308"}x{"\u2309"} = 2, so 2<sup>{"\u2308"}x{"\u2309"}</sup> = 4</span>
          <span style={{ color: C.muted }}>...</span>
          <span>98 {"<"} x {"\u2264"} 99: {"\u2308"}x{"\u2309"} = 99, so 2<sup>{"\u2308"}x{"\u2309"}</sup> = 2<sup>99</sup></span>
        </div>
      ),
      graph: true,
      color: C.ps,
    },
    {
      label: "Write as a sum of rectangles",
      text: "Each step gives a rectangle of width 1 and height 2\u207F. The integral is the sum of these areas.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>{"\u222B"}<sub>0</sub><sup>99</sup> 2<sup>{"\u2308"}x{"\u2309"}</sup> dx = 2<sup>1</sup> + 2<sup>2</sup> + 2<sup>3</sup> + ... + 2<sup>99</sup></span>
        </div>
      ),
      graph: false,
      color: C.calc,
    },
    {
      label: "Sum the geometric series",
      text: "This is a geometric series with first term 2, common ratio 2, and 99 terms.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>Sum = a(r<sup>n</sup> - 1) / (r - 1)</span>
          <span>= 2(2<sup>99</sup> - 1) / (2 - 1)</span>
          <span>= 2<sup>100</sup> - 2</span>
          <span style={{ color: C.ok }}><strong>= 2<sup>100</sup> - 2</strong></span>
        </div>
      ),
      graph: false,
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
                      <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", fontSize: 15, color: C.white, fontFamily: mathFont, textAlign: "center", letterSpacing: 0.5, lineHeight: 2 }}>{s.math}</div>
                    </div>
                    <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px", display: "flex", alignItems: "center" }}>
                      <StepGraph maxSteps={5} showArea={false} compact />
                    </div>
                  </div>
                ) : (
                  <div>
                    <p style={{ margin: "0 0 8px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{s.text}</p>
                    <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", fontSize: 17, color: C.white, fontFamily: mathFont, textAlign: "center", letterSpacing: 0.5, lineHeight: 2 }}>{s.math}</div>
                  </div>
                )}
                {i === steps.length - 1 && <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: C.conclBg, border: `1px solid ${C.ok}44`, fontSize: 13.5, color: C.ok, fontWeight: 600, lineHeight: 1.5 }}>The answer is F: 2<sup>100</sup> - 2.</div>}
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
function RectangleExplorer() {
  const [numSteps, setNumSteps] = useState(4);

  // Running total: 2^1 + 2^2 + ... + 2^n = 2^(n+1) - 2
  const total = Math.pow(2, numSteps + 1) - 2;
  const formula = `2${numSteps + 1 <= 9 ? superscript(numSteps + 1) : "^(" + (numSteps + 1) + ")"} - 2`;

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Number of steps (upper limit of integral)</span>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <input type="range" min={1} max={8} step={1} value={numSteps} onChange={e => setNumSteps(parseInt(e.target.value))} style={{ flex: 1, accentColor: C.accent, height: 6 }} />
          <div style={{ minWidth: 120, textAlign: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.accent }}>{"\u222B"}<sub style={{ fontSize: 10 }}>0</sub><sup style={{ fontSize: 10 }}>{numSteps}</sup> 2<sup>{"\u2308"}x{"\u2309"}</sup> dx</span>
          </div>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 18 }}>
        <StepGraph maxSteps={numSteps} showArea compact={false} />
      </div>

      {/* Term breakdown table */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 20px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 10 }}>Rectangle areas (each width = 1)</span>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          {Array.from({ length: numSteps }, (_, i) => i + 1).map(k => (
            <div key={k} style={{ background: C.area + "15", borderRadius: 6, padding: "6px 10px", textAlign: "center", minWidth: 40 }}>
              <div style={{ fontSize: 9, color: C.muted }}>Step {k}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.step, fontFamily: mathFont }}>2<sup>{k}</sup> = {Math.pow(2, k)}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: C.muted }}>Sum:</span>
          <span style={{ fontSize: 12, color: C.text, fontFamily: mathFont }}>
            {Array.from({ length: numSteps }, (_, i) => `2${superscript(i + 1)}`).join(" + ")}
          </span>
          <span style={{ fontSize: 12, color: C.muted }}>=</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.ok, fontFamily: mathFont }}>{total}</span>
          <span style={{ fontSize: 12, color: C.muted }}>=</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.ok, fontFamily: mathFont }}>2<sup>{numSteps + 1}</sup> - 2</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, marginBottom: 4 }}>Upper limit</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: C.white }}>{numSteps}</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.ok}`, borderRadius: 14, padding: "14px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: C.ok, fontWeight: 700, marginBottom: 4 }}>Total area</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.ok }}>2<sup>{numSteps + 1}</sup> - 2 = {total}</div>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 18px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ background: C.assumBg, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.assum, fontWeight: 700, whiteSpace: "nowrap" }}>HINT</span>
          <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, margin: 0 }}>Notice the pattern: the total is always 2<sup>n+1</sup> - 2. For the full integral with upper limit 99, the total is 2<sup>100</sup> - 2. Each rectangle doubles the previous one, giving a geometric series.</p>
        </div>
      </div>
    </div>
  );
}

// Superscript helper
function superscript(n) {
  const digits = String(n).split("");
  const sup = { "0": "\u2070", "1": "\u00B9", "2": "\u00B2", "3": "\u00B3", "4": "\u2074", "5": "\u2075", "6": "\u2076", "7": "\u2077", "8": "\u2078", "9": "\u2079" };
  return digits.map(d => sup[d] || d).join("");
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
  { letter: "A", text: <span>2<sup>99</sup></span>, ok: false, expl: <span>This is just the last term 2<sup>99</sup>. The integral sums all 99 terms from 2<sup>1</sup> to 2<sup>99</sup>.</span> },
  { letter: "B", text: <span>2<sup>99</sup> - 1</span>, ok: false, expl: <span>This would be the geometric series 1 + 2 + ... + 2<sup>98</sup>. Our series starts at 2<sup>1</sup>, not 2<sup>0</sup>.</span> },
  { letter: "C", text: <span>2<sup>99</sup> - 2</span>, ok: false, expl: <span>Off by a factor. The series 2 + 4 + ... + 2<sup>99</sup> = 2(2<sup>99</sup> - 1)/(2-1) = 2<sup>100</sup> - 2, not 2<sup>99</sup> - 2.</span> },
  { letter: "D", text: <span>2<sup>100</sup></span>, ok: false, expl: <span>Close but the geometric series formula gives 2<sup>100</sup> - 2, not 2<sup>100</sup>. The -2 comes from subtracting the "missing" 2<sup>0</sup> = 1 term (times 2).</span> },
  { letter: "E", text: <span>2<sup>100</sup> - 1</span>, ok: false, expl: <span>2<sup>100</sup> - 1 = 1 + 2 + 4 + ... + 2<sup>99</sup>, which includes 2<sup>0</sup> = 1. Our sum starts at 2<sup>1</sup>, so subtract 1 more to get 2<sup>100</sup> - 2.</span> },
  { letter: "F", text: <span>2<sup>100</sup> - 2</span>, ok: true, expl: <span>2<sup>1</sup> + 2<sup>2</sup> + ... + 2<sup>99</sup> = 2(2<sup>99</sup> - 1)/(2 - 1) = 2<sup>100</sup> - 2. The step function gives 99 rectangles of width 1, heights doubling each time.</span> },
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
            <span style={{ fontSize: 12, color: C.ps }}>Integration and Series</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TMUA 2023 {"\u00B7"} Paper 2 {"\u00B7"} Question 17</p>
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
              <p style={{ margin: "0 0 8px" }}>The ceiling of x, written {"\u2308"}x{"\u2309"}, is defined to be the value of x rounded up to the nearest integer.</p>
              <p style={{ margin: "0 0 8px" }}>For example: {"\u2308"}{"\u03C0"}{"\u2309"} = 4, {"\u2308"}2.1{"\u2309"} = 3, {"\u2308"}8{"\u2309"} = 8.</p>
              <p style={{ margin: 0 }}>What is the value of <strong style={{ color: C.assum }}>{"\u222B"}<sub>0</sub><sup>99</sup> 2<sup>{"\u2308"}x{"\u2309"}</sup> dx</strong>?</p>
            </div>
          </div>
        )}

        {/* Step 1: Setup */}
        {step === 1 && (
          <>
            <QuestionSummary />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>What does the integrand look like?</span>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 10px" }}>
                The ceiling function {"\u2308"}x{"\u2309"} jumps at each integer. Between consecutive integers, it is constant. So 2<sup>{"\u2308"}x{"\u2309"}</sup> is a step function that doubles at each integer step.
              </p>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 16px" }}>
                The integral of a step function is just the sum of the rectangular areas under each step.
              </p>
              <StepGraph maxSteps={6} showArea compact={false} />
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>STRATEGY</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Split the integral into 99 unit intervals. On each interval the integrand is constant, giving a rectangle of width 1. The heights form a geometric sequence, so sum using the geometric series formula.</p>
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
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Increase the number of steps and watch the rectangles double in height. The total always follows the pattern 2<sup>n+1</sup> - 2. For the full problem with 99 steps, the total is 2<sup>100</sup> - 2.</p>
              </div>
            </div>
            <RectangleExplorer />
          </>
        )}

        {/* Step 4: Answer */}
        {step === 4 && (
          <>
            <QuestionSummary />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6, fontStyle: "italic" }}>"What is the value of the integral?"</div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Summary</span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <div style={{ background: C.step + "12", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: C.step, fontWeight: 700, marginBottom: 4 }}>Series</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.step, fontFamily: mathFont }}>2 + 4 + ... + 2<sup>99</sup></div>
                </div>
                <div style={{ background: C.calc + "12", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: C.calc, fontWeight: 700, marginBottom: 4 }}>99 terms, ratio 2</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.calc, fontFamily: mathFont }}>a = 2, r = 2, n = 99</div>
                </div>
                <div style={{ background: C.ok + "12", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: C.ok, fontWeight: 700, marginBottom: 4 }}>Total</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: C.ok }}>2<sup>100</sup> - 2</div>
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
