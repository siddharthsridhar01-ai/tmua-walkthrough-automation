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
  c1: "#a29bfe", c2: "#fd79a8", line: "#55efc4",
};
const mathFont = "'Cambria Math','Latin Modern Math','STIX Two Math',Georgia,serif";

const stepsMeta = [
  { id: 0, label: "Read", title: "Read the Question" },
  { id: 1, label: "Setup", title: "Identify the Approach" },
  { id: 2, label: "Solve", title: "Find the Maximum Distance" },
  { id: 3, label: "Verify", title: "Explore P and Q Positions" },
  { id: 4, label: "Answer", title: "Confirm the Answer" },
];

/* Circle data */
const C1 = { x: 2, y: 1, r: 4 };
const C2 = { x: 4, y: -5, r: 4 };
const D_CENTRES = Math.sqrt((C2.x - C1.x) ** 2 + (C2.y - C1.y) ** 2); // 2sqrt(10)
const MAX_PQ = D_CENTRES + C1.r + C2.r; // 8 + 2sqrt(10)

function QuestionSummary() {
  return (
    <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 18px", marginBottom: 16, textAlign: "center" }}>
      <p style={{ margin: "0 0 8px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
        <span style={{ fontWeight: 700, color: C.muted, letterSpacing: 0.5, marginRight: 6 }}>Q13</span>
        P lies on (x - 2)<sup>2</sup> + (y - 1)<sup>2</sup> = 16. Q lies on (x - 4)<sup>2</sup> + (y + 5)<sup>2</sup> = 16. Find the <strong style={{ color: C.assum }}>maximum possible length of PQ</strong>.
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 10, fontSize: 11, fontWeight: 600, color: C.muted, flexWrap: "wrap" }}>
        <span>A: 10</span><span>B: 14</span><span>C: 16</span><span>D: 2{"\u221A"}34</span><span>E: 10{"\u221A"}2</span><span>F: 8+2{"\u221A"}10</span><span>G: 16+2{"\u221A"}6</span>
      </div>
    </div>
  );
}

/* ───── Two Circles Diagram ─────
   Props:
   - showCentres: label centres C1, C2
   - showRadii: show sample radii "4" on each circle
   - showDistLine: show dashed line between centres
   - showDistLabel: show d = 2sqrt(10) on centre line
   - showP/showQ: show point P and/or Q on circles
   - pAngle/qAngle: angle (rad) for P on C1 and Q on C2
   - showPQ: draw line PQ
   - showMaxLine: show the full aligned P-C1-C2-Q line for max
   - showMaxAnnotations: show segment annotations on the max line
   - compact: smaller size for solve pane
*/
function TwoCirclesDiagram({ showCentres, showRadii, showDistLine, showDistLabel, showP, showQ, pAngle, qAngle, showPQ, showMaxLine, showMaxAnnotations, compact }) {
  /* ── Content-driven viewBox ──
     Compute the bounding box of both circles, add padding for labels,
     then derive viewBox and scale from that. This guarantees nothing is cropped. */
  const pad = compact ? 1.5 : 2; // padding in math units around content
  const minMathX = Math.min(C1.x - C1.r, C2.x - C2.r) - pad;
  const maxMathX = Math.max(C1.x + C1.r, C2.x + C2.r) + pad;
  const minMathY = Math.min(C1.y - C1.r, C2.y - C2.r) - pad;
  const maxMathY = Math.max(C1.y + C1.r, C2.y + C2.r) + pad;
  const mathW = maxMathX - minMathX;
  const mathH = maxMathY - minMathY;

  // Target pixel width; height follows from aspect ratio
  const targetW = compact ? 320 : 500;
  const scale = targetW / mathW;
  const w = targetW;
  const h = mathH * scale;

  const toSx = (x) => (x - minMathX) * scale;
  const toSy = (y) => (maxMathY - y) * scale;
  const fs = compact ? 9 : 12;
  const sfs = compact ? 8 : 10;

  const c1Sx = toSx(C1.x), c1Sy = toSy(C1.y);
  const c2Sx = toSx(C2.x), c2Sy = toSy(C2.y);

  // P on circle 1
  const pX = C1.x + C1.r * Math.cos(pAngle || 0);
  const pY = C1.y + C1.r * Math.sin(pAngle || 0);
  const pSx = toSx(pX), pSy = toSy(pY);

  // Q on circle 2
  const qX = C2.x + C2.r * Math.cos(qAngle || 0);
  const qY = C2.y + C2.r * Math.sin(qAngle || 0);
  const qSx = toSx(qX), qSy = toSy(qY);

  // Max alignment direction: from C1 to C2
  const dx = C2.x - C1.x, dy = C2.y - C1.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / dist, uy = dy / dist;
  const pMaxX = C1.x - ux * C1.r, pMaxY = C1.y - uy * C1.r;
  const qMaxX = C2.x + ux * C2.r, qMaxY = C2.y + uy * C2.r;

  // Axis tick range (integers visible in the view)
  const xTickMin = Math.ceil(minMathX), xTickMax = Math.floor(maxMathX);
  const yTickMin = Math.ceil(minMathY), yTickMax = Math.floor(maxMathY);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", display: "block" }}>
      {/* Axes */}
      <line x1={0} y1={toSy(0)} x2={w} y2={toSy(0)} stroke={C.muted} strokeWidth={0.7} opacity={0.35} />
      <line x1={toSx(0)} y1={0} x2={toSx(0)} y2={h} stroke={C.muted} strokeWidth={0.7} opacity={0.35} />
      {/* X-axis ticks */}
      {Array.from({ length: xTickMax - xTickMin + 1 }, (_, i) => xTickMin + i).filter(v => v !== 0).map(v => (
        <g key={"xt" + v}>
          <line x1={toSx(v)} y1={toSy(0) - 3} x2={toSx(v)} y2={toSy(0) + 3} stroke={C.muted} strokeWidth={0.5} opacity={0.4} />
          {!compact && <text x={toSx(v)} y={toSy(0) + 12} fill={C.muted} fontSize={7} textAnchor="middle" opacity={0.5}>{v}</text>}
        </g>
      ))}
      {/* Y-axis ticks */}
      {Array.from({ length: yTickMax - yTickMin + 1 }, (_, i) => yTickMin + i).filter(v => v !== 0).map(v => (
        <g key={"yt" + v}>
          <line x1={toSx(0) - 3} y1={toSy(v)} x2={toSx(0) + 3} y2={toSy(v)} stroke={C.muted} strokeWidth={0.5} opacity={0.4} />
          {!compact && <text x={toSx(0) - 6} y={toSy(v) + 3} fill={C.muted} fontSize={7} textAnchor="end" opacity={0.5}>{v}</text>}
        </g>
      ))}
      {/* Axis labels */}
      {!compact && (
        <>
          <text x={w - 6} y={toSy(0) - 5} fill={C.muted} fontSize={9} textAnchor="end" opacity={0.5} fontStyle="italic">x</text>
          <text x={toSx(0) + 8} y={10} fill={C.muted} fontSize={9} opacity={0.5} fontStyle="italic">y</text>
        </>
      )}

      {/* Circle 1 */}
      <circle cx={c1Sx} cy={c1Sy} r={C1.r * scale} fill="none" stroke={C.c1} strokeWidth={compact ? 1.5 : 2} opacity={0.5} />
      {/* Circle 2 */}
      <circle cx={c2Sx} cy={c2Sy} r={C2.r * scale} fill="none" stroke={C.c2} strokeWidth={compact ? 1.5 : 2} opacity={0.5} />

      {/* Distance line between centres */}
      {showDistLine && (
        <line x1={c1Sx} y1={c1Sy} x2={c2Sx} y2={c2Sy} stroke={C.muted} strokeWidth={1.5} strokeDasharray="6,4" />
      )}

      {/* Max alignment line: P---C1---C2---Q */}
      {showMaxLine && (
        <>
          <line x1={toSx(pMaxX)} y1={toSy(pMaxY)} x2={toSx(qMaxX)} y2={toSy(qMaxY)} stroke={C.line} strokeWidth={compact ? 1.5 : 2} opacity={0.7} />
          <circle cx={toSx(pMaxX)} cy={toSy(pMaxY)} r={compact ? 4 : 5} fill={C.c1} />
          <text x={toSx(pMaxX) + (compact ? -10 : -12)} y={toSy(pMaxY) - (compact ? 5 : 8)} fill={C.c1} fontSize={fs} fontWeight={700} fontFamily="'Gill Sans',sans-serif" textAnchor="end">P</text>
          <circle cx={toSx(qMaxX)} cy={toSy(qMaxY)} r={compact ? 4 : 5} fill={C.c2} />
          <text x={toSx(qMaxX) + (compact ? 8 : 10)} y={toSy(qMaxY) + (compact ? 10 : 14)} fill={C.c2} fontSize={fs} fontWeight={700} fontFamily="'Gill Sans',sans-serif">Q</text>
        </>
      )}

      {/* Max annotations: segment labels */}
      {showMaxAnnotations && (() => {
        const nx = -uy, ny = ux;
        const off = compact ? 12 : 18;
        const m1x = (pMaxX + C1.x) / 2, m1y = (pMaxY + C1.y) / 2;
        const m2x = (C1.x + C2.x) / 2, m2y = (C1.y + C2.y) / 2;
        const m3x = (C2.x + qMaxX) / 2, m3y = (C2.y + qMaxY) / 2;
        return (
          <>
            <text x={toSx(m1x) + nx * off} y={toSy(m1y) - ny * off} fill={C.c1} fontSize={sfs} fontWeight={700} textAnchor="middle" fontFamily={mathFont}>4</text>
            <text x={toSx(m2x) + nx * off} y={toSy(m2y) - ny * off} fill={C.muted} fontSize={sfs} fontWeight={700} textAnchor="middle" fontFamily={mathFont}>2{"\u221A"}10</text>
            <text x={toSx(m3x) + nx * off} y={toSy(m3y) - ny * off} fill={C.c2} fontSize={sfs} fontWeight={700} textAnchor="middle" fontFamily={mathFont}>4</text>
          </>
        );
      })()}

      {/* Distance label */}
      {showDistLabel && !showMaxAnnotations && (() => {
        const mx = (c1Sx + c2Sx) / 2, my = (c1Sy + c2Sy) / 2;
        const nx = -(C2.y - C1.y) / dist, ny = (C2.x - C1.x) / dist;
        const off = compact ? 10 : 14;
        return (
          <g>
            <rect x={mx + nx * off * scale / 10 - (compact ? 28 : 34)} y={my - ny * off * scale / 10 - 8} width={compact ? 56 : 68} height={16} rx={4} fill={C.bg} fillOpacity={0.95} />
            <text x={mx + nx * off * scale / 10} y={my - ny * off * scale / 10 + 4} fill={C.white} fontSize={sfs} fontWeight={700} textAnchor="middle" fontFamily={mathFont}>d = 2{"\u221A"}10</text>
          </g>
        );
      })()}

      {/* P point */}
      {showP && !showMaxLine && (
        <>
          <circle cx={pSx} cy={pSy} r={compact ? 4 : 5} fill={C.c1} />
          <text x={pSx - (compact ? 8 : 12)} y={pSy - (compact ? 4 : 6)} fill={C.c1} fontSize={fs} fontWeight={700} fontFamily="'Gill Sans',sans-serif" textAnchor="end">P</text>
        </>
      )}

      {/* Q point */}
      {showQ && !showMaxLine && (
        <>
          <circle cx={qSx} cy={qSy} r={compact ? 4 : 5} fill={C.c2} />
          <text x={qSx + (compact ? 6 : 8)} y={qSy + (compact ? 10 : 14)} fill={C.c2} fontSize={fs} fontWeight={700} fontFamily="'Gill Sans',sans-serif">Q</text>
        </>
      )}

      {/* PQ line */}
      {showPQ && !showMaxLine && (
        <line x1={pSx} y1={pSy} x2={qSx} y2={qSy} stroke={C.line} strokeWidth={1.5} opacity={0.6} />
      )}

      {/* Centre labels */}
      {showCentres && (
        <>
          <circle cx={c1Sx} cy={c1Sy} r={compact ? 2.5 : 3} fill={C.white} />
          <text x={c1Sx + (compact ? 5 : 8)} y={c1Sy - (compact ? 4 : 6)} fill={C.white} fontSize={sfs} fontWeight={700} fontFamily="'Gill Sans',sans-serif">C<tspan dy={2} fontSize={sfs - 2}>1</tspan><tspan dy={-2}>(2, 1)</tspan></text>
          <circle cx={c2Sx} cy={c2Sy} r={compact ? 2.5 : 3} fill={C.white} />
          <text x={c2Sx + (compact ? 5 : 8)} y={c2Sy + (compact ? 10 : 14)} fill={C.white} fontSize={sfs} fontWeight={700} fontFamily="'Gill Sans',sans-serif">C<tspan dy={2} fontSize={sfs - 2}>2</tspan><tspan dy={-2}>(4, -5)</tspan></text>
        </>
      )}

      {/* Radius annotations */}
      {showRadii && (
        <>
          <line x1={c1Sx} y1={c1Sy} x2={c1Sx + C1.r * scale} y2={c1Sy} stroke={C.c1} strokeWidth={1} strokeDasharray="4,3" opacity={0.6} />
          <text x={c1Sx + C1.r * scale / 2} y={c1Sy - (compact ? 4 : 6)} fill={C.c1} fontSize={sfs} fontWeight={600} textAnchor="middle" fontFamily={mathFont}>4</text>
          <line x1={c2Sx} y1={c2Sy} x2={c2Sx + C2.r * scale} y2={c2Sy} stroke={C.c2} strokeWidth={1} strokeDasharray="4,3" opacity={0.6} />
          <text x={c2Sx + C2.r * scale / 2} y={c2Sy - (compact ? 4 : 6)} fill={C.c2} fontSize={sfs} fontWeight={600} textAnchor="middle" fontFamily={mathFont}>4</text>
        </>
      )}
    </svg>
  );
}

/* ───── Solve Step ───── */
function SolveStep() {
  const [revealed, setRevealed] = useState(0);
  const steps = [
    {
      label: "Identify the circles",
      text: "Read off the centre and radius of each circle from standard form.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>C<sub>1</sub>: centre (2, 1), radius {"\u221A"}16 = 4</span>
          <span>C<sub>2</sub>: centre (4, -5), radius {"\u221A"}16 = 4</span>
        </div>
      ),
      graph: "centres",
      color: C.ps,
    },
    {
      label: "Distance between centres",
      text: "Apply the distance formula between (2, 1) and (4, -5).",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>d = {"\u221A"}((4-2){"\u00B2"} + (-5-1){"\u00B2"})</span>
          <span>= {"\u221A"}(4 + 36)</span>
          <span>= {"\u221A"}40 = 2{"\u221A"}10</span>
        </div>
      ),
      graph: "dist",
      color: C.calc,
    },
    {
      label: "Maximise PQ",
      text: "PQ is longest when P, C\u2081, C\u2082, Q are collinear, with P and Q on opposite sides.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>max PQ = r<sub>1</sub> + d + r<sub>2</sub></span>
          <span>= 4 + 2{"\u221A"}10 + 4</span>
          <span>= <strong style={{ color: C.ok }}>8 + 2{"\u221A"}10</strong></span>
        </div>
      ),
      graph: "max",
      color: C.ok,
    },
  ];

  const graphForStep = (g) => {
    if (g === "centres") return <TwoCirclesDiagram showCentres showRadii showDistLine={false} showDistLabel={false} showP={false} showQ={false} showPQ={false} showMaxLine={false} showMaxAnnotations={false} compact />;
    if (g === "dist") return <TwoCirclesDiagram showCentres showRadii={false} showDistLine showDistLabel showP={false} showQ={false} showPQ={false} showMaxLine={false} showMaxAnnotations={false} compact />;
    if (g === "max") return <TwoCirclesDiagram showCentres showRadii={false} showDistLine={false} showDistLabel={false} showP={false} showQ={false} showPQ={false} showMaxLine showMaxAnnotations compact />;
    return null;
  };

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
                    <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", fontSize: 17, color: C.white, fontFamily: mathFont, textAlign: "center", letterSpacing: 0.5, lineHeight: 2 }}>{s.math}</div>
                  </div>
                  <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px", display: "flex", alignItems: "center" }}>
                    {graphForStep(s.graph)}
                  </div>
                </div>
                {i === steps.length - 1 && <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: C.conclBg, border: `1px solid ${C.ok}44`, fontSize: 13.5, color: C.ok, fontWeight: 600, lineHeight: 1.5 }}>The answer is F: 8 + 2{"\u221A"}10.</div>}
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
function CircleExplorer() {
  const [pAngle, setPAngle] = useState(Math.PI * 0.75);
  const [qAngle, setQAngle] = useState(Math.PI * 1.75);

  const pX = C1.x + C1.r * Math.cos(pAngle);
  const pY = C1.y + C1.r * Math.sin(pAngle);
  const qX = C2.x + C2.r * Math.cos(qAngle);
  const qY = C2.y + C2.r * Math.sin(qAngle);
  const pqDist = Math.sqrt((qX - pX) ** 2 + (qY - pY) ** 2);

  // Max alignment angle: direction from C1 to C2
  const dirAngle = Math.atan2(C2.y - C1.y, C2.x - C1.x); // angle from C1 toward C2
  // P should go opposite: dirAngle + pi, Q should go same: dirAngle
  const pMaxAngle = dirAngle + Math.PI;
  const qMaxAngle = dirAngle;

  const isMax = Math.abs(pqDist - MAX_PQ) < 0.01;

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Move P and Q around their circles</span>

        <div style={{ display: "flex", gap: 20, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.c1, marginBottom: 6 }}>P on Circle 1</div>
            <input type="range" min={0} max={6.283} step={0.02} value={pAngle} onChange={e => setPAngle(parseFloat(e.target.value))} style={{ width: "100%", accentColor: C.c1, height: 6 }} />
            <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>({pX.toFixed(1)}, {pY.toFixed(1)})</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.c2, marginBottom: 6 }}>Q on Circle 2</div>
            <input type="range" min={0} max={6.283} step={0.02} value={qAngle} onChange={e => setQAngle(parseFloat(e.target.value))} style={{ width: "100%", accentColor: C.c2, height: 6 }} />
            <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>({qX.toFixed(1)}, {qY.toFixed(1)})</div>
          </div>
        </div>

        <button onClick={() => { setPAngle(pMaxAngle < 0 ? pMaxAngle + 2 * Math.PI : pMaxAngle); setQAngle(qMaxAngle < 0 ? qMaxAngle + 2 * Math.PI : qMaxAngle); }} style={{
          padding: "9px 18px", borderRadius: 8, cursor: "pointer",
          border: `2px solid ${C.accent}`, background: C.accent + "15",
          color: C.accent, fontSize: 11, fontWeight: 700, transition: "all 0.2s",
        }}>Snap to maximum</button>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 18 }}>
        <TwoCirclesDiagram showCentres showRadii={false} showDistLine showDistLabel={false} showP showQ pAngle={pAngle} qAngle={qAngle} showPQ showMaxLine={false} showMaxAnnotations={false} compact={false} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 18 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, marginBottom: 4 }}>Centre distance</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.white }}>2{"\u221A"}10</div>
          <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{"\u2248"} {D_CENTRES.toFixed(2)}</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${isMax ? C.ok : C.border}`, borderRadius: 14, padding: "14px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: isMax ? C.ok : C.muted, fontWeight: 700, marginBottom: 4 }}>PQ distance</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: isMax ? C.ok : C.white }}>{pqDist.toFixed(2)}</div>
          {isMax && <div style={{ fontSize: 10, color: C.ok, fontWeight: 600, marginTop: 2 }}>= 8 + 2{"\u221A"}10</div>}
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: C.ok, fontWeight: 700, marginBottom: 4 }}>Maximum PQ</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.ok }}>8+2{"\u221A"}10</div>
          <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{"\u2248"} {MAX_PQ.toFixed(2)}</div>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 18px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ background: C.assumBg, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.assum, fontWeight: 700, whiteSpace: "nowrap" }}>HINT</span>
          <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, margin: 0 }}>PQ is longest when P, C<sub>1</sub>, C<sub>2</sub>, Q all lie on the same straight line, with P and Q on opposite sides. Click "Snap to maximum" to see this alignment.</p>
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
  { letter: "A", text: <span>10</span>, ok: false, expl: "This would only be the case if the distance between centres were 2, not 2\u221A10. Check: 2 + 4 + 4 = 10, but d = 2\u221A10 \u2248 6.32." },
  { letter: "B", text: <span>14</span>, ok: false, expl: "This does not match any sensible combination of the radii and centre distance." },
  { letter: "C", text: <span>16</span>, ok: false, expl: "This is 2r\u2081 + 2r\u2082 = 2(4) + 2(4) = 16, i.e. the sum of the diameters, but we need one radius from each circle plus the centre distance." },
  { letter: "D", text: <span>2{"\u221A"}34</span>, ok: false, expl: <span>2{"\u221A"}34 {"\u2248"} 11.66. The correct maximum is 8 + 2{"\u221A"}10 {"\u2248"} 14.32. This is a distractor from a computation error.</span> },
  { letter: "E", text: <span>10{"\u221A"}2</span>, ok: false, expl: <span>10{"\u221A"}2 {"\u2248"} 14.14. Close but not equal to 8 + 2{"\u221A"}10 {"\u2248"} 14.32. Likely from a distance formula error.</span> },
  { letter: "F", text: <span>8 + 2{"\u221A"}10</span>, ok: true, expl: <span>r<sub>1</sub> + d + r<sub>2</sub> = 4 + 2{"\u221A"}10 + 4 = 8 + 2{"\u221A"}10. PQ is maximised when P, C<sub>1</sub>, C<sub>2</sub>, Q are collinear with P and Q on opposite sides.</span> },
  { letter: "G", text: <span>16 + 2{"\u221A"}6</span>, ok: false, expl: <span>16 + 2{"\u221A"}6 {"\u2248"} 20.90. Far too large - this exceeds the sum of both diameters plus the centre distance.</span> },
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
            <span style={{ fontSize: 12, color: C.ps }}>Circle Geometry</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TMUA 2022 {"\u00B7"} Paper 1 {"\u00B7"} Question 13</p>
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
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question 13</span>
            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: "0 0 8px" }}>Point P lies on the circle with equation (x - 2)<sup>2</sup> + (y - 1)<sup>2</sup> = 16.</p>
              <p style={{ margin: "0 0 8px" }}>Point Q lies on the circle with equation (x - 4)<sup>2</sup> + (y + 5)<sup>2</sup> = 16.</p>
              <p style={{ margin: 0 }}>What is the <strong style={{ color: C.assum }}>maximum possible length of PQ</strong>?</p>
            </div>
            <div style={{ marginTop: 16 }}>
              <TwoCirclesDiagram showCentres showRadii showDistLine={false} showDistLabel={false} showP={false} showQ={false} showPQ={false} showMaxLine={false} showMaxAnnotations={false} compact={false} />
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
                Both circles are in standard form, so we can read off the centres and radii directly. Both have radius 4, but they are centred at different points.
              </p>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 16px" }}>
                P is free to move anywhere on the first circle, and Q anywhere on the second. The distance PQ depends on where we place them.
              </p>
              <TwoCirclesDiagram showCentres showRadii showDistLine showDistLabel={false} showP showQ pAngle={Math.PI * 0.6} qAngle={Math.PI * 1.8} showPQ showMaxLine={false} showMaxAnnotations={false} compact={false} />
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>KEY INSIGHT</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>The distance PQ is maximised when P, C<sub>1</sub>, C<sub>2</sub>, Q all lie on the same straight line, with P and Q as far apart as possible. In this configuration, PQ = r<sub>1</sub> + d(C<sub>1</sub>, C<sub>2</sub>) + r<sub>2</sub>.</p>
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
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Drag P and Q around their circles. The distance PQ updates in real time. Use "Snap to maximum" to see the collinear configuration that achieves 8 + 2{"\u221A"}10 {"\u2248"} 14.32.</p>
              </div>
            </div>
            <CircleExplorer />
          </>
        )}

        {/* Step 4: Answer */}
        {step === 4 && (
          <>
            <QuestionSummary />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6, fontStyle: "italic" }}>"What is the maximum possible length of PQ?"</div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Summary</span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <div style={{ background: C.c1 + "12", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: C.c1, fontWeight: 700, marginBottom: 4 }}>Radius r<sub>1</sub></div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: C.c1 }}>4</div>
                </div>
                <div style={{ background: C.muted + "12", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, marginBottom: 4 }}>Centre dist d</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: C.white }}>2{"\u221A"}10</div>
                </div>
                <div style={{ background: C.c2 + "12", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: C.c2, fontWeight: 700, marginBottom: 4 }}>Radius r<sub>2</sub></div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: C.c2 }}>4</div>
                </div>
              </div>
              <div style={{ marginTop: 10, background: C.ok + "12", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 10, color: C.ok, fontWeight: 700, marginBottom: 4 }}>Max PQ = r<sub>1</sub> + d + r<sub>2</sub></div>
                <div style={{ fontSize: 24, fontWeight: 700, color: C.ok }}>8 + 2{"\u221A"}10</div>
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
