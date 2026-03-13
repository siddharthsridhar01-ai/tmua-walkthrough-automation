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
  curve: "#a29bfe", sp: "#fd79a8", root: "#55efc4",
};
const mathFont = "'Cambria Math','Latin Modern Math','STIX Two Math',Georgia,serif";
const bodyFont = "'Gill Sans','Trebuchet MS',Calibri,sans-serif";

const stepsMeta = [
  { id: 0, label: "Read", title: "Read the Question" },
  { id: 1, label: "Setup", title: "Identify the Approach" },
  { id: 2, label: "Solve", title: "Analyse the Student's Proof" },
  { id: 3, label: "Verify", title: "Explore the Cubic" },
  { id: 4, label: "Answer", title: "Confirm the Answer" },
];

function QuestionSummary() {
  return (
    <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 18px", marginBottom: 16, textAlign: "center" }}>
      <p style={{ margin: "0 0 6px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
        <span style={{ fontWeight: 700, color: C.muted, letterSpacing: 0.5, marginRight: 6 }}>Q17</span>
        A student proves: x{"\u00B3"} + ax{"\u00B2"} + b = 0 has three distinct real roots if 27b(b + 4a{"\u00B3"}/27) {"<"} 0.{" "}
        <strong style={{ color: C.assum }}>Which option best describes the solution?</strong>
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, fontSize: 10, fontWeight: 600, color: C.muted, flexWrap: "wrap" }}>
        <span>A: correct</span><span>B: proved converse</span><span>C: wrong order</span><span>D: converse in II</span><span>E: converse in III</span>
      </div>
    </div>
  );
}

/* ───── Cubic Graph ─────
   Shows y = x^3 + ax^2 + b with stationary points and roots.
   Pixel-margin layout. No SVG flatlines - breaks polyline at edges.
   Labels placed to avoid overlap using above/below logic.
*/
function CubicGraph({ aVal, bVal, showSP, showRoots, showYvals, general, compact }) {
  const mL = compact ? 32 : 44, mR = compact ? 16 : 24;
  const mT = compact ? 16 : 20, mB = compact ? 24 : 30;
  const pW = compact ? 220 : 370, pH = compact ? 155 : 230;
  const w = mL + pW + mR, h = mT + pH + mB;

  const a = aVal, b = bVal;
  const sp1x = 0, sp1y = b;
  const sp2x = -2 * a / 3, sp2y = sp2x * sp2x * sp2x + a * sp2x * sp2x + b;

  const xMinM = general ? -4 : Math.min(sp2x, sp1x, -2) - 1.5;
  const xMaxM = general ? 4 : Math.max(sp2x, sp1x, 2) + 1.5;
  const N = 500;
  const yVals = [];
  for (let i = 0; i <= N; i++) {
    const x = xMinM + (xMaxM - xMinM) * i / N;
    yVals.push(x * x * x + a * x * x + b);
  }
  const yDataMin = Math.min(...yVals, sp1y, sp2y);
  const yDataMax = Math.max(...yVals, sp1y, sp2y);
  const yPad = Math.max(1, (yDataMax - yDataMin) * 0.15);
  const yMinM = yDataMin - yPad;
  const yMaxM = yDataMax + yPad;

  const toSx = (x) => mL + ((x - xMinM) / (xMaxM - xMinM)) * pW;
  const toSy = (y) => mT + ((yMaxM - y) / (yMaxM - yMinM)) * pH;
  const sfs = compact ? 7 : 9;
  const textRectW = (str, fs) => str.length * fs * 0.62 + (compact ? 6 : 10);

  // Build curve segments, breaking at y-range boundaries
  const segments = [];
  let seg = [];
  for (let i = 0; i <= N; i++) {
    const x = xMinM + (xMaxM - xMinM) * i / N;
    const y = x * x * x + a * x * x + b;
    if (y >= yMinM && y <= yMaxM) {
      seg.push(`${toSx(x).toFixed(1)},${toSy(y).toFixed(1)}`);
    } else {
      if (seg.length > 1) segments.push(seg);
      seg = [];
    }
  }
  if (seg.length > 1) segments.push(seg);

  // Find roots numerically
  const roots = [];
  if (showRoots) {
    for (let i = 0; i < N; i++) {
      const x1 = xMinM + (xMaxM - xMinM) * i / N;
      const x2 = xMinM + (xMaxM - xMinM) * (i + 1) / N;
      const y1 = x1 * x1 * x1 + a * x1 * x1 + b;
      const y2 = x2 * x2 * x2 + a * x2 * x2 + b;
      if (y1 * y2 < 0) {
        let lo = x1, hi = x2;
        for (let j = 0; j < 30; j++) {
          const mid = (lo + hi) / 2;
          const ym = mid * mid * mid + a * mid * mid + b;
          if (ym * y1 < 0) hi = mid; else lo = mid;
        }
        roots.push((lo + hi) / 2);
      }
    }
  }

  // Grid
  const yGridVals = [];
  const rawYStep = (yMaxM - yMinM) / (compact ? 4 : 6);
  const yStep = [1, 2, 5, 10, 20, 50].find(s => s >= rawYStep) || Math.ceil(rawYStep);
  for (let v = Math.ceil(yMinM / yStep) * yStep; v <= yMaxM; v += yStep) yGridVals.push(v);
  const xGridVals = [];
  for (let v = Math.ceil(xMinM); v <= Math.floor(xMaxM); v++) xGridVals.push(v);

  // SP label placement: place each label on the side away from the other SP
  const sp1sx = toSx(sp1x), sp1sy = toSy(sp1y);
  const sp2sx = toSx(sp2x), sp2sy = toSy(sp2y);
  const sp1Above = sp1sy < sp2sy; // in screen coords, smaller y = higher
  const labelOffset = compact ? 14 : 18;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", display: "block" }}>
      {/* Gridlines */}
      {yGridVals.map(v => (
        <g key={"yg" + v}>
          <line x1={mL} y1={toSy(v)} x2={mL + pW} y2={toSy(v)}
            stroke={v === 0 ? C.muted : C.border} strokeWidth={v === 0 ? 0.8 : 0.5}
            strokeDasharray={v === 0 ? "none" : "4,4"} opacity={v === 0 ? 0.5 : 0.3} />
          <text x={mL - 5} y={toSy(v) + 3} fill={C.muted} fontSize={sfs}
            textAnchor="end" opacity={0.6} fontFamily={mathFont}>{v}</text>
        </g>
      ))}
      {xGridVals.filter(v => v !== 0).map(v => (
        <g key={"xg" + v}>
          <line x1={toSx(v)} y1={mT} x2={toSx(v)} y2={mT + pH}
            stroke={C.border} strokeWidth={0.5} strokeDasharray="4,4" opacity={0.3} />
          <text x={toSx(v)} y={mT + pH + (compact ? 14 : 18)} fill={C.muted} fontSize={sfs}
            textAnchor="middle" opacity={0.6} fontFamily={mathFont}>{v}</text>
        </g>
      ))}
      {/* x-axis */}
      {yMinM <= 0 && yMaxM >= 0 && (
        <line x1={mL} y1={toSy(0)} x2={mL + pW} y2={toSy(0)}
          stroke={C.muted} strokeWidth={0.8} opacity={0.5} />
      )}
      {/* Curve */}
      {segments.map((s, i) => (
        <polyline key={i} points={s.join(" ")} fill="none" stroke={C.curve} strokeWidth={compact ? 1.8 : 2.2} />
      ))}
      {/* Stationary points */}
      {showSP && !general && (
        <>
          {showYvals && yMinM <= 0 && yMaxM >= 0 && (
            <>
              <line x1={sp1sx} y1={sp1sy} x2={sp1sx} y2={toSy(0)} stroke={C.sp} strokeWidth={0.7} strokeDasharray="3,3" opacity={0.4} />
              <line x1={sp2sx} y1={sp2sy} x2={sp2sx} y2={toSy(0)} stroke={C.sp} strokeWidth={0.7} strokeDasharray="3,3" opacity={0.4} />
            </>
          )}
          <circle cx={sp1sx} cy={sp1sy} r={compact ? 4 : 5} fill={C.sp} stroke={C.bg} strokeWidth={1.5} />
          <circle cx={sp2sx} cy={sp2sy} r={compact ? 4 : 5} fill={C.sp} stroke={C.bg} strokeWidth={1.5} />
          {showYvals && (
            <>
              {/* SP1 label */}
              {(() => {
                const lbl = `y=${sp1y.toFixed(1)}`;
                const dy = sp1Above ? -labelOffset : labelOffset;
                const tw = textRectW(lbl, sfs);
                return (
                  <g>
                    <rect x={sp1sx - tw / 2} y={sp1sy + dy - sfs / 2 - 3} width={tw} height={sfs + 6} rx={3} fill={C.bg} fillOpacity={0.92} />
                    <text x={sp1sx} y={sp1sy + dy + sfs / 2 - 2} fill={C.sp} fontSize={sfs} textAnchor="middle" fontFamily={mathFont}>{lbl}</text>
                  </g>
                );
              })()}
              {/* SP2 label */}
              {(() => {
                const lbl = `y=${sp2y.toFixed(1)}`;
                const dy = sp1Above ? labelOffset : -labelOffset;
                const tw = textRectW(lbl, sfs);
                return (
                  <g>
                    <rect x={sp2sx - tw / 2} y={sp2sy + dy - sfs / 2 - 3} width={tw} height={sfs + 6} rx={3} fill={C.bg} fillOpacity={0.92} />
                    <text x={sp2sx} y={sp2sy + dy + sfs / 2 - 2} fill={C.sp} fontSize={sfs} textAnchor="middle" fontFamily={mathFont}>{lbl}</text>
                  </g>
                );
              })()}
            </>
          )}
        </>
      )}
      {/* Roots */}
      {showRoots && roots.map((r, i) => (
        <circle key={"root" + i} cx={toSx(r)} cy={toSy(0)} r={compact ? 3.5 : 4.5} fill={C.root} stroke={C.bg} strokeWidth={1.5} />
      ))}
      {/* Curve label - anchored top-right of plot area */}
      {!compact && (
        <g>
          <rect x={mL + pW - textRectW("y = x\u00B3+ax\u00B2+b", sfs + 1) - 2} y={mT + 2} width={textRectW("y = x\u00B3+ax\u00B2+b", sfs + 1)} height={16} rx={3} fill={C.bg} fillOpacity={0.92} />
          <text x={mL + pW - 6} y={mT + 14} fill={C.curve} fontSize={sfs + 1} textAnchor="end" fontFamily={mathFont}>y = x{"\u00B3"}+ax{"\u00B2"}+b</text>
        </g>
      )}
    </svg>
  );
}


/* ───── Solve Step ───── */
function SolveStep() {
  const [revealed, setRevealed] = useState(0);
  const steps = [
    {
      label: "Step I: Differentiation (correct)",
      text: <span>The student differentiates y = x{"\u00B3"} + ax{"\u00B2"} + b correctly to find the stationary points at x = 0 and x = -2a/3. The y-values at these points are b and b + 4a{"\u00B3"}/27.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>dy/dx = 3x{"\u00B2"} + 2ax = x(3x + 2a)</span>
          <span>Stationary points: x = 0 and x = -2a/3</span>
          <span>y(0) = b</span>
          <span>y(-2a/3) = b + 4a{"\u00B3"}/27</span>
        </div>
      ),
      color: C.ok,
    },
    {
      label: "Step II: Opposite signs (correct)",
      text: <span>If 27b(b + 4a{"\u00B3"}/27) {"<"} 0, the product of the two y-values at the stationary points is negative. Two numbers with a negative product must have opposite signs. So one SP is above and one is below the x-axis.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>y-values at SPs: b and b + 4a{"\u00B3"}/27</span>
          <span>27b(b + 4a{"\u00B3"}/27) {"<"} 0</span>
          <span>{"\u21D2"} b and (b + 4a{"\u00B3"}/27) have opposite signs</span>
          <span style={{ color: C.ok }}>{"\u21D2"} one SP above, one below x-axis</span>
        </div>
      ),
      color: C.ok,
    },
    {
      label: "Step III: The critical error",
      text: <span>The student writes: "If the cubic has three distinct real roots, then one SP is above and one is below the x-axis." This is <strong style={{ color: C.fail }}>true but in the wrong direction</strong>. The proof needs the converse: "If one SP is above and one below, then the cubic has three distinct real roots."</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ color: C.fail }}>Student wrote: 3 roots {"\u21D2"} one SP above, one below</span>
          <span style={{ color: C.ok }}>Proof needs: one SP above, one below {"\u21D2"} 3 roots</span>
          <span style={{ color: C.muted, fontSize: 13 }}>These are converses of each other.</span>
          <span style={{ color: C.muted, fontSize: 13 }}>A true statement does not make its converse true.</span>
        </div>
      ),
      color: C.fail,
    },
    {
      label: "Step IV: The conclusion does not follow",
      text: <span>Because step III goes the wrong way, the chain of reasoning is broken. Step II establishes one SP above, one below. The proof needs this to imply three roots. But step III only tells us that three roots would imply this - not the other way around.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>Proof chain should be:</span>
          <span style={{ color: C.ok }}>condition {"\u21D2"} opposite signs {"\u21D2"} one above, one below {"\u21D2"} 3 roots</span>
          <span style={{ color: C.muted, fontSize: 13 }}>But the student's step III gives:</span>
          <span style={{ color: C.fail }}>3 roots {"\u21D2"} one above, one below (wrong direction)</span>
          <span style={{ color: C.fail }}>The converse of step III is what was needed</span>
        </div>
      ),
      color: C.fail,
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
                {i === steps.length - 1 && (
                  <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: C.conclBg, border: `1px solid ${C.ok}44`, fontSize: 13.5, color: C.ok, fontWeight: 600, lineHeight: 1.5 }}>
                    The student should have shown the converse of the result in step III. The answer is E.
                  </div>
                )}
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


/* ───── Verify: Interactive Cubic Explorer ─────
   Sliders for a and b. Graph + status cards side by side.
   Student-directed: set SPs to opposite signs, observe root count.
*/
function CubicExplorer() {
  const [aVal, setAVal] = useState(-3);
  const [bVal, setBVal] = useState(2);

  const sp1y = bVal;
  const sp2y = bVal + 4 * aVal * aVal * aVal / 27;
  const conditionVal = 27 * bVal * (bVal + 4 * aVal * aVal * aVal / 27);
  const conditionHolds = conditionVal < 0;
  const spBracket = sp1y * sp2y < 0;

  // Count real roots numerically
  const xMin = Math.min(-2 * aVal / 3, 0) - 6;
  const xMax = Math.max(-2 * aVal / 3, 0) + 6;
  let rootCount = 0;
  const scanN = 4000;
  for (let i = 0; i < scanN; i++) {
    const x1 = xMin + (xMax - xMin) * i / scanN;
    const x2 = xMin + (xMax - xMin) * (i + 1) / scanN;
    const y1 = x1 * x1 * x1 + aVal * x1 * x1 + bVal;
    const y2 = x2 * x2 * x2 + aVal * x2 * x2 + bVal;
    if (y1 * y2 < 0) rootCount++;
  }

  const sliderStyle = {
    width: "100%", height: 6, borderRadius: 3, cursor: "pointer",
    accentColor: C.curve, background: C.border,
  };

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 20px", marginBottom: 18 }}>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {/* Left: Graph */}
        <div style={{ flex: "1 1 340px", minWidth: 280 }}>
          <CubicGraph aVal={aVal} bVal={bVal} showSP showRoots showYvals />
        </div>
        {/* Right: Controls + Status */}
        <div style={{ flex: "0 0 240px", minWidth: 210 }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.text, marginBottom: 4 }}>
              <span style={{ fontFamily: mathFont }}>a = {aVal.toFixed(1)}</span>
            </div>
            <input type="range" min={-5} max={5} step={0.1} value={aVal}
              onChange={e => setAVal(+e.target.value)} style={sliderStyle} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.text, marginBottom: 4 }}>
              <span style={{ fontFamily: mathFont }}>b = {bVal.toFixed(1)}</span>
            </div>
            <input type="range" min={-10} max={10} step={0.1} value={bVal}
              onChange={e => setBVal(+e.target.value)} style={sliderStyle} />
          </div>
          {/* Status cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ padding: "8px 12px", borderRadius: 8, background: spBracket ? C.ok + "12" : C.fail + "12", border: `1px solid ${spBracket ? C.ok : C.fail}44` }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: C.muted, marginBottom: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>Stationary points</div>
              <div style={{ fontSize: 12, fontFamily: mathFont, color: C.text }}>y = {sp1y.toFixed(1)} and y = {sp2y.toFixed(1)}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: spBracket ? C.ok : C.fail }}>{spBracket ? "Opposite sides of x-axis" : "Same side of x-axis"}</div>
            </div>
            <div style={{ padding: "8px 12px", borderRadius: 8, background: rootCount === 3 ? C.ok + "12" : C.assum + "12", border: `1px solid ${rootCount === 3 ? C.ok : C.assum}44` }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: C.muted, marginBottom: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>Distinct real roots</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: rootCount === 3 ? C.ok : C.assum, fontFamily: mathFont }}>{rootCount}</div>
            </div>
            <div style={{ padding: "8px 12px", borderRadius: 8, background: conditionHolds ? C.ok + "12" : "#1e2030", border: `1px solid ${conditionHolds ? C.ok : C.border}44` }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: C.muted, marginBottom: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>27b(b + 4a{"\u00B3"}/27)</div>
              <div style={{ fontSize: 12, fontFamily: mathFont, color: conditionHolds ? C.ok : C.text }}>{conditionVal.toFixed(1)} {conditionHolds ? "< 0" : "\u2265 0"}</div>
            </div>
          </div>
          {/* Live observation */}
          <div style={{ marginTop: 12, padding: "8px 10px", borderRadius: 8, background: C.psBg, border: `1px solid ${C.ps}44`, fontSize: 11, color: C.ps, lineHeight: 1.5 }}>
            {spBracket && rootCount === 3 && "SPs on opposite sides = 3 roots. The converse of step III holds here."}
            {spBracket && rootCount !== 3 && "SPs on opposite sides - check the graph carefully."}
            {!spBracket && rootCount === 3 && "SPs same side but still 3 roots - unusual configuration."}
            {!spBracket && rootCount < 3 && "SPs on the same side, fewer than 3 roots. Try making them bracket the axis."}
          </div>
        </div>
      </div>
      {/* Preset buttons */}
      <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: C.muted, alignSelf: "center", marginRight: 4 }}>Presets:</span>
        {[
          { label: "SPs bracket axis, 3 roots", a: -3, b: 2 },
          { label: "SPs same side, 1 root", a: -1, b: 3 },
          { label: "SPs same side, 1 root (neg b)", a: 2, b: -5 },
          { label: "Near boundary", a: -3, b: 4 },
        ].map((p, i) => (
          <button key={i} onClick={() => { setAVal(p.a); setBVal(p.b); }}
            style={{ padding: "5px 10px", borderRadius: 6, border: `1px solid ${C.border}`, background: "#1e2030", color: C.text, fontSize: 11, cursor: "pointer" }}>
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}


/* ───── Option Card ───── */
function OptionCard({ o, expanded, animate, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: expanded ? (o.ok ? C.conclBg : C.failBg) : C.card,
      border: `1px solid ${expanded ? (o.ok ? C.ok : C.fail) + "55" : C.border}`,
      borderLeft: expanded ? `4px solid ${o.ok ? C.ok : C.fail}` : `1px solid ${C.border}`,
      borderRadius: 10, padding: "12px 16px", cursor: "pointer",
      transition: "all 0.3s ease", opacity: animate ? 1 : 0,
      transform: animate ? "translateY(0)" : "translateY(12px)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: expanded ? (o.ok ? C.ok + "22" : C.fail + "22") : C.accent + "22", border: `1.5px solid ${expanded ? (o.ok ? C.ok : C.fail) : C.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: expanded ? (o.ok ? C.ok : C.fail) : C.accent, flexShrink: 0 }}>{o.letter}</div>
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
  { letter: "A", text: "It is a completely correct solution.", ok: false,
    expl: "Step III states the implication in the wrong direction. The proof chain is broken." },
  { letter: "B", text: "The student has instead proved the converse of the statement in the question.", ok: false,
    expl: "The converse would be: \"3 distinct roots implies the condition.\" The student's steps I and II go in the forward direction (condition to opposite signs), so this is not a proof of the converse overall." },
  { letter: "C", text: "The solution is wrong, because the student should have stated step II after step III.", ok: false,
    expl: "Reordering steps II and III would not fix the error. Step III still states the implication in the wrong direction regardless of where it appears." },
  { letter: "D", text: "The solution is wrong, because the student should have shown the converse of the result in step II.", ok: false,
    expl: "Step II is correct as written. The condition does imply opposite signs. No converse is needed here." },
  { letter: "E", text: "The solution is wrong, because the student should have shown the converse of the result in step III.", ok: true,
    expl: "Step III says \"3 roots \u21D2 one SP above, one below.\" The proof needs the converse: \"one SP above, one below \u21D2 3 roots.\" This is the missing link that would complete the chain from the condition to three distinct roots." },
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
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: bodyFont, letterSpacing: 0.2, padding: "24px 16px" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ background: `linear-gradient(135deg,${C.accent},${C.accentLight})`, borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: C.white, letterSpacing: 1 }}>TMUA</span>
            <span style={{ fontSize: 12, color: C.muted }}>Paper 2</span>
            <span style={{ fontSize: 12, color: C.muted }}>{"\u00B7"}</span>
            <span style={{ fontSize: 12, color: C.ps }}>Proof Analysis</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TMUA 2022 {"\u00B7"} Paper 2 {"\u00B7"} Question 17</p>
        </div>

        {/* Step buttons */}
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

        {/* Step title */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span style={{ background: C.accent, borderRadius: 6, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: C.white }}>{step + 1}</span>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: C.white, margin: 0 }}>{stepsMeta[step].title}</h2>
        </div>

        {/* Step 0: Read */}
        {step === 0 && (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question 17</span>
            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: "0 0 10px" }}>A student answered the following question:</p>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", marginBottom: 14 }}>
                <p style={{ margin: "0 0 6px", fontStyle: "italic", color: C.muted, fontSize: 13 }}>a and b are non-zero real numbers. Prove that the equation</p>
                <div style={{ textAlign: "center", fontFamily: mathFont, fontSize: 16, margin: "8px 0" }}>
                  x{"\u00B3"} + ax{"\u00B2"} + b = 0
                </div>
                <p style={{ margin: "0 0 4px", fontStyle: "italic", color: C.muted, fontSize: 13 }}>has three distinct real roots if</p>
                <div style={{ textAlign: "center", fontFamily: mathFont, fontSize: 16, margin: "8px 0" }}>
                  27b(b + 4a{"\u00B3"}/27) {"<"} 0
                </div>
              </div>
              <p style={{ margin: "0 0 8px", fontWeight: 600, color: C.white }}>The student's solution:</p>
              <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, lineHeight: 2.2, fontFamily: mathFont }}>
                <div style={{ marginBottom: 10 }}>
                  <span style={{ fontWeight: 700, color: C.ps, fontFamily: bodyFont, fontSize: 12 }}>I</span>{" "}
                  <span style={{ color: C.text }}>Differentiate y = x{"\u00B3"} + ax{"\u00B2"} + b to get dy/dx = 3x{"\u00B2"} + 2ax = x(3x + 2a).</span>
                  <br/>
                  <span style={{ color: C.text }}>Stationary points at (0, b) and (-2a/3, b + 4a{"\u00B3"}/27).</span>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <span style={{ fontWeight: 700, color: C.ps, fontFamily: bodyFont, fontSize: 12 }}>II</span>{" "}
                  <span style={{ color: C.text }}>If 27b(b + 4a{"\u00B3"}/27) {"<"} 0, then b and b + 4a{"\u00B3"}/27 have opposite signs, so one SP is above and one is below the x-axis.</span>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <span style={{ fontWeight: 700, color: C.fail, fontFamily: bodyFont, fontSize: 12 }}>III</span>{" "}
                  <span style={{ color: C.text }}>If the cubic has three distinct real roots, then one of the stationary points is above the x-axis and one is below.</span>
                </div>
                <div>
                  <span style={{ fontWeight: 700, color: C.ps, fontFamily: bodyFont, fontSize: 12 }}>IV</span>{" "}
                  <span style={{ color: C.text }}>Hence if 27b(b + 4a{"\u00B3"}/27) {"<"} 0, then the equation has three distinct real roots.</span>
                </div>
              </div>
              <p style={{ margin: "14px 0 0", fontSize: 14, color: C.assum }}>Which option best describes the student's solution?</p>
            </div>
          </div>
        )}

        {/* Step 1: Setup */}
        {step === 1 && (
          <>
            <QuestionSummary />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>What type of question is this?</span>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 10px" }}>
                This is a <strong style={{ color: C.assum }}>proof analysis</strong> question. We are not asked to solve the cubic ourselves. Instead, we must read the student's four-step proof and decide whether the logic is valid.
              </p>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 10px" }}>
                The question asks to prove: <strong style={{ color: C.ps }}>condition {"\u21D2"} three distinct roots</strong>. For a valid proof, each step must follow logically from the previous one, building a chain from the condition to the conclusion.
              </p>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 0" }}>
                A common error in proofs is <strong style={{ color: C.fail }}>reversing the direction of an implication</strong>. If you need "A implies B" but instead state "B implies A", the proof breaks down - even if "B implies A" is a true statement.
              </p>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>STRATEGY</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Check each step of the student's proof. For each implication, ask: does the arrow point the right way? Map out the chain the proof needs and see if the student's steps build that chain.</p>
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
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  Use the sliders to set the turning points on <strong style={{ color: C.sp }}>opposite sides</strong> of the x-axis (one y-value positive, one negative). Count the roots. Can you ever get the SPs to bracket the axis without having exactly 3 roots? This is the converse of step III - and it is actually true, which is why the proof <em>would</em> work if the student had stated it the right way round.
                </p>
              </div>
            </div>
            <CubicExplorer />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 20px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.assumBg, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.assum, fontWeight: 700, whiteSpace: "nowrap" }}>WHY IT WORKS</span>
                <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, margin: 0 }}>If one turning point is above the x-axis and the other is below, the cubic must cross the axis three times: once before the first turning point, once between them, and once after the second. This is the converse of step III. It is true, and it is what the student needed to write to complete the proof.</p>
              </div>
            </div>
          </>
        )}

        {/* Step 4: Answer */}
        {step === 4 && (
          <>
            <QuestionSummary />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6, fontStyle: "italic" }}>"Which one of the following options best describes the student's solution?"</div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Proof analysis</span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
                {[
                  { n: "I", lbl: "Differentiation", sub: "Correct", col: C.ok },
                  { n: "II", lbl: "Opposite signs", sub: "Correct", col: C.ok },
                  { n: "III", lbl: "Wrong direction", sub: "Needs converse", col: C.fail },
                  { n: "IV", lbl: "Does not follow", sub: "Chain broken", col: C.fail },
                ].map(v => (
                  <div key={v.n} style={{ background: v.col + "12", borderRadius: 8, padding: "10px 8px", textAlign: "center" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: v.col, marginBottom: 4 }}>{v.n}</div>
                    <div style={{ fontSize: 10, color: v.col }}>{v.lbl}</div>
                    <div style={{ fontSize: 10, color: v.col }}>{v.sub}</div>
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

        {/* Navigation */}
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
