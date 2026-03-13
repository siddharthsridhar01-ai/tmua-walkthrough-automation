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
  tri: "#a29bfe", line1: "#55efc4", line2: "#fd79a8", line3: "#fdcb6e", rightMark: "#55efc4",
};
const mathFont = "'Cambria Math','Latin Modern Math','STIX Two Math',Georgia,serif";
const bodyFont = "'Gill Sans','Trebuchet MS',Calibri,sans-serif";

const stepsMeta = [
  { id: 0, label: "Read", title: "Read the Question" },
  { id: 1, label: "Setup", title: "Identify the Approach" },
  { id: 2, label: "Solve", title: "Count the Lines" },
  { id: 3, label: "Verify", title: "Explore Triangles" },
  { id: 4, label: "Answer", title: "Confirm the Answer" },
];

function QuestionSummary() {
  return (
    <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 18px", marginBottom: 16, textAlign: "center" }}>
      <p style={{ margin: "0 0 4px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
        <span style={{ fontWeight: 700, color: C.muted, letterSpacing: 0.5, marginRight: 6 }}>Q8</span>
        A non-right triangle is divided by a line into two triangles, at least one right-angled. How many such lines?
      </p>
      <div style={{ fontSize: 12, color: C.text, lineHeight: 1.8, marginBottom: 6, fontFamily: mathFont }}>
        <div>I: The student can draw a triangle with exactly 1 such line</div>
        <div>II: The student can draw a triangle with exactly 2 such lines</div>
        <div>III: The student can draw a triangle with exactly 3 such lines</div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, fontSize: 10, fontWeight: 600, color: C.muted, flexWrap: "wrap" }}>
        <span>A: none</span><span>B: I</span><span>C: II</span><span>D: III</span><span>E: I,II</span><span>F: I,III</span><span>G: II,III</span><span>H: all</span>
      </div>
    </div>
  );
}


/* ───── Triangle Diagram ─────
   Shows a triangle with the "such lines" drawn.
   Props:
   - vertices: [{x,y}, {x,y}, {x,y}]
   - showLines: array of line indices to show (0,1,2)
   - showRightAngles: show right angle markers
   - labels: vertex labels
   - compact: smaller
*/
function TriangleDiagram({ vertices, showLines, showRightAngles, labels, lineColors, compact, caption }) {
  const pad = compact ? 20 : 30;
  const allX = vertices.map(v => v.x), allY = vertices.map(v => v.y);
  const minX = Math.min(...allX) - pad, maxX = Math.max(...allX) + pad;
  const minY = Math.min(...allY) - pad, maxY = Math.max(...allY) + pad;
  const w = maxX - minX, h = maxY - minY;
  const sfs = compact ? 8 : 10;
  const ra = compact ? 7 : 10;

  const [A, B, Cv] = vertices;

  // Compute the 3 "such lines" for this triangle
  // For each vertex, drop perpendicular to opposite side (altitude)
  // Also for obtuse triangles, lines from obtuse vertex splitting the angle

  const dot = (u, v) => u.x * v.x + u.y * v.y;
  const sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
  const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
  const scale = (v, s) => ({ x: v.x * s, y: v.y * s });
  const len = (v) => Math.sqrt(v.x * v.x + v.y * v.y);
  const norm = (v) => { const l = len(v); return { x: v.x / l, y: v.y / l }; };

  // Foot of perpendicular from P to line segment AB
  const footPerp = (P, A2, B2) => {
    const AB = sub(B2, A2);
    const AP = sub(P, A2);
    const t = dot(AP, AB) / dot(AB, AB);
    return { pt: add(A2, scale(AB, t)), t };
  };

  // Perpendicular direction (rotate 90 degrees)
  const perp = (v) => ({ x: -v.y, y: v.x });

  // Intersect ray from P in direction d with line segment AB, return t on AB
  const raySegIntersect = (P, d, A2, B2) => {
    // P + s*d = A2 + t*(B2-A2)
    const AB = sub(B2, A2);
    const denom = d.x * AB.y - d.y * AB.x;
    if (Math.abs(denom) < 1e-10) return null;
    const AP = sub(A2, P);
    const t = (AP.x * d.y - AP.y * d.x) / denom;
    return t;
  };

  const verts = [A, B, Cv];
  const sides = [[1, 2], [0, 2], [0, 1]]; // opposite side vertex indices

  const lines = [];
  const rightAngles = [];

  // Angle at each vertex
  const angleAt = (i) => {
    const [j, k] = sides[i];
    const v1 = norm(sub(verts[j], verts[i]));
    const v2 = norm(sub(verts[k], verts[i]));
    return Math.acos(Math.max(-1, Math.min(1, dot(v1, v2))));
  };

  const angles = [angleAt(0), angleAt(1), angleAt(2)];
  const isAcute = angles.every(a => a < Math.PI / 2 - 0.01);

  if (isAcute) {
    // Acute triangle: all 3 altitudes land inside
    for (let i = 0; i < 3; i++) {
      const P = verts[i];
      const [j, k] = sides[i];
      const foot = footPerp(P, verts[j], verts[k]);
      if (foot.t > 0.001 && foot.t < 0.999) {
        lines.push({ from: P, to: foot.pt });
        rightAngles.push({ pt: foot.pt, dir1: norm(sub(P, foot.pt)), dir2: norm(sub(verts[j], foot.pt)) });
      }
    }
  } else {
    // Obtuse triangle: find the obtuse vertex
    let obtuseIdx = angles.findIndex(a => a > Math.PI / 2 + 0.01);
    if (obtuseIdx < 0) obtuseIdx = angles.indexOf(Math.max(...angles)); // near-right fallback
    const [j, k] = sides[obtuseIdx];
    const P = verts[obtuseIdx]; // obtuse vertex

    // Line 1: altitude from obtuse vertex to opposite side (right angle at foot)
    const altFoot = footPerp(P, verts[j], verts[k]);
    if (altFoot.t > 0.001 && altFoot.t < 0.999) {
      lines.push({ from: P, to: altFoot.pt });
      rightAngles.push({ pt: altFoot.pt, dir1: norm(sub(P, altFoot.pt)), dir2: norm(sub(verts[j], altFoot.pt)) });
    }

    // Line 2: from obtuse vertex, perpendicular to side P-j direction (right angle at P in one sub-triangle)
    // Direction from P to vertex j
    const dirPJ = norm(sub(verts[j], P));
    // Perpendicular to this: line from P in perp direction, intersect with opposite side j-k
    const perpDir1 = perp(dirPJ);
    const t1 = raySegIntersect(P, perpDir1, verts[j], verts[k]);
    const t1b = raySegIntersect(P, scale(perpDir1, -1), verts[j], verts[k]);
    const tUse1 = (t1 !== null && t1 > 0.01 && t1 < 0.99) ? t1 : (t1b !== null && t1b > 0.01 && t1b < 0.99) ? t1b : null;
    if (tUse1 !== null) {
      const D = add(verts[j], scale(sub(verts[k], verts[j]), tUse1));
      lines.push({ from: P, to: D });
      // Right angle is at P between PJ and PD
      rightAngles.push({ pt: P, dir1: norm(sub(verts[j], P)), dir2: norm(sub(D, P)) });
    }

    // Line 3: from obtuse vertex, perpendicular to side P-k direction (right angle at P in other sub-triangle)
    const dirPK = norm(sub(verts[k], P));
    const perpDir2 = perp(dirPK);
    const t2 = raySegIntersect(P, perpDir2, verts[j], verts[k]);
    const t2b = raySegIntersect(P, scale(perpDir2, -1), verts[j], verts[k]);
    const tUse2 = (t2 !== null && t2 > 0.01 && t2 < 0.99) ? t2 : (t2b !== null && t2b > 0.01 && t2b < 0.99) ? t2b : null;
    if (tUse2 !== null) {
      const D = add(verts[j], scale(sub(verts[k], verts[j]), tUse2));
      lines.push({ from: P, to: D });
      rightAngles.push({ pt: P, dir1: norm(sub(verts[k], P)), dir2: norm(sub(D, P)) });
    }
  }

  const defaultColors = [C.line1, C.line2, C.line3];
  const colors = lineColors || defaultColors;

  return (
    <div>
      <svg viewBox={`${minX} ${minY} ${w} ${h}`} style={{ width: "100%", display: "block" }}>
        {/* Triangle fill */}
        <polygon points={vertices.map(v => `${v.x},${v.y}`).join(" ")}
          fill={C.tri + "08"} stroke={C.tri} strokeWidth={compact ? 1.5 : 2} strokeLinejoin="round" />
        {/* Lines */}
        {lines.map((l, i) => {
          if (showLines && !showLines.includes(i)) return null;
          return (
            <line key={i} x1={l.from.x} y1={l.from.y} x2={l.to.x} y2={l.to.y}
              stroke={colors[i % colors.length]} strokeWidth={compact ? 1.5 : 2} strokeDasharray="6,4" />
          );
        })}
        {/* Right angle markers */}
        {showRightAngles && rightAngles.map((r, i) => {
          if (showLines && !showLines.includes(i)) return null;
          const d1 = scale(r.dir1, ra);
          const d2 = scale(r.dir2, ra);
          return (
            <path key={"ra" + i}
              d={`M ${r.pt.x + d1.x},${r.pt.y + d1.y} L ${r.pt.x + d1.x + d2.x},${r.pt.y + d1.y + d2.y} L ${r.pt.x + d2.x},${r.pt.y + d2.y}`}
              fill="none" stroke={C.rightMark} strokeWidth={1} />
          );
        })}
        {/* Vertex dots + labels */}
        {vertices.map((v, i) => (
          <g key={i}>
            <circle cx={v.x} cy={v.y} r={compact ? 3 : 4} fill={C.tri} stroke={C.bg} strokeWidth={1.2} />
            {labels && (
              <text x={v.x + (labels[i].dx || 0)} y={v.y + (labels[i].dy || 0)}
                fill={C.white} fontSize={sfs + 1} fontWeight={600} textAnchor="middle" fontFamily={bodyFont}>{labels[i].label}</text>
            )}
          </g>
        ))}
        {/* Line count label */}
        {showLines && (
          <text x={minX + w / 2} y={maxY - 4} fill={C.muted} fontSize={sfs} textAnchor="middle" fontFamily={bodyFont}>
            {showLines.length === lines.length ? `${lines.length} line${lines.length !== 1 ? "s" : ""} shown` : `${showLines.length} of ${lines.length}`}
          </text>
        )}
      </svg>
      {caption && <p style={{ margin: "4px 0 0", fontSize: 10, color: C.muted, lineHeight: 1.4, textAlign: "center" }}>{caption}</p>}
    </div>
  );
}

/* Preset triangles */
const acuteTriangle = {
  vertices: [{ x: 50, y: 10 }, { x: 10, y: 130 }, { x: 140, y: 120 }],
  labels: [{ label: "A", dx: 0, dy: -10 }, { label: "B", dx: -12, dy: 8 }, { label: "C", dx: 12, dy: 8 }],
};
const obtuseTriangle = {
  vertices: [{ x: 24, y: 120 }, { x: 156, y: 120 }, { x: 75, y: 74 }],
  labels: [{ label: "A", dx: -12, dy: 10 }, { label: "B", dx: 12, dy: 10 }, { label: "C", dx: 0, dy: -12 }],
};


/* ───── Solve Step ───── */
function SolveStep() {
  const [revealed, setRevealed] = useState(0);

  const steps = [
    {
      label: "Acute triangle: 3 altitudes inside",
      text: <span>For an acute triangle, all three altitudes land inside the opposite side. Each altitude creates a right angle at its foot, splitting the triangle into two right-angled sub-triangles. So there are at least 3 such lines.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>Each altitude is perpendicular to opposite side</span>
          <span>All 3 feet lie inside the triangle</span>
          <span style={{ color: C.ok }}>3 such lines for any acute triangle</span>
        </div>
      ),
      diagram: (
        <TriangleDiagram {...acuteTriangle} showLines={[0, 1, 2]} showRightAngles compact
          caption="Acute: all 3 altitudes land inside" />
      ),
      color: C.ok,
    },
    {
      label: "Obtuse triangle: altitude + angle-splitting lines",
      text: <span>For an obtuse triangle, only the altitude from the obtuse angle lands inside. The other two altitudes land outside the triangle. But from the obtuse angle, we can split it into a right angle plus a remainder in two different ways, each creating a line to the opposite side that forms a right angle at the endpoint. This gives 1 + 2 = 3 lines.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>1 altitude from the obtuse vertex (lands inside)</span>
          <span>2 lines splitting the obtuse angle</span>
          <span style={{ color: C.muted, fontSize: 13 }}>(perpendiculars from the non-obtuse vertices to the adjacent sides)</span>
          <span style={{ color: C.ok }}>1 + 2 = 3 such lines for any obtuse triangle</span>
        </div>
      ),
      diagram: (
        <TriangleDiagram {...obtuseTriangle} showLines={[0, 1, 2]} showRightAngles compact
          caption="Obtuse: 1 altitude + 2 angle-split lines = 3" />
      ),
      color: C.ok,
    },
    {
      label: "Always exactly 3",
      text: <span>In both cases (acute and obtuse), there are exactly 3 such lines. No non-right triangle gives fewer or more. So the student cannot draw one with exactly 1 or 2 lines, but can always draw one with exactly 3.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ color: C.fail }}>I: exactly 1 line - impossible (always 3)</span>
          <span style={{ color: C.fail }}>II: exactly 2 lines - impossible (always 3)</span>
          <span style={{ color: C.ok }}>III: exactly 3 lines - always true</span>
        </div>
      ),
      diagram: null,
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
                {s.diagram ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <p style={{ margin: "0 0 6px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{s.text}</p>
                      <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 15, color: C.white, fontFamily: mathFont, textAlign: "center", letterSpacing: 0.5, lineHeight: 2 }}>{s.math}</div>
                    </div>
                    <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px" }}>
                      {s.diagram}
                    </div>
                  </div>
                ) : (
                  <>
                    <p style={{ margin: "0 0 6px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{s.text}</p>
                    <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 15, color: C.white, fontFamily: mathFont, textAlign: "center", letterSpacing: 0.5, lineHeight: 2 }}>{s.math}</div>
                  </>
                )}
                {i === steps.length - 1 && (
                  <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: C.conclBg, border: `1px solid ${C.ok}44`, fontSize: 13.5, color: C.ok, fontWeight: 600, lineHeight: 1.5 }}>
                    Only III is true. The answer is D.
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


/* ───── Verify: Triangle Explorer ─────
   Toggle between preset triangles and see the lines drawn.
   Toggle individual lines on/off.
*/
function TriangleExplorer() {
  const [triIdx, setTriIdx] = useState(0);
  const [showLineFlags, setShowLineFlags] = useState([true, true, true]);

  const presets = [
    { name: "Acute (equilateral-ish)", vertices: [{ x: 80, y: 10 }, { x: 10, y: 150 }, { x: 150, y: 150 }], labels: [{ label: "A", dx: 0, dy: -12 }, { label: "B", dx: -14, dy: 10 }, { label: "C", dx: 14, dy: 10 }] },
    { name: "Acute (scalene)", vertices: [{ x: 50, y: 10 }, { x: 10, y: 130 }, { x: 160, y: 120 }], labels: [{ label: "A", dx: 0, dy: -12 }, { label: "B", dx: -14, dy: 8 }, { label: "C", dx: 14, dy: 8 }] },
    { name: "Obtuse (108\u00B0 at C)", vertices: [{ x: 24, y: 140 }, { x: 156, y: 140 }, { x: 75, y: 94 }], labels: [{ label: "A", dx: -12, dy: 10 }, { label: "B", dx: 12, dy: 10 }, { label: "C", dx: 0, dy: -12 }] },
    { name: "Obtuse (110\u00B0 at C)", vertices: [{ x: 24, y: 140 }, { x: 156, y: 140 }, { x: 90, y: 94 }], labels: [{ label: "A", dx: -12, dy: 10 }, { label: "B", dx: 12, dy: 10 }, { label: "C", dx: 0, dy: -12 }] },
    { name: "Nearly right (89\u00B0)", vertices: [{ x: 10, y: 10 }, { x: 10, y: 150 }, { x: 155, y: 148 }], labels: [{ label: "A", dx: -10, dy: -8 }, { label: "B", dx: -14, dy: 8 }, { label: "C", dx: 12, dy: 10 }] },
  ];

  const tri = presets[triIdx];
  const activeLines = showLineFlags.map((f, i) => f ? i : -1).filter(i => i >= 0);

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 20px", marginBottom: 18 }}>
      {/* Triangle selector */}
      <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Choose a triangle</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {presets.map((p, i) => (
          <button key={i} onClick={() => { setTriIdx(i); setShowLineFlags([true, true, true]); }} style={{
            padding: "6px 12px", borderRadius: 8, cursor: "pointer",
            border: `2px solid ${triIdx === i ? C.accent : C.border}`,
            background: triIdx === i ? C.accent + "15" : "#1e2030",
            color: triIdx === i ? C.accent : C.text,
            fontSize: 11, fontWeight: 600,
          }}>
            {p.name}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {/* Left: Diagram */}
        <div style={{ flex: "1 1 300px", minWidth: 240 }}>
          <TriangleDiagram vertices={tri.vertices} labels={tri.labels}
            showLines={activeLines} showRightAngles />
        </div>
        {/* Right: Line toggles + count */}
        <div style={{ flex: "0 0 200px", minWidth: 180 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Toggle lines</div>
          {[0, 1, 2].map(i => (
            <div key={i} onClick={() => setShowLineFlags(f => { const n = [...f]; n[i] = !n[i]; return n; })}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 6, cursor: "pointer", marginBottom: 6, background: showLineFlags[i] ? [C.line1, C.line2, C.line3][i] + "12" : "#1e2030", border: `1px solid ${showLineFlags[i] ? [C.line1, C.line2, C.line3][i] + "44" : C.border}` }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, border: `2px solid ${[C.line1, C.line2, C.line3][i]}`, background: showLineFlags[i] ? [C.line1, C.line2, C.line3][i] + "44" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: C.white }}>{showLineFlags[i] ? "\u2713" : ""}</div>
              <span style={{ fontSize: 12, color: C.text }}>Line {i + 1}</span>
            </div>
          ))}
          {/* Count */}
          <div style={{ marginTop: 12, padding: "12px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}`, textAlign: "center" }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Total such lines</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: C.ok, fontFamily: mathFont }}>3</div>
            <div style={{ fontSize: 11, color: C.muted }}>Always 3 for any non-right triangle</div>
          </div>
        </div>
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
  { letter: "A", text: "None of them", ok: false, expl: "Statement III is true. Every non-right triangle has exactly 3 such lines." },
  { letter: "B", text: "I only", ok: false, expl: "There is no non-right triangle with exactly 1 such line. The count is always 3." },
  { letter: "C", text: "II only", ok: false, expl: "There is no non-right triangle with exactly 2 such lines. The count is always 3." },
  { letter: "D", text: "III only", ok: true, expl: "For an acute triangle, the 3 altitudes all land inside. For an obtuse triangle, 1 altitude plus 2 angle-splitting lines from the non-obtuse vertices gives 3. The count is always exactly 3." },
  { letter: "E", text: "I and II only", ok: false, expl: "Neither 1 nor 2 is achievable. The count is always 3." },
  { letter: "F", text: "I and III only", ok: false, expl: "I is false - you cannot achieve exactly 1 line." },
  { letter: "G", text: "II and III only", ok: false, expl: "II is false - you cannot achieve exactly 2 lines." },
  { letter: "H", text: "I, II and III", ok: false, expl: "Only III is true. The count is always exactly 3, never 1 or 2." },
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
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ background: `linear-gradient(135deg,${C.accent},${C.accentLight})`, borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: C.white, letterSpacing: 1 }}>TMUA</span>
            <span style={{ fontSize: 12, color: C.muted }}>Paper 2</span>
            <span style={{ fontSize: 12, color: C.muted }}>{"\u00B7"}</span>
            <span style={{ fontSize: 12, color: C.ps }}>Geometry and Reasoning</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TMUA 2023 {"\u00B7"} Paper 2 {"\u00B7"} Question 8</p>
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

        {step === 0 && (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question 8</span>
            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: "0 0 8px" }}>A student draws a triangle that is acute-angled or obtuse-angled but <strong style={{ color: C.fail }}>not</strong> right-angled.</p>
              <p style={{ margin: "0 0 8px" }}>The student counts the number of straight lines that divide the triangle into two triangles, <strong style={{ color: C.assum }}>at least one</strong> of which is right-angled.</p>
              <p style={{ margin: "0 0 6px" }}>Which of the following statements is/are true?</p>
              <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 18px", fontSize: 14, lineHeight: 2.2 }}>
                <div><span style={{ fontWeight: 700, color: C.ps, fontFamily: bodyFont, fontSize: 12 }}>I</span>{" "} The student can draw a triangle with exactly 1 such line.</div>
                <div><span style={{ fontWeight: 700, color: C.ps, fontFamily: bodyFont, fontSize: 12 }}>II</span>{" "} The student can draw a triangle with exactly 2 such lines.</div>
                <div><span style={{ fontWeight: 700, color: C.ps, fontFamily: bodyFont, fontSize: 12 }}>III</span>{" "} The student can draw a triangle with exactly 3 such lines.</div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <>
            <QuestionSummary />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>What counts as a "such line"?</span>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 10px" }}>
                A straight line from a point on one side to a point on another side (or vertex) that splits the triangle into two smaller triangles, where at least one of the two has a right angle.
              </p>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 0" }}>
                The most obvious candidates are <strong style={{ color: C.assum }}>altitudes</strong> (perpendiculars from a vertex to the opposite side). But for obtuse triangles, some altitudes land outside, so we also need to consider other lines that create right angles.
              </p>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>STRATEGY</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Consider acute and obtuse triangles separately. Count all valid lines for each case. If the count is always the same, only one of I/II/III can be true.</p>
              </div>
            </div>
          </>
        )}

        {step === 2 && <><QuestionSummary /><SolveStep /></>}

        {step === 3 && (
          <>
            <QuestionSummary />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>TRY IT</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  Select different triangles and toggle each line on/off. No matter which non-right triangle you pick, there are always exactly 3 such lines. Try both acute and obtuse cases to convince yourself.
                </p>
              </div>
            </div>
            <TriangleExplorer />
          </>
        )}

        {step === 4 && (
          <>
            <QuestionSummary />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6, fontStyle: "italic" }}>"Which of the following statements is/are true?"</div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Verdict</span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <div style={{ background: C.fail + "12", borderRadius: 8, padding: "12px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.fail, marginBottom: 4 }}>I: False</div>
                  <div style={{ fontSize: 11, color: C.fail }}>Cannot get exactly 1</div>
                </div>
                <div style={{ background: C.fail + "12", borderRadius: 8, padding: "12px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.fail, marginBottom: 4 }}>II: False</div>
                  <div style={{ fontSize: 11, color: C.fail }}>Cannot get exactly 2</div>
                </div>
                <div style={{ background: C.ok + "12", borderRadius: 8, padding: "12px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.ok, marginBottom: 4 }}>III: True</div>
                  <div style={{ fontSize: 11, color: C.ok }}>Always exactly 3</div>
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
