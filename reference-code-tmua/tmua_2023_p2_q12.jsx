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
  curve: "#a29bfe", pLine: "#fd79a8", root: "#55efc4",
};
const mathFont = "'Cambria Math','Latin Modern Math','STIX Two Math',Georgia,serif";
const bodyFont = "'Gill Sans','Trebuchet MS',Calibri,sans-serif";

const stepsMeta = [
  { id: 0, label: "Read", title: "Read the Question" },
  { id: 1, label: "Setup", title: "Identify the Approach" },
  { id: 2, label: "Solve", title: "Find n for Each p" },
  { id: 3, label: "Verify", title: "Explore Different p Values" },
  { id: 4, label: "Answer", title: "Confirm the Answer" },
];

function QuestionSummary() {
  return (
    <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 18px", marginBottom: 16, textAlign: "center" }}>
      <p style={{ margin: "0 0 6px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
        <span style={{ fontWeight: 700, color: C.muted, letterSpacing: 0.5, marginRight: 6 }}>Q12</span>
        sin x cos{"\u00B2"}x = p{"\u00B2"} sin x has n distinct solutions in 0 {"\u2264"} x {"\u2264"} 2{"\u03C0"}.{" "}
        Which statements <strong style={{ color: C.assum }}>are true</strong>?
      </p>
      <div style={{ fontSize: 12, color: C.text, lineHeight: 1.8, marginBottom: 6, fontFamily: mathFont }}>
        <div>I: n = 3 is <strong>sufficient</strong> for p {">"} 1</div>
        <div>II: n = 7 <strong>only if</strong> -1 {"<"} p {"<"} 1</div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, fontSize: 10, fontWeight: 600, color: C.muted, flexWrap: "wrap" }}>
        <span>A: none</span><span>B: I only</span><span>C: II only</span><span>D: I and II</span>
      </div>
    </div>
  );
}

/* ───── Solution count for given p ───── */
function countSolutions(p) {
  const absP = Math.abs(p);
  if (absP > 1) return 3; // only sin x = 0
  if (absP === 1) return 3; // cos x = +-1 coincides with sin x = 0 solutions
  if (absP === 0) return 5; // cos x = 0 gives 2 extra
  // 0 < |p| < 1: cos x = +-p gives 4 extra solutions
  return 7;
}

/* ───── Intersection Graph ─────
   Shows y = sin x cos^2 x and y = p^2 sin x on [0, 2pi].
   Highlights roots of the equation.
*/
function IntersectionGraph({ pVal, showRoots, compact }) {
  const mL = compact ? 28 : 40, mR = compact ? 14 : 20;
  const mT = compact ? 12 : 16, mB = compact ? 22 : 28;
  const pW = compact ? 220 : 370, pH = compact ? 130 : 200;
  const w = mL + pW + mR, h = mT + pH + mB;

  const xMinM = 0, xMaxM = 2 * Math.PI;

  // Dynamic y-range: fit both curves
  const p2 = pVal * pVal;
  const rhsAmp = p2; // p^2 sin x oscillates between -p^2 and p^2
  const lhsAmp = 0.4; // sin x cos^2 x max is about 0.385
  const amp = Math.max(lhsAmp, rhsAmp, 0.5);
  const yMinM = -amp - amp * 0.15;
  const yMaxM = amp + amp * 0.15;

  const toSx = (x) => mL + ((x - xMinM) / (xMaxM - xMinM)) * pW;
  const toSy = (y) => mT + ((yMaxM - y) / (yMaxM - yMinM)) * pH;
  const sfs = compact ? 7 : 9;
  const textRectW = (str, fs) => str.length * fs * 0.62 + (compact ? 6 : 10);

  const N = 600;

  // Build polyline segments with proper breaking at y-range boundaries
  const buildSegments = (evalFn) => {
    const segments = [];
    let seg = [];
    for (let i = 0; i <= N; i++) {
      const x = xMinM + (xMaxM - xMinM) * i / N;
      const y = evalFn(x);
      if (y >= yMinM && y <= yMaxM && isFinite(y)) {
        seg.push(`${toSx(x).toFixed(1)},${toSy(y).toFixed(1)}`);
      } else {
        if (seg.length > 1) segments.push(seg);
        seg = [];
      }
    }
    if (seg.length > 1) segments.push(seg);
    return segments;
  };

  const lhsSegments = buildSegments(x => Math.sin(x) * Math.cos(x) ** 2);
  const rhsSegments = buildSegments(x => p2 * Math.sin(x));

  // Find intersections numerically
  const roots = [];
  if (showRoots) {
    for (let i = 0; i < N; i++) {
      const x1 = xMinM + (xMaxM - xMinM) * i / N;
      const x2 = xMinM + (xMaxM - xMinM) * (i + 1) / N;
      const d1 = Math.sin(x1) * Math.cos(x1) ** 2 - p2 * Math.sin(x1);
      const d2 = Math.sin(x2) * Math.cos(x2) ** 2 - p2 * Math.sin(x2);
      if (d1 * d2 < 0) {
        let lo = x1, hi = x2;
        for (let j = 0; j < 30; j++) {
          const mid = (lo + hi) / 2;
          const dm = Math.sin(mid) * Math.cos(mid) ** 2 - p2 * Math.sin(mid);
          if (dm * d1 < 0) hi = mid; else lo = mid;
        }
        roots.push((lo + hi) / 2);
      }
    }
    // Also check exact roots at 0, pi, 2pi (sin x = 0)
    [0, Math.PI, 2 * Math.PI].forEach(x => {
      if (!roots.some(r => Math.abs(r - x) < 0.05)) roots.push(x);
    });
    // cos x = p => x = acos(p) if |p| <= 1
    if (Math.abs(pVal) <= 1 && pVal !== 0) {
      const a1 = Math.acos(pVal);
      const a2 = 2 * Math.PI - a1;
      [a1, a2].forEach(x => { if (x >= 0 && x <= 2 * Math.PI && !roots.some(r => Math.abs(r - x) < 0.05)) roots.push(x); });
      const a3 = Math.acos(-pVal);
      const a4 = 2 * Math.PI - a3;
      [a3, a4].forEach(x => { if (x >= 0 && x <= 2 * Math.PI && !roots.some(r => Math.abs(r - x) < 0.05)) roots.push(x); });
    }
    // cos x = 0 when p = 0
    if (Math.abs(pVal) < 0.01) {
      [Math.PI / 2, 3 * Math.PI / 2].forEach(x => {
        if (!roots.some(r => Math.abs(r - x) < 0.05)) roots.push(x);
      });
    }
    roots.sort((a, b) => a - b);
  }

  // Grid - adaptive
  const yGridVals = [];
  const rawStep = (yMaxM - yMinM) / (compact ? 4 : 6);
  const yStep = [0.1, 0.2, 0.5, 1, 2, 5].find(s => s >= rawStep) || Math.ceil(rawStep);
  for (let v = Math.ceil(yMinM / yStep) * yStep; v <= yMaxM; v += yStep) yGridVals.push(v);

  const xPiVals = [
    { x: 0, label: "0" }, { x: Math.PI / 2, label: "\u03C0/2" },
    { x: Math.PI, label: "\u03C0" }, { x: 3 * Math.PI / 2, label: "3\u03C0/2" },
    { x: 2 * Math.PI, label: "2\u03C0" },
  ];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", display: "block" }}>
      {yGridVals.map(v => (
        <g key={"yg" + v}>
          <line x1={mL} y1={toSy(v)} x2={mL + pW} y2={toSy(v)}
            stroke={v === 0 ? C.muted : C.border} strokeWidth={v === 0 ? 0.8 : 0.5}
            strokeDasharray={v === 0 ? "none" : "4,4"} opacity={v === 0 ? 0.5 : 0.3} />
          {!compact && <text x={mL - 5} y={toSy(v) + 3} fill={C.muted} fontSize={sfs - 1} textAnchor="end" opacity={0.6} fontFamily={mathFont}>{Math.abs(v) < 0.001 ? "0" : v.toFixed(1)}</text>}
        </g>
      ))}
      {xPiVals.map(v => (
        <g key={"xg" + v.label}>
          <line x1={toSx(v.x)} y1={mT} x2={toSx(v.x)} y2={mT + pH}
            stroke={C.border} strokeWidth={0.5} strokeDasharray="4,4" opacity={0.3} />
          <text x={toSx(v.x)} y={mT + pH + (compact ? 12 : 16)} fill={C.muted} fontSize={sfs - 1}
            textAnchor="middle" opacity={0.6} fontFamily={mathFont}>{v.label}</text>
        </g>
      ))}
      {/* LHS curve: sin x cos^2 x */}
      {lhsSegments.map((seg, i) => (
        <polyline key={"lhs" + i} points={seg.join(" ")} fill="none" stroke={C.curve} strokeWidth={compact ? 1.5 : 2} />
      ))}
      {/* RHS curve: p^2 sin x */}
      {rhsSegments.map((seg, i) => (
        <polyline key={"rhs" + i} points={seg.join(" ")} fill="none" stroke={C.pLine} strokeWidth={compact ? 1.5 : 2} strokeDasharray="6,3" />
      ))}
      {/* Roots */}
      {showRoots && roots.map((r, i) => (
        <circle key={i} cx={toSx(r)} cy={toSy(0)} r={compact ? 3 : 4} fill={C.root} stroke={C.bg} strokeWidth={1.2} />
      ))}
      {/* Legend */}
      <g>
        <rect x={mL + pW - (compact ? 110 : 160)} y={mT + 2} width={compact ? 108 : 156} height={compact ? 24 : 30} rx={4} fill={C.bg} fillOpacity={0.92} />
        <line x1={mL + pW - (compact ? 106 : 154)} y1={mT + (compact ? 10 : 12)} x2={mL + pW - (compact ? 90 : 134)} y2={mT + (compact ? 10 : 12)} stroke={C.curve} strokeWidth={1.5} />
        <text x={mL + pW - (compact ? 86 : 130)} y={mT + (compact ? 13 : 15)} fill={C.curve} fontSize={compact ? 6 : 8} fontFamily={mathFont}>sin x cos{"\u00B2"}x</text>
        <line x1={mL + pW - (compact ? 106 : 154)} y1={mT + (compact ? 20 : 24)} x2={mL + pW - (compact ? 90 : 134)} y2={mT + (compact ? 20 : 24)} stroke={C.pLine} strokeWidth={1.5} strokeDasharray="4,2" />
        <text x={mL + pW - (compact ? 86 : 130)} y={mT + (compact ? 23 : 27)} fill={C.pLine} fontSize={compact ? 6 : 8} fontFamily={mathFont}>p{"\u00B2"} sin x</text>
      </g>
    </svg>
  );
}


/* ───── Solve Step ───── */
function SolveStep() {
  const [revealed, setRevealed] = useState(0);
  const steps = [
    {
      label: "Factor the equation",
      text: <span>Rearrange sin x cos{"\u00B2"}x = p{"\u00B2"} sin x to get everything on one side, then factor out sin x.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>sin x cos{"\u00B2"}x - p{"\u00B2"} sin x = 0</span>
          <span>sin x (cos{"\u00B2"}x - p{"\u00B2"}) = 0</span>
          <span style={{ color: C.ps }}>So sin x = 0 or cos{"\u00B2"}x = p{"\u00B2"} (i.e. cos x = {"\u00B1"}p)</span>
        </div>
      ),
      color: C.ps,
    },
    {
      label: "Count solutions from sin x = 0",
      text: <span>sin x = 0 gives x = 0, {"\u03C0"}, 2{"\u03C0"} in [0, 2{"\u03C0"}]. That is 3 solutions, present for every value of p.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>sin x = 0: x = 0, {"\u03C0"}, 2{"\u03C0"}</span>
          <span style={{ color: C.assum }}>3 solutions (always)</span>
        </div>
      ),
      color: C.assum,
    },
    {
      label: "Count solutions from cos x = \u00B1p",
      text: <span>cos x = {"\u00B1"}p has solutions only when |p| {"\u2264"} 1. If p = 0, cos x = 0 gives 2 extra solutions. If 0 {"<"} |p| {"<"} 1, cos x = p gives 2 solutions and cos x = -p gives 2 more (4 extra, all distinct from sin x = 0). If |p| = 1, cos x = {"\u00B1"}1 coincides with sin x = 0 (no new solutions). If |p| {">"} 1, no solutions.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>|p| {">"} 1: no extra solutions {"\u2192"} n = 3</span>
          <span>|p| = 1: cos x = {"\u00B1"}1 already counted {"\u2192"} n = 3</span>
          <span>p = 0: cos x = 0 gives 2 extra {"\u2192"} n = 5</span>
          <span style={{ color: C.ok }}>0 {"<"} |p| {"<"} 1: 4 extra solutions {"\u2192"} n = 7</span>
        </div>
      ),
      color: C.ok,
    },
    {
      label: "Test each statement",
      text: <span>Now read off the truth of each statement from the classification.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ color: C.fail }}>I: "n=3 sufficient for p{">"} 1" means "n=3 {"\u21D2"} p{">"} 1"</span>
          <span style={{ color: C.fail }}>False: n=3 when p=1 or p{"\u2264"}-1 too</span>
          <span style={{ marginTop: 4, color: C.ok }}>II: "n=7 only if -1{"<"}p{"<"}1" means "n=7 {"\u21D2"} -1{"<"}p{"<"}1"</span>
          <span style={{ color: C.ok }}>True: n=7 requires 0{"<"}|p|{"<"}1, which is inside (-1,1)</span>
        </div>
      ),
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
                <p style={{ margin: "0 0 6px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{s.text}</p>
                <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 15, color: C.white, fontFamily: mathFont, textAlign: "center", letterSpacing: 0.5, lineHeight: 2 }}>{s.math}</div>
                {i === steps.length - 1 && (
                  <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: C.conclBg, border: `1px solid ${C.ok}44`, fontSize: 13.5, color: C.ok, fontWeight: 600, lineHeight: 1.5 }}>
                    Only statement II is true. The answer is C.
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


/* ───── Verify: p Explorer ─────
   Slider for p. Shows intersection graph + solution count + arrow-notation logic checker.
*/
function PExplorer() {
  const [pVal, setPVal] = useState(0.5);
  const n = countSolutions(pVal);
  const absP = Math.abs(pVal);

  // Statement truth values
  const nIs3 = n === 3;
  const pGt1 = pVal > 1.01;
  const nIs7 = n === 7;
  const pIn = absP < 0.99; // -1 < p < 1

  const statements = [
    {
      num: "I",
      left: { label: "n = 3", value: nIs3 },
      right: { label: "p > 1", value: pGt1 },
      desc: "\"n = 3 is sufficient for p > 1\"",
    },
    {
      num: "II",
      left: { label: "n = 7", value: nIs7 },
      right: { label: "-1 < p < 1", value: pIn },
      desc: "\"n = 7 only if -1 < p < 1\"",
    },
  ];

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 20px", marginBottom: 18 }}>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {/* Left: Graph */}
        <div style={{ flex: "1 1 340px", minWidth: 280 }}>
          <IntersectionGraph pVal={pVal} showRoots />
        </div>
        {/* Right: Controls + Status */}
        <div style={{ flex: "0 0 250px", minWidth: 220 }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.text, marginBottom: 4 }}>
              <span style={{ fontFamily: mathFont }}>p = {pVal.toFixed(2)}</span>
            </div>
            <input type="range" min={-2} max={2} step={0.01} value={pVal}
              onChange={e => setPVal(+e.target.value)} style={{ width: "100%", height: 6, borderRadius: 3, cursor: "pointer", accentColor: C.pLine, background: C.border }} />
          </div>
          {/* n value */}
          <div style={{ padding: "10px 12px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}`, marginBottom: 12, textAlign: "center" }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Distinct solutions (n)</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: C.ok, fontFamily: mathFont }}>{n}</div>
            <div style={{ fontSize: 11, color: C.muted }}>
              {absP > 1 && "| p| > 1: only sin x = 0"}
              {absP === 1 && "| p| = 1: cos x = \u00B11 coincides"}
              {absP === 0 && "p = 0: cos x = 0 adds 2"}
              {absP > 0 && absP < 1 && "0 < |p| < 1: cos x = \u00B1p adds 4"}
            </div>
          </div>
          {/* Arrow-notation logic checker */}
          {statements.map(s => {
            const leftTrue = s.left.value;
            const rightTrue = s.right.value;
            const violated = leftTrue && !rightTrue;
            const tested = leftTrue;
            const arrowColor = !tested ? C.muted : violated ? C.fail : C.ok;

            return (
              <div key={s.num} style={{ marginBottom: 8, padding: "10px 12px", borderRadius: 8, background: violated ? C.fail + "08" : tested && !violated ? C.ok + "06" : "transparent", border: `1px solid ${violated ? C.fail + "33" : C.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.white, marginRight: 8, minWidth: 14 }}>{s.num}</span>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 8px", borderRadius: 5, border: `1.5px solid ${leftTrue ? C.ok : C.muted}44`, background: leftTrue ? C.ok + "10" : "transparent", marginRight: 6 }}>
                    <span style={{ fontSize: 11, color: leftTrue ? C.ok : C.muted, fontFamily: mathFont }}>{s.left.label}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: leftTrue ? C.ok : C.muted }}>{leftTrue ? "\u2713" : "\u2717"}</span>
                  </div>
                  <span style={{ fontSize: 16, color: arrowColor, fontWeight: 700, margin: "0 4px" }}>{"\u2192"}</span>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 8px", borderRadius: 5, border: `1.5px solid ${rightTrue ? C.ok : tested ? C.fail : C.muted}44`, background: rightTrue ? C.ok + "10" : tested ? C.fail + "10" : "transparent" }}>
                    <span style={{ fontSize: 11, color: rightTrue ? C.ok : tested ? C.fail : C.muted, fontFamily: mathFont }}>{s.right.label}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: rightTrue ? C.ok : tested ? C.fail : C.muted }}>{rightTrue ? "\u2713" : "\u2717"}</span>
                  </div>
                </div>
                <div style={{ fontSize: 10, marginLeft: 22 }}>
                  {!tested ? (
                    <span style={{ color: C.muted }}>Left side false - not a useful test for this p</span>
                  ) : violated ? (
                    <span style={{ color: C.fail, fontWeight: 700 }}>VIOLATED: left true but right false - counterexample</span>
                  ) : (
                    <span style={{ color: C.ok }}>Consistent: both sides agree</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Presets */}
      <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: C.muted, alignSelf: "center", marginRight: 4 }}>Presets:</span>
        {[
          { label: "n=7 (p=0.5)", p: 0.5 },
          { label: "n=5 (p=0)", p: 0 },
          { label: "n=3 (p=1)", p: 1 },
          { label: "n=3 (p=1.5)", p: 1.5 },
          { label: "I fails (p=-2)", p: -2 },
        ].map((pr, i) => (
          <button key={i} onClick={() => setPVal(pr.p)}
            style={{ padding: "5px 10px", borderRadius: 6, border: `1px solid ${C.border}`, background: "#1e2030", color: C.text, fontSize: 11, cursor: "pointer" }}>
            {pr.label}
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
  { letter: "A", text: "None of them", ok: false, expl: "Statement II is true. n = 7 only occurs when 0 < |p| < 1, which lies inside -1 < p < 1." },
  { letter: "B", text: "I only", ok: false, expl: "Statement I is false. n = 3 when p = 1 or p \u2264 -1, not just p > 1. For example p = -2 gives n = 3." },
  { letter: "C", text: "II only", ok: true, expl: "n = 7 requires 0 < |p| < 1, so -1 < p < 1 must hold. Statement I fails because n = 3 occurs for p = 1 and p \u2264 -1, not only p > 1." },
  { letter: "D", text: "I and II", ok: false, expl: "Statement I is false. \"n = 3 is sufficient for p > 1\" means n = 3 \u21D2 p > 1, but p = -2 gives n = 3 with p < 1." },
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
            <span style={{ fontSize: 12, color: C.ps }}>Trigonometry and Logic</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TMUA 2023 {"\u00B7"} Paper 2 {"\u00B7"} Question 12</p>
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
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question 12</span>
            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: "0 0 8px" }}>In this question, p is a real constant.</p>
              <p style={{ margin: "0 0 8px" }}>The equation</p>
              <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 18px", textAlign: "center", fontFamily: mathFont, fontSize: 16, margin: "8px 0 12px" }}>
                sin x cos{"\u00B2"}x = p{"\u00B2"} sin x
              </div>
              <p style={{ margin: "0 0 8px" }}>has n distinct solutions in the range 0 {"\u2264"} x {"\u2264"} 2{"\u03C0"}.</p>
              <p style={{ margin: "0 0 6px" }}>Which of the following statements is/are true?</p>
              <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 18px", fontSize: 14, lineHeight: 2.2, fontFamily: mathFont }}>
                <div><span style={{ fontWeight: 700, color: C.ps, fontFamily: bodyFont, fontSize: 12 }}>I</span>{" "} n = 3 is <strong>sufficient</strong> for p {">"} 1</div>
                <div><span style={{ fontWeight: 700, color: C.ps, fontFamily: bodyFont, fontSize: 12 }}>II</span>{" "} n = 7 <strong>only if</strong> -1 {"<"} p {"<"} 1</div>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Setup */}
        {step === 1 && (
          <>
            <QuestionSummary />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Translate the logic</span>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 10px" }}>
                <strong style={{ color: C.ps }}>I:</strong> "n = 3 is <strong>sufficient</strong> for p {">"} 1" means: if n = 3, then p {">"} 1. (Sufficient = hypothesis of an implication.)
              </p>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 10px" }}>
                <strong style={{ color: C.ps }}>II:</strong> "n = 7 <strong>only if</strong> -1 {"<"} p {"<"} 1" means: if n = 7, then -1 {"<"} p {"<"} 1. ("A only if B" = "if A then B".)
              </p>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 0" }}>
                To test these, we need to work out exactly which values of p give n = 3 and n = 7. The trig equation can be factored.
              </p>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>STRATEGY</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Factor the equation into sin x = 0 or cos x = {"\u00B1"}p. Count distinct solutions in [0, 2{"\u03C0"}] for each case of p, then check the two implications.</p>
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
                  Slide p and watch the intersection count change. Try to violate statement I by finding n = 3 with p {"\u2264"} 1. Try to violate statement II by finding n = 7 outside (-1, 1). The arrow notation below shows live truth values.
                </p>
              </div>
            </div>
            <PExplorer />
          </>
        )}

        {/* Step 4: Answer */}
        {step === 4 && (
          <>
            <QuestionSummary />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6, fontStyle: "italic" }}>"Which of the following statements is/are true?"</div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Verdict</span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ background: C.fail + "12", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.fail, marginBottom: 4 }}>I: False</div>
                  <div style={{ fontSize: 11, color: C.fail }}>n = 3 when p = 1 or p {"\u2264"} -1</div>
                  <div style={{ fontSize: 11, color: C.fail }}>Not just p {">"} 1</div>
                </div>
                <div style={{ background: C.ok + "12", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.ok, marginBottom: 4 }}>II: True</div>
                  <div style={{ fontSize: 11, color: C.ok }}>n = 7 requires 0 {"<"} |p| {"<"} 1</div>
                  <div style={{ fontSize: 11, color: C.ok }}>Always inside (-1, 1)</div>
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
