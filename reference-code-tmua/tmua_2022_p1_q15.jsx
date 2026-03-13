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
  curve: "#a29bfe", maxC: "#55efc4", minC: "#fd79a8",
};
const mathFont = "'Cambria Math','Latin Modern Math','STIX Two Math',Georgia,serif";

const stepsMeta = [
  { id: 0, label: "Read", title: "Read the Question" },
  { id: 1, label: "Setup", title: "Identify the Approach" },
  { id: 2, label: "Solve", title: "Find the Possible Values of a" },
  { id: 3, label: "Verify", title: "Explore f(x) = a^(cos x)" },
  { id: 4, label: "Answer", title: "Confirm the Answer" },
];

const A1 = (3 + Math.sqrt(13)) / 2; // ~3.303
const A2 = (-3 + Math.sqrt(13)) / 2; // ~0.303

function QuestionSummary() {
  return (
    <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 18px", marginBottom: 16, textAlign: "center" }}>
      <p style={{ margin: "0 0 8px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
        <span style={{ fontWeight: 700, color: C.muted, letterSpacing: 0.5, marginRight: 6 }}>Q15</span>
        The difference between the max and min of f(x) = a<sup>cos x</sup>, where a {">"} 0 and x is real, is 3. Find the <strong style={{ color: C.assum }}>sum of the possible values of a</strong>.
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 10, fontSize: 11, fontWeight: 600, color: C.muted, flexWrap: "wrap" }}>
        <span>A: 0</span><span>B: 3/2</span><span>C: 5/2</span><span>D: 3</span><span>E: {"\u221A"}10</span><span>F: {"\u221A"}13</span>
      </div>
    </div>
  );
}

/* ───── Graph of a^(cos x) ─────
   Content-driven viewBox. Shows one full period [0, 2pi].
   Props:
   - aVal: value of a
   - showMaxMin: highlight max/min lines
   - showDiffLabel: show the difference annotation
   - general: show schematic version without specific a
   - compact: smaller for solve pane
*/
function FunctionGraph({ aVal, showMaxMin, showDiffLabel, general, compact }) {
  /* ── Pixel-margin layout: plot area lives inside fixed margins ── */
  const mL = compact ? 28 : 36, mR = compact ? 78 : 96;
  const mT = compact ? 10 : 14, mB = compact ? 20 : 26;
  const pW = compact ? 220 : 380, pH = compact ? 150 : 240;
  const w = mL + pW + mR, h = mT + pH + mB;

  const fMax = general ? 3.5 : Math.max(aVal, 1 / aVal);
  const fMin = general ? 0.2 : Math.min(aVal, 1 / aVal);
  const yMinM = Math.min(fMin, 0) - 0.3, yMaxM = fMax + 0.5;
  const xMinM = 0, xMaxM = 2 * Math.PI;

  const toSx = (x) => mL + ((x - xMinM) / (xMaxM - xMinM)) * pW;
  const toSy = (y) => mT + ((yMaxM - y) / (yMaxM - yMinM)) * pH;
  const sfs = compact ? 7 : 9;

  const N = 500;
  const pts = [];
  for (let i = 0; i <= N; i++) {
    const x = (xMaxM * i) / N;
    const y = general ? 2 + 1.2 * Math.cos(x) : Math.pow(aVal, Math.cos(x));
    pts.push(`${toSx(x).toFixed(1)},${toSy(y).toFixed(1)}`);
  }
  const diff = general ? null : Math.abs(fMax - fMin);

  const yGridVals = [];
  for (let v = Math.ceil(yMinM); v <= Math.floor(yMaxM); v++) yGridVals.push(v);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", display: "block" }}>
      {/* Horizontal gridlines + y labels */}
      {yGridVals.map(v => (
        <g key={"yg" + v}>
          <line x1={mL} y1={toSy(v)} x2={mL + pW} y2={toSy(v)}
            stroke={v === 0 ? C.muted : C.border} strokeWidth={v === 0 ? 0.8 : 0.5}
            strokeDasharray={v === 0 ? "none" : "4,4"} opacity={v === 0 ? 0.5 : 0.4} />
          <text x={mL - 5} y={toSy(v) + 3} fill={C.muted} fontSize={sfs}
            textAnchor="end" opacity={0.6} fontFamily={mathFont}>{v}</text>
        </g>
      ))}
      {/* Vertical gridlines at pi, 2pi */}
      {[Math.PI, 2 * Math.PI].map((v, i) => (
        <g key={"xg" + i}>
          <line x1={toSx(v)} y1={mT} x2={toSx(v)} y2={mT + pH}
            stroke={C.border} strokeWidth={0.5} strokeDasharray="4,4" opacity={0.4} />
          <text x={toSx(v)} y={mT + pH + 13} fill={C.muted} fontSize={sfs}
            textAnchor="middle" opacity={0.6} fontFamily={mathFont}>
            {i === 0 ? "\u03C0" : "2\u03C0"}
          </text>
        </g>
      ))}
      {/* Y-axis */}
      <line x1={mL} y1={mT} x2={mL} y2={mT + pH} stroke={C.muted} strokeWidth={0.8} opacity={0.4} />
      {!compact && (
        <>
          <text x={mL + pW + 4} y={toSy(0) + 4} fill={C.muted} fontSize={8} opacity={0.5} fontStyle="italic">x</text>
          <text x={mL + 4} y={mT - 2} fill={C.muted} fontSize={8} opacity={0.5} fontStyle="italic">y</text>
        </>
      )}

      {/* The curve */}
      <polyline points={pts.join(" ")} fill="none" stroke={C.curve}
        strokeWidth={compact ? 2 : 2.5} opacity={0.9} strokeLinejoin="round" />

      {/* Max/min dashed lines + labels with backgrounds */}
      {showMaxMin && !general && (
        <>
          <line x1={mL} y1={toSy(fMax)} x2={mL + pW} y2={toSy(fMax)}
            stroke={C.maxC} strokeWidth={1} strokeDasharray="5,4" opacity={0.5} />
          <rect x={mL + pW + 3} y={toSy(fMax) - 7} width={compact ? 34 : 42} height={14}
            rx={3} fill={C.bg} fillOpacity={0.9} stroke={C.maxC} strokeWidth={0.5} strokeOpacity={0.3} />
          <text x={mL + pW + (compact ? 20 : 24)} y={toSy(fMax) + 4} fill={C.maxC}
            fontSize={sfs} fontWeight={700} textAnchor="middle" fontFamily={mathFont}>
            {fMax.toFixed(2)}
          </text>
          <line x1={mL} y1={toSy(fMin)} x2={mL + pW} y2={toSy(fMin)}
            stroke={C.minC} strokeWidth={1} strokeDasharray="5,4" opacity={0.5} />
          <rect x={mL + pW + 3} y={toSy(fMin) - 7} width={compact ? 34 : 42} height={14}
            rx={3} fill={C.bg} fillOpacity={0.9} stroke={C.minC} strokeWidth={0.5} strokeOpacity={0.3} />
          <text x={mL + pW + (compact ? 20 : 24)} y={toSy(fMin) + 4} fill={C.minC}
            fontSize={sfs} fontWeight={700} textAnchor="middle" fontFamily={mathFont}>
            {fMin.toFixed(2)}
          </text>
        </>
      )}

      {/* Difference bracket */}
      {showDiffLabel && !general && diff > 0.01 && (() => {
        const bx = mL + pW + (compact ? 40 : 50);
        const topY = toSy(fMax), botY = toSy(fMin), midY = (topY + botY) / 2;
        return (
          <>
            <line x1={bx - 4} y1={topY} x2={bx} y2={topY} stroke={C.assum} strokeWidth={1} />
            <line x1={bx} y1={topY} x2={bx} y2={botY} stroke={C.assum} strokeWidth={1} />
            <line x1={bx - 4} y1={botY} x2={bx} y2={botY} stroke={C.assum} strokeWidth={1} />
            <rect x={bx + 3} y={midY - 7} width={compact ? 30 : 36} height={14} rx={3}
              fill={C.bg} fillOpacity={0.9} />
            <text x={bx + 3 + (compact ? 15 : 18)} y={midY + 4} fill={C.assum}
              fontSize={compact ? 8 : 10} fontWeight={700} textAnchor="middle"
              fontFamily={mathFont}>{diff.toFixed(2)}</text>
          </>
        );
      })()}

      {/* General mode: labels with background rects, positioned clear of curve */}
      {general && (() => {
        const maxY = toSy(2 + 1.2) - (compact ? 10 : 16);
        const minY = toSy(2 - 1.2) + (compact ? 16 : 22);
        const lblX = toSx(Math.PI);
        const fLblX = toSx(Math.PI * 1.55);
        const fLblY = toSy(1.6);
        return (
          <>
            <rect x={lblX - (compact ? 26 : 32)} y={maxY - 9} width={compact ? 52 : 64}
              height={14} rx={3} fill={C.bg} fillOpacity={0.85} />
            <text x={lblX} y={maxY + 2} fill={C.maxC} fontSize={compact ? 9 : 11}
              fontWeight={700} textAnchor="middle" fontFamily={mathFont}>max = a</text>
            <rect x={lblX - (compact ? 28 : 34)} y={minY - 9} width={compact ? 56 : 68}
              height={14} rx={3} fill={C.bg} fillOpacity={0.85} />
            <text x={lblX} y={minY + 2} fill={C.minC} fontSize={compact ? 9 : 11}
              fontWeight={700} textAnchor="middle" fontFamily={mathFont}>min = 1/a</text>
            <rect x={fLblX - (compact ? 44 : 56)} y={fLblY - 9} width={compact ? 88 : 112}
              height={16} rx={3} fill={C.bg} fillOpacity={0.85} />
            <text x={fLblX} y={fLblY + 3} fill={C.curve} fontSize={compact ? 9 : 11}
              fontWeight={600} textAnchor="middle" fontFamily={mathFont}>
              f(x) = a<tspan dy={-4} fontSize={compact ? 7 : 9}>cos x</tspan>
            </text>
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
      label: "Range of cos x",
      text: "Since x is real, cos x takes all values from -1 to 1.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>-1 {"\u2264"} cos x {"\u2264"} 1</span>
        </div>
      ),
      graph: null,
      color: C.ps,
    },
    {
      label: "Max and min of a^(cos x)",
      text: <span>Since a<sup>t</sup> is monotonic in t, the extreme values of a<sup>cos x</sup> occur when cos x = 1 and cos x = -1.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>If a {">"} 1: max = a<sup>1</sup> = a, min = a<sup>-1</sup> = 1/a</span>
          <span>If 0 {"<"} a {"<"} 1: max = a<sup>-1</sup> = 1/a, min = a<sup>1</sup> = a</span>
          <span style={{ color: C.muted, fontSize: 13 }}>Either way: difference = |a - 1/a| = 3</span>
        </div>
      ),
      graph: null,
      color: C.calc,
    },
    {
      label: "Case 1: a > 1",
      text: "When a > 1, the max is a and the min is 1/a.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>a - 1/a = 3</span>
          <span>a{"\u00B2"} - 1 = 3a</span>
          <span>a{"\u00B2"} - 3a - 1 = 0</span>
          <span>a = (3 + {"\u221A"}13)/2 <span style={{ color: C.muted, fontSize: 13 }}>(reject (3 - {"\u221A"}13)/2 {"<"} 0)</span></span>
        </div>
      ),
      graph: { a: A1 },
      color: C.maxC,
    },
    {
      label: "Case 2: 0 < a < 1",
      text: "When 0 < a < 1, the max is 1/a and the min is a.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>1/a - a = 3</span>
          <span>1 - a{"\u00B2"} = 3a</span>
          <span>a{"\u00B2"} + 3a - 1 = 0</span>
          <span>a = (-3 + {"\u221A"}13)/2 <span style={{ color: C.muted, fontSize: 13 }}>(reject (-3 - {"\u221A"}13)/2 {"<"} 0)</span></span>
        </div>
      ),
      graph: { a: A2 },
      color: C.minC,
    },
    {
      label: "Sum the values",
      text: "Add the two valid values of a.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>(3 + {"\u221A"}13)/2 + (-3 + {"\u221A"}13)/2</span>
          <span>= (3 + {"\u221A"}13 - 3 + {"\u221A"}13)/2</span>
          <span>= 2{"\u221A"}13 / 2</span>
          <span>= <strong style={{ color: C.ok }}>{"\u221A"}13</strong></span>
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
                      <FunctionGraph aVal={s.graph.a} showMaxMin showDiffLabel compact />
                    </div>
                  </div>
                ) : (
                  <div>
                    <p style={{ margin: "0 0 8px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{s.text}</p>
                    <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", fontSize: 17, color: C.white, fontFamily: mathFont, textAlign: "center", letterSpacing: 0.5, lineHeight: 2 }}>{s.math}</div>
                  </div>
                )}
                {i === steps.length - 1 && <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: C.conclBg, border: `1px solid ${C.ok}44`, fontSize: 13.5, color: C.ok, fontWeight: 600, lineHeight: 1.5 }}>The answer is F: {"\u221A"}13.</div>}
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
function AExplorer() {
  const [aVal, setAVal] = useState(2);

  const fMax = Math.max(aVal, 1 / aVal);
  const fMin = Math.min(aVal, 1 / aVal);
  const diff = fMax - fMin;
  const isDiff3 = Math.abs(diff - 3) < 0.01;
  const isA1 = Math.abs(aVal - A1) < 0.01;
  const isA2 = Math.abs(aVal - A2) < 0.01;

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Adjust a</span>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <input type="range" min={0.1} max={5} step={0.01} value={aVal} onChange={e => setAVal(parseFloat(e.target.value))} style={{ flex: 1, accentColor: C.accent, height: 6 }} />
          <div style={{ minWidth: 80, textAlign: "center" }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: C.curve, fontFamily: mathFont }}>a = {aVal.toFixed(2)}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setAVal(A1)} style={{
            flex: 1, padding: "10px 4px", borderRadius: 8, cursor: "pointer",
            border: `2px solid ${isA1 ? C.ok : C.border}`,
            background: isA1 ? C.ok + "15" : C.card,
            color: isA1 ? C.ok : C.muted,
            fontSize: 11, fontWeight: 700, transition: "all 0.2s",
          }}>
            <div>a = (3+{"\u221A"}13)/2</div>
            <div style={{ fontSize: 9, marginTop: 2, opacity: 0.7 }}>{"\u2248"} {A1.toFixed(3)}</div>
          </button>
          <button onClick={() => setAVal(1)} style={{
            flex: 1, padding: "10px 4px", borderRadius: 8, cursor: "pointer",
            border: `2px solid ${Math.abs(aVal - 1) < 0.01 ? C.assum : C.border}`,
            background: Math.abs(aVal - 1) < 0.01 ? C.assum + "15" : C.card,
            color: Math.abs(aVal - 1) < 0.01 ? C.assum : C.muted,
            fontSize: 11, fontWeight: 700, transition: "all 0.2s",
          }}>
            <div>a = 1</div>
            <div style={{ fontSize: 9, marginTop: 2, opacity: 0.7 }}>constant</div>
          </button>
          <button onClick={() => setAVal(A2)} style={{
            flex: 1, padding: "10px 4px", borderRadius: 8, cursor: "pointer",
            border: `2px solid ${isA2 ? C.ok : C.border}`,
            background: isA2 ? C.ok + "15" : C.card,
            color: isA2 ? C.ok : C.muted,
            fontSize: 11, fontWeight: 700, transition: "all 0.2s",
          }}>
            <div>a = (-3+{"\u221A"}13)/2</div>
            <div style={{ fontSize: 9, marginTop: 2, opacity: 0.7 }}>{"\u2248"} {A2.toFixed(3)}</div>
          </button>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 18 }}>
        <FunctionGraph aVal={aVal} showMaxMin showDiffLabel compact={false} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 18 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: C.maxC, fontWeight: 700, marginBottom: 4 }}>Max (a<sup>cos x</sup>)</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.maxC }}>{fMax.toFixed(3)}</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: C.minC, fontWeight: 700, marginBottom: 4 }}>Min (a<sup>cos x</sup>)</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.minC }}>{fMin.toFixed(3)}</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${isDiff3 ? C.ok : C.border}`, borderRadius: 14, padding: "14px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: isDiff3 ? C.ok : C.assum, fontWeight: 700, marginBottom: 4 }}>Difference</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: isDiff3 ? C.ok : C.white }}>{diff.toFixed(3)}</div>
          {isDiff3 && <div style={{ fontSize: 10, color: C.ok, fontWeight: 600, marginTop: 2 }}>= 3</div>}
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 18px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ background: C.assumBg, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.assum, fontWeight: 700, whiteSpace: "nowrap" }}>HINT</span>
          <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, margin: 0 }}>Try the two solution buttons - both give a difference of exactly 3. Notice that when a = 1, the function is constant (difference = 0). One solution has a {">"} 1, the other has 0 {"<"} a {"<"} 1.</p>
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
  { letter: "A", text: <span>0</span>, ok: false, expl: "a must be positive, and a = 0 is not valid for a^(cos x). Neither solution equals zero." },
  { letter: "B", text: <span>3/2</span>, ok: false, expl: "The two values are (3+\u221A13)/2 and (-3+\u221A13)/2. Their sum is \u221A13, not 3/2." },
  { letter: "C", text: <span>5/2</span>, ok: false, expl: "This does not match. The sum is \u221A13 \u2248 3.606, not 5/2 = 2.5." },
  { letter: "D", text: <span>3</span>, ok: false, expl: "3 is the given difference, not the sum of the a values. The sum \u221A13 \u2248 3.606." },
  { letter: "E", text: <span>{"\u221A"}10</span>, ok: false, expl: <span>{"\u221A"}10 {"\u2248"} 3.162. This likely comes from an error in the quadratic. The correct discriminant is 9 + 4 = 13, not 4 + 6 = 10.</span> },
  { letter: "F", text: <span>{"\u221A"}13</span>, ok: true, expl: <span>(3+{"\u221A"}13)/2 + (-3+{"\u221A"}13)/2 = 2{"\u221A"}13/2 = {"\u221A"}13. The 3 and -3 cancel, leaving {"\u221A"}13.</span> },
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
            <span style={{ fontSize: 12, color: C.ps }}>Exponentials</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TMUA 2022 {"\u00B7"} Paper 1 {"\u00B7"} Question 15</p>
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
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question 15</span>
            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: "0 0 8px" }}>The difference between the maximum and minimum values of the function f(x) = a<sup>cos x</sup>, where a {">"} 0 and x is real, is 3.</p>
              <p style={{ margin: 0 }}>Find the <strong style={{ color: C.assum }}>sum of the possible values of a</strong>.</p>
            </div>
            <div style={{ marginTop: 16 }}>
              <FunctionGraph aVal={2} showMaxMin={false} showDiffLabel={false} general compact={false} />
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: C.muted, textAlign: "center" }}>Schematic graph of a<sup>cos x</sup> for a {">"} 1 (shape only, not to scale)</div>
          </div>
        )}

        {/* Step 1: Setup */}
        {step === 1 && (
          <>
            <QuestionSummary />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>What do we know?</span>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 10px" }}>
                The function a<sup>cos x</sup> is a composition: the outer function is a<sup>t</sup> (exponential in t) and the inner function is cos x. Since cos x oscillates between -1 and 1, the output a<sup>cos x</sup> oscillates between a<sup>-1</sup> and a<sup>1</sup>.
              </p>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 16px" }}>
                Which of a and 1/a is larger depends on whether a {">"} 1 or 0 {"<"} a {"<"} 1. We need to consider both cases.
              </p>
              <FunctionGraph aVal={2} showMaxMin={false} showDiffLabel={false} general compact={false} />
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>STRATEGY</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Set |a - 1/a| = 3 and solve. This gives two cases (a {">"} 1 and 0 {"<"} a {"<"} 1), each yielding a quadratic. Find all positive solutions, then sum them.</p>
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
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Slide a and watch the graph of a<sup>cos x</sup> change shape. The max, min, and their difference update in real time. The difference equals 3 at exactly two values of a.</p>
              </div>
            </div>
            <AExplorer />
          </>
        )}

        {/* Step 4: Answer */}
        {step === 4 && (
          <>
            <QuestionSummary />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6, fontStyle: "italic" }}>"Find the sum of the possible values of a."</div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Both solutions</span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div style={{ background: C.maxC + "12", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: C.maxC, fontWeight: 700, marginBottom: 4 }}>a {">"} 1</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.maxC }}>(3+{"\u221A"}13)/2</div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{"\u2248"} {A1.toFixed(3)}</div>
                </div>
                <div style={{ background: C.minC + "12", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: C.minC, fontWeight: 700, marginBottom: 4 }}>0 {"<"} a {"<"} 1</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.minC }}>(-3+{"\u221A"}13)/2</div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{"\u2248"} {A2.toFixed(3)}</div>
                </div>
              </div>
              <div style={{ background: C.ok + "12", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 10, color: C.ok, fontWeight: 700, marginBottom: 4 }}>Sum</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: C.ok }}>{"\u221A"}13</div>
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
