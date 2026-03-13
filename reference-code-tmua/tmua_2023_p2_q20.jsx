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
  { id: 1, label: "Setup", title: "Identify the Key Observation" },
  { id: 2, label: "Solve", title: "Test Each Statement" },
  { id: 3, label: "Verify", title: "Try Different Polynomials" },
  { id: 4, label: "Answer", title: "Confirm the Answer" },
];

function QuestionSummary() {
  return (
    <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 18px", marginBottom: 16, textAlign: "center" }}>
      <p style={{ margin: "0 0 4px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
        <span style={{ fontWeight: 700, color: C.muted, letterSpacing: 0.5, marginRight: 6 }}>Q20</span>
        I<sub>p,q</sub> = {"\u222B"}<sub>p</sub><sup>q</sup> [(f(x)){"\u00B2"} - (f(|x|)){"\u00B2"}] dx. Which statements <strong style={{ color: C.assum }}>must be true</strong>?
      </p>
      <div style={{ fontSize: 11, color: C.text, lineHeight: 1.8, marginBottom: 4, fontFamily: mathFont }}>
        <span>1: I = 0 only if 0 {"<"} p</span><span style={{ margin: "0 10px", color: C.border }}>|</span>
        <span>2: f' {"<"} 0 only if I {"<"} 0 for p {"<"} q {"<"} 0</span><span style={{ margin: "0 10px", color: C.border }}>|</span>
        <span>3: I {">"} 0 only if p {"<"} 0</span>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, fontSize: 10, fontWeight: 600, color: C.muted, flexWrap: "wrap" }}>
        <span>A: none</span><span>B: 1</span><span>C: 2</span><span>D: 3</span><span>E: 1,2</span><span>F: 1,3</span><span>G: 2,3</span><span>H: all</span>
      </div>
    </div>
  );
}

/* ───── Solve Step ───── */
function SolveStep() {
  const [revealed, setRevealed] = useState(0);
  const steps = [
    {
      label: "The integrand is zero for x \u2265 0",
      text: <span>When x {"\u2265"} 0, |x| = x, so f(|x|) = f(x). The integrand becomes f(x){"\u00B2"} - f(x){"\u00B2"} = 0. Only the part of the interval where x {"<"} 0 contributes to I<sub>p,q</sub>.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>x {"\u2265"} 0: f(|x|) = f(x)</span>
          <span>so (f(x)){"\u00B2"} - (f(|x|)){"\u00B2"} = 0</span>
          <span style={{ color: C.ps }}>Only the x {"<"} 0 part matters</span>
        </div>
      ),
      color: C.ps,
    },
    {
      label: "Statement 1: I = 0 only if 0 < p",
      text: <span>"Only if" means: if I = 0 then p {">"} 0. Counterexample: take f(x) = 1 (constant). Then f(x) = f(|x|) = 1 always, so I = 0 for any p, q - including p {"<"} 0.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>f(x) = 1: f(x){"\u00B2"} - f(|x|){"\u00B2"} = 0 everywhere</span>
          <span>I<sub>p,q</sub> = 0 even when p {"<"} 0</span>
          <span style={{ color: C.fail }}>Statement 1 is false</span>
        </div>
      ),
      color: C.fail,
    },
    {
      label: "Statement 2: f'(x) < 0 \u21D2 I < 0 for p < q < 0",
      text: <span>Try f(x) = 1 - x (decreasing, f' = -1). For x {"<"} 0: f(x) = 1-x and f(|x|) = f(-x) = 1+x.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>(1-x){"\u00B2"} - (1+x){"\u00B2"}</span>
          <span>= (1-2x+x{"\u00B2"}) - (1+2x+x{"\u00B2"})</span>
          <span>= -4x</span>
          <span style={{ color: C.muted, fontSize: 13 }}>When x {"<"} 0: -4x {">"} 0, so I {">"} 0</span>
          <span style={{ color: C.fail }}>Statement 2 claims I {"<"} 0, but I {">"} 0. False.</span>
        </div>
      ),
      color: C.fail,
    },
    {
      label: "Statement 3: I > 0 only if p < 0",
      text: <span>"Only if" means: if I {">"} 0 then p {"<"} 0. We showed the integrand is 0 for all x {"\u2265"} 0. So if p {"\u2265"} 0, the entire interval has zero integrand, giving I = 0. Therefore I {">"} 0 requires p {"<"} 0.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>If p {"\u2265"} 0: integrand = 0 on [p, q]</span>
          <span>so I<sub>p,q</sub> = 0, not {">"} 0</span>
          <span>Contrapositive: I {">"} 0 {"\u21D2"} p {"<"} 0</span>
          <span style={{ color: C.ok }}>Statement 3 is true</span>
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
                <p style={{ margin: "0 0 8px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{s.text}</p>
                <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", fontSize: 15, color: C.white, fontFamily: mathFont, textAlign: "center", letterSpacing: 0.5, lineHeight: 2 }}>{s.math}</div>
                {i === steps.length - 1 && <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: C.conclBg, border: `1px solid ${C.ok}44`, fontSize: 13.5, color: C.ok, fontWeight: 600, lineHeight: 1.5 }}>Only statement 3 must be true. The answer is D.</div>}
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

/* ───── Function Pair Graph ─────
   mode "functions": shows f(x) and f(|x|) with p,q markers
   mode "integrand": shows (f(x))^2 - (f(|x|))^2 with shaded integral area
*/
function FunctionPairGraph({ fn, pVal, qVal, mode }) {
  const mL = 40, mR = 24, mT = 16, mB = 28;
  const pW = 400, pH = 160;
  const w = mL + pW + mR, h = mT + pH + mB;

  const xMinM = -4.5, xMaxM = 4.5;
  const toSx = (x) => mL + ((x - xMinM) / (xMaxM - xMinM)) * pW;

  // Sample values to find y range
  const N = 400;
  let yMin = 0, yMax = 0;
  const samples = [];
  for (let i = 0; i <= N; i++) {
    const x = xMinM + (xMaxM - xMinM) * i / N;
    const fx = fn(x);
    const fabsx = fn(Math.abs(x));
    let val;
    if (mode === "functions") {
      val = Math.max(Math.abs(fx), Math.abs(fabsx));
      yMin = Math.min(yMin, fx, fabsx);
      yMax = Math.max(yMax, fx, fabsx);
    } else {
      val = fx * fx - fabsx * fabsx;
      yMin = Math.min(yMin, val);
      yMax = Math.max(yMax, val);
    }
    samples.push({ x, fx, fabsx, integrand: fx * fx - fabsx * fabsx });
  }
  const yPad = Math.max(0.5, (yMax - yMin) * 0.15);
  const yMinM = yMin - yPad, yMaxM = yMax + yPad;
  const toSy = (y) => mT + ((yMaxM - y) / (yMaxM - yMinM)) * pH;

  const sfs = 9;
  const textRectW = (str, fs) => str.length * fs * 0.65 + 10;

  // Build polyline paths
  const buildPath = (vals) => vals.filter(v => isFinite(v.y) && v.y >= yMinM && v.y <= yMaxM).map(v => `${toSx(v.x).toFixed(1)},${toSy(v.y).toFixed(1)}`).join(" ");

  const fxPath = buildPath(samples.map(s => ({ x: s.x, y: s.fx })));
  const fabsxPath = buildPath(samples.map(s => ({ x: s.x, y: s.fabsx })));
  const integrandPath = buildPath(samples.map(s => ({ x: s.x, y: s.integrand })));

  // Shaded area polygon for integrand between p and q
  const shadedPts = [];
  if (mode === "integrand") {
    for (let i = 0; i <= 200; i++) {
      const x = pVal + (qVal - pVal) * i / 200;
      const fx = fn(x);
      const fabsx = fn(Math.abs(x));
      const v = fx * fx - fabsx * fabsx;
      if (isFinite(v)) shadedPts.push({ x, y: Math.max(yMinM, Math.min(yMaxM, v)) });
    }
  }
  const shadedPolygon = shadedPts.length > 2 ?
    `${toSx(pVal).toFixed(1)},${toSy(0).toFixed(1)} ` +
    shadedPts.map(s => `${toSx(s.x).toFixed(1)},${toSy(s.y).toFixed(1)}`).join(" ") +
    ` ${toSx(qVal).toFixed(1)},${toSy(0).toFixed(1)}`
    : "";

  // Y gridlines
  const yGridVals = [];
  const yStep = Math.max(1, Math.round((yMaxM - yMinM) / 5));
  for (let v = Math.ceil(yMinM / yStep) * yStep; v <= yMaxM; v += yStep) yGridVals.push(v);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", display: "block" }}>
      {/* Grid */}
      {yGridVals.map(v => (
        <g key={"yg" + v}>
          <line x1={mL} y1={toSy(v)} x2={mL + pW} y2={toSy(v)}
            stroke={v === 0 ? C.muted : C.border} strokeWidth={v === 0 ? 0.8 : 0.5}
            strokeDasharray={v === 0 ? "none" : "4,4"} opacity={v === 0 ? 0.5 : 0.3} />
          <text x={mL - 5} y={toSy(v) + 3} fill={C.muted} fontSize={7} textAnchor="end" opacity={0.5} fontFamily={mathFont}>{v}</text>
        </g>
      ))}
      {/* X-axis at y=0 */}
      <line x1={mL} y1={toSy(0)} x2={mL + pW} y2={toSy(0)} stroke={C.muted} strokeWidth={0.8} opacity={0.4} />
      {/* Y-axis at x=0 */}
      <line x1={toSx(0)} y1={mT} x2={toSx(0)} y2={mT + pH} stroke={C.muted} strokeWidth={0.8} opacity={0.4} />
      {/* X=0 label */}
      <text x={toSx(0)} y={mT + pH + 14} fill={C.muted} fontSize={7} textAnchor="middle" opacity={0.5}>0</text>

      {/* p and q markers */}
      <line x1={toSx(pVal)} y1={mT} x2={toSx(pVal)} y2={mT + pH} stroke={C.ps} strokeWidth={1} strokeDasharray="3,3" opacity={0.5} />
      <text x={toSx(pVal)} y={mT + pH + 14} fill={C.ps} fontSize={8} textAnchor="middle" fontWeight={700} fontFamily={mathFont}>p</text>
      <line x1={toSx(qVal)} y1={mT} x2={toSx(qVal)} y2={mT + pH} stroke={C.calc} strokeWidth={1} strokeDasharray="3,3" opacity={0.5} />
      <text x={toSx(qVal)} y={mT + pH + 14} fill={C.calc} fontSize={8} textAnchor="middle" fontWeight={700} fontFamily={mathFont}>q</text>

      {mode === "functions" && (
        <>
          <polyline points={fxPath} fill="none" stroke={C.accent} strokeWidth={2.5} opacity={0.9} />
          <polyline points={fabsxPath} fill="none" stroke={C.ok} strokeWidth={2.5} opacity={0.9} strokeDasharray="6,3" />
          {/* Labels */}
          {[{ lbl: "f(x)", col: C.accent, xPos: 0.8 }, { lbl: "f(|x|)", col: C.ok, xPos: 0.2 }].map((l, i) => {
            const xp = xMinM + (xMaxM - xMinM) * l.xPos;
            const yp = i === 0 ? fn(xp) : fn(Math.abs(xp));
            const rw = textRectW(l.lbl, 9);
            return (
              <g key={i}>
                <rect x={toSx(xp) - rw / 2} y={toSy(yp) - 16} width={rw} height={14} rx={3} fill={C.bg} fillOpacity={0.9} />
                <text x={toSx(xp)} y={toSy(yp) - 6} fill={l.col} fontSize={9} fontWeight={700} textAnchor="middle" fontFamily={mathFont}>{l.lbl}</text>
              </g>
            );
          })}
        </>
      )}

      {mode === "integrand" && (
        <>
          {/* Shaded area */}
          {shadedPolygon && <polygon points={shadedPolygon} fill={C.accent} fillOpacity={0.2} />}
          {/* Integrand curve */}
          <polyline points={integrandPath} fill="none" stroke={C.accent} strokeWidth={2.5} opacity={0.9} />
          {/* Zero region annotation for x >= 0 */}
          {(() => {
            const lbl = "= 0 for x \u2265 0";
            const rw = textRectW(lbl, 8);
            return (
              <g>
                <rect x={toSx(1.5) - rw / 2} y={toSy(0) - 18} width={rw} height={14} rx={3} fill={C.bg} fillOpacity={0.9} />
                <text x={toSx(1.5)} y={toSy(0) - 8} fill={C.muted} fontSize={8} fontWeight={600} textAnchor="middle" fontFamily="'Gill Sans',sans-serif">{lbl}</text>
              </g>
            );
          })()}
        </>
      )}
    </svg>
  );
}

/* ───── Interactive Explorer ───── */
const polynomials = [
  { name: "f(x) = 1 - x", fn: (x) => 1 - x, desc: "Decreasing linear (counterexample for 1 and 2)" },
  { name: "f(x) = x", fn: (x) => x, desc: "Simple linear" },
  { name: "f(x) = x\u00B2 - 1", fn: (x) => x * x - 1, desc: "Quadratic" },
  { name: "f(x) = 1", fn: (x) => 1, desc: "Constant (counterexample for 1)" },
  { name: "f(x) = x + 2", fn: (x) => x + 2, desc: "Increasing linear" },
];

function IntegralExplorer() {
  const [fIdx, setFIdx] = useState(0);
  const [pVal, setPVal] = useState(-2);
  const [qVal, setQVal] = useState(1);

  const f = polynomials[fIdx].fn;

  // Compute I_{p,q} numerically
  const N = 2000;
  let integral = 0;
  const dx = (qVal - pVal) / N;
  for (let i = 0; i < N; i++) {
    const x = pVal + (i + 0.5) * dx;
    const fx = f(x);
    const fabsx = f(Math.abs(x));
    integral += (fx * fx - fabsx * fabsx) * dx;
  }

  const pGe0 = pVal >= 0;
  const qLe0 = qVal <= 0;

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 12 }}>Choose a polynomial</span>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          {polynomials.map((p, i) => (
            <button key={i} onClick={() => setFIdx(i)} style={{
              flex: 1, minWidth: 90, padding: "8px 6px", borderRadius: 8, cursor: "pointer",
              border: `2px solid ${fIdx === i ? C.accent : C.border}`,
              background: fIdx === i ? C.accent + "15" : C.card,
              color: fIdx === i ? C.accent : C.muted,
              fontSize: 11, fontWeight: 700, textAlign: "center",
            }}>
              <div style={{ fontFamily: mathFont }}>{p.name}</div>
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.ps, marginBottom: 6 }}>p = {pVal.toFixed(1)}</div>
            <input type="range" min={-4} max={3} step={0.1} value={pVal} onChange={e => { const v = parseFloat(e.target.value); setPVal(v); if (v >= qVal) setQVal(v + 0.5); }} style={{ width: "100%", accentColor: C.ps, height: 6 }} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.calc, marginBottom: 6 }}>q = {qVal.toFixed(1)}</div>
            <input type="range" min={-3} max={4} step={0.1} value={qVal} onChange={e => { const v = parseFloat(e.target.value); setQVal(v); if (v <= pVal) setPVal(v - 0.5); }} style={{ width: "100%", accentColor: C.calc, height: 6 }} />
          </div>
        </div>
      </div>

      {/* Graph 1: f(x) and f(|x|) */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>f(x) vs f(|x|)</div>
        <FunctionPairGraph fn={f} pVal={pVal} qVal={qVal} mode="functions" />
      </div>

      {/* Graph 2: integrand with shaded area */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 18 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>(f(x)){"\u00B2"} - (f(|x|)){"\u00B2"} with integral shaded</div>
        <FunctionPairGraph fn={f} pVal={pVal} qVal={qVal} mode="integrand" />
      </div>

      {/* Result */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 18 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: C.ps, fontWeight: 700, marginBottom: 4 }}>p</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: pVal < 0 ? C.ps : C.muted }}>{pVal.toFixed(1)}</div>
          <div style={{ fontSize: 9, color: pVal < 0 ? C.ps : C.muted, marginTop: 2 }}>{pVal < 0 ? "p < 0" : "p \u2265 0"}</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${Math.abs(integral) < 0.01 ? C.border : integral > 0 ? C.ok : C.fail}`, borderRadius: 14, padding: "14px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: C.assum, fontWeight: 700, marginBottom: 4 }}>I<sub>p,q</sub></div>
          <div style={{ fontSize: 20, fontWeight: 700, color: Math.abs(integral) < 0.01 ? C.muted : integral > 0 ? C.ok : C.fail }}>{integral.toFixed(3)}</div>
          <div style={{ fontSize: 9, color: C.muted, marginTop: 2 }}>{Math.abs(integral) < 0.01 ? "= 0" : integral > 0 ? "> 0" : "< 0"}</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: C.calc, fontWeight: 700, marginBottom: 4 }}>q</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.calc }}>{qVal.toFixed(1)}</div>
          <div style={{ fontSize: 9, color: qVal < 0 ? C.calc : C.muted, marginTop: 2 }}>{qVal < 0 ? "q < 0" : "q \u2265 0"}</div>
        </div>
      </div>

      {/* Logic checker with arrow notation */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 22px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 12 }}>Statement logic (A {"\u2192"} B means "if A then B")</span>
        {(() => {
          const iVal = integral;
          const iIsZero = Math.abs(iVal) < 0.01;
          const iPos = iVal > 0.01;
          const iNeg = iVal < -0.01;
          const pPos = pVal > 0.01;
          const pNeg = pVal < -0.01;
          const isDecreasing = fIdx === 0;
          const bothNeg = pVal < 0 && qVal < 0;

          const statements = [
            {
              num: "1",
              left: { label: "I = 0", value: iIsZero },
              right: { label: "0 < p", value: pPos },
              arrow: "\u2192",
              desc: "\"I = 0 only if 0 < p\"",
            },
            {
              num: "2",
              left: { label: "f' < 0 everywhere", value: isDecreasing },
              right: { label: "I < 0 (for p<q<0)", value: iNeg && bothNeg },
              arrow: "\u2192",
              desc: "\"f'<0 \u2192 I<0 for p<q<0\"",
              extra: !bothNeg ? "(need p < q < 0 to test)" : null,
            },
            {
              num: "3",
              left: { label: "I > 0", value: iPos },
              right: { label: "p < 0", value: pNeg },
              arrow: "\u2192",
              desc: "\"I > 0 only if p < 0\"",
            },
          ];

          return statements.map(s => {
            const leftTrue = s.left.value;
            const rightTrue = s.right.value;
            // A -> B is violated when A is true and B is false
            const violated = leftTrue && !rightTrue;
            const consistent = !leftTrue || rightTrue;
            const tested = leftTrue; // only tested when the "if" part holds
            const arrowColor = !tested ? C.muted : violated ? C.fail : C.ok;

            return (
              <div key={s.num} style={{ marginBottom: 12, padding: "12px 14px", borderRadius: 10, background: violated ? C.fail + "08" : consistent && tested ? C.ok + "06" : "transparent", border: `1px solid ${violated ? C.fail + "33" : C.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.white, marginRight: 10, minWidth: 16 }}>{s.num}.</span>
                  {/* Left box */}
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: 6, border: `1.5px solid ${leftTrue ? C.ok : C.muted}44`, background: leftTrue ? C.ok + "10" : "transparent", marginRight: 8 }}>
                    <span style={{ fontSize: 12, color: leftTrue ? C.ok : C.muted, fontFamily: mathFont }}>{s.left.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: leftTrue ? C.ok : C.muted }}>{leftTrue ? "\u2713" : "\u2717"}</span>
                  </div>
                  {/* Arrow */}
                  <span style={{ fontSize: 18, color: arrowColor, fontWeight: 700, margin: "0 6px" }}>{s.arrow}</span>
                  {/* Right box */}
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: 6, border: `1.5px solid ${rightTrue ? C.ok : tested ? C.fail : C.muted}44`, background: rightTrue ? C.ok + "10" : tested ? C.fail + "10" : "transparent" }}>
                    <span style={{ fontSize: 12, color: rightTrue ? C.ok : tested ? C.fail : C.muted, fontFamily: mathFont }}>{s.right.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: rightTrue ? C.ok : tested ? C.fail : C.muted }}>{rightTrue ? "\u2713" : "\u2717"}</span>
                  </div>
                </div>
                {/* Verdict */}
                <div style={{ fontSize: 11, marginLeft: 26 }}>
                  {s.extra && !tested ? (
                    <span style={{ color: C.muted }}>{s.extra}</span>
                  ) : !tested ? (
                    <span style={{ color: C.muted }}>Left side is false, so implication holds vacuously (not a useful test)</span>
                  ) : violated ? (
                    <span style={{ color: C.fail, fontWeight: 700 }}>VIOLATED: left is true but right is false - this is a counterexample</span>
                  ) : (
                    <span style={{ color: C.ok }}>Consistent: left true and right true (not a counterexample)</span>
                  )}
                </div>
              </div>
            );
          });
        })()}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 18px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ background: C.assumBg, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.assum, fontWeight: 700, whiteSpace: "nowrap" }}>HINT</span>
          <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, margin: 0 }}>Try f(x) = 1 with p {"<"} 0: I = 0 even though p {"<"} 0, disproving statement 1. Try f(x) = 1-x with p {"<"} q {"<"} 0: I {">"} 0, disproving statement 2. Statement 3 holds because whenever p {"\u2265"} 0, I = 0.</p>
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
  { letter: "A", text: "None of them", ok: false, expl: "Statement 3 is true. If p \u2265 0, the integrand is 0 on [p,q], so I = 0. Therefore I > 0 requires p < 0." },
  { letter: "B", text: "1 only", ok: false, expl: "Statement 1 fails: f(x) = 1 gives I = 0 for any p,q, including p < 0." },
  { letter: "C", text: "2 only", ok: false, expl: "Statement 2 fails: f(x) = 1-x is decreasing but gives I > 0 (not < 0) for p < q < 0." },
  { letter: "D", text: "3 only", ok: true, expl: "The integrand is zero for x \u2265 0. So if p \u2265 0, I = 0. Contrapositive: I > 0 implies p < 0. Statements 1 and 2 have counterexamples." },
  { letter: "E", text: "1 and 2 only", ok: false, expl: "Both 1 and 2 are false. 1 fails with f = 1 (constant), 2 fails with f = 1-x (decreasing gives I > 0, not < 0)." },
  { letter: "F", text: "1 and 3 only", ok: false, expl: "Statement 1 is false. f(x) = 1 gives I = 0 for all p,q." },
  { letter: "G", text: "2 and 3 only", ok: false, expl: "Statement 2 is false. A decreasing polynomial gives I > 0 for p < q < 0, not I < 0." },
  { letter: "H", text: "1, 2 and 3", ok: false, expl: "Only 3 is true. Both 1 and 2 have explicit counterexamples." },
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
            <span style={{ fontSize: 12, color: C.ps }}>Integration and Logic</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TMUA 2023 {"\u00B7"} Paper 2 {"\u00B7"} Question 20</p>
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
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question 20</span>
            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: "0 0 8px" }}>Let f be a polynomial with real coefficients. The integral I<sub>p,q</sub> where p {"<"} q is defined by</p>
              <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", textAlign: "center", fontFamily: mathFont, fontSize: 16, margin: "8px 0 12px" }}>
                I<sub>p,q</sub> = {"\u222B"}<sub>p</sub><sup>q</sup> [(f(x)){"\u00B2"} - (f(|x|)){"\u00B2"}] dx
              </div>
              <p style={{ margin: "0 0 8px" }}>Which of the following statements <strong style={{ color: C.assum }}>must be true</strong>?</p>
              <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontFamily: mathFont, fontSize: 14, lineHeight: 2.2 }}>
                <div>1: I<sub>p,q</sub> = 0 <strong>only if</strong> 0 {"<"} p</div>
                <div>2: f'(x) {"<"} 0 for all x <strong>only if</strong> I<sub>p,q</sub> {"<"} 0 for all p {"<"} q {"<"} 0</div>
                <div>3: I<sub>p,q</sub> {">"} 0 <strong>only if</strong> p {"<"} 0</div>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Setup */}
        {step === 1 && (
          <>
            <QuestionSummary />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>The crucial observation</span>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 10px" }}>
                When x {"\u2265"} 0, we have |x| = x, so f(|x|) = f(x). That means the integrand (f(x)){"\u00B2"} - (f(|x|)){"\u00B2"} = 0 for all x {"\u2265"} 0.
              </p>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 10px" }}>
                So the integral only "sees" the part of [p, q] where x {"<"} 0. If the entire interval has x {"\u2265"} 0 (i.e. p {"\u2265"} 0), then I = 0. This one observation is enough to answer the question.
              </p>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>STRATEGY</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Use the observation that the integrand vanishes for x {"\u2265"} 0 to test each statement. For "only if" statements, look for counterexamples. Remember "A only if B" means "if A then B".</p>
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
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Choose different polynomials and adjust p, q. Watch how I<sub>p,q</sub> changes. Notice: whenever p {"\u2265"} 0, I is always 0 regardless of f. This confirms statement 3.</p>
              </div>
            </div>
            <IntegralExplorer />
          </>
        )}

        {/* Step 4: Answer */}
        {step === 4 && (
          <>
            <QuestionSummary />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6, fontStyle: "italic" }}>"Which of the following statements must be true?"</div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Verdict</span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <div style={{ background: C.fail + "12", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.fail, marginBottom: 4 }}>1</div>
                  <div style={{ fontSize: 11, color: C.fail }}>f = 1 gives I = 0</div>
                  <div style={{ fontSize: 11, color: C.fail }}>even when p {"<"} 0</div>
                </div>
                <div style={{ background: C.fail + "12", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.fail, marginBottom: 4 }}>2</div>
                  <div style={{ fontSize: 11, color: C.fail }}>f = 1-x gives I {">"} 0</div>
                  <div style={{ fontSize: 11, color: C.fail }}>not I {"<"} 0</div>
                </div>
                <div style={{ background: C.ok + "12", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.ok, marginBottom: 4 }}>3</div>
                  <div style={{ fontSize: 11, color: C.ok }}>integrand = 0 for x {"\u2265"} 0</div>
                  <div style={{ fontSize: 11, color: C.ok }}>so I {">"} 0 needs p {"<"} 0</div>
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
