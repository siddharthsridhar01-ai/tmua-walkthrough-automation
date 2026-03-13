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
  tri: ["#a29bfe", "#fd79a8", "#55efc4", "#fdcb6e", "#74b9ff", "#e17055", "#00cec9", "#fab1a0"],
};
const mathFont = "'Cambria Math','Latin Modern Math','STIX Two Math',Georgia,serif";

const stepsMeta = [
  { id: 0, label: "Read", title: "Read the Question" },
  { id: 1, label: "Setup", title: "Identify the Approach" },
  { id: 2, label: "Solve", title: "Test Each Value of n" },
  { id: 3, label: "Verify", title: "Build Polygons Interactively" },
  { id: 4, label: "Answer", title: "Confirm the Answer" },
];

function QuestionSummary() {
  return (
    <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 18px", marginBottom: 16, textAlign: "center" }}>
      <p style={{ margin: "0 0 6px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
        <span style={{ fontWeight: 700, color: C.muted, letterSpacing: 0.5, marginRight: 6 }}>Q19</span>
        A cyclic polygon with n vertices, centre inside, radii creating n equal-area triangles. For which n is this <strong style={{ color: C.assum }}>sufficient</strong> to deduce the polygon is regular?
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 10, fontSize: 11, fontWeight: 600, color: C.muted, flexWrap: "wrap" }}>
        <span>A: no values</span><span>B: n=3 only</span><span>C: n=3,4 only</span><span>D: n=3 and n{"\u2265"}5</span><span>E: all values</span>
      </div>
    </div>
  );
}

/* ───── Polygon Diagram ─────
   Draws a cyclic polygon inscribed in a circle with triangles from centre.
   angles: array of central angles (radians) summing to 2pi
   Props:
   - angles: array of central angles
   - showAreas: display area values in each triangle
   - showAngles: display angle labels at centre
   - highlightEqual: colour triangles by equal-area status
   - label: title for this diagram
   - compact: smaller
*/
function PolygonDiagram({ angles, showAreas, showAngles, highlightEqual, label, compact }) {
  /* ── Pixel-margin layout: generous margins for all annotations ──
     Top: title label. Bottom: status badge. Sides: area labels can extend
     to r*0.5 + half text width beyond the circle edge. */
  const mL = compact ? 20 : 30, mR = compact ? 20 : 30;
  const mT = compact ? 22 : 30, mB = compact ? 22 : 28;
  const circleSize = compact ? 130 : 220;
  const w = mL + circleSize + mR, h = mT + circleSize + mB;
  const cx = mL + circleSize / 2, cy = mT + circleSize / 2;
  const r = circleSize / 2 - 2;
  const sfs = compact ? 7 : 9;

  // Helper: estimate text rect width from string length
  const textRectW = (str, fontSize) => str.length * fontSize * 0.65 + (compact ? 8 : 12);

  const n = angles.length;
  const cumAngles = [0];
  for (let i = 0; i < n; i++) cumAngles.push(cumAngles[i] + angles[i]);
  const vertices = cumAngles.map(a => ({
    x: cx + r * Math.cos(a - Math.PI / 2),
    y: cy + r * Math.sin(a - Math.PI / 2),
  }));

  const areas = angles.map(a => 0.5 * Math.sin(a));
  const maxArea = Math.max(...areas);
  const minArea = Math.min(...areas);
  const allEqual = maxArea - minArea < 0.001;
  const isRegular = angles.every(a => Math.abs(a - 2 * Math.PI / n) < 0.01);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", display: "block" }}>
      {/* Title label */}
      {label && (
        <text x={w / 2} y={mT / 2 + 2} fill={C.white} fontSize={compact ? 9 : 11}
          fontWeight={700} textAnchor="middle" fontFamily="'Gill Sans',sans-serif">{label}</text>
      )}

      {/* Circle */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.muted} strokeWidth={1} opacity={0.3} />

      {/* Triangles with area and angle labels */}
      {angles.map((a, i) => {
        const v1 = vertices[i], v2 = vertices[i + 1];
        const midAngle = cumAngles[i] + a / 2 - Math.PI / 2;
        const labelR = r * 0.48;
        const lx = cx + labelR * Math.cos(midAngle);
        const ly = cy + labelR * Math.sin(midAngle);

        const areaMatch = allEqual || Math.abs(areas[i] - areas[0]) < 0.001;
        const col = C.tri[i % C.tri.length];

        const areaStr = areas[i].toFixed(3);
        const areaRW = textRectW(areaStr, sfs);
        const degStr = `${(a * 180 / Math.PI).toFixed(0)}\u00B0`;
        const degFS = compact ? 6 : 8;
        const degRW = textRectW(degStr, degFS);

        // Angle label position: closer to centre
        const angR = r * 0.22;
        const ax = cx + angR * Math.cos(midAngle);
        const ay = cy + angR * Math.sin(midAngle);

        return (
          <g key={i}>
            <polygon
              points={`${cx},${cy} ${v1.x},${v1.y} ${v2.x},${v2.y}`}
              fill={col + "18"} stroke={col} strokeWidth={1} opacity={0.8} />
            {showAreas && (
              <>
                <rect x={lx - areaRW / 2} y={ly - 7}
                  width={areaRW} height={14} rx={3}
                  fill={C.bg} fillOpacity={0.9} />
                <text x={lx} y={ly + 4} fill={areaMatch && highlightEqual ? C.ok : C.white}
                  fontSize={sfs} fontWeight={600} textAnchor="middle" fontFamily={mathFont}>
                  {areaStr}
                </text>
              </>
            )}
            {showAngles && (
              <>
                <rect x={ax - degRW / 2} y={ay - 6}
                  width={degRW} height={12} rx={2}
                  fill={C.bg} fillOpacity={0.9} />
                <text x={ax} y={ay + 4}
                  fill={C.muted} fontSize={degFS} fontWeight={600}
                  textAnchor="middle" fontFamily={mathFont}>
                  {degStr}
                </text>
              </>
            )}
          </g>
        );
      })}

      {/* Centre dot */}
      <circle cx={cx} cy={cy} r={2} fill={C.white} />

      {/* Vertex dots */}
      {vertices.slice(0, n).map((v, i) => (
        <circle key={"v" + i} cx={v.x} cy={v.y} r={compact ? 2.5 : 3} fill={C.white} />
      ))}

      {/* Status badge - sits in bottom margin */}
      {highlightEqual && (() => {
        const statusText = allEqual ? (isRegular ? "Regular" : "Equal areas, not regular") : "Unequal areas";
        const statusW = textRectW(statusText, compact ? 7 : 9);
        const statusCol = allEqual ? (isRegular ? C.ok : C.assum) : C.fail;
        return (
          <g>
            <rect x={w / 2 - statusW / 2} y={mT + circleSize + 4}
              width={statusW} height={compact ? 14 : 16} rx={3}
              fill={statusCol} fillOpacity={0.15}
              stroke={statusCol} strokeWidth={0.5} />
            <text x={w / 2} y={mT + circleSize + (compact ? 14 : 16)}
              fill={statusCol} fontSize={compact ? 7 : 9} fontWeight={700}
              textAnchor="middle" fontFamily="'Gill Sans',sans-serif">
              {statusText}
            </text>
          </g>
        );
      })()}
    </svg>
  );
}

/* ───── Solve Step ───── */
function SolveStep() {
  const [revealed, setRevealed] = useState(0);

  const regTri = [2 * Math.PI / 3, 2 * Math.PI / 3, 2 * Math.PI / 3];
  const alpha4 = Math.PI / 3;
  const nonRegQuad = [alpha4, Math.PI - alpha4, alpha4, Math.PI - alpha4];
  const alpha5 = Math.PI / 3;
  const nonRegPent = [alpha5, alpha5, alpha5, alpha5, Math.PI - alpha5];

  const steps = [
    {
      label: "Key observation",
      text: <span>Each triangle has two sides equal to the radius r, with central angle {"\u03B8"}<sub>i</sub>. Area = {"\u00BD"}r{"\u00B2"}sin({"\u03B8"}<sub>i</sub>). Equal areas means all the sin({"\u03B8"}<sub>i</sub>) must be equal.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>sin({"\u03B8"}) = sin(180{"\u00B0"} - {"\u03B8"})</span>
          <span style={{ color: C.muted, fontSize: 13 }}>So angles can be {"\u03B1"} or (180{"\u00B0"} - {"\u03B1"})</span>
          <span style={{ color: C.muted, fontSize: 13 }}>while still giving equal areas</span>
        </div>
      ),
      graph: null,
      color: C.ps,
    },
    {
      label: "n = 3: must be regular",
      text: <span>With 3 central angles summing to 360{"\u00B0"}, if k angles are (180{"\u00B0"} - {"\u03B1"}) and (3 - k) are {"\u03B1"}: every case forces {"\u03B1"} = 0{"\u00B0"} or 180{"\u00B0"} (degenerate). So all three must equal 120{"\u00B0"}.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>k=1: (180{"\u00B0"}-{"\u03B1"}) + 2{"\u03B1"} = 180{"\u00B0"}+{"\u03B1"} = 360{"\u00B0"}</span>
          <span>{"\u2192"} {"\u03B1"} = 180{"\u00B0"} (invalid)</span>
          <span>k=2: 2(180{"\u00B0"}-{"\u03B1"}) + {"\u03B1"} = 360{"\u00B0"}-{"\u03B1"} = 360{"\u00B0"}</span>
          <span>{"\u2192"} {"\u03B1"} = 0{"\u00B0"} (invalid)</span>
          <span style={{ color: C.ok }}>All angles must be 120{"\u00B0"} {"\u2192"} regular</span>
        </div>
      ),
      graph: { angles: regTri, lbl: "n = 3: forced regular" },
      color: C.ok,
    },
    {
      label: "n = 4: counterexample exists",
      text: <span>With 2 angles of {"\u03B1"} and 2 of (180{"\u00B0"} - {"\u03B1"}), the sum is always 360{"\u00B0"} regardless of {"\u03B1"}. A non-square rectangle is such a polygon.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>2{"\u03B1"} + 2(180{"\u00B0"} - {"\u03B1"}) = 360{"\u00B0"} for any {"\u03B1"}</span>
          <span>sin({"\u03B1"}) = sin(180{"\u00B0"} - {"\u03B1"}) {"\u2192"} equal areas</span>
          <span style={{ color: C.fail }}>Not necessarily regular</span>
        </div>
      ),
      graph: { angles: nonRegQuad, lbl: "n = 4: equal areas, not regular" },
      color: C.fail,
    },
    {
      label: "n \u2265 5: counterexample exists",
      text: <span>Use (n - 1) angles of {"\u03B1"} = 180{"\u00B0"}/(n - 2) and 1 angle of (180{"\u00B0"} - {"\u03B1"}). The sum is (n-2){"\u03B1"} + 180{"\u00B0"} = 360{"\u00B0"}, and all areas are equal.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>{"\u03B1"} = 180{"\u00B0"}/(n-2)</span>
          <span>One angle = 180{"\u00B0"} - {"\u03B1"}</span>
          <span>Sum = (n-2) {"\u00D7"} 180{"\u00B0"}/(n-2) + 180{"\u00B0"} = 360{"\u00B0"}</span>
          <span style={{ color: C.fail }}>Not necessarily regular for any n {"\u2265"} 5</span>
        </div>
      ),
      graph: { angles: nonRegPent, lbl: "n = 5: equal areas, not regular" },
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
                {s.graph ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <p style={{ margin: "0 0 8px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{s.text}</p>
                      <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", fontSize: 15, color: C.white, fontFamily: mathFont, textAlign: "center", letterSpacing: 0.5, lineHeight: 2 }}>{s.math}</div>
                    </div>
                    <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px", display: "flex", alignItems: "center" }}>
                      <PolygonDiagram angles={s.graph.angles} showAreas showAngles highlightEqual label={s.graph.lbl} compact />
                    </div>
                  </div>
                ) : (
                  <div>
                    <p style={{ margin: "0 0 8px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{s.text}</p>
                    <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", fontSize: 16, color: C.white, fontFamily: mathFont, textAlign: "center", letterSpacing: 0.5, lineHeight: 2 }}>{s.math}</div>
                  </div>
                )}
                {i === steps.length - 1 && <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: C.conclBg, border: `1px solid ${C.ok}44`, fontSize: 13.5, color: C.ok, fontWeight: 600, lineHeight: 1.5 }}>Only n = 3 forces regularity. The answer is B.</div>}
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
function PolygonExplorer() {
  const [n, setN] = useState(4);
  const [showCounter, setShowCounter] = useState(true);

  const regAngle = 2 * Math.PI / n;

  // Counterexample: (n-1) angles of alpha, 1 of (180-alpha)
  // where alpha = 180/(n-2) in degrees = pi/(n-2) in radians
  const counterAlpha = Math.PI / (n - 2);
  const counterAngles = [];
  for (let i = 0; i < n - 1; i++) counterAngles.push(counterAlpha);
  counterAngles.push(Math.PI - counterAlpha);

  const angles = (n === 3 || !showCounter) ? Array(n).fill(regAngle) : counterAngles;

  const areas = angles.map(a => 0.5 * Math.sin(a));
  const allEqual = Math.max(...areas) - Math.min(...areas) < 0.001;
  const isRegular = angles.every(a => Math.abs(a - regAngle) < 0.01);

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.ps, marginBottom: 6 }}>Number of sides (n)</div>
          <div style={{ display: "flex", gap: 6 }}>
            {[3, 4, 5, 6, 7, 8].map(v => (
              <button key={v} onClick={() => { setN(v); setShowCounter(v > 3); }}
                style={{
                  width: 36, height: 36, borderRadius: 8, cursor: "pointer",
                  border: `2px solid ${n === v ? C.accent : C.border}`,
                  background: n === v ? C.accent + "20" : C.card,
                  color: n === v ? C.accent : C.muted,
                  fontSize: 14, fontWeight: 700, transition: "all 0.2s",
                }}>{v}</button>
            ))}
          </div>
        </div>

        {n === 3 ? (
          <div style={{ padding: "10px 14px", borderRadius: 8, background: C.conclBg, border: `1px solid ${C.ok}44`, fontSize: 13, color: C.ok, fontWeight: 600, lineHeight: 1.5 }}>
            For n = 3, equal areas forces all central angles to be 120{"\u00B0"}. The polygon must be regular.
          </div>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setShowCounter(false)} style={{
              flex: 1, padding: "12px", borderRadius: 10, cursor: "pointer",
              border: `2px solid ${!showCounter ? C.ok : C.border}`,
              background: !showCounter ? C.ok + "15" : C.card,
              color: !showCounter ? C.ok : C.muted,
              fontSize: 12, fontWeight: 700, transition: "all 0.2s",
            }}>
              <div>Regular</div>
              <div style={{ fontSize: 10, marginTop: 2, opacity: 0.7 }}>All angles = {(360 / n).toFixed(1)}{"\u00B0"}</div>
            </button>
            <button onClick={() => setShowCounter(true)} style={{
              flex: 1, padding: "12px", borderRadius: 10, cursor: "pointer",
              border: `2px solid ${showCounter ? C.assum : C.border}`,
              background: showCounter ? C.assum + "15" : C.card,
              color: showCounter ? C.assum : C.muted,
              fontSize: 12, fontWeight: 700, transition: "all 0.2s",
            }}>
              <div>Counterexample</div>
              <div style={{ fontSize: 10, marginTop: 2, opacity: 0.7 }}>{n-1} at {(180 / (n - 2)).toFixed(1)}{"\u00B0"}, 1 at {(180 - 180 / (n - 2)).toFixed(1)}{"\u00B0"}</div>
            </button>
          </div>
        )}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 18 }}>
        <PolygonDiagram angles={angles} showAreas showAngles highlightEqual label={`n = ${n}`} compact={false} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 18 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, marginBottom: 4 }}>n</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: C.white }}>{n}</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${allEqual ? C.ok : C.fail}`, borderRadius: 14, padding: "14px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: allEqual ? C.ok : C.fail, fontWeight: 700, marginBottom: 4 }}>Equal areas?</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: allEqual ? C.ok : C.fail }}>{allEqual ? "Yes" : "No"}</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${isRegular ? C.ok : C.assum}`, borderRadius: 14, padding: "14px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: isRegular ? C.ok : C.assum, fontWeight: 700, marginBottom: 4 }}>Regular?</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: isRegular ? C.ok : C.assum }}>{isRegular ? "Yes" : "No"}</div>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 18px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ background: C.assumBg, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.assum, fontWeight: 700, whiteSpace: "nowrap" }}>HINT</span>
          <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, margin: 0 }}>For n = 3, there is no counterexample to show - equal areas always means regular. For n {"\u2265"} 4, toggle between "Regular" and "Counterexample" to see that equal-area triangles do not force regularity.</p>
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
  { letter: "A", text: "No values of n", ok: false, expl: "n = 3 does force regularity. With three central angles summing to 360\u00B0, the equal-area constraint leaves no freedom." },
  { letter: "B", text: "n = 3 only", ok: true, expl: "For n = 3, every attempt to mix angles \u03B1 and (180\u00B0 - \u03B1) leads to a degenerate case. For n \u2265 4, a non-regular polygon with equal-area triangles always exists." },
  { letter: "C", text: "n = 3 and n = 4 only", ok: false, expl: "n = 4 does NOT force regularity. A non-square rectangle inscribed in its circumscribed circle has equal-area triangles (opposing central angles are supplementary, so sin is equal)." },
  { letter: "D", text: <span>n = 3 and n {"\u2265"} 5 only</span>, ok: false, expl: "n \u2265 5 does not force regularity either. Using (n-1) angles of 180\u00B0/(n-2) and one angle of 180\u00B0 - 180\u00B0/(n-2) gives equal areas without regularity." },
  { letter: "E", text: "All values of n", ok: false, expl: "Not all values. For any n \u2265 4, a counterexample exists. Only n = 3 forces regularity." },
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
            <span style={{ fontSize: 12, color: C.ps }}>Geometric Reasoning</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TMUA 2022 {"\u00B7"} Paper 1 {"\u00B7"} Question 19</p>
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
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question 19</span>
            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: "0 0 8px" }}>A polygon has n vertices, where n {"\u2265"} 3. It has the following properties:</p>
              <ul style={{ margin: "0 0 8px", paddingLeft: 24, lineHeight: 2 }}>
                <li>Every vertex lies on the circumference of a circle C.</li>
                <li>The centre of the circle C is inside the polygon.</li>
                <li>The radii from the centre to the vertices cut the polygon into n triangles of equal area.</li>
              </ul>
              <p style={{ margin: 0 }}>For which values of n are these properties <strong style={{ color: C.assum }}>sufficient</strong> to deduce that the polygon is regular?</p>
            </div>
            <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <PolygonDiagram angles={[2*Math.PI/5, 2*Math.PI/5, 2*Math.PI/5, 2*Math.PI/5, 2*Math.PI/5]} showAreas={false} showAngles={false} highlightEqual={false} label="Regular pentagon" compact />
              <PolygonDiagram angles={[Math.PI/3, Math.PI/3, Math.PI/3, Math.PI/3, 2*Math.PI/3]} showAreas={false} showAngles={false} highlightEqual={false} label="Non-regular pentagon" compact />
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
                Each triangle has two sides equal to the radius r of the circle, with some central angle {"\u03B8"}<sub>i</sub> between them. The area of each triangle is {"\u00BD"}r{"\u00B2"}sin({"\u03B8"}<sub>i</sub>). For the areas to be equal, we need all the sin({"\u03B8"}<sub>i</sub>) to be equal.
              </p>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 16px" }}>
                The crucial observation is that sin is not one-to-one: sin({"\u03B1"}) = sin(180{"\u00B0"} - {"\u03B1"}). So the angles do not all have to be equal for the areas to match. We need to check whether this freedom actually allows a non-regular polygon for each n.
              </p>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>STRATEGY</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>For each n, try to build a non-regular polygon where some central angles are {"\u03B1"} and others are (180{"\u00B0"} - {"\u03B1"}), with the total summing to 360{"\u00B0"}. If this is impossible, n forces regularity. If possible, it does not.</p>
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
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Choose the number of sides, then adjust the central angle. For n = 3, the polygon is always regular (no freedom). For n {"\u2265"} 4, use the "Counterexample" button to see a non-regular polygon with equal-area triangles.</p>
              </div>
            </div>
            <PolygonExplorer />
          </>
        )}

        {/* Step 4: Answer */}
        {step === 4 && (
          <>
            <QuestionSummary />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6, fontStyle: "italic" }}>"For which values of n are these properties sufficient to deduce that the polygon is regular?"</div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Summary by n</span>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                {[
                  { n: 3, forces: true },
                  { n: 4, forces: false },
                  { n: 5, forces: false },
                  { n: "6+", forces: false },
                ].map(s => (
                  <div key={s.n} style={{ background: (s.forces ? C.ok : C.fail) + "12", borderRadius: 8, padding: "12px 10px", textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: s.forces ? C.ok : C.fail, fontWeight: 700, marginBottom: 4 }}>n = {s.n}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: s.forces ? C.ok : C.fail }}>{s.forces ? "Forces regular" : "Counterexample exists"}</div>
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
