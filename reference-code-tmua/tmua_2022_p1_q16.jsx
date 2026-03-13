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
  ptA: "#a29bfe", ptB: "#fd79a8", ptC: "#55efc4",
  right: "#fdcb6e",
};
const mathFont = "'Cambria Math','Latin Modern Math','STIX Two Math',Georgia,serif";

const stepsMeta = [
  { id: 0, label: "Read", title: "Read the Question" },
  { id: 1, label: "Setup", title: "Identify the Approach" },
  { id: 2, label: "Solve", title: "Find All Possible k Values" },
  { id: 3, label: "Verify", title: "Drag k to See Right Angles" },
  { id: 4, label: "Answer", title: "Confirm the Answer" },
];

/* Fixed vertices */
const A = { x: 2, y: 3 };
const B = { x: 9, y: -1 };
/* C = (5, k) where k varies */
const K_SOLUTIONS = [-8, -3, 5, 8.25]; // all valid k values
const K_SUM = 2.25;

function QuestionSummary() {
  return (
    <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 18px", marginBottom: 16, textAlign: "center" }}>
      <p style={{ margin: "0 0 8px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
        <span style={{ fontWeight: 700, color: C.muted, letterSpacing: 0.5, marginRight: 6 }}>Q16</span>
        A right-angled triangle has vertices at (2, 3), (9, -1) and (5, k). Find the <strong style={{ color: C.assum }}>sum of all possible values of k</strong>.
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 10, fontSize: 11, fontWeight: 600, color: C.muted, flexWrap: "wrap" }}>
        <span>A: -8</span><span>B: -6</span><span>C: 0.25</span><span>D: 2</span><span>E: 2.25</span><span>F: 8.25</span><span>G: 10.25</span>
      </div>
    </div>
  );
}

/* ───── Triangle Diagram ─────
   Content-driven viewBox: computes bounds from actual points + padding.
   Props:
   - k: current k value for point C
   - showRightAngle: highlight right angle marker if triangle is right-angled
   - showLabels: show vertex coordinate labels
   - showRightAngle: highlight right angle marker if triangle is right-angled
   - showKLine: show dashed vertical line x=5
   - highlightVertex: "A", "B", "C" or null - which vertex to emphasise
   - compact: smaller for solve pane
*/
function TriangleDiagram({ k, showRightAngle, showLabels, showKLine, highlightVertex, compact, general }) {
  const Cv = { x: 5, y: general ? 1 : k };
  const pts = [A, B, Cv];

  // Content bounds - when general, ensure enough room for the dashed line
  const pad = compact ? 1.8 : 2.5;
  const allX = pts.map(p => p.x);
  const allY = general ? [A.y, B.y, -2, 4] : pts.map(p => p.y);
  const minMX = Math.min(...allX) - pad;
  const maxMX = Math.max(...allX) + pad;
  const minMY = Math.min(...allY) - pad;
  const maxMY = Math.max(...allY) + pad;
  const mathW = maxMX - minMX;
  const mathH = maxMY - minMY;

  const targetW = compact ? 300 : 480;
  const scale = targetW / mathW;
  const w = targetW;
  const h = mathH * scale;

  const toSx = (x) => (x - minMX) * scale;
  const toSy = (y) => (maxMY - y) * scale;
  const fs = compact ? 9 : 12;
  const sfs = compact ? 8 : 10;

  // Dot products for right-angle detection
  const dot = (v1, v2) => v1[0] * v2[0] + v1[1] * v2[1];
  const dotAtA = dot([B.x - A.x, B.y - A.y], [Cv.x - A.x, Cv.y - A.y]);
  const dotAtB = dot([A.x - B.x, A.y - B.y], [Cv.x - B.x, Cv.y - B.y]);
  const dotAtC = dot([A.x - Cv.x, A.y - Cv.y], [B.x - Cv.x, B.y - Cv.y]);

  const tol = 0.01;
  const rightAtA = Math.abs(dotAtA) < tol;
  const rightAtB = Math.abs(dotAtB) < tol;
  const rightAtC = Math.abs(dotAtC) < tol;
  const isRight = rightAtA || rightAtB || rightAtC;

  // Right-angle marker helper
  const drawRightAngle = (vertex, p1, p2) => {
    const sz = compact ? 8 : 12;
    const v1x = p1.x - vertex.x, v1y = p1.y - vertex.y;
    const v2x = p2.x - vertex.x, v2y = p2.y - vertex.y;
    const len1 = Math.sqrt(v1x * v1x + v1y * v1y);
    const len2 = Math.sqrt(v2x * v2x + v2y * v2y);
    const u1x = v1x / len1, u1y = v1y / len1;
    const u2x = v2x / len2, u2y = v2y / len2;
    const ax = toSx(vertex.x + u1x * sz / scale);
    const ay = toSy(vertex.y + u1y * sz / scale);
    const bx = toSx(vertex.x + (u1x + u2x) * sz / scale);
    const by = toSy(vertex.y + (u1y + u2y) * sz / scale);
    const cx = toSx(vertex.x + u2x * sz / scale);
    const cy = toSy(vertex.y + u2y * sz / scale);
    return <polyline points={`${ax},${ay} ${bx},${by} ${cx},${cy}`} fill="none" stroke={C.right} strokeWidth={1.5} />;
  };

  // Axis tick range
  const xTickMin = Math.ceil(minMX), xTickMax = Math.floor(maxMX);
  const yTickMin = Math.ceil(minMY), yTickMax = Math.floor(maxMY);

  const ptColors = { A: C.ptA, B: C.ptB, C: C.ptC };
  const labels = [
    { pt: A, name: "A", label: "(2, 3)", color: C.ptA, offX: compact ? -6 : -8, offY: compact ? -8 : -10 },
    { pt: B, name: "B", label: "(9, -1)", color: C.ptB, offX: compact ? 6 : 8, offY: compact ? 12 : 14 },
    { pt: Cv, name: "C", label: general ? "(5, k)" : `(5, ${Number.isInteger(k) ? k : k.toFixed(2)})`, color: C.ptC, offX: compact ? 6 : 8, offY: compact ? -6 : -8 },
  ];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", display: "block" }}>
      {/* Axes */}
      <line x1={0} y1={toSy(0)} x2={w} y2={toSy(0)} stroke={C.muted} strokeWidth={0.7} opacity={0.35} />
      <line x1={toSx(0)} y1={0} x2={toSx(0)} y2={h} stroke={C.muted} strokeWidth={0.7} opacity={0.35} />
      {/* X ticks */}
      {Array.from({ length: xTickMax - xTickMin + 1 }, (_, i) => xTickMin + i).filter(v => v !== 0).map(v => (
        <g key={"xt" + v}>
          <line x1={toSx(v)} y1={toSy(0) - 3} x2={toSx(v)} y2={toSy(0) + 3} stroke={C.muted} strokeWidth={0.5} opacity={0.4} />
          {!compact && <text x={toSx(v)} y={toSy(0) + 12} fill={C.muted} fontSize={7} textAnchor="middle" opacity={0.5}>{v}</text>}
        </g>
      ))}
      {/* Y ticks */}
      {Array.from({ length: yTickMax - yTickMin + 1 }, (_, i) => yTickMin + i).filter(v => v !== 0).map(v => (
        <g key={"yt" + v}>
          <line x1={toSx(0) - 3} y1={toSy(v)} x2={toSx(0) + 3} y2={toSy(v)} stroke={C.muted} strokeWidth={0.5} opacity={0.4} />
          {!compact && <text x={toSx(0) - 6} y={toSy(v) + 3} fill={C.muted} fontSize={7} textAnchor="end" opacity={0.5}>{v}</text>}
        </g>
      ))}
      {!compact && (
        <>
          <text x={w - 6} y={toSy(0) - 5} fill={C.muted} fontSize={9} textAnchor="end" opacity={0.5} fontStyle="italic">x</text>
          <text x={toSx(0) + 8} y={10} fill={C.muted} fontSize={9} opacity={0.5} fontStyle="italic">y</text>
        </>
      )}

      {/* Dashed vertical line x=5 */}
      {showKLine && (
        <>
          <line x1={toSx(5)} y1={0} x2={toSx(5)} y2={h} stroke={C.ptC} strokeWidth={1} strokeDasharray="5,4" opacity={0.25} />
          {general && (
            <>
              {/* Arrows indicating C can move up/down */}
              <polygon points={`${toSx(5)},${toSy(Cv.y) - (compact ? 22 : 30)} ${toSx(5) - 4},${toSy(Cv.y) - (compact ? 14 : 20)} ${toSx(5) + 4},${toSy(Cv.y) - (compact ? 14 : 20)}`} fill={C.ptC} opacity={0.5} />
              <polygon points={`${toSx(5)},${toSy(Cv.y) + (compact ? 22 : 30)} ${toSx(5) - 4},${toSy(Cv.y) + (compact ? 14 : 20)} ${toSx(5) + 4},${toSy(Cv.y) + (compact ? 14 : 20)}`} fill={C.ptC} opacity={0.5} />
            </>
          )}
        </>
      )}

      {/* Triangle fill */}
      <polygon
        points={`${toSx(A.x)},${toSy(A.y)} ${toSx(B.x)},${toSy(B.y)} ${toSx(Cv.x)},${toSy(Cv.y)}`}
        fill={!general && isRight && showRightAngle ? C.ok + "10" : C.accent + "08"}
        stroke={!general && isRight && showRightAngle ? C.ok : C.muted}
        strokeWidth={compact ? 1.5 : 2}
        strokeDasharray={general ? "6,4" : "none"}
        opacity={general ? 0.5 : 0.8}
      />

      {/* Right-angle marker */}
      {!general && showRightAngle && rightAtA && drawRightAngle(A, B, Cv)}
      {!general && showRightAngle && rightAtB && drawRightAngle(B, A, Cv)}
      {!general && showRightAngle && rightAtC && drawRightAngle(Cv, A, B)}

      {/* Vertex dots and labels */}
      {labels.map(l => (
        <g key={l.name}>
          <circle cx={toSx(l.pt.x)} cy={toSy(l.pt.y)} r={compact ? 4 : 5}
            fill={highlightVertex === l.name ? l.color : l.color}
            opacity={highlightVertex && highlightVertex !== l.name ? 0.4 : 1} />
          {showLabels && (
            <text x={toSx(l.pt.x) + l.offX} y={toSy(l.pt.y) + l.offY}
              fill={l.color} fontSize={sfs} fontWeight={700}
              textAnchor={l.offX < 0 ? "end" : "start"}
              fontFamily="'Gill Sans',sans-serif"
              opacity={highlightVertex && highlightVertex !== l.name ? 0.4 : 1}>
              {l.name} {l.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

/* ───── Solve Step ───── */
function SolveStep() {
  const [revealed, setRevealed] = useState(0);
  const steps = [
    {
      label: "Right angle at C(5, k)",
      text: "If the right angle is at C, the gradients of CA and CB must multiply to give -1.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>m<sub>CA</sub> = (3 - k)/(-3), m<sub>CB</sub> = (-1 - k)/4</span>
          <span>m<sub>CA</sub> {"\u00D7"} m<sub>CB</sub> = -1</span>
          <span>(3 - k)(-1 - k) / (-12) = -1</span>
          <span>(3 - k)(-1 - k) = 12</span>
          <span>k{"\u00B2"} - 2k - 15 = 0</span>
          <span>(k - 5)(k + 3) = 0</span>
          <span style={{ color: C.ok }}>k = 5 or k = -3</span>
        </div>
      ),
      graph: { k: 5, hl: "C" },
      color: C.ptC,
    },
    {
      label: "Right angle at A(2, 3)",
      text: "If the right angle is at A, the gradients of AB and AC must multiply to give -1.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>m<sub>AB</sub> = -4/7, m<sub>AC</sub> = (k - 3)/3</span>
          <span>(-4/7) {"\u00D7"} (k - 3)/3 = -1</span>
          <span>-4(k - 3) = -21</span>
          <span>k - 3 = 21/4</span>
          <span style={{ color: C.ok }}>k = 33/4 = 8.25</span>
        </div>
      ),
      graph: { k: 8.25, hl: "A" },
      color: C.ptA,
    },
    {
      label: "Right angle at B(9, -1)",
      text: "If the right angle is at B, the gradients of BA and BC must multiply to give -1.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>m<sub>BA</sub> = 4/(-7) = -4/7</span>
          <span>m<sub>BC</sub> = (k + 1)/(-4)</span>
          <span>(-4/7) {"\u00D7"} (k + 1)/(-4) = -1</span>
          <span>(k + 1)/7 = -1</span>
          <span style={{ color: C.ok }}>k = -8</span>
        </div>
      ),
      graph: { k: -8, hl: "B" },
      color: C.ptB,
    },
    {
      label: "Sum all values",
      text: "We found four valid values of k. Sum them.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>k = -8, -3, 5, 8.25</span>
          <span>Sum = -8 + (-3) + 5 + 8.25</span>
          <span>= <strong style={{ color: C.ok }}>2.25</strong></span>
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
                      <TriangleDiagram k={s.graph.k} showRightAngle showLabels showKLine={false} highlightVertex={s.graph.hl} compact />
                    </div>
                  </div>
                ) : (
                  <div>
                    <p style={{ margin: "0 0 8px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{s.text}</p>
                    <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", fontSize: 17, color: C.white, fontFamily: mathFont, textAlign: "center", letterSpacing: 0.5, lineHeight: 2 }}>{s.math}</div>
                  </div>
                )}
                {i === steps.length - 1 && <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: C.conclBg, border: `1px solid ${C.ok}44`, fontSize: 13.5, color: C.ok, fontWeight: 600, lineHeight: 1.5 }}>The answer is E: 2.25.</div>}
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
function KExplorer() {
  const [k, setK] = useState(1);

  const Cv = { x: 5, y: k };

  // Gradients from each vertex
  const gradAB = (B.y - A.y) / (B.x - A.x); // -4/7
  const gradAC = (Cv.y - A.y) / (Cv.x - A.x); // (k-3)/3
  const gradBA = (A.y - B.y) / (A.x - B.x); // same as gradAB = -4/7
  const gradBC = (Cv.y - B.y) / (Cv.x - B.x); // (k+1)/(-4)
  const gradCA = (A.y - Cv.y) / (A.x - Cv.x); // (3-k)/(-3)
  const gradCB = (B.y - Cv.y) / (B.x - Cv.x); // (-1-k)/4

  // Gradient products: perpendicular when = -1
  const prodAtA = gradAB * gradAC;
  const prodAtB = gradBA * gradBC;
  const prodAtC = gradCA * gradCB;

  const tol = 0.08;
  const rightAtA = Math.abs(prodAtA - (-1)) < tol;
  const rightAtB = Math.abs(prodAtB - (-1)) < tol;
  const rightAtC = Math.abs(prodAtC - (-1)) < tol;
  const isRight = rightAtA || rightAtB || rightAtC;
  const rightLabel = rightAtA ? "A" : rightAtB ? "B" : rightAtC ? "C" : null;

  const presets = [
    { val: -8, label: "k = -8", vertex: "B" },
    { val: -3, label: "k = -3", vertex: "C" },
    { val: 5, label: "k = 5", vertex: "C" },
    { val: 8.25, label: "k = 8.25", vertex: "A" },
  ];

  const fmtProd = (v) => {
    if (!isFinite(v)) return "undef";
    return v.toFixed(2);
  };

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Drag k to explore</span>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <input type="range" min={-10} max={10} step={0.05} value={k} onChange={e => setK(parseFloat(e.target.value))} style={{ flex: 1, accentColor: C.accent, height: 6 }} />
          <div style={{ minWidth: 80, textAlign: "center" }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: C.ptC, fontFamily: mathFont }}>k = {k.toFixed(2)}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {presets.map(p => {
            const active = Math.abs(k - p.val) < 0.01;
            return (
              <button key={p.val} onClick={() => setK(p.val)} style={{
                flex: 1, minWidth: 70, padding: "10px 4px", borderRadius: 8, cursor: "pointer",
                border: `2px solid ${active ? C.ok : C.border}`,
                background: active ? C.ok + "15" : C.card,
                color: active ? C.ok : C.muted,
                fontSize: 11, fontWeight: 700, transition: "all 0.2s",
              }}>
                <div>{p.label}</div>
                <div style={{ fontSize: 9, marginTop: 2, opacity: 0.7 }}>right at {p.vertex}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 18 }}>
        <TriangleDiagram k={k} showRightAngle showLabels showKLine highlightVertex={null} compact={false} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 18 }}>
        <div style={{ background: C.card, border: `1px solid ${rightAtA ? C.ok : C.border}`, borderRadius: 14, padding: "14px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: rightAtA ? C.ok : C.ptA, fontWeight: 700, marginBottom: 4 }}>m<sub>AB</sub> {"\u00D7"} m<sub>AC</sub></div>
          <div style={{ fontSize: 18, fontWeight: 700, color: rightAtA ? C.ok : C.white }}>{fmtProd(prodAtA)}</div>
          {rightAtA && <div style={{ fontSize: 10, color: C.ok, fontWeight: 600, marginTop: 2 }}>= -1, right at A</div>}
        </div>
        <div style={{ background: C.card, border: `1px solid ${rightAtB ? C.ok : C.border}`, borderRadius: 14, padding: "14px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: rightAtB ? C.ok : C.ptB, fontWeight: 700, marginBottom: 4 }}>m<sub>BA</sub> {"\u00D7"} m<sub>BC</sub></div>
          <div style={{ fontSize: 18, fontWeight: 700, color: rightAtB ? C.ok : C.white }}>{fmtProd(prodAtB)}</div>
          {rightAtB && <div style={{ fontSize: 10, color: C.ok, fontWeight: 600, marginTop: 2 }}>= -1, right at B</div>}
        </div>
        <div style={{ background: C.card, border: `1px solid ${rightAtC ? C.ok : C.border}`, borderRadius: 14, padding: "14px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: rightAtC ? C.ok : C.ptC, fontWeight: 700, marginBottom: 4 }}>m<sub>CA</sub> {"\u00D7"} m<sub>CB</sub></div>
          <div style={{ fontSize: 18, fontWeight: 700, color: rightAtC ? C.ok : C.white }}>{fmtProd(prodAtC)}</div>
          {rightAtC && <div style={{ fontSize: 10, color: C.ok, fontWeight: 600, marginTop: 2 }}>= -1, right at C</div>}
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${isRight ? C.ok + "44" : C.border}`, borderRadius: 14, padding: "14px 18px", textAlign: "center", marginBottom: 18 }}>
        {isRight ? (
          <span style={{ fontSize: 14, fontWeight: 700, color: C.ok }}>Right angle at {rightLabel} when k = {k.toFixed(2)}</span>
        ) : (
          <span style={{ fontSize: 14, color: C.muted }}>No right angle at this k</span>
        )}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 18px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ background: C.assumBg, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.assum, fontWeight: 700, whiteSpace: "nowrap" }}>HINT</span>
          <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, margin: 0 }}>There are four values of k that give a right angle: try the preset buttons above. Two come from the right angle at C (a quadratic), one from A, and one from B.</p>
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
  { letter: "A", text: <span>-8</span>, ok: false, expl: "This is just k = -8, one of the four solutions. It omits k = -3, 5, and 8.25." },
  { letter: "B", text: <span>-6</span>, ok: false, expl: "This would be the sum of only k = -8 and k = -3 (omitting the cases where the right angle is at C giving k = 5, and at A giving k = 8.25)." },
  { letter: "C", text: <span>0.25</span>, ok: false, expl: "This likely comes from finding only three of the four values. Check all three cases: right angle at A, at B, and at C (which gives a quadratic with two roots)." },
  { letter: "D", text: <span>2</span>, ok: false, expl: "Close but not quite. The sum -8 + (-3) + 5 + 8.25 = 2.25, not 2. Likely an arithmetic slip." },
  { letter: "E", text: <span>2.25</span>, ok: true, expl: <span>All four values: k = -8 (right at B) + (-3) (right at C) + 5 (right at C) + 8.25 (right at A) = 2.25.</span> },
  { letter: "F", text: <span>8.25</span>, ok: false, expl: "This is just k = 33/4 from the right angle at A. There are three other values to include." },
  { letter: "G", text: <span>10.25</span>, ok: false, expl: "This is 5 + 8.25 - 3 = 10.25, which omits k = -8 from the right angle at B." },
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
            <span style={{ fontSize: 12, color: C.ps }}>Coordinate Geometry</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TMUA 2022 {"\u00B7"} Paper 1 {"\u00B7"} Question 16</p>
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
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question 16</span>
            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: "0 0 8px" }}>A right-angled triangle has vertices at (2, 3), (9, -1) and (5, k).</p>
              <p style={{ margin: 0 }}>Find the <strong style={{ color: C.assum }}>sum of all the possible values of k</strong>.</p>
            </div>
            <div style={{ marginTop: 16 }}>
              <TriangleDiagram k={1} showRightAngle={false} showLabels showKLine highlightVertex={null} compact={false} general />
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: C.muted, textAlign: "center" }}>k is unknown - C can slide along x = 5</div>
          </div>
        )}

        {/* Step 1: Setup */}
        {step === 1 && (
          <>
            <QuestionSummary />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>What do we know?</span>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 10px" }}>
                We have three vertices, one of which has an unknown y-coordinate k. The triangle must be right-angled, but we do not know which vertex the right angle is at.
              </p>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 16px" }}>
                We need to consider all three possibilities: the right angle could be at A(2, 3), at B(9, -1), or at C(5, k). Each case gives an equation from the perpendicularity condition.
              </p>
              <TriangleDiagram k={1} showRightAngle={false} showLabels showKLine highlightVertex={null} compact={false} general />
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>STRATEGY</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>For each vertex V, find the gradients of the two edges meeting at V and set their product equal to -1 (the perpendicular gradient condition). This gives a linear equation when V = A or V = B, and a quadratic when V = C. Solve each, then sum all valid k values.</p>
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
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Drag k along the slider and watch the three gradient products. When any one hits -1, the two edges at that vertex are perpendicular. Use the preset buttons to snap to each solution.</p>
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
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6, fontStyle: "italic" }}>"Find the sum of all the possible values of k."</div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>All solutions</span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
                {[
                  { k: -8, at: "B", color: C.ptB },
                  { k: -3, at: "C", color: C.ptC },
                  { k: 5, at: "C", color: C.ptC },
                  { k: 8.25, at: "A", color: C.ptA },
                ].map(s => (
                  <div key={s.k} style={{ background: s.color + "12", borderRadius: 8, padding: "12px 10px", textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: s.color, fontWeight: 700, marginBottom: 4 }}>Right at {s.at}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.k}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: C.ok + "12", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 10, color: C.ok, fontWeight: 700, marginBottom: 4 }}>Sum of all k values</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: C.ok }}>2.25</div>
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
