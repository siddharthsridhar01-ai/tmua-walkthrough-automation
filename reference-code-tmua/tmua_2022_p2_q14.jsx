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
  ineq1: "#a29bfe", ineq2: "#fd79a8", soln: "#55efc4",
};
const mathFont = "'Cambria Math','Latin Modern Math','STIX Two Math',Georgia,serif";

const stepsMeta = [
  { id: 0, label: "Read", title: "Read the Question" },
  { id: 1, label: "Setup", title: "Identify the Approach" },
  { id: 2, label: "Solve", title: "Solve Each Inequality" },
  { id: 3, label: "Verify", title: "Explore on the Number Line" },
  { id: 4, label: "Answer", title: "Confirm the Answer" },
];

function QuestionSummary() {
  return (
    <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 18px", marginBottom: 16, textAlign: "center" }}>
      <p style={{ margin: "0 0 6px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
        <span style={{ fontWeight: 700, color: C.muted, letterSpacing: 0.5, marginRight: 6 }}>Q14</span>
        |x + 5| {"<"} |x + 11| and |x + 11| {"<"} |x + 1|. <strong style={{ color: C.assum }}>Which statement about the solution set is correct?</strong>
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, fontSize: 11, fontWeight: 600, color: C.muted, flexWrap: "wrap" }}>
        <span>A: empty</span><span>B: one point</span><span>C: length 1</span><span>D: length 2</span><span>E: length 3</span><span>F: length 4</span><span>G: length 5</span>
      </div>
    </div>
  );
}

/* ───── Number Line Diagram ─────
   Pixel-margin layout. Shows key points and solution intervals.
   - xVal: current x position (for verify slider)
   - showIneq1: highlight inequality 1 solution region
   - showIneq2: highlight inequality 2 solution region
   - showIntersection: highlight the combined solution
   - showDistances: show distance arcs from x to key points
   - showMidpoints: show midpoint markers at -8 and -6
   - compact: smaller for solve pane
*/
function NumberLine({ xVal, showIneq1, showIneq2, showIntersection, showDistances, showMidpoints, compact }) {
  const mL = compact ? 16 : 24, mR = compact ? 16 : 24;
  const mT = compact ? 46 : 86, mB = compact ? 20 : 30;
  const plotW = compact ? 260 : 460, plotH = compact ? 30 : 40;
  const w = mL + plotW + mR, h = mT + plotH + mB;

  // Math range: show from -14 to 2
  const xMinM = -14, xMaxM = 2;
  const toSx = (x) => mL + ((x - xMinM) / (xMaxM - xMinM)) * plotW;
  const lineY = mT + plotH / 2;
  const sfs = compact ? 7 : 9;
  const textRectW = (str, fs) => str.length * fs * 0.65 + (compact ? 6 : 10);

  const keyPoints = [
    { x: -11, label: "-11", color: C.muted },
    { x: -8, label: "-8", color: C.ineq1, isMidpoint: true },
    { x: -6, label: "-6", color: C.ineq2, isMidpoint: true },
    { x: -5, label: "-5", color: C.muted },
    { x: -1, label: "-1", color: C.muted },
  ];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", display: "block" }}>
      {/* Number line */}
      <line x1={mL} y1={lineY} x2={mL + plotW} y2={lineY} stroke={C.muted} strokeWidth={1} opacity={0.5} />
      {/* Arrow */}
      <polygon points={`${mL + plotW},${lineY} ${mL + plotW - 6},${lineY - 3} ${mL + plotW - 6},${lineY + 3}`} fill={C.muted} opacity={0.5} />

      {/* Inequality 1 region: x > -8 */}
      {showIneq1 && (
        <>
          <rect x={toSx(-8)} y={lineY - (compact ? 8 : 12)} width={toSx(xMaxM) - toSx(-8)} height={compact ? 16 : 24} fill={C.ineq1} fillOpacity={0.1} rx={2} />
          {/* Vertical boundary at x = -8 */}
          <line x1={toSx(-8)} y1={lineY - (compact ? 18 : 28)} x2={toSx(-8)} y2={lineY + (compact ? 10 : 14)} stroke={C.ineq1} strokeWidth={1.5} strokeDasharray="3,3" opacity={0.7} />
        </>
      )}
      {/* Inequality 2 region: x < -6 */}
      {showIneq2 && (
        <>
          <rect x={toSx(xMinM)} y={lineY - (compact ? 8 : 12)} width={toSx(-6) - toSx(xMinM)} height={compact ? 16 : 24} fill={C.ineq2} fillOpacity={0.1} rx={2} />
          {/* Vertical boundary at x = -6 */}
          <line x1={toSx(-6)} y1={lineY - (compact ? 18 : 28)} x2={toSx(-6)} y2={lineY + (compact ? 10 : 14)} stroke={C.ineq2} strokeWidth={1.5} strokeDasharray="3,3" opacity={0.7} />
        </>
      )}
      {/* Intersection: -8 < x < -6 */}
      {showIntersection && (
        <rect x={toSx(-8)} y={lineY - (compact ? 10 : 14)} width={toSx(-6) - toSx(-8)} height={compact ? 20 : 28} fill={C.soln} fillOpacity={0.2} rx={3} stroke={C.soln} strokeWidth={1.5} strokeOpacity={0.6} />
      )}

      {/* Key point ticks and labels */}
      {keyPoints.map(p => {
        const sx = toSx(p.x);
        const show = !p.isMidpoint || showMidpoints;
        return show ? (
          <g key={p.x}>
            <line x1={sx} y1={lineY - (compact ? 5 : 7)} x2={sx} y2={lineY + (compact ? 5 : 7)} stroke={p.color} strokeWidth={p.isMidpoint ? 2 : 1} />
            <text x={sx} y={lineY + (compact ? 16 : 22)} fill={p.color} fontSize={sfs} fontWeight={p.isMidpoint ? 700 : 500} textAnchor="middle" fontFamily={mathFont}>{p.label}</text>
          </g>
        ) : null;
      })}

      {/* Midpoint labels */}
      {showMidpoints && !compact && (
        <>
          <text x={toSx(-8)} y={lineY - (compact ? 10 : 14)} fill={C.ineq1} fontSize={7} fontWeight={600} textAnchor="middle" fontFamily="'Gill Sans',sans-serif">midpoint of -5,-11</text>
          <text x={toSx(-6)} y={lineY - (compact ? 10 : 14)} fill={C.ineq2} fontSize={7} fontWeight={600} textAnchor="middle" fontFamily="'Gill Sans',sans-serif">midpoint of -11,-1</text>
        </>
      )}

      {/* Current x marker */}
      {xVal !== undefined && (
        <>
          <circle cx={toSx(xVal)} cy={lineY} r={compact ? 4 : 6} fill={C.white} stroke={C.accent} strokeWidth={2} />
          {(() => {
            const lbl = `x = ${xVal.toFixed(1)}`;
            const rw = textRectW(lbl, compact ? 8 : 10);
            return (
              <>
                <rect x={toSx(xVal) - rw / 2} y={lineY - (compact ? 22 : 32)} width={rw} height={compact ? 14 : 16} rx={3} fill={C.bg} fillOpacity={0.9} stroke={C.accent} strokeWidth={0.5} />
                <text x={toSx(xVal)} y={lineY - (compact ? 12 : 18)} fill={C.accent} fontSize={compact ? 8 : 10} fontWeight={700} textAnchor="middle" fontFamily={mathFont}>{lbl}</text>
              </>
            );
          })()}
        </>
      )}

      {/* Distance arcs from x to key points */}
      {showDistances && xVal !== undefined && (
        <>
          {[
            { to: -5, label: "|x+5|", color: C.ineq1, yOff: -(compact ? 30 : 46) },
            { to: -11, label: "|x+11|", color: C.muted, yOff: -(compact ? 42 : 62) },
            { to: -1, label: "|x+1|", color: C.ineq2, yOff: -(compact ? 54 : 78) },
          ].map(d => {
            const x1 = toSx(Math.min(xVal, d.to));
            const x2 = toSx(Math.max(xVal, d.to));
            const dist = Math.abs(xVal - d.to);
            const arcY = lineY + d.yOff;
            const midX = (x1 + x2) / 2;
            if (dist < 0.1) return null;
            const lbl = `${d.label} = ${dist.toFixed(1)}`;
            const rw = textRectW(lbl, compact ? 7 : 8);
            return (
              <g key={d.to}>
                <path d={`M ${x1} ${lineY - 4} Q ${midX} ${arcY} ${x2} ${lineY - 4}`} fill="none" stroke={d.color} strokeWidth={1} opacity={0.6} />
                <rect x={midX - rw / 2} y={arcY - 2 - 7} width={rw} height={14} rx={3} fill={C.bg} fillOpacity={0.9} />
                <text x={midX} y={arcY + 2} fill={d.color} fontSize={compact ? 7 : 8} fontWeight={600} textAnchor="middle" fontFamily={mathFont}>{lbl}</text>
              </g>
            );
          })}
        </>
      )}

      {/* Intersection length label */}
      {showIntersection && (
        (() => {
          const midX = (toSx(-8) + toSx(-6)) / 2;
          const lbl = "length = 2";
          const rw = textRectW(lbl, compact ? 8 : 10);
          return (
            <>
              <rect x={midX - rw / 2} y={lineY + (compact ? 20 : 28)} width={rw} height={compact ? 14 : 16} rx={3} fill={C.soln} fillOpacity={0.15} />
              <text x={midX} y={lineY + (compact ? 30 : 40)} fill={C.soln} fontSize={compact ? 8 : 10} fontWeight={700} textAnchor="middle" fontFamily={mathFont}>{lbl}</text>
            </>
          );
        })()
      )}
    </svg>
  );
}

/* ───── Solve Step ───── */
function SolveStep() {
  const [revealed, setRevealed] = useState(0);
  const steps = [
    {
      label: "Interpret |x + a| as distance",
      text: "|x + a| = |x - (-a)| is the distance from x to -a. Mark the three key points -5, -11, -1 on a number line. This is the sketch you would draw in the exam.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>|x + 5| = distance from x to -5</span>
          <span>|x + 11| = distance from x to -11</span>
          <span>|x + 1| = distance from x to -1</span>
        </div>
      ),
      diagram: "points",
      color: C.ps,
    },
    {
      label: "Boundary for |x+5| < |x+11|",
      text: "x is closer to -5 than to -11. Find the midpoint: (-5 + -11)/2 = -8. Draw a vertical dashed line at x = -8 and shade to the right (towards -5).",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>Midpoint = (-5 + (-11))/2 = -8</span>
          <span>Draw line at x = -8, shade right</span>
          <span style={{ color: C.ineq1 }}>x {">"} -8</span>
        </div>
      ),
      diagram: "ineq1",
      color: C.ineq1,
    },
    {
      label: "Boundary for |x+11| < |x+1|",
      text: "x is closer to -11 than to -1. Midpoint: (-11 + -1)/2 = -6. Draw a vertical dashed line at x = -6 and shade to the left (towards -11).",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>Midpoint = (-11 + (-1))/2 = -6</span>
          <span>Draw line at x = -6, shade left</span>
          <span style={{ color: C.ineq2 }}>x {"<"} -6</span>
        </div>
      ),
      diagram: "ineq2",
      color: C.ineq2,
    },
    {
      label: "Read off the overlap",
      text: "The two shaded regions overlap between the vertical lines at -8 and -6. This is the interval where both inequalities hold.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>-8 {"<"} x {"<"} -6</span>
          <span>Interval of length <strong style={{ color: C.ok }}>2</strong></span>
        </div>
      ),
      diagram: "both",
      color: C.ok,
    },
  ];

  const diagramProps = (d) => {
    if (d === "points") return { showIneq1: false, showIneq2: false, showIntersection: false, showMidpoints: false };
    if (d === "ineq1") return { showIneq1: true, showIneq2: false, showIntersection: false, showMidpoints: true };
    if (d === "ineq2") return { showIneq1: false, showIneq2: true, showIntersection: false, showMidpoints: true };
    if (d === "both") return { showIneq1: true, showIneq2: true, showIntersection: true, showMidpoints: true };
    return {};
  };

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 16 }}>Step-by-step solution</span>
      {steps.map((s, i) => {
        if (i > revealed) return null;
        const dp = diagramProps(s.diagram);
        return (
          <div key={i} style={{ marginBottom: 22, animation: "fadeSlideIn 0.4s ease-out" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", flexShrink: 0, background: s.color + "22", border: `2px solid ${s.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: s.color }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: s.color, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
                <p style={{ margin: "0 0 8px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{s.text}</p>
                <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", fontSize: 16, color: C.white, fontFamily: mathFont, textAlign: "center", letterSpacing: 0.5, lineHeight: 2, marginBottom: 10 }}>{s.math}</div>
                <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px" }}>
                  <NumberLine {...dp} showDistances={false} compact />
                </div>
                {i === steps.length - 1 && <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: C.conclBg, border: `1px solid ${C.ok}44`, fontSize: 13.5, color: C.ok, fontWeight: 600, lineHeight: 1.5 }}>The answer is D: interval of length 2.</div>}
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
function InequalityExplorer() {
  const [xVal, setXVal] = useState(-7);

  const d5 = Math.abs(xVal + 5);
  const d11 = Math.abs(xVal + 11);
  const d1 = Math.abs(xVal + 1);
  const ineq1 = d5 < d11;
  const ineq2 = d11 < d1;
  const both = ineq1 && ineq2;

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Drag x along the number line</span>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
          <input type="range" min={-13} max={1} step={0.1} value={xVal} onChange={e => setXVal(parseFloat(e.target.value))} style={{ flex: 1, accentColor: C.accent, height: 6 }} />
          <div style={{ minWidth: 80, textAlign: "center" }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: C.accent, fontFamily: mathFont }}>x = {xVal.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 18 }}>
        <NumberLine xVal={xVal} showIneq1 showIneq2 showIntersection showDistances showMidpoints compact={false} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
        <div style={{ background: C.card, border: `1px solid ${ineq1 ? C.ok : C.fail}`, borderRadius: 14, padding: "14px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: ineq1 ? C.ok : C.fail, fontWeight: 700, marginBottom: 4 }}>|x+5| {"<"} |x+11|?</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: ineq1 ? C.ok : C.fail }}>{d5.toFixed(1)} {"<"} {d11.toFixed(1)} {ineq1 ? "\u2713" : "\u2717"}</div>
          <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>Needs x {">"} -8</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${ineq2 ? C.ok : C.fail}`, borderRadius: 14, padding: "14px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: ineq2 ? C.ok : C.fail, fontWeight: 700, marginBottom: 4 }}>|x+11| {"<"} |x+1|?</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: ineq2 ? C.ok : C.fail }}>{d11.toFixed(1)} {"<"} {d1.toFixed(1)} {ineq2 ? "\u2713" : "\u2717"}</div>
          <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>Needs x {"<"} -6</div>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${both ? C.ok + "66" : C.border}`, borderRadius: 14, padding: "14px 18px", textAlign: "center", marginBottom: 18 }}>
        {both ? (
          <span style={{ fontSize: 14, fontWeight: 700, color: C.ok }}>Both inequalities satisfied (x is in (-8, -6))</span>
        ) : (
          <span style={{ fontSize: 14, color: C.muted }}>{!ineq1 && !ineq2 ? "Neither inequality satisfied" : !ineq1 ? "First inequality fails (x \u2264 -8)" : "Second inequality fails (x \u2265 -6)"}</span>
        )}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 18px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ background: C.assumBg, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.assum, fontWeight: 700, whiteSpace: "nowrap" }}>HINT</span>
          <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, margin: 0 }}>Both inequalities are satisfied precisely when -8 {"<"} x {"<"} -6. The arcs show the three distances - watch how their relative sizes change as x moves.</p>
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
  { letter: "A", text: "There is no real number for which both inequalities are true.", ok: false, expl: "Try x = -7: |{-7+5}| = 2 < 4 = |-7+11| and |-7+11| = 4 < 6 = |-7+1|. Both hold." },
  { letter: "B", text: "There is exactly one real number for which both are true.", ok: false, expl: "The solution is an open interval (-8, -6), not a single point." },
  { letter: "C", text: "The solution set is an interval of length 1.", ok: false, expl: "The interval is (-8, -6) which has length 2, not 1." },
  { letter: "D", text: "The solution set is an interval of length 2.", ok: true, expl: "Inequality 1 gives x > -8 (closer to -5 than -11). Inequality 2 gives x < -6 (closer to -11 than -1). The intersection is (-8, -6), length 2." },
  { letter: "E", text: "The solution set is an interval of length 3.", ok: false, expl: "The midpoints are -8 and -6, giving interval length |-6-(-8)| = 2, not 3." },
  { letter: "F", text: "The solution set is an interval of length 4.", ok: false, expl: "Too large. The two boundary midpoints are only 2 apart." },
  { letter: "G", text: "The solution set is an interval of length 5.", ok: false, expl: "Far too large. The interval is (-8, -6), length 2." },
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
            <span style={{ fontSize: 12, color: C.ps }}>Absolute Value Inequalities</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TMUA 2022 {"\u00B7"} Paper 2 {"\u00B7"} Question 14</p>
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
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question 14</span>
            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: "0 0 8px" }}>Consider the two inequalities:</p>
              <div style={{ textAlign: "center", fontFamily: mathFont, fontSize: 18, margin: "12px 0", lineHeight: 2.2 }}>
                <div>|x + 5| {"<"} |x + 11|</div>
                <div>|x + 11| {"<"} |x + 1|</div>
              </div>
              <p style={{ margin: 0 }}>Which one of the following is correct?</p>
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
                Both inequalities compare absolute values of the form |x + a|. Recall that |x + a| = |x - (-a)| represents the distance from x to the point -a on the number line.
              </p>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 16px" }}>
                So |x + 5| {"<"} |x + 11| says "x is closer to -5 than to -11", and |x + 11| {"<"} |x + 1| says "x is closer to -11 than to -1". Each inequality defines a half-line, and we need their intersection.
              </p>
              <NumberLine showIneq1={false} showIneq2={false} showIntersection={false} showDistances={false} showMidpoints={false} compact={false} />
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>KEY INSIGHT</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>|x - a| {"<"} |x - b| is equivalent to: x is on the same side as a of the midpoint of a and b. The boundary is always the midpoint.</p>
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
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Drag x along the number line. The arcs show the three distances |x+5|, |x+11|, and |x+1|. Both inequalities hold only when x is between -8 and -6.</p>
              </div>
            </div>
            <InequalityExplorer />
          </>
        )}

        {/* Step 4: Answer */}
        {step === 4 && (
          <>
            <QuestionSummary />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6, fontStyle: "italic" }}>"Which one of the following is correct?"</div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Summary</span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <div style={{ background: C.ineq1 + "12", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: C.ineq1, fontWeight: 700, marginBottom: 4 }}>Inequality 1</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.ineq1 }}>x {">"} -8</div>
                </div>
                <div style={{ background: C.ineq2 + "12", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: C.ineq2, fontWeight: 700, marginBottom: 4 }}>Inequality 2</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.ineq2 }}>x {"<"} -6</div>
                </div>
                <div style={{ background: C.ok + "12", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: C.ok, fontWeight: 700, marginBottom: 4 }}>Intersection</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.ok }}>(-8, -6)</div>
                  <div style={{ fontSize: 10, color: C.ok, marginTop: 2 }}>length = 2</div>
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
