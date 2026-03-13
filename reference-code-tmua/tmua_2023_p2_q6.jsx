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
};
const mathFont = "'Cambria Math','Latin Modern Math','STIX Two Math',Georgia,serif";

const stepsMeta = [
  { id: 0, label: "Read", title: "Read the Question" },
  { id: 1, label: "Setup", title: "Identify the Approach" },
  { id: 2, label: "Solve", title: "Test Each Equation" },
  { id: 3, label: "Verify", title: "Check with a Specific a" },
  { id: 4, label: "Answer", title: "Confirm the Answer" },
];

function QuestionSummary() {
  return (
    <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 18px", marginBottom: 16, textAlign: "center" }}>
      <p style={{ margin: "0 0 6px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
        <span style={{ fontWeight: 700, color: C.muted, letterSpacing: 0.5, marginRight: 6 }}>Q6</span>
        (*) a<sup>x</sup> = x, where a {">"} 1. Which equations <strong style={{ color: C.assum }}>must have the same number</strong> of real solutions?
      </p>
      <div style={{ fontSize: 12, color: C.text, lineHeight: 1.8, marginBottom: 6, fontFamily: mathFont }}>
        <span>I: log<sub>a</sub> x = x</span><span style={{ margin: "0 12px", color: C.border }}>|</span>
        <span>II: a<sup>2x</sup> = x{"\u00B2"}</span><span style={{ margin: "0 12px", color: C.border }}>|</span>
        <span>III: a<sup>2x</sup> = 2x</span>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, fontSize: 10, fontWeight: 600, color: C.muted, flexWrap: "wrap" }}>
        <span>A: none</span><span>B: I</span><span>C: II</span><span>D: III</span><span>E: I,II</span><span>F: I,III</span><span>G: II,III</span><span>H: all</span>
      </div>
    </div>
  );
}

/* ───── Intersection Graph ─────
   Shows two curves and highlights their intersection points.
   eq: "star" | "I" | "II" | "III"
*/
function IntersectionGraph({ eq, aVal, compact }) {
  const mL = compact ? 28 : 40, mR = compact ? 16 : 24;
  const mT = compact ? 12 : 16, mB = compact ? 22 : 28;
  const pW = compact ? 220 : 380, pH = compact ? 140 : 220;
  const w = mL + pW + mR, h = mT + pH + mB;

  // Math range: adaptive to a value to ensure all intersections visible
  // For a close to 1, intersections of a^x=x can be very far right
  const farX = Math.max(5, 4 / Math.log(aVal) + 2);
  const xMinM = eq === "II" ? -3 : -1;
  const xMaxM = eq === "II" ? Math.max(4, farX * 0.5) : farX;
  const yMinM = eq === "II" ? -1 : -1;
  const yMaxM = eq === "II" ? Math.max(8, xMaxM * xMaxM * 0.3) : Math.max(5, xMaxM + 1);

  const toSx = (x) => mL + ((x - xMinM) / (xMaxM - xMinM)) * pW;
  const toSy = (y) => mT + ((yMaxM - y) / (yMaxM - yMinM)) * pH;
  const sfs = compact ? 7 : 9;
  const textRectW = (str, fs) => str.length * fs * 0.65 + (compact ? 6 : 10);

  // Define the two curves for each equation
  let f1, f2, label1, label2, col1, col2;
  if (eq === "star") {
    f1 = (x) => Math.pow(aVal, x); f2 = (x) => x;
    label1 = "a\u02E3"; label2 = "x"; col1 = C.accent; col2 = C.calc;
  } else if (eq === "I") {
    f1 = (x) => x > 0 ? Math.log(x) / Math.log(aVal) : NaN; f2 = (x) => x;
    label1 = "log\u2090 x"; label2 = "x"; col1 = C.ok; col2 = C.calc;
  } else if (eq === "II") {
    f1 = (x) => Math.pow(aVal, 2 * x); f2 = (x) => x * x;
    label1 = "a\u00B2\u02E3"; label2 = "x\u00B2"; col1 = C.fail; col2 = C.calc;
  } else {
    f1 = (x) => Math.pow(aVal, 2 * x); f2 = (x) => 2 * x;
    label1 = "a\u00B2\u02E3"; label2 = "2x"; col1 = C.ok; col2 = C.calc;
  }

  const N = 400;
  const buildPath = (f) => {
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const x = xMinM + (xMaxM - xMinM) * i / N;
      const y = f(x);
      // Skip points outside range - don't clamp (prevents flatline)
      if (isFinite(y) && y >= yMinM && y <= yMaxM) {
        pts.push(`${toSx(x).toFixed(1)},${toSy(y).toFixed(1)}`);
      } else {
        // Break the polyline by not adding a point (SVG handles gaps)
      }
    }
    return pts.join(" ");
  };

  const path1 = buildPath(f1);
  const path2 = buildPath(f2);

  // Find intersections (sign changes of f1-f2)
  const intersections = [];
  const step = (xMaxM - xMinM) / 2000;
  let prev = null;
  for (let x = xMinM; x <= xMaxM; x += step) {
    const v = f1(x) - f2(x);
    if (isFinite(v) && prev !== null && isFinite(prev)) {
      if ((v > 0 && prev < 0) || (v < 0 && prev > 0)) {
        // Bisect
        let lo = x - step, hi = x;
        for (let j = 0; j < 20; j++) {
          const mid = (lo + hi) / 2;
          const vm = f1(mid) - f2(mid);
          if ((vm > 0) === (f1(lo) - f2(lo) > 0)) lo = mid; else hi = mid;
        }
        const ix = (lo + hi) / 2;
        intersections.push({ x: ix, y: f2(ix) });
      }
    }
    prev = v;
  }

  // Grid
  const yGridVals = [];
  for (let v = Math.ceil(yMinM); v <= Math.floor(yMaxM); v++) yGridVals.push(v);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", display: "block" }}>
      {/* Gridlines */}
      {yGridVals.map(v => (
        <g key={"yg" + v}>
          <line x1={mL} y1={toSy(v)} x2={mL + pW} y2={toSy(v)}
            stroke={v === 0 ? C.muted : C.border} strokeWidth={v === 0 ? 0.8 : 0.5}
            strokeDasharray={v === 0 ? "none" : "4,4"} opacity={v === 0 ? 0.5 : 0.3} />
          {!compact && <text x={mL - 5} y={toSy(v) + 3} fill={C.muted} fontSize={7} textAnchor="end" opacity={0.5} fontFamily={mathFont}>{v}</text>}
        </g>
      ))}
      {/* Y-axis */}
      <line x1={toSx(0)} y1={mT} x2={toSx(0)} y2={mT + pH} stroke={C.muted} strokeWidth={0.8} opacity={0.4} />
      {/* X-axis */}
      <line x1={mL} y1={toSy(0)} x2={mL + pW} y2={toSy(0)} stroke={C.muted} strokeWidth={0.8} opacity={0.4} />

      {/* Curves */}
      <polyline points={path1} fill="none" stroke={col1} strokeWidth={compact ? 2 : 2.5} opacity={0.9} strokeLinejoin="round" />
      <polyline points={path2} fill="none" stroke={col2} strokeWidth={compact ? 2 : 2.5} opacity={0.9} strokeLinejoin="round" />

      {/* Intersection points */}
      {intersections.map((p, i) => (
        <circle key={i} cx={toSx(p.x)} cy={toSy(p.y)} r={compact ? 4 : 5} fill={C.white} stroke={C.accent} strokeWidth={2} />
      ))}

      {/* Curve labels */}
      {[{ lbl: label1, col: col1, yPos: 0.15 }, { lbl: label2, col: col2, yPos: 0.85 }].map((l, i) => {
        const rw = textRectW(l.lbl, compact ? 8 : 10);
        const lx = mL + pW * l.yPos;
        const ly = mT + 10 + i * (compact ? 14 : 18);
        return (
          <g key={i}>
            <rect x={lx - rw / 2} y={ly - 7} width={rw} height={14} rx={3} fill={C.bg} fillOpacity={0.9} />
            <text x={lx} y={ly + 4} fill={l.col} fontSize={compact ? 8 : 10} fontWeight={700} textAnchor="middle" fontFamily={mathFont}>{l.lbl}</text>
          </g>
        );
      })}

      {/* Solution count badge */}
      {(() => {
        const lbl = `${intersections.length} intersection${intersections.length !== 1 ? "s" : ""}`;
        const rw = textRectW(lbl, compact ? 8 : 9);
        return (
          <g>
            <rect x={mL + pW - rw - 2} y={mT + pH - 16} width={rw} height={14} rx={3}
              fill={C.bg} fillOpacity={0.9} stroke={C.accent} strokeWidth={0.5} strokeOpacity={0.5} />
            <text x={mL + pW - 2 - rw / 2} y={mT + pH - 6} fill={C.white} fontSize={compact ? 8 : 9}
              fontWeight={700} textAnchor="middle" fontFamily="'Gill Sans',sans-serif">{lbl}</text>
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
      label: "Statement I: log_a(x) = x",
      text: <span>Take log base a of both sides of (*). Since a<sup>x</sup> {">"} 0, any solution to (*) has x {">"} 0, so the log is defined.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>a<sup>x</sup> = x</span>
          <span>log<sub>a</sub>(a<sup>x</sup>) = log<sub>a</sub>(x)</span>
          <span>x = log<sub>a</sub>(x)</span>
          <span style={{ color: C.muted, fontSize: 13 }}>Reversible: exponentiating gives back (*)</span>
          <span style={{ color: C.ok }}>I has the same solutions as (*)</span>
        </div>
      ),
      graph: "I",
      color: C.ok,
    },
    {
      label: "Statement II: a^(2x) = x\u00B2",
      text: <span>Squaring both sides of (*) gives a<sup>2x</sup> = x{"\u00B2"}. But squaring can introduce extra solutions: a<sup>2x</sup> = x{"\u00B2"} means (a<sup>x</sup>){"\u00B2"} = x{"\u00B2"}, so a<sup>x</sup> = x or a<sup>x</sup> = -x.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>(a<sup>x</sup>){"\u00B2"} = x{"\u00B2"} means a<sup>x</sup> = {"\u00B1"}x</span>
          <span style={{ color: C.muted, fontSize: 13 }}>a<sup>x</sup> = -x can have solutions when x {"<"} 0</span>
          <span style={{ color: C.muted, fontSize: 13 }}>e.g. a = 4, x = -1/2: a<sup>x</sup> = 1/2, -x = 1/2</span>
          <span style={{ color: C.fail }}>II may have extra solutions. Not guaranteed same.</span>
        </div>
      ),
      graph: "II",
      color: C.fail,
    },
    {
      label: "Statement III: a^(2x) = 2x",
      text: "Substitute u = 2x. Then a\u1D58 = u, which is exactly (*) with u in place of x. Every solution for u gives a unique x = u/2, and vice versa.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>Let u = 2x:</span>
          <span>a<sup>2x</sup> = 2x becomes a<sup>u</sup> = u</span>
          <span style={{ color: C.muted, fontSize: 13 }}>This is exactly (*) with u instead of x</span>
          <span style={{ color: C.muted, fontSize: 13 }}>Each u gives unique x = u/2 (one-to-one)</span>
          <span style={{ color: C.ok }}>III has the same number of solutions as (*)</span>
        </div>
      ),
      graph: "III",
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
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <p style={{ margin: "0 0 8px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{s.text}</p>
                    <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", fontSize: 15, color: C.white, fontFamily: mathFont, textAlign: "center", letterSpacing: 0.5, lineHeight: 2 }}>{s.math}</div>
                  </div>
                  <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px", display: "flex", alignItems: "center" }}>
                    <IntersectionGraph eq={s.graph} aVal={2} compact />
                  </div>
                </div>
                {i === steps.length - 1 && <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: C.conclBg, border: `1px solid ${C.ok}44`, fontSize: 13.5, color: C.ok, fontWeight: 600, lineHeight: 1.5 }}>I and III always have the same number of solutions as (*). The answer is F.</div>}
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
function EquationExplorer() {
  const [aVal, setAVal] = useState(2);

  // Count solutions numerically by scanning for sign changes
  const countSolns = (f, xMin, xMax, N = 2000) => {
    let count = 0;
    let prevSign = null;
    for (let i = 0; i <= N; i++) {
      const x = xMin + (xMax - xMin) * i / N;
      const v = f(x);
      if (!isFinite(v)) { prevSign = null; continue; }
      const sign = v > 0 ? 1 : v < 0 ? -1 : 0;
      if (prevSign !== null && sign !== 0 && prevSign !== 0 && sign !== prevSign) count++;
      prevSign = sign;
    }
    return count;
  };

  // Scan range: for a close to 1, intersections can be very far out
  // e.g. a=1.2: a^x = x has solutions near x≈1.3 and x≈14.3
  const scanMax = Math.max(20, 4 / Math.log(aVal) + 5);
  const scanN = 4000; // high resolution across wide range
  // (*) a^x - x = 0
  const starSolns = countSolns(x => Math.pow(aVal, x) - x, -5, scanMax, scanN);
  // I: log_a(x) - x = 0 (x > 0 only)
  const iSolns = countSolns(x => Math.log(x) / Math.log(aVal) - x, 0.001, scanMax, scanN);
  // II: a^(2x) - x^2 = 0
  const iiSolns = countSolns(x => Math.pow(aVal, 2 * x) - x * x, -5, scanMax, scanN);
  // III: a^(2x) - 2x = 0 (substitute u=2x into *, so scan half the range)
  const iiiSolns = countSolns(x => Math.pow(aVal, 2 * x) - 2 * x, -5, scanMax, scanN);

  const presets = [
    { v: 1.5, l: "a = 1.5" },
    { v: 2, l: "a = 2" },
    { v: Math.E, l: "a = e" },
    { v: 4, l: "a = 4" },
  ];

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Choose a value of a</span>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <input type="range" min={1.1} max={5} step={0.1} value={aVal} onChange={e => setAVal(parseFloat(e.target.value))} style={{ flex: 1, accentColor: C.accent, height: 6 }} />
          <div style={{ minWidth: 80, textAlign: "center" }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: C.accent, fontFamily: mathFont }}>a = {aVal.toFixed(1)}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {presets.map(p => (
            <button key={p.v} onClick={() => setAVal(p.v)} style={{
              flex: 1, padding: "8px 2px", borderRadius: 8, cursor: "pointer",
              border: `2px solid ${Math.abs(aVal - p.v) < 0.05 ? C.accent : C.border}`,
              background: Math.abs(aVal - p.v) < 0.05 ? C.accent + "15" : C.card,
              color: Math.abs(aVal - p.v) < 0.05 ? C.accent : C.muted,
              fontSize: 11, fontWeight: 700,
            }}>{p.l}</button>
          ))}
        </div>
      </div>

      {/* 2x2 graph grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
        {[
          { eq: "star", label: "(*) a\u02E3 = x" },
          { eq: "I", label: "I: log\u2090 x = x" },
          { eq: "II", label: "II: a\u00B2\u02E3 = x\u00B2" },
          { eq: "III", label: "III: a\u00B2\u02E3 = 2x" },
        ].map(g => (
          <div key={g.eq} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "10px 10px 6px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textAlign: "center", marginBottom: 4, fontFamily: mathFont }}>{g.label}</div>
            <IntersectionGraph eq={g.eq} aVal={aVal} compact />
          </div>
        ))}
      </div>

      {/* Solution count table */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 22px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 12 }}>Number of real solutions</span>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
          {[
            { label: <span>(*) a<sup>x</sup> = x</span>, count: starSolns, color: C.accent },
            { label: <span>I: log<sub>a</sub> x = x</span>, count: iSolns, color: iSolns === starSolns ? C.ok : C.fail },
            { label: <span>II: a<sup>2x</sup> = x{"\u00B2"}</span>, count: iiSolns, color: iiSolns === starSolns ? C.ok : C.fail },
            { label: <span>III: a<sup>2x</sup> = 2x</span>, count: iiiSolns, color: iiiSolns === starSolns ? C.ok : C.fail },
          ].map((eq, i) => (
            <div key={i} style={{ background: eq.color + "12", borderRadius: 10, padding: "14px 10px", textAlign: "center", border: `1px solid ${eq.color}33` }}>
              <div style={{ fontSize: 11, color: eq.color, fontWeight: 700, marginBottom: 6, fontFamily: mathFont }}>{eq.label}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: eq.color }}>{eq.count}</div>
              {i > 0 && (
                <div style={{ fontSize: 10, color: eq.count === starSolns ? C.ok : C.fail, marginTop: 4, fontWeight: 600 }}>
                  {eq.count === starSolns ? "Same as (*)" : "Different!"}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Highlight the II counterexample */}
      {iiSolns !== starSolns && (
        <div style={{ background: C.card, border: `1px solid ${C.fail}44`, borderRadius: 14, padding: "14px 18px", marginBottom: 18 }}>
          <p style={{ color: C.fail, fontSize: 13, margin: 0, lineHeight: 1.6 }}>
            <strong>II has {iiSolns} solutions vs (*) has {starSolns}.</strong> The extra solution comes from a<sup>x</sup> = -x (squaring introduced it). For a = {aVal.toFixed(1)}, there is a negative x where a<sup>x</sup> equals -x.
          </p>
        </div>
      )}

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 18px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ background: C.assumBg, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.assum, fontWeight: 700, whiteSpace: "nowrap" }}>HINT</span>
          <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, margin: 0 }}>Try a = 4: (*) has 1 solution, I has 1 (same), II has 2 (extra from squaring), III has 1 (same). The pattern holds for all a {">"} 1: I and III always match (*), but II can differ.</p>
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
  { letter: "A", text: "None of them", ok: false, expl: "I and III both have the same number of solutions as (*) for every a > 1." },
  { letter: "B", text: "I only", ok: false, expl: "I is correct, but III also works. Substituting u = 2x turns III into (*) with a one-to-one change of variable." },
  { letter: "C", text: "II only", ok: false, expl: "II can have extra solutions from squaring. For a = 4, x = -1/2 solves II but not (*)." },
  { letter: "D", text: "III only", ok: false, expl: "III is correct, but I also works. Taking log base a of (*) is reversible since a\u02E3 > 0 forces x > 0." },
  { letter: "E", text: "I and II only", ok: false, expl: "II fails. Squaring a\u02E3 = x gives a\u00B2\u02E3 = x\u00B2, but this also captures solutions to a\u02E3 = -x." },
  { letter: "F", text: "I and III only", ok: true, expl: <span>I: taking log<sub>a</sub> is reversible (a<sup>x</sup> {">"} 0 so x {">"} 0). III: substituting u = 2x gives a<sup>u</sup> = u, which is (*). II fails because squaring introduces a<sup>x</sup> = -x solutions.</span> },
  { letter: "G", text: "II and III only", ok: false, expl: "II fails. I works because log base a is the inverse of exponentiation, and the domain restriction (x > 0) is automatically satisfied." },
  { letter: "H", text: "I, II and III", ok: false, expl: "II does not always have the same number. Squaring is not a reversible operation - it can introduce spurious solutions from a\u02E3 = -x." },
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
            <span style={{ fontSize: 12, color: C.ps }}>Equations and Transformations</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TMUA 2023 {"\u00B7"} Paper 2 {"\u00B7"} Question 6</p>
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
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question 6</span>
            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: "0 0 8px" }}>Consider the following equation where a is a real number and a {">"} 1:</p>
              <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", textAlign: "center", fontFamily: mathFont, fontSize: 18, margin: "8px 0 12px" }}>
                (*) a<sup>x</sup> = x
              </div>
              <p style={{ margin: "0 0 8px" }}>Which of the following equations must have the same number of real solutions as (*)?</p>
              <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontFamily: mathFont, fontSize: 16, lineHeight: 2.2, textAlign: "center" }}>
                <div>I: log<sub>a</sub> x = x</div>
                <div>II: a<sup>2x</sup> = x{"\u00B2"}</div>
                <div>III: a<sup>2x</sup> = 2x</div>
              </div>
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
                Each equation I, II, III is obtained from (*) by some algebraic operation. We need to check whether each operation preserves the number of solutions, or whether it can introduce or lose solutions.
              </p>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 10px" }}>
                Key fact: a<sup>x</sup> {">"} 0 for all real x. This means any solution to (*) must have x {">"} 0. This is important when checking whether operations are reversible.
              </p>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>STRATEGY</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>For each equation, identify the operation used to derive it from (*). Ask: is this operation reversible? If yes, the solution count is preserved. If not, it may introduce extra solutions. Squaring is the classic non-reversible operation.</p>
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
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Adjust a and see the solution count for each equation. I and III always match (*). II sometimes has an extra solution from squaring.</p>
              </div>
            </div>
            <EquationExplorer />
          </>
        )}

        {/* Step 4: Answer */}
        {step === 4 && (
          <>
            <QuestionSummary />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6, fontStyle: "italic" }}>"Which equations must have the same number of real solutions as (*)?"</div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Verdict</span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <div style={{ background: C.ok + "12", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.ok, marginBottom: 4 }}>I</div>
                  <div style={{ fontSize: 12, color: C.ok }}>log is reversible</div>
                  <div style={{ fontSize: 11, color: C.ok, fontWeight: 700, marginTop: 4 }}>Same</div>
                </div>
                <div style={{ background: C.fail + "12", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.fail, marginBottom: 4 }}>II</div>
                  <div style={{ fontSize: 12, color: C.fail }}>squaring adds solutions</div>
                  <div style={{ fontSize: 11, color: C.fail, fontWeight: 700, marginTop: 4 }}>Can differ</div>
                </div>
                <div style={{ background: C.ok + "12", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.ok, marginBottom: 4 }}>III</div>
                  <div style={{ fontSize: 12, color: C.ok }}>substitution u = 2x</div>
                  <div style={{ fontSize: 11, color: C.ok, fontWeight: 700, marginTop: 4 }}>Same</div>
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
