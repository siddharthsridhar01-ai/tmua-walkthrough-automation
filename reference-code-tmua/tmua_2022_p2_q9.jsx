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
  parab: "#a29bfe", kLine: "#fd79a8", counter: "#ff7675",
};
const mathFont = "'Cambria Math','Latin Modern Math','STIX Two Math',Georgia,serif";

const stepsMeta = [
  { id: 0, label: "Read", title: "Read the Question" },
  { id: 1, label: "Setup", title: "Identify the Approach" },
  { id: 2, label: "Solve", title: "Test Whether (*) Can Hold" },
  { id: 3, label: "Verify", title: "Explore Different k Values" },
  { id: 4, label: "Answer", title: "Confirm the Answer" },
];

function QuestionSummary() {
  return (
    <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 18px", marginBottom: 16, textAlign: "center" }}>
      <p style={{ margin: "0 0 6px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
        <span style={{ fontWeight: 700, color: C.muted, letterSpacing: 0.5, marginRight: 6 }}>Q9</span>
        (*) For all real x, if x {"<"} k then x{"\u00B2"} {"<"} k. Find the <strong style={{ color: C.assum }}>complete set of k</strong> for which (*) is true.
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, fontSize: 11, fontWeight: 600, color: C.muted, flexWrap: "wrap" }}>
        <span>A: none</span><span>B: k{">"} 0</span><span>C: k{"<"}1</span><span>D: k{"\u2264"}1</span><span>E: 0{"<"}k{"<"}1</span><span>F: 0{"<"}k{"\u2264"}1</span><span>G: all</span>
      </div>
    </div>
  );
}

/* ───── Graph: y = x² and y = k ─────
   Shows the parabola, horizontal line y=k, vertical line x=k,
   and highlights the counterexample point.
*/
function ParabolaGraph({ kVal, showCounterexample, compact }) {
  const mL = compact ? 28 : 40, mR = compact ? 12 : 20;
  const mT = compact ? 12 : 16, mB = compact ? 22 : 28;
  const pW = compact ? 220 : 400, pH = compact ? 160 : 260;
  const w = mL + pW + mR, h = mT + pH + mB;

  // Math range: adjust to show the counterexample
  const counterX = -Math.sqrt(Math.abs(kVal)) - 0.5;
  const xMinM = Math.min(-3, counterX - 1);
  const xMaxM = Math.max(3, kVal + 1);
  const yMinM = Math.min(-1, kVal - 1);
  const yMaxM = Math.max(kVal + 2, 5);

  const toSx = (x) => mL + ((x - xMinM) / (xMaxM - xMinM)) * pW;
  const toSy = (y) => mT + ((yMaxM - y) / (yMaxM - yMinM)) * pH;
  const sfs = compact ? 7 : 9;
  const textRectW = (str, fs) => str.length * fs * 0.65 + (compact ? 6 : 10);

  // Parabola points
  const N = 300;
  const pts = [];
  for (let i = 0; i <= N; i++) {
    const x = xMinM + (xMaxM - xMinM) * i / N;
    const y = x * x;
    if (y <= yMaxM + 1 && y >= yMinM - 1) {
      pts.push(`${toSx(x).toFixed(1)},${toSy(y).toFixed(1)}`);
    }
  }

  // Counterexample: x = -sqrt(|k|) if k > 0, or x = k - 1 if k <= 0
  let cxVal, cyVal;
  if (kVal > 0) {
    cxVal = -Math.sqrt(kVal);
    cyVal = kVal; // x² = k, so x² < k fails
  } else {
    cxVal = kVal - 1;
    cyVal = cxVal * cxVal;
  }

  // Grid values
  const yGridVals = [];
  for (let v = Math.ceil(yMinM); v <= Math.floor(yMaxM); v++) yGridVals.push(v);
  const xGridVals = [];
  for (let v = Math.ceil(xMinM); v <= Math.floor(xMaxM); v++) xGridVals.push(v);

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
          <text x={toSx(v)} y={mT + pH + 14} fill={C.muted} fontSize={sfs}
            textAnchor="middle" opacity={0.6} fontFamily={mathFont}>{v}</text>
        </g>
      ))}
      {/* Y axis */}
      <line x1={toSx(0)} y1={mT} x2={toSx(0)} y2={mT + pH} stroke={C.muted} strokeWidth={0.8} opacity={0.5} />
      {!compact && (
        <>
          <text x={mL + pW + 4} y={toSy(0) + 4} fill={C.muted} fontSize={8} opacity={0.5} fontStyle="italic">x</text>
          <text x={toSx(0) + 6} y={mT - 2} fill={C.muted} fontSize={8} opacity={0.5} fontStyle="italic">y</text>
        </>
      )}

      {/* Shaded region: x < k (left of vertical line) */}
      <rect x={mL} y={mT} width={Math.max(0, toSx(kVal) - mL)} height={pH}
        fill={C.kLine} fillOpacity={0.04} />

      {/* Parabola y = x² */}
      <polyline points={pts.join(" ")} fill="none" stroke={C.parab}
        strokeWidth={compact ? 2 : 2.5} opacity={0.9} strokeLinejoin="round" />

      {/* Horizontal line y = k */}
      <line x1={mL} y1={toSy(kVal)} x2={mL + pW} y2={toSy(kVal)}
        stroke={C.kLine} strokeWidth={1.5} strokeDasharray="6,4" opacity={0.6} />
      {(() => {
        const lbl = `y = k = ${kVal.toFixed(1)}`;
        const rw = textRectW(lbl, sfs);
        return (
          <>
            <rect x={mL + pW - rw - 4} y={toSy(kVal) - (compact ? 12 : 14)} width={rw} height={compact ? 12 : 14} rx={3} fill={C.bg} fillOpacity={0.9} />
            <text x={mL + pW - 4 - rw / 2} y={toSy(kVal) - (compact ? 3 : 4)} fill={C.kLine} fontSize={sfs} fontWeight={600} textAnchor="middle" fontFamily={mathFont}>{lbl}</text>
          </>
        );
      })()}

      {/* Vertical line x = k */}
      <line x1={toSx(kVal)} y1={mT} x2={toSx(kVal)} y2={mT + pH}
        stroke={C.kLine} strokeWidth={1} strokeDasharray="4,3" opacity={0.4} />
      {(() => {
        const lbl = `x = k`;
        const rw = textRectW(lbl, sfs);
        return (
          <>
            <rect x={toSx(kVal) - rw / 2} y={mT + pH + 2} width={rw} height={compact ? 12 : 14} rx={3} fill={C.bg} fillOpacity={0.9} />
            <text x={toSx(kVal)} y={mT + pH + (compact ? 11 : 13)} fill={C.kLine} fontSize={sfs} fontWeight={600} textAnchor="middle" fontFamily={mathFont}>{lbl}</text>
          </>
        );
      })()}

      {/* Counterexample point */}
      {showCounterexample && (
        <>
          <circle cx={toSx(cxVal)} cy={toSy(cyVal)} r={compact ? 5 : 7} fill={C.counter} opacity={0.9} />
          {(() => {
            const lbl = `(${cxVal.toFixed(1)}, ${cyVal.toFixed(1)})`;
            const rw = textRectW(lbl, sfs);
            const ly = toSy(cyVal) - (compact ? 10 : 14);
            return (
              <>
                <rect x={toSx(cxVal) - rw / 2} y={ly - 7} width={rw} height={14} rx={3} fill={C.bg} fillOpacity={0.9} stroke={C.counter} strokeWidth={0.5} strokeOpacity={0.5} />
                <text x={toSx(cxVal)} y={ly + 4} fill={C.counter} fontSize={sfs} fontWeight={700} textAnchor="middle" fontFamily={mathFont}>{lbl}</text>
              </>
            );
          })()}
          {/* Annotation: x < k but x² >= k */}
          {!compact && (() => {
            const annX = toSx(cxVal) + 30;
            const annY = toSy(cyVal) + 20;
            return (
              <>
                <line x1={toSx(cxVal) + 8} y1={toSy(cyVal) + 4} x2={annX - 2} y2={annY - 6} stroke={C.counter} strokeWidth={0.8} opacity={0.5} />
                <text x={annX} y={annY} fill={C.counter} fontSize={8} fontWeight={600} fontFamily="'Gill Sans',sans-serif">x {"<"} k but x{"\u00B2"} {"\u2265"} k</text>
              </>
            );
          })()}
        </>
      )}

      {/* Parabola label */}
      {(() => {
        const lx = toSx(Math.min(xMaxM - 0.5, 2.5));
        const ly = toSy(Math.min(2.5, xMaxM - 0.5) ** 2);
        const lbl = "y = x\u00B2";
        const rw = textRectW(lbl, compact ? 8 : 10);
        return (
          <>
            <rect x={lx + 4} y={ly - 7} width={rw} height={14} rx={3} fill={C.bg} fillOpacity={0.85} />
            <text x={lx + 4 + rw / 2} y={ly + 4} fill={C.parab} fontSize={compact ? 8 : 10} fontWeight={600} textAnchor="middle" fontFamily={mathFont}>{lbl}</text>
          </>
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
      label: "Understand what (*) requires",
      text: "(*) says: every x to the left of k must also have x\u00B2 below k. In other words, on the graph of y = x\u00B2, the region x < k must lie entirely below the line y = k.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>(*) is true for k means:</span>
          <span>there is no x {"<"} k with x{"\u00B2"} {"\u2265"} k</span>
        </div>
      ),
      color: C.ps,
    },
    {
      label: "Try k > 0: look for a counterexample",
      text: <span>For any k {">"} 0, consider x = -{"\u221A"}k. Then x {"<"} 0 {"<"} k (so x {"<"} k holds), but x{"\u00B2"} = k, so x{"\u00B2"} {"<"} k fails.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>x = -{"\u221A"}k satisfies x {"<"} k</span>
          <span>but x{"\u00B2"} = ({"\u221A"}k){"\u00B2"} = k</span>
          <span style={{ color: C.fail }}>x{"\u00B2"} {"<"} k fails. (*) is false for all k {">"} 0.</span>
        </div>
      ),
      color: C.fail,
    },
    {
      label: "Try k \u2264 0: even worse",
      text: "If k \u2264 0, then x\u00B2 \u2265 0 \u2265 k for every x. So x\u00B2 < k is never true, but there are x < k (e.g. x = k - 1). So (*) fails.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>If k {"\u2264"} 0: x{"\u00B2"} {"\u2265"} 0 {"\u2265"} k always</span>
          <span>Take x = k - 1: x {"<"} k but x{"\u00B2"} {"\u2265"} 0 {"\u2265"} k</span>
          <span style={{ color: C.fail }}>(*) is false for all k {"\u2264"} 0.</span>
        </div>
      ),
      color: C.fail,
    },
    {
      label: "Conclusion",
      text: "For k > 0, x = -\u221Ak always breaks (*). For k \u2264 0, x\u00B2 \u2265 0 > k always breaks it. There is no value of k for which (*) holds.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>k {">"} 0: counterexample x = -{"\u221A"}k</span>
          <span>k {"\u2264"} 0: counterexample x = k - 1</span>
          <span style={{ color: C.ok }}>(*) is true for no real values of k.</span>
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
                <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", fontSize: 16, color: C.white, fontFamily: mathFont, textAlign: "center", letterSpacing: 0.5, lineHeight: 2 }}>{s.math}</div>
                {i === steps.length - 1 && <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: C.conclBg, border: `1px solid ${C.ok}44`, fontSize: 13.5, color: C.ok, fontWeight: 600, lineHeight: 1.5 }}>The answer is A: no real numbers.</div>}
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

/* ───── Number Line Verify: fix k, drag x ───── */
function NumberLineVerify({ kVal }) {
  const [xVal, setXVal] = useState(-2);

  const xSq = xVal * xVal;
  const xLtK = xVal < kVal;
  const xSqLtK = xSq < kVal;
  const isCounter = xLtK && !xSqLtK;

  // Number line SVG
  const mL = 30, mR = 30, mT = 32, mB = 20;
  const pW = 420, pH = 20;
  const w = mL + pW + mR, h = mT + pH + mB;
  const lineMin = Math.min(-5, xVal - 1, xSq > 10 ? -5 : -5);
  const lineMax = Math.max(10, xSq + 1, kVal + 1);
  const toSx = (v) => mL + ((v - lineMin) / (lineMax - lineMin)) * pW;
  const lineY = mT + pH / 2;
  const textRectW = (str, fs) => str.length * fs * 0.65 + 10;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: C.accent, fontWeight: 700, minWidth: 30 }}>x</span>
        <input type="range" min={-5} max={kVal - 0.01} step={0.05} value={Math.min(xVal, kVal - 0.01)} onChange={e => setXVal(parseFloat(e.target.value))} style={{ flex: 1, accentColor: C.accent, height: 6 }} />
        <span style={{ fontSize: 14, fontWeight: 700, color: C.accent, fontFamily: mathFont, minWidth: 60, textAlign: "right" }}>x = {xVal.toFixed(1)}</span>
      </div>

      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", display: "block", marginBottom: 10 }}>
        {/* Number line */}
        <line x1={mL} y1={lineY} x2={mL + pW} y2={lineY} stroke={C.muted} strokeWidth={1} opacity={0.4} />
        <polygon points={`${mL + pW},${lineY} ${mL + pW - 6},${lineY - 3} ${mL + pW - 6},${lineY + 3}`} fill={C.muted} opacity={0.4} />

        {/* k marker */}
        <line x1={toSx(kVal)} y1={lineY - 12} x2={toSx(kVal)} y2={lineY + 12} stroke={C.kLine} strokeWidth={1.5} strokeDasharray="3,3" opacity={0.7} />
        {(() => { const l = `k=${kVal.toFixed(1)}`; const rw = textRectW(l, 9); return (
          <><rect x={toSx(kVal) - rw/2} y={lineY + 14} width={rw} height={14} rx={3} fill={C.bg} fillOpacity={0.9} />
          <text x={toSx(kVal)} y={lineY + 25} fill={C.kLine} fontSize={9} fontWeight={700} textAnchor="middle" fontFamily={mathFont}>{l}</text></>
        ); })()}

        {/* x marker */}
        <circle cx={toSx(xVal)} cy={lineY} r={5} fill={C.accent} />
        {(() => { const l = `x=${xVal.toFixed(1)}`; const rw = textRectW(l, 8); return (
          <><rect x={toSx(xVal) - rw/2} y={lineY - 22} width={rw} height={13} rx={3} fill={C.bg} fillOpacity={0.9} stroke={C.accent} strokeWidth={0.5} />
          <text x={toSx(xVal)} y={lineY - 12} fill={C.accent} fontSize={8} fontWeight={700} textAnchor="middle" fontFamily={mathFont}>{l}</text></>
        ); })()}

        {/* x² marker */}
        {xSq <= lineMax && (
          <>
            <circle cx={toSx(xSq)} cy={lineY} r={5} fill={C.parab} />
            {(() => { const l = `x\u00B2=${xSq.toFixed(1)}`; const rw = textRectW(l, 8); return (
              <><rect x={toSx(xSq) - rw/2} y={lineY - 22} width={rw} height={13} rx={3} fill={C.bg} fillOpacity={0.9} stroke={C.parab} strokeWidth={0.5} />
              <text x={toSx(xSq)} y={lineY - 12} fill={C.parab} fontSize={8} fontWeight={700} textAnchor="middle" fontFamily={mathFont}>{l}</text></>
            ); })()}
          </>
        )}

        {/* Integer ticks */}
        {Array.from({ length: Math.floor(lineMax) - Math.ceil(lineMin) + 1 }, (_, i) => Math.ceil(lineMin) + i).filter(v => v % 2 === 0).map(v => (
          <g key={v}>
            <line x1={toSx(v)} y1={lineY - 3} x2={toSx(v)} y2={lineY + 3} stroke={C.muted} strokeWidth={0.5} opacity={0.4} />
            <text x={toSx(v)} y={lineY + 12} fill={C.muted} fontSize={6} textAnchor="middle" opacity={0.4}>{v}</text>
          </g>
        ))}
      </svg>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <div style={{ background: xLtK ? C.ok + "12" : C.fail + "12", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: xLtK ? C.ok : C.fail, fontWeight: 700 }}>x {"<"} k?</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: xLtK ? C.ok : C.fail }}>{xLtK ? "Yes" : "No"}</div>
        </div>
        <div style={{ background: xSqLtK ? C.ok + "12" : C.fail + "12", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: xSqLtK ? C.ok : C.fail, fontWeight: 700 }}>x{"\u00B2"} {"<"} k?</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: xSqLtK ? C.ok : C.fail }}>{xSqLtK ? "Yes" : "No"}</div>
        </div>
        <div style={{ background: isCounter ? C.fail + "15" : C.ok + "08", borderRadius: 8, padding: "8px 10px", textAlign: "center", border: isCounter ? `1px solid ${C.fail}44` : "none" }}>
          <div style={{ fontSize: 10, color: isCounter ? C.fail : C.muted, fontWeight: 700 }}>Breaks (*)?</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: isCounter ? C.fail : C.muted }}>{isCounter ? "Yes!" : "No"}</div>
        </div>
      </div>
    </div>
  );
}

/* ───── Interactive Explorer ───── */
function KExplorer() {
  const [kVal, setKVal] = useState(1);

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>1. Choose a value of k</span>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <input type="range" min={-3} max={4} step={0.1} value={kVal} onChange={e => setKVal(parseFloat(e.target.value))} style={{ flex: 1, accentColor: C.kLine, height: 6 }} />
          <div style={{ minWidth: 80, textAlign: "center" }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: C.kLine, fontFamily: mathFont }}>k = {kVal.toFixed(1)}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[{ v: -1, l: "k = -1" }, { v: 0, l: "k = 0" }, { v: 0.5, l: "k = 0.5" }, { v: 1, l: "k = 1" }, { v: 2, l: "k = 2" }].map(p => (
            <button key={p.v} onClick={() => setKVal(p.v)} style={{
              flex: 1, padding: "8px 2px", borderRadius: 8, cursor: "pointer",
              border: `2px solid ${Math.abs(kVal - p.v) < 0.01 ? C.kLine : C.border}`,
              background: Math.abs(kVal - p.v) < 0.01 ? C.kLine + "15" : C.card,
              color: Math.abs(kVal - p.v) < 0.01 ? C.kLine : C.muted,
              fontSize: 11, fontWeight: 700, transition: "all 0.2s",
            }}>{p.l}</button>
          ))}
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>2. Drag x to find a counterexample</span>
        <p style={{ fontSize: 12, color: C.muted, margin: "0 0 12px" }}>x is constrained to x {"<"} k (so the "if" part of (*) holds). Can you find an x where x{"\u00B2"} {"\u2265"} k?</p>
        <NumberLineVerify kVal={kVal} />
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 18px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ background: C.assumBg, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.assum, fontWeight: 700, whiteSpace: "nowrap" }}>HINT</span>
          <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, margin: 0 }}>Try dragging x to the left (negative). For any k, a sufficiently negative x has x {"<"} k but x{"\u00B2"} very large. For k {">"} 0, try x = -{"\u221A"}k. For k {"\u2264"} 0, any x {"<"} k works since x{"\u00B2"} {"\u2265"} 0 {">"} k.</p>
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
  { letter: "A", text: "No real numbers", ok: true, expl: <span>For k {">"} 0, x = -{"\u221A"}k gives x {"<"} k but x{"\u00B2"} = k. For k {"\u2264"} 0, x{"\u00B2"} {"\u2265"} 0 {">"} k always. No k works.</span> },
  { letter: "B", text: <span>k {">"} 0</span>, ok: false, expl: <span>Try k = 1, x = -1: x {"<"} k but x{"\u00B2"} = 1 = k, so x{"\u00B2"} {"<"} k fails.</span> },
  { letter: "C", text: <span>k {"<"} 1</span>, ok: false, expl: <span>Try k = 0.5, x = -1: x {"<"} k but x{"\u00B2"} = 1 {">"} k. Or k = -1: x{"\u00B2"} {"\u2265"} 0 {">"} -1.</span> },
  { letter: "D", text: <span>k {"\u2264"} 1</span>, ok: false, expl: <span>Same issue. Negative x values always have large x{"\u00B2"}, which can exceed any finite k.</span> },
  { letter: "E", text: <span>0 {"<"} k {"<"} 1</span>, ok: false, expl: <span>Try k = 0.5, x = -{"\u221A"}0.5 {"\u2248"} -0.71: x {"<"} k but x{"\u00B2"} = 0.5 = k.</span> },
  { letter: "F", text: <span>0 {"<"} k {"\u2264"} 1</span>, ok: false, expl: <span>Same counterexample as E. The trap is focusing on positive x where x{"\u00B2"} is small, forgetting negative x.</span> },
  { letter: "G", text: "All real numbers", ok: false, expl: <span>k = 1, x = -2: -2 {"<"} 1 but (-2){"\u00B2"} = 4 {">"} 1. (*) fails immediately.</span> },
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
            <span style={{ fontSize: 12, color: C.ps }}>Logic and Inequalities</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TMUA 2022 {"\u00B7"} Paper 2 {"\u00B7"} Question 9</p>
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
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question 9</span>
            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: "0 0 8px" }}>Consider the following statement:</p>
              <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", textAlign: "center", fontFamily: mathFont, fontSize: 16, margin: "8px 0 12px" }}>
                (*) <strong>For all</strong> real numbers x, if x {"<"} k then x{"\u00B2"} {"<"} k
              </div>
              <p style={{ margin: 0 }}>What is the <strong style={{ color: C.assum }}>complete set of values of k</strong> for which (*) is true?</p>
            </div>
          </div>
        )}

        {/* Step 1: Setup */}
        {step === 1 && (
          <>
            <QuestionSummary />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>What does (*) really say?</span>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 10px" }}>
                (*) claims that the entire region x {"<"} k on the number line maps to x{"\u00B2"} {"<"} k. On the graph of y = x{"\u00B2"}, this means: every point on the parabola to the left of x = k must lie below y = k.
              </p>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 10px" }}>
                The "for all" quantifier is critical. Even a single counterexample x (with x {"<"} k but x{"\u00B2"} {"\u2265"} k) would make (*) false for that k.
              </p>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>KEY INSIGHT</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Large negative values of x satisfy x {"<"} k for any finite k, but their squares are large and positive. This is the source of the counterexample.</p>
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
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Adjust k and see the parabola y = x{"\u00B2"} with the line y = k. The red point shows the counterexample: an x {"<"} k where x{"\u00B2"} {"\u2265"} k. No matter what k you choose, this point always exists.</p>
              </div>
            </div>
            <KExplorer />
          </>
        )}

        {/* Step 4: Answer */}
        {step === 4 && (
          <>
            <QuestionSummary />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6, fontStyle: "italic" }}>"What is the complete set of values of k for which (*) is true?"</div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Why every k fails</span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ background: C.fail + "12", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: C.fail, fontWeight: 700, marginBottom: 4 }}>k {">"} 0</div>
                  <div style={{ fontSize: 13, color: C.fail }}>x = -{"\u221A"}k gives x{"\u00B2"} = k</div>
                </div>
                <div style={{ background: C.fail + "12", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: C.fail, fontWeight: 700, marginBottom: 4 }}>k {"\u2264"} 0</div>
                  <div style={{ fontSize: 13, color: C.fail }}>x{"\u00B2"} {"\u2265"} 0 {"\u2265"} k always</div>
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
