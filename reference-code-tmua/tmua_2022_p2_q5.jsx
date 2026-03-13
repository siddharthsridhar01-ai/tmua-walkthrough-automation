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
  line: "#a29bfe", xInt: "#55efc4", yInt: "#fd79a8", fixed: "#fdcb6e",
};
const mathFont = "'Cambria Math','Latin Modern Math','STIX Two Math',Georgia,serif";
const bodyFont = "'Gill Sans','Trebuchet MS',Calibri,sans-serif";

const stepsMeta = [
  { id: 0, label: "Read", title: "Read the Question" },
  { id: 1, label: "Setup", title: "Identify the Approach" },
  { id: 2, label: "Solve", title: "Test Each Statement" },
  { id: 3, label: "Verify", title: "Explore Lines Through (1, 2)" },
  { id: 4, label: "Answer", title: "Confirm the Answer" },
];

function QuestionSummary() {
  return (
    <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 18px", marginBottom: 16, textAlign: "center" }}>
      <p style={{ margin: "0 0 6px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
        <span style={{ fontWeight: 700, color: C.muted, letterSpacing: 0.5, marginRight: 6 }}>Q5</span>
        Line L passes through (1, 2). Which of the following <strong style={{ color: C.assum }}>must be true</strong>?
      </p>
      <div style={{ fontSize: 12, color: C.text, lineHeight: 1.8, marginBottom: 6, fontFamily: mathFont }}>
        <div>I: P - if y-int {"<"} 0, then x-int {">"} 0</div>
        <div>II: converse - if x-int {">"} 0, then y-int {"<"} 0</div>
        <div>III: contrapositive - if x-int {"\u2264"} 0, then y-int {"\u2265"} 0</div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, fontSize: 10, fontWeight: 600, color: C.muted, flexWrap: "wrap" }}>
        <span>A: none</span><span>B: I</span><span>C: II</span><span>D: III</span><span>E: I,II</span><span>F: I,III</span><span>G: II,III</span><span>H: all</span>
      </div>
    </div>
  );
}

/* ───── Line Graph ─────
   Shows a line through (1,2) with given gradient.
   Highlights x-intercept and y-intercept.
   Props:
   - m: gradient of the line
   - showIntercepts: show and label intercepts
   - showFixedPoint: highlight (1,2)
   - highlightP: colour-code based on P's truth
   - compact: smaller for solve pane
   - general: schematic mode
*/
function LineGraph({ m, showIntercepts, showFixedPoint, highlightP, compact, general }) {
  const mL = compact ? 28 : 40, mR = compact ? 14 : 20;
  const mT = compact ? 14 : 18, mB = compact ? 22 : 28;
  const pW = compact ? 200 : 360, pH = compact ? 140 : 220;
  const w = mL + pW + mR, h = mT + pH + mB;

  // Line: y - 2 = m(x - 1), i.e. y = mx + (2 - m)
  const c = 2 - m; // y-intercept
  const xInt = m !== 0 ? -c / m : null; // x-intercept (y=0)
  const yInt = c; // y-intercept (x=0)

  // Determine ranges
  const xMinM = compact ? -2 : -3, xMaxM = compact ? 5 : 6;
  const yMinM = compact ? -3 : -4, yMaxM = compact ? 5 : 6;

  const toSx = (x) => mL + ((x - xMinM) / (xMaxM - xMinM)) * pW;
  const toSy = (y) => mT + ((yMaxM - y) / (yMaxM - yMinM)) * pH;
  const sfs = compact ? 7 : 9;
  const textRectW = (str, fs) => str.length * fs * 0.62 + (compact ? 6 : 10);

  // Line endpoints at x-range boundaries
  const y1 = m * xMinM + c, y2 = m * xMaxM + c;

  // Grid
  const yGridVals = [];
  for (let v = Math.ceil(yMinM); v <= Math.floor(yMaxM); v++) yGridVals.push(v);
  const xGridVals = [];
  for (let v = Math.ceil(xMinM); v <= Math.floor(xMaxM); v++) xGridVals.push(v);

  // Truth values
  const yIntNeg = yInt < -0.01;
  const xIntPos = xInt !== null && xInt > 0.01;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", display: "block" }}>
      {/* Grid */}
      {yGridVals.map(v => (
        <g key={"yg" + v}>
          <line x1={mL} y1={toSy(v)} x2={mL + pW} y2={toSy(v)}
            stroke={v === 0 ? C.muted : C.border} strokeWidth={v === 0 ? 0.8 : 0.5}
            strokeDasharray={v === 0 ? "none" : "4,4"} opacity={v === 0 ? 0.5 : 0.3} />
          {!compact && <text x={mL - 5} y={toSy(v) + 3} fill={C.muted} fontSize={sfs} textAnchor="end" opacity={0.6} fontFamily={mathFont}>{v}</text>}
        </g>
      ))}
      {xGridVals.map(v => (
        <g key={"xg" + v}>
          <line x1={toSx(v)} y1={mT} x2={toSx(v)} y2={mT + pH}
            stroke={v === 0 ? C.muted : C.border} strokeWidth={v === 0 ? 0.8 : 0.5}
            strokeDasharray={v === 0 ? "none" : "4,4"} opacity={v === 0 ? 0.5 : 0.3} />
          {!compact && <text x={toSx(v)} y={mT + pH + 16} fill={C.muted} fontSize={sfs} textAnchor="middle" opacity={0.6} fontFamily={mathFont}>{v}</text>}
        </g>
      ))}
      {/* Line */}
      {!general && (
        <line x1={toSx(xMinM)} y1={toSy(y1)} x2={toSx(xMaxM)} y2={toSy(y2)}
          stroke={C.line} strokeWidth={compact ? 1.5 : 2} />
      )}
      {/* General mode: show a schematic line with arrow */}
      {general && (
        <>
          <line x1={toSx(-1)} y1={toSy(4)} x2={toSx(4)} y2={toSy(-1.5)}
            stroke={C.line} strokeWidth={compact ? 1.5 : 2} opacity={0.5} strokeDasharray="6,4" />
          <text x={toSx(3.5)} y={toSy(-0.5)} fill={C.line} fontSize={sfs} fontFamily={mathFont} fontStyle="italic" opacity={0.7}>L</text>
        </>
      )}
      {/* Fixed point (1,2) */}
      {showFixedPoint && (
        <>
          <circle cx={toSx(1)} cy={toSy(2)} r={compact ? 4 : 5} fill={C.fixed} stroke={C.bg} strokeWidth={1.5} />
          <g>
            <rect x={toSx(1) + 6} y={toSy(2) - (compact ? 12 : 14)} width={textRectW("(1, 2)", sfs + 1)} height={sfs + 6} rx={3} fill={C.bg} fillOpacity={0.92} />
            <text x={toSx(1) + 10} y={toSy(2) - (compact ? 5 : 6)} fill={C.fixed} fontSize={sfs + 1} fontFamily={mathFont}>(1, 2)</text>
          </g>
        </>
      )}
      {/* Intercepts */}
      {showIntercepts && !general && (
        <>
          {/* y-intercept */}
          {yInt >= yMinM && yInt <= yMaxM && (
            <>
              <circle cx={toSx(0)} cy={toSy(yInt)} r={compact ? 3.5 : 4.5} fill={C.yInt} stroke={C.bg} strokeWidth={1.5} />
              {(() => {
                const lbl = `y-int = ${yInt.toFixed(1)}`;
                const lx = toSx(0) - (compact ? 8 : 12) - textRectW(lbl, sfs);
                const ly = toSy(yInt);
                return (
                  <g>
                    <rect x={lx} y={ly - sfs / 2 - 3} width={textRectW(lbl, sfs)} height={sfs + 6} rx={3} fill={C.bg} fillOpacity={0.92} />
                    <text x={lx + 4} y={ly + sfs / 2 - 1} fill={C.yInt} fontSize={sfs} fontFamily={mathFont}>{lbl}</text>
                  </g>
                );
              })()}
            </>
          )}
          {/* x-intercept */}
          {xInt !== null && xInt >= xMinM && xInt <= xMaxM && (
            <>
              <circle cx={toSx(xInt)} cy={toSy(0)} r={compact ? 3.5 : 4.5} fill={C.xInt} stroke={C.bg} strokeWidth={1.5} />
              {(() => {
                const lbl = `x-int = ${xInt.toFixed(1)}`;
                const lx = toSx(xInt);
                const ly = toSy(0) + (compact ? 12 : 16);
                return (
                  <g>
                    <rect x={lx - textRectW(lbl, sfs) / 2} y={ly - sfs / 2 - 2} width={textRectW(lbl, sfs)} height={sfs + 4} rx={3} fill={C.bg} fillOpacity={0.92} />
                    <text x={lx} y={ly + sfs / 2 - 1} fill={C.xInt} fontSize={sfs} textAnchor="middle" fontFamily={mathFont}>{lbl}</text>
                  </g>
                );
              })()}
            </>
          )}
        </>
      )}
      {/* P truth indicator */}
      {highlightP && !general && (
        (() => {
          let pText, pColor;
          if (!yIntNeg) {
            pText = "y-int \u2265 0 (P not tested)";
            pColor = C.muted;
          } else if (xIntPos) {
            pText = "y-int < 0, x-int > 0: P holds";
            pColor = C.ok;
          } else {
            pText = "y-int < 0, x-int \u2264 0: P violated";
            pColor = C.fail;
          }
          return (
            <g>
              <rect x={mL + 4} y={mT + 4} width={textRectW(pText, sfs) + 4} height={sfs + 8} rx={4} fill={pColor + "22"} stroke={pColor} strokeWidth={0.8} />
              <text x={mL + 8} y={mT + sfs + 7} fill={pColor} fontSize={sfs} fontFamily={bodyFont} fontWeight={600}>{pText}</text>
            </g>
          );
        })()
      )}
    </svg>
  );
}


/* ───── Solve Step ───── */
function SolveStep() {
  const [revealed, setRevealed] = useState(0);

  const graphForStep = (g) => {
    // Step 1: line with negative y-int, show x-int is between 0 and 1
    if (g === "p_true") return <LineGraph m={5} showIntercepts showFixedPoint compact />;
    // Step 2: line with positive x-int > 1 but positive y-int (converse fails)
    if (g === "conv_fail") return <LineGraph m={-1} showIntercepts showFixedPoint compact />;
    return null;
  };

  const steps = [
    {
      label: "Statement I: P is true",
      text: <span>If the y-intercept is negative, the line passes through (1, 2) from below the x-axis. It must cross the x-axis somewhere between x = 0 and x = 1, since y {"<"} 0 at x = 0 and y = 2 {">"} 0 at x = 1. So the x-intercept is positive.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>y-intercept {"<"} 0 means y(0) {"<"} 0</span>
          <span>But y(1) = 2 {">"} 0</span>
          <span>So the line crosses y = 0 for some x in (0, 1)</span>
          <span style={{ color: C.ok }}>x-intercept is in (0, 1), so positive. P is true.</span>
        </div>
      ),
      graph: "p_true",
      graphCaption: <span>Example: a steep line with <span style={{ color: C.yInt }}>y-int {"<"} 0</span> always has <span style={{ color: C.xInt }}>x-int</span> between 0 and 1.</span>,
      color: C.ok,
    },
    {
      label: "Statement II: Converse of P is false",
      text: <span>The converse says: "if x-intercept {">"} 0, then y-intercept {"<"} 0." A counterexample: a line through (1, 2) with a gentle negative slope can have x-intercept {">"} 1 but still cross the y-axis above zero.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ color: C.muted, fontSize: 13 }}>Let L have gradient -1 through (1, 2):</span>
          <span>y = -x + 3</span>
          <span>y-intercept = 3 {">"} 0, x-intercept = 3 {">"} 0</span>
          <span style={{ color: C.fail }}>x-int {">"} 0 but y-int {">"} 0. Converse is false.</span>
        </div>
      ),
      graph: "conv_fail",
      graphCaption: <span>Counterexample: <span style={{ color: C.xInt }}>x-int = 3 {">"} 0</span> but <span style={{ color: C.yInt }}>y-int = 3 {">"} 0</span>. Converse fails.</span>,
      color: C.fail,
    },
    {
      label: "Statement III: Contrapositive of P is true",
      text: <span>The contrapositive of any statement always has the same truth value as the original. Since P is true, the contrapositive of P is also true. (It says: "if x-intercept is not positive, then y-intercept is not negative.")</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>Contrapositive of P:</span>
          <span>"if x-int {"\u2264"} 0, then y-int {"\u2265"} 0"</span>
          <span style={{ color: C.muted, fontSize: 13 }}>A statement and its contrapositive are logically equivalent.</span>
          <span style={{ color: C.ok }}>P is true, so contrapositive is true.</span>
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
                      <p style={{ margin: "0 0 6px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{s.text}</p>
                      <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 15, color: C.white, fontFamily: mathFont, textAlign: "center", letterSpacing: 0.5, lineHeight: 2 }}>{s.math}</div>
                    </div>
                    <div>
                      <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px", display: "flex", alignItems: "center" }}>
                        {graphForStep(s.graph)}
                      </div>
                      {s.graphCaption && <p style={{ margin: "6px 0 0", fontSize: 10, color: C.muted, lineHeight: 1.4, textAlign: "center" }}>{s.graphCaption}</p>}
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
                    I and III are true, II is false. The answer is F.
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


/* ───── Verify: Line Explorer ─────
   Slider for gradient. Shows line through (1,2), intercepts, P/converse/contrapositive truth.
*/
function LineExplorer() {
  const [m, setM] = useState(3);

  const c = 2 - m; // y = mx + c
  const yInt = c;
  const xInt = m !== 0 ? -c / m : null;
  const yIntNeg = yInt < -0.01;
  const xIntPos = xInt !== null && xInt > 0.01;

  // P: y-int < 0 => x-int > 0
  const pApplies = yIntNeg;
  const pHolds = !yIntNeg || xIntPos;
  // Converse: x-int > 0 => y-int < 0
  const convApplies = xIntPos;
  const convHolds = !xIntPos || yIntNeg;

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 20px", marginBottom: 18 }}>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {/* Left: Graph */}
        <div style={{ flex: "1 1 340px", minWidth: 280 }}>
          <LineGraph m={m} showIntercepts showFixedPoint highlightP />
        </div>
        {/* Right: Controls + Status */}
        <div style={{ flex: "0 0 240px", minWidth: 210 }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.text, marginBottom: 4 }}>
              <span style={{ fontFamily: mathFont }}>gradient = {m.toFixed(1)}</span>
            </div>
            <input type="range" min={-5} max={8} step={0.1} value={m}
              onChange={e => setM(+e.target.value)} style={{ width: "100%", height: 6, borderRadius: 3, cursor: "pointer", accentColor: C.line, background: C.border }} />
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4, fontFamily: mathFont }}>
              y = {m.toFixed(1)}x + {(2 - m).toFixed(1)}
            </div>
          </div>
          {/* Intercept values */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <div style={{ flex: 1, padding: "6px 8px", borderRadius: 6, background: "#1e2030", border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>y-intercept</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: yIntNeg ? C.yInt : C.text, fontFamily: mathFont }}>{yInt.toFixed(1)}</div>
            </div>
            <div style={{ flex: 1, padding: "6px 8px", borderRadius: 6, background: "#1e2030", border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>x-intercept</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: xIntPos ? C.xInt : C.text, fontFamily: mathFont }}>{xInt !== null ? xInt.toFixed(1) : "none"}</div>
            </div>
          </div>
          {/* Arrow-notation logic checker */}
          {(() => {
            const xIntNonPos = xInt === null || xInt <= 0.01;
            const yIntNonNeg = yInt >= -0.01;

            const statements = [
              {
                num: "I", label: "P",
                left: { label: "y-int < 0", value: yIntNeg },
                right: { label: "x-int > 0", value: xIntPos },
              },
              {
                num: "II", label: "Converse",
                left: { label: "x-int > 0", value: xIntPos },
                right: { label: "y-int < 0", value: yIntNeg },
              },
              {
                num: "III", label: "Contrapositive",
                left: { label: "x-int \u2264 0", value: xIntNonPos },
                right: { label: "y-int \u2265 0", value: yIntNonNeg },
              },
            ];

            return statements.map(s => {
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
                      <span style={{ color: C.muted }}>Left side is false - implication holds vacuously (not a useful test)</span>
                    ) : violated ? (
                      <span style={{ color: C.fail, fontWeight: 700 }}>VIOLATED: left is true but right is false</span>
                    ) : (
                      <span style={{ color: C.ok }}>Consistent: both sides agree</span>
                    )}
                  </div>
                </div>
              );
            });
          })()}
          {/* Live observation */}
          <div style={{ marginTop: 10, padding: "8px 10px", borderRadius: 8, background: C.psBg, border: `1px solid ${C.ps}44`, fontSize: 11, color: C.ps, lineHeight: 1.5 }}>
            {yIntNeg && xIntPos && "y-int < 0 and x-int > 0: P and contrapositive hold. Try to find a line where P fails - you cannot."}
            {!yIntNeg && xIntPos && !yIntNeg && "x-int > 0 but y-int \u2265 0: the converse is violated. P is vacuously true here (hypothesis not met)."}
            {!yIntNeg && !xIntPos && "Neither hypothesis is met. Try increasing the gradient to push the y-intercept below zero."}
            {yIntNeg && !xIntPos && "This should not happen for a line through (1,2) - the x-intercept must be positive when y-int < 0."}
          </div>
        </div>
      </div>
      {/* Presets */}
      <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: C.muted, alignSelf: "center", marginRight: 4 }}>Presets:</span>
        {[
          { label: "P holds (steep, m=5)", m: 5 },
          { label: "Converse fails (m=-1)", m: -1 },
          { label: "Converse fails (m=0.5)", m: 0.5 },
          { label: "Horizontal (m=0)", m: 0 },
        ].map((p, i) => (
          <button key={i} onClick={() => setM(p.m)}
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
  { letter: "A", text: "None of them", ok: false, expl: "P is true: a line through (1,2) with negative y-intercept must have positive x-intercept." },
  { letter: "B", text: "I only", ok: false, expl: "P is true, but so is its contrapositive (always logically equivalent to P)." },
  { letter: "C", text: "II only", ok: false, expl: "The converse is false. y = -x + 3 passes through (1,2) with x-intercept 3 > 0 but y-intercept 3 > 0." },
  { letter: "D", text: "III only", ok: false, expl: "The contrapositive is true, but P itself is also true." },
  { letter: "E", text: "I and II only", ok: false, expl: "The converse is false. A line with x-intercept > 1 can have a positive y-intercept." },
  { letter: "F", text: "I and III only", ok: true, expl: "P is true (negative y-intercept forces x-intercept between 0 and 1). The contrapositive is always equivalent to P, so it is also true. The converse has counterexamples." },
  { letter: "G", text: "II and III only", ok: false, expl: "P is true, so it should be included. And the converse is false." },
  { letter: "H", text: "I, II and III", ok: false, expl: "The converse is false: y = -x + 3 gives x-int = 3 > 0 but y-int = 3 > 0." },
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
            <span style={{ fontSize: 12, color: C.ps }}>Logic and Geometry</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TMUA 2022 {"\u00B7"} Paper 2 {"\u00B7"} Question 5</p>
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
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question 5</span>
            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: "0 0 8px" }}>A straight line L passes through (1, 2).</p>
              <p style={{ margin: "0 0 8px" }}>Let P be the statement:</p>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", margin: "8px 0 12px", textAlign: "center", fontSize: 15 }}>
                <strong>if</strong> the y-intercept of L is negative, <strong>then</strong> the x-intercept of L is positive.
              </div>
              <p style={{ margin: "0 0 6px" }}>Which of the following statements <strong style={{ color: C.assum }}>must be true</strong>?</p>
              <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 18px", fontSize: 14, lineHeight: 2 }}>
                <div><strong style={{ color: C.ps }}>I</strong>{" "} P</div>
                <div><strong style={{ color: C.ps }}>II</strong>{" "} the converse of P</div>
                <div><strong style={{ color: C.ps }}>III</strong>{" "} the contrapositive of P</div>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Setup */}
        {step === 1 && (
          <>
            <QuestionSummary />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Unpack the logic</span>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 10px" }}>
                <strong style={{ color: C.ps }}>P:</strong> "If y-intercept {"<"} 0, then x-intercept {">"} 0."
              </p>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 10px" }}>
                <strong style={{ color: C.assum }}>Converse:</strong> "If x-intercept {">"} 0, then y-intercept {"<"} 0." (Swap hypothesis and conclusion.)
              </p>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 10px" }}>
                <strong style={{ color: C.ok }}>Contrapositive:</strong> "If x-intercept {"\u2264"} 0, then y-intercept {"\u2265"} 0." (Negate both and swap.)
              </p>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 0" }}>
                A key fact: a statement and its contrapositive are <strong style={{ color: C.ok }}>always logically equivalent</strong>. If P is true, III is automatically true (and vice versa). The converse is independent - it can be true or false regardless.
              </p>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>STRATEGY</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Test P by thinking about what a negative y-intercept forces geometrically. Then test the converse by looking for a counterexample. The contrapositive follows from P for free.</p>
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
                  Drag the gradient slider to rotate the line through (1, 2). Watch the intercepts and truth values change. Can you find a line where P is violated? Can you find one where the converse holds?
                </p>
              </div>
            </div>
            <LineExplorer />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 20px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.assumBg, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.assum, fontWeight: 700, whiteSpace: "nowrap" }}>KEY POINT</span>
                <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, margin: 0 }}>When the y-intercept is negative, the x-intercept is always trapped between 0 and 1 (the line must cross the x-axis before reaching the fixed point). But a positive x-intercept does not force a negative y-intercept - the line could cross the x-axis beyond x = 1 with a gentle downward slope.</p>
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
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6, fontStyle: "italic" }}>"Which of the following statements must be true?"</div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Verdict</span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <div style={{ background: C.ok + "12", borderRadius: 8, padding: "12px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.ok, marginBottom: 4 }}>I: P</div>
                  <div style={{ fontSize: 11, color: C.ok }}>y-int {"<"} 0 forces</div>
                  <div style={{ fontSize: 11, color: C.ok }}>x-int in (0, 1)</div>
                </div>
                <div style={{ background: C.fail + "12", borderRadius: 8, padding: "12px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.fail, marginBottom: 4 }}>II: Converse</div>
                  <div style={{ fontSize: 11, color: C.fail }}>y = -x + 3 gives</div>
                  <div style={{ fontSize: 11, color: C.fail }}>x-int {">"} 0, y-int {">"} 0</div>
                </div>
                <div style={{ background: C.ok + "12", borderRadius: 8, padding: "12px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.ok, marginBottom: 4 }}>III: Contra</div>
                  <div style={{ fontSize: 11, color: C.ok }}>Same truth value</div>
                  <div style={{ fontSize: 11, color: C.ok }}>as P (always)</div>
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
