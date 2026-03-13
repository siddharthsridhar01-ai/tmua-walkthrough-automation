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
  kite: "#a29bfe", diag: "#636e80", rightAngle: "#fdcb6e",
  sidePS: "#fd79a8", sidePQ: "#74b9ff", sideSQ: "#55efc4",
};
const mathFont = "'Cambria Math','Latin Modern Math','STIX Two Math',Georgia,serif";
const bodyFont = "'Gill Sans','Trebuchet MS',Calibri,sans-serif";

const stepsMeta = [
  { id: 0, label: "Read", title: "Read the Question" },
  { id: 1, label: "Setup", title: "Identify the Approach" },
  { id: 2, label: "Solve", title: "Derive the Condition" },
  { id: 3, label: "Verify", title: "Adjust the Kite" },
  { id: 4, label: "Answer", title: "Confirm the Answer" },
];

function QuestionSummary() {
  return (
    <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 18px", marginBottom: 16, textAlign: "center" }}>
      <p style={{ margin: "0 0 6px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
        <span style={{ fontWeight: 700, color: C.muted, letterSpacing: 0.5, marginRight: 6 }}>Q11</span>
        Kite PQRS has diagonals meeting at O. OP = OR = x, OQ = y, OS = z.{" "}
        Which condition is <strong style={{ color: C.assum }}>necessary and sufficient</strong> for angle SPQ to be a right angle?
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, fontSize: 11, fontWeight: 600, color: C.muted, flexWrap: "wrap" }}>
        <span>A: x=y=z</span><span>B: 2x=y+z</span><span>C: x{"\u00B2"}=yz</span><span>D: y=z</span><span>E: y{"\u00B2"}=x{"\u00B2"}+z{"\u00B2"}</span>
      </div>
    </div>
  );
}

/* ───── Kite Diagram ─────
   Content-driven viewBox. Shows kite PQRS with O at centre.
   Props:
   - x, y, z: the distances OP=OR=x, OQ=y, OS=z
   - showLabels: show vertex and distance labels
   - showRightAngleO: show right angle marker at O
   - showRightAngleSPQ: show right angle marker at P (when applicable)
   - showTriangles: highlight triangles SOP and POQ
   - showPythag: show SP, PQ, SQ lengths
   - general: schematic mode with symbolic labels
   - compact: smaller for solve pane
*/
function KiteDiagram({ x, y, z, showLabels, showRightAngleO, showRightAngleSPQ, showTriangles, showPythag, general, compact }) {
  // Kite layout: O at origin, PR horizontal, SQ vertical
  // P = (-x, 0), R = (x, 0), S = (0, z), Q = (0, -y) -- S is up, Q is down
  const scale = compact ? 28 : 40;
  const xDisp = general ? 2.5 : x;
  const yDisp = general ? 3.5 : y;
  const zDisp = general ? 2 : z;

  const P = { x: -xDisp * scale, y: 0 };
  const R = { x: xDisp * scale, y: 0 };
  const S = { x: 0, y: -zDisp * scale }; // SVG y is inverted
  const Q = { x: 0, y: yDisp * scale };
  const O = { x: 0, y: 0 };

  // Content-driven viewBox
  const pad = compact ? 28 : 42;
  const allX = [P.x, R.x, S.x, Q.x];
  const allY = [P.y, R.y, S.y, Q.y];
  const minX = Math.min(...allX) - pad - (compact ? 10 : 20);
  const maxX = Math.max(...allX) + pad + (compact ? 10 : 20);
  const minY = Math.min(...allY) - pad - (compact ? 14 : 24);
  const maxY = Math.max(...allY) + pad + (compact ? 14 : 24);
  const w = maxX - minX, h = maxY - minY;

  const sfs = compact ? 8 : 10;
  const textRectW = (str, fs) => str.length * fs * 0.62 + (compact ? 6 : 10);
  const raSize = compact ? 8 : 12; // right angle marker size

  // Computed lengths
  const SP = Math.sqrt(xDisp * xDisp + zDisp * zDisp);
  const PQ = Math.sqrt(xDisp * xDisp + yDisp * yDisp);
  const SQ = yDisp + zDisp;
  const isRightAngle = !general && Math.abs(SP * SP + PQ * PQ - SQ * SQ) < 0.01;

  return (
    <svg viewBox={`${minX} ${minY} ${w} ${h}`} style={{ width: "100%", display: "block" }}>
      {/* Triangle highlights */}
      {showTriangles && (
        <>
          <polygon points={`${S.x},${S.y} ${O.x},${O.y} ${P.x},${P.y}`}
            fill={C.sidePS} fillOpacity={0.08} stroke="none" />
          <polygon points={`${P.x},${P.y} ${O.x},${O.y} ${Q.x},${Q.y}`}
            fill={C.sidePQ} fillOpacity={0.08} stroke="none" />
        </>
      )}
      {/* Kite outline */}
      <polygon points={`${P.x},${P.y} ${S.x},${S.y} ${R.x},${R.y} ${Q.x},${Q.y}`}
        fill="none" stroke={C.kite} strokeWidth={compact ? 1.5 : 2} strokeLinejoin="round" />
      {/* Diagonals */}
      <line x1={P.x} y1={P.y} x2={R.x} y2={R.y} stroke={C.diag} strokeWidth={0.8} strokeDasharray="5,4" opacity={0.5} />
      <line x1={S.x} y1={S.y} x2={Q.x} y2={Q.y} stroke={C.diag} strokeWidth={0.8} strokeDasharray="5,4" opacity={0.5} />
      {/* Right angle at O */}
      {showRightAngleO && (
        <path d={`M ${O.x + raSize},${O.y} L ${O.x + raSize},${O.y - raSize} L ${O.x},${O.y - raSize}`}
          fill="none" stroke={C.rightAngle} strokeWidth={1} />
      )}
      {/* Right angle at P (angle SPQ) */}
      {showRightAngleSPQ && (isRightAngle || general) && (
        (() => {
          // Direction from P to S and P to Q
          const psx = S.x - P.x, psy = S.y - P.y;
          const pqx = Q.x - P.x, pqy = Q.y - P.y;
          const psLen = Math.sqrt(psx * psx + psy * psy);
          const pqLen = Math.sqrt(pqx * pqx + pqy * pqy);
          const ux1 = psx / psLen * raSize, uy1 = psy / psLen * raSize;
          const ux2 = pqx / pqLen * raSize, uy2 = pqy / pqLen * raSize;
          return (
            <path d={`M ${P.x + ux1},${P.y + uy1} L ${P.x + ux1 + ux2},${P.y + uy1 + uy2} L ${P.x + ux2},${P.y + uy2}`}
              fill="none" stroke={C.rightAngle} strokeWidth={1.5} />
          );
        })()
      )}
      {/* SP and PQ lines when showing Pythagoras */}
      {showPythag && (
        <>
          <line x1={S.x} y1={S.y} x2={P.x} y2={P.y} stroke={C.sidePS} strokeWidth={compact ? 1.5 : 2} />
          <line x1={P.x} y1={P.y} x2={Q.x} y2={Q.y} stroke={C.sidePQ} strokeWidth={compact ? 1.5 : 2} />
          <line x1={S.x} y1={S.y} x2={Q.x} y2={Q.y} stroke={C.sideSQ} strokeWidth={compact ? 1.5 : 2} strokeDasharray="4,3" />
        </>
      )}
      {/* Vertex dots */}
      {[P, R, S, Q, O].map((pt, i) => (
        <circle key={i} cx={pt.x} cy={pt.y} r={compact ? 3 : 4} fill={i === 4 ? C.muted : C.kite} stroke={C.bg} strokeWidth={1.2} />
      ))}
      {/* Labels */}
      {showLabels && (
        <>
          {/* Vertex labels */}
          {[
            { pt: P, label: "P", dx: -(compact ? 14 : 18), dy: 0 },
            { pt: R, label: "R", dx: compact ? 10 : 14, dy: 0 },
            { pt: S, label: "S", dx: 0, dy: -(compact ? 10 : 14) },
            { pt: Q, label: "Q", dx: 0, dy: compact ? 16 : 20 },
            { pt: O, label: "O", dx: compact ? 8 : 12, dy: compact ? 12 : 16 },
          ].map((v, i) => (
            <g key={i}>
              <rect x={v.pt.x + v.dx - textRectW(v.label, sfs + 1) / 2} y={v.pt.y + v.dy - sfs / 2 - 3}
                width={textRectW(v.label, sfs + 1)} height={sfs + 6} rx={3} fill={C.bg} fillOpacity={0.92} />
              <text x={v.pt.x + v.dx} y={v.pt.y + v.dy + sfs / 2 - 1}
                fill={C.white} fontSize={sfs + 1} fontWeight={600} textAnchor="middle" fontFamily={bodyFont}>{v.label}</text>
            </g>
          ))}
          {/* Distance labels on diagonals */}
          {general ? (
            <>
              <text x={(P.x + O.x) / 2} y={O.y - (compact ? 6 : 10)} fill={C.text} fontSize={sfs} textAnchor="middle" fontFamily={mathFont} fontStyle="italic">x</text>
              <text x={(R.x + O.x) / 2} y={O.y - (compact ? 6 : 10)} fill={C.text} fontSize={sfs} textAnchor="middle" fontFamily={mathFont} fontStyle="italic">x</text>
              <text x={O.x + (compact ? 8 : 12)} y={(S.y + O.y) / 2 + 3} fill={C.text} fontSize={sfs} textAnchor="start" fontFamily={mathFont} fontStyle="italic">z</text>
              <text x={O.x + (compact ? 8 : 12)} y={(Q.y + O.y) / 2 + 3} fill={C.text} fontSize={sfs} textAnchor="start" fontFamily={mathFont} fontStyle="italic">y</text>
            </>
          ) : (
            <>
              <text x={(P.x + O.x) / 2} y={O.y - (compact ? 6 : 10)} fill={C.muted} fontSize={sfs - 1} textAnchor="middle" fontFamily={mathFont}>{x.toFixed(1)}</text>
              <text x={(R.x + O.x) / 2} y={O.y - (compact ? 6 : 10)} fill={C.muted} fontSize={sfs - 1} textAnchor="middle" fontFamily={mathFont}>{x.toFixed(1)}</text>
              <text x={O.x + (compact ? 8 : 12)} y={(S.y + O.y) / 2 + 3} fill={C.muted} fontSize={sfs - 1} textAnchor="start" fontFamily={mathFont}>{z.toFixed(1)}</text>
              <text x={O.x + (compact ? 8 : 12)} y={(Q.y + O.y) / 2 + 3} fill={C.muted} fontSize={sfs - 1} textAnchor="start" fontFamily={mathFont}>{y.toFixed(1)}</text>
            </>
          )}
          {/* Side labels: symbolic in general mode, numeric otherwise */}
          {showPythag && (
            <>
              {(() => {
                const mx = (S.x + P.x) / 2 - (compact ? 16 : 24), my = (S.y + P.y) / 2;
                const lbl = general ? "SP" : `SP=${SP.toFixed(2)}`;
                return (
                  <g>
                    <rect x={mx - textRectW(lbl, sfs) / 2} y={my - sfs / 2 - 2} width={textRectW(lbl, sfs)} height={sfs + 4} rx={3} fill={C.bg} fillOpacity={0.92} />
                    <text x={mx} y={my + sfs / 2 - 1} fill={C.sidePS} fontSize={sfs} fontWeight={general ? 700 : 400} textAnchor="middle" fontFamily={mathFont}>{lbl}</text>
                  </g>
                );
              })()}
              {(() => {
                const mx = (Q.x + P.x) / 2 - (compact ? 16 : 24), my = (Q.y + P.y) / 2;
                const lbl = general ? "PQ" : `PQ=${PQ.toFixed(2)}`;
                return (
                  <g>
                    <rect x={mx - textRectW(lbl, sfs) / 2} y={my - sfs / 2 - 2} width={textRectW(lbl, sfs)} height={sfs + 4} rx={3} fill={C.bg} fillOpacity={0.92} />
                    <text x={mx} y={my + sfs / 2 - 1} fill={C.sidePQ} fontSize={sfs} fontWeight={general ? 700 : 400} textAnchor="middle" fontFamily={mathFont}>{lbl}</text>
                  </g>
                );
              })()}
              {(() => {
                const mx = S.x + (compact ? 20 : 30), my = (S.y + Q.y) / 2;
                const lbl = general ? "SQ" : `SQ=${SQ.toFixed(2)}`;
                return (
                  <g>
                    <rect x={mx - textRectW(lbl, sfs) / 2} y={my - sfs / 2 - 2} width={textRectW(lbl, sfs)} height={sfs + 4} rx={3} fill={C.bg} fillOpacity={0.92} />
                    <text x={mx} y={my + sfs / 2 - 1} fill={C.sideSQ} fontSize={sfs} fontWeight={general ? 700 : 400} textAnchor="middle" fontFamily={mathFont}>{lbl}</text>
                  </g>
                );
              })()}
            </>
          )}
        </>
      )}
    </svg>
  );
}


/* ───── Solve Step ───── */
function SolveStep() {
  const [revealed, setRevealed] = useState(0);

  const graphForStep = (g) => {
    if (g === "triangles") return <KiteDiagram x={2} y={4} z={1} showLabels showRightAngleO showTriangles general compact />;
    if (g === "sq") return <KiteDiagram x={2} y={4} z={1} showLabels showRightAngleO general compact />;
    if (g === "pythag") return <KiteDiagram x={2} y={4} z={1} showLabels showRightAngleO showTriangles showPythag general compact />;
    if (g === "result") return <KiteDiagram x={2} y={4} z={1} showLabels showRightAngleO showRightAngleSPQ showPythag general compact />;
    return null;
  };

  const steps = [
    {
      label: "Use the perpendicular diagonals",
      text: <span>Since PQRS is a kite, its diagonals PR and SQ meet at right angles at O. This means triangles SOP and POQ are both right-angled at O. Apply Pythagoras to each.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>In triangle SOP: SP{"\u00B2"} = OP{"\u00B2"} + OS{"\u00B2"} = x{"\u00B2"} + z{"\u00B2"}</span>
          <span>In triangle POQ: PQ{"\u00B2"} = OP{"\u00B2"} + OQ{"\u00B2"} = x{"\u00B2"} + y{"\u00B2"}</span>
        </div>
      ),
      graph: "triangles",
      color: C.ps,
    },
    {
      label: "Find SQ",
      text: <span>S and Q are on the same diagonal, on opposite sides of O. Since OS = z and OQ = y, we have SQ = y + z.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>SQ = OS + OQ = z + y</span>
          <span>SQ{"\u00B2"} = (y + z){"\u00B2"} = y{"\u00B2"} + 2yz + z{"\u00B2"}</span>
        </div>
      ),
      graph: "sq",
      color: C.ps,
    },
    {
      label: "Apply Pythagoras to triangle SPQ",
      text: <span>Angle SPQ = 90{"\u00B0"} if and only if SP{"\u00B2"} + PQ{"\u00B2"} = SQ{"\u00B2"} (with SQ as the hypotenuse, since it would be opposite the right angle).</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>SP{"\u00B2"} + PQ{"\u00B2"} = SQ{"\u00B2"}</span>
          <span>(x{"\u00B2"} + z{"\u00B2"}) + (x{"\u00B2"} + y{"\u00B2"}) = (y + z){"\u00B2"}</span>
          <span>2x{"\u00B2"} + y{"\u00B2"} + z{"\u00B2"} = y{"\u00B2"} + 2yz + z{"\u00B2"}</span>
        </div>
      ),
      graph: "pythag",
      color: C.assum,
    },
    {
      label: "Simplify",
      text: <span>The y{"\u00B2"} and z{"\u00B2"} terms cancel from both sides, leaving a clean condition.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>2x{"\u00B2"} = 2yz</span>
          <span style={{ color: C.ok, fontSize: 17 }}>x{"\u00B2"} = yz</span>
        </div>
      ),
      graph: "result",
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
                    <p style={{ margin: "0 0 6px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{s.text}</p>
                    <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 15, color: C.white, fontFamily: mathFont, textAlign: "center", letterSpacing: 0.5, lineHeight: 2 }}>{s.math}</div>
                  </div>
                  <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px", display: "flex", alignItems: "center" }}>
                    {graphForStep(s.graph)}
                  </div>
                </div>
                {i === steps.length - 1 && (
                  <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: C.conclBg, border: `1px solid ${C.ok}44`, fontSize: 13.5, color: C.ok, fontWeight: 600, lineHeight: 1.5 }}>
                    Every step used "if and only if", so x{"\u00B2"} = yz is both necessary and sufficient. The answer is C.
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


/* ───── Verify: Kite Explorer ─────
   Sliders for x, y, z. Shows the kite diagram and whether angle SPQ = 90.
*/
function KiteExplorer() {
  const [x, setX] = useState(2);
  const [y, setY] = useState(4);
  const [z, setZ] = useState(1);

  const sp2 = x * x + z * z;
  const pq2 = x * x + y * y;
  const sq2 = (y + z) * (y + z);
  const isRight = Math.abs(sp2 + pq2 - sq2) < 0.05;
  const x2 = x * x;
  const yz = y * z;
  const condHolds = Math.abs(x2 - yz) < 0.05;

  // Compute angle SPQ in degrees
  const SP = Math.sqrt(sp2), PQ = Math.sqrt(pq2), SQ = y + z;
  // cos(SPQ) = (SP^2 + PQ^2 - SQ^2) / (2*SP*PQ)
  const cosAngle = SP > 0 && PQ > 0 ? (sp2 + pq2 - sq2) / (2 * SP * PQ) : 0;
  const angleDeg = Math.acos(Math.max(-1, Math.min(1, cosAngle))) * 180 / Math.PI;

  const sliderStyle = {
    width: "100%", height: 6, borderRadius: 3, cursor: "pointer",
    accentColor: C.kite, background: C.border,
  };

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 20px", marginBottom: 18 }}>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {/* Left: Diagram */}
        <div style={{ flex: "1 1 300px", minWidth: 240 }}>
          <KiteDiagram x={x} y={y} z={z} showLabels showRightAngleO showRightAngleSPQ showPythag />
        </div>
        {/* Right: Controls + Status */}
        <div style={{ flex: "0 0 240px", minWidth: 210 }}>
          {/* Sliders */}
          {[
            { label: "x", val: x, set: setX, min: 0.5, max: 5 },
            { label: "y", val: y, set: setY, min: 0.5, max: 6 },
            { label: "z", val: z, set: setZ, min: 0.5, max: 5 },
          ].map(s => (
            <div key={s.label} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.text, marginBottom: 3 }}>
                <span style={{ fontFamily: mathFont, fontStyle: "italic" }}>{s.label} = {s.val.toFixed(1)}</span>
              </div>
              <input type="range" min={s.min} max={s.max} step={0.1} value={s.val}
                onChange={e => s.set(+e.target.value)} style={sliderStyle} />
            </div>
          ))}
          {/* Status cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
            <div style={{ padding: "8px 12px", borderRadius: 8, background: condHolds ? C.ok + "12" : "#1e2030", border: `1px solid ${condHolds ? C.ok : C.border}44` }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: C.muted, marginBottom: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>Condition check</div>
              <div style={{ fontSize: 12, fontFamily: mathFont, color: C.text }}>
                x{"\u00B2"} = {x2.toFixed(2)}, yz = {yz.toFixed(2)}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: condHolds ? C.ok : C.fail }}>
                {condHolds ? "x\u00B2 = yz (holds)" : "x\u00B2 \u2260 yz"}
              </div>
            </div>
            <div style={{ padding: "8px 12px", borderRadius: 8, background: isRight ? C.ok + "12" : C.fail + "12", border: `1px solid ${isRight ? C.ok : C.fail}44` }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: C.muted, marginBottom: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>Angle SPQ</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: isRight ? C.ok : C.text, fontFamily: mathFont }}>
                {angleDeg.toFixed(1)}{"\u00B0"}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: isRight ? C.ok : C.fail }}>
                {isRight ? "Right angle" : "Not 90\u00B0"}
              </div>
            </div>
          </div>
          {/* Live observation */}
          <div style={{ marginTop: 10, padding: "8px 10px", borderRadius: 8, background: C.psBg, border: `1px solid ${C.ps}44`, fontSize: 11, color: C.ps, lineHeight: 1.5 }}>
            {condHolds && isRight && "x\u00B2 = yz and the angle is 90\u00B0. The condition works both ways."}
            {condHolds && !isRight && "x\u00B2 = yz but angle is not 90\u00B0 - check rounding."}
            {!condHolds && isRight && "Angle is 90\u00B0 but x\u00B2 \u2260 yz - check rounding."}
            {!condHolds && !isRight && "x\u00B2 \u2260 yz and angle is not 90\u00B0. Try adjusting to make x\u00B2 = yz."}
          </div>
        </div>
      </div>
      {/* Presets */}
      <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: C.muted, alignSelf: "center", marginRight: 4 }}>Presets:</span>
        {[
          { label: "x\u00B2=yz (2,4,1)", x: 2, y: 4, z: 1 },
          { label: "x\u00B2=yz (3,3,3)", x: 3, y: 3, z: 3 },
          { label: "x\u00B2=yz (2,2,2)", x: 2, y: 2, z: 2 },
          { label: "Not 90\u00B0 (2,3,1)", x: 2, y: 3, z: 1 },
        ].map((p, i) => (
          <button key={i} onClick={() => { setX(p.x); setY(p.y); setZ(p.z); }}
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
          <p style={{ margin: 0, fontSize: 14, color: C.text, lineHeight: 1.6, fontFamily: mathFont }}>{o.text}</p>
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
  { letter: "A", text: "x = y = z", ok: false,
    expl: "This is sufficient (it gives x\u00B2 = x\u00B7x = yz) but not necessary. For example x=2, y=4, z=1 also gives a right angle." },
  { letter: "B", text: "2x = y + z", ok: false,
    expl: "Try x=2, y=3, z=1: 2(2) = 4 = 3+1 holds, but x\u00B2=4 and yz=3, so x\u00B2 \u2260 yz and the angle is not 90\u00B0. Not sufficient." },
  { letter: "C", text: <span>x{"\u00B2"} = yz</span>, ok: true,
    expl: "Angle SPQ = 90\u00B0 iff SP\u00B2 + PQ\u00B2 = SQ\u00B2, which simplifies to exactly x\u00B2 = yz. Every step is an equivalence, so this is both necessary and sufficient." },
  { letter: "D", text: "y = z", ok: false,
    expl: "This makes the kite symmetric about PR as well, but x\u00B2 = yz becomes x\u00B2 = y\u00B2, so x = y. That is just one special case (x=y=z). Not necessary." },
  { letter: "E", text: <span>y{"\u00B2"} = x{"\u00B2"} + z{"\u00B2"}</span>, ok: false,
    expl: "Try x=2, y=4, z=1: y\u00B2=16, x\u00B2+z\u00B2=5. This fails, but x\u00B2=4=yz gives a right angle. So this is not necessary." },
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
            <span style={{ fontSize: 12, color: C.ps }}>Geometry and Logic</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TMUA 2022 {"\u00B7"} Paper 2 {"\u00B7"} Question 11</p>
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
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question 11</span>
            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: "0 0 10px" }}>The diagram shows a kite PQRS whose diagonals meet at O.</p>
              <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 18px", fontFamily: mathFont, fontSize: 15, lineHeight: 2, marginBottom: 12 }}>
                <div>OP = x, OQ = y, OR = x, OS = z</div>
              </div>
              <p style={{ margin: "0 0 6px" }}>Which of the following is <strong style={{ color: C.assum }}>necessary and sufficient</strong> for angle SPQ to be a right angle?</p>
            </div>
            <div style={{ maxWidth: 320, margin: "12px auto 0" }}>
              <KiteDiagram x={2.5} y={3.5} z={2} showLabels showRightAngleO general />
            </div>
          </div>
        )}

        {/* Step 1: Setup */}
        {step === 1 && (
          <>
            <QuestionSummary />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Key observation</span>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 10px" }}>
                The diagonals of a kite meet at right angles. This means O is a right angle, giving us two right-angled triangles: SOP and POQ.
              </p>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 10px" }}>
                We want angle SPQ = 90{"\u00B0"}. The question asks for a condition that is <strong style={{ color: C.assum }}>necessary and sufficient</strong> - meaning it must hold whenever SPQ = 90{"\u00B0"}, and SPQ = 90{"\u00B0"} must hold whenever the condition is true.
              </p>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 0" }}>
                If we can express SP, PQ, and SQ in terms of x, y, z, then Pythagoras on triangle SPQ will give us exactly the "if and only if" condition we need.
              </p>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>STRATEGY</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Use Pythagoras on the right-angled triangles at O to find SP{"\u00B2"} and PQ{"\u00B2"}, then apply Pythagoras to triangle SPQ with SQ as the hypotenuse.</p>
              </div>
            </div>
            <div style={{ maxWidth: 300, margin: "0 auto" }}>
              <KiteDiagram x={2.5} y={3.5} z={2} showLabels showRightAngleO showTriangles general />
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
                  Adjust x, y, z and watch the angle at P. Try to make it exactly 90{"\u00B0"} - you will find this happens precisely when x{"\u00B2"} = yz. Try the other options (like x = y = z, or y = z) and notice they are special cases of x{"\u00B2"} = yz, not the full picture.
                </p>
              </div>
            </div>
            <KiteExplorer />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 20px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.assumBg, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.assum, fontWeight: 700, whiteSpace: "nowrap" }}>KEY POINT</span>
                <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, margin: 0 }}>x = y = z (option A) implies x{"\u00B2"} = yz, so it is sufficient but not necessary. y = z (option D) implies x = y as well, which is even more restrictive. The condition x{"\u00B2"} = yz is the most general - it captures every kite where angle SPQ = 90{"\u00B0"}.</p>
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
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6, fontStyle: "italic" }}>"Which of the following is necessary and sufficient for angle SPQ to be a right angle?"</div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Summary</span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <div style={{ background: "#1e2030", borderRadius: 8, padding: "12px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.sidePS, marginBottom: 4, fontFamily: mathFont }}>SP{"\u00B2"}</div>
                  <div style={{ fontSize: 12, color: C.text, fontFamily: mathFont }}>x{"\u00B2"} + z{"\u00B2"}</div>
                </div>
                <div style={{ background: "#1e2030", borderRadius: 8, padding: "12px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.sidePQ, marginBottom: 4, fontFamily: mathFont }}>PQ{"\u00B2"}</div>
                  <div style={{ fontSize: 12, color: C.text, fontFamily: mathFont }}>x{"\u00B2"} + y{"\u00B2"}</div>
                </div>
                <div style={{ background: "#1e2030", borderRadius: 8, padding: "12px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.sideSQ, marginBottom: 4, fontFamily: mathFont }}>SQ{"\u00B2"}</div>
                  <div style={{ fontSize: 12, color: C.text, fontFamily: mathFont }}>(y+z){"\u00B2"}</div>
                </div>
              </div>
              <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: C.conclBg, border: `1px solid ${C.ok}44`, textAlign: "center" }}>
                <span style={{ fontSize: 14, fontFamily: mathFont, color: C.ok, fontWeight: 600 }}>SP{"\u00B2"} + PQ{"\u00B2"} = SQ{"\u00B2"} simplifies to x{"\u00B2"} = yz</span>
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
