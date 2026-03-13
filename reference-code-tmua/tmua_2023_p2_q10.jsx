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
  curve: "#a29bfe", region: "#55efc4",
};
const mathFont = "'Cambria Math','Latin Modern Math','STIX Two Math',Georgia,serif";
const bodyFont = "'Gill Sans','Trebuchet MS',Calibri,sans-serif";

const stepsMeta = [
  { id: 0, label: "Read", title: "Read the Question" },
  { id: 1, label: "Setup", title: "Identify the Approach" },
  { id: 2, label: "Solve", title: "Check Each Line" },
  { id: 3, label: "Verify", title: "Test with Values" },
  { id: 4, label: "Answer", title: "Confirm the Answer" },
];

function QuestionSummary() {
  return (
    <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 18px", marginBottom: 16, textAlign: "center" }}>
      <p style={{ margin: "0 0 4px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
        <span style={{ fontWeight: 700, color: C.muted, letterSpacing: 0.5, marginRight: 6 }}>Q10</span>
        A student solves x<sup>4</sup> - 2x<sup>2</sup> - 3 {"<"} 0 in six lines. <strong style={{ color: C.assum }}>Where is the first error?</strong>
      </p>
      <div style={{ fontSize: 11, color: C.text, lineHeight: 1.8, marginBottom: 4, fontFamily: mathFont }}>
        <span>I: x<sup>4</sup>-2x<sup>2</sup>+1{"<"}4</span>
        <span style={{ margin: "0 6px", color: C.border }}>|</span>
        <span>II: (x<sup>2</sup>-1)<sup>2</sup>{"<"}4</span>
        <span style={{ margin: "0 6px", color: C.border }}>|</span>
        <span>III: -2{"<"}x<sup>2</sup>-1{"<"}2</span>
        <span style={{ margin: "0 6px", color: C.border }}>|</span>
        <span>IV: x<sup>2</sup>-1{"<"}2</span>
        <span style={{ margin: "0 6px", color: C.border }}>|</span>
        <span>V: x<sup>2</sup>{"<"}3</span>
        <span style={{ margin: "0 6px", color: C.border }}>|</span>
        <span>VI: -{"\u221A"}3{"<"}x{"<"}{"\u221A"}3</span>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, fontSize: 10, fontWeight: 600, color: C.muted, flexWrap: "wrap" }}>
        <span>A: correct</span><span>B: line I</span><span>C: line II</span><span>D: line III</span><span>E: line IV</span><span>F: line V</span><span>G: line VI</span>
      </div>
    </div>
  );
}


/* ───── Solve Step ───── */
function SolveStep() {
  const [revealed, setRevealed] = useState(0);
  const steps = [
    {
      label: "Line I: Add 4 to both sides",
      text: <span>x<sup>4</sup> - 2x<sup>2</sup> - 3 {"<"} 0 is equivalent to x<sup>4</sup> - 2x<sup>2</sup> + 1 {"<"} 4 (adding 4 to both sides). This is reversible and valid.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>x<sup>4</sup> - 2x<sup>2</sup> - 3 {"<"} 0</span>
          <span>x<sup>4</sup> - 2x<sup>2</sup> - 3 + 4 {"<"} 0 + 4</span>
          <span style={{ color: C.ok }}>x<sup>4</sup> - 2x<sup>2</sup> + 1 {"<"} 4 {"\u2713"}</span>
        </div>
      ),
      color: C.ok,
    },
    {
      label: "Line II: Recognise perfect square",
      text: <span>x<sup>4</sup> - 2x<sup>2</sup> + 1 = (x<sup>2</sup> - 1)<sup>2</sup> is an identity (check: expanding gives x<sup>4</sup> - 2x<sup>2</sup> + 1). So the substitution is valid.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>(x<sup>2</sup> - 1)<sup>2</sup> = x<sup>4</sup> - 2x<sup>2</sup> + 1 {"\u2713"}</span>
          <span style={{ color: C.ok }}>(x<sup>2</sup> - 1)<sup>2</sup> {"<"} 4 {"\u2713"}</span>
        </div>
      ),
      color: C.ok,
    },
    {
      label: "Line III: Square root both sides",
      text: <span>u<sup>2</sup> {"<"} 4 if and only if -2 {"<"} u {"<"} 2. With u = x<sup>2</sup> - 1, this gives -2 {"<"} x<sup>2</sup> - 1 {"<"} 2. This step is correct.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>u<sup>2</sup> {"<"} 4 {"\u21D4"} -2 {"<"} u {"<"} 2</span>
          <span style={{ color: C.ok }}>-2 {"<"} x<sup>2</sup> - 1 {"<"} 2 {"\u2713"}</span>
        </div>
      ),
      color: C.ok,
    },
    {
      label: "Line IV: Drop the left inequality (the tricky step)",
      text: <span>This looks suspicious - the student drops -2 {"<"} x<sup>2</sup> - 1 and keeps only x<sup>2</sup> - 1 {"<"} 2. But x<sup>2</sup> - 1 {"\u2265"} -1 for all real x (since x<sup>2</sup> {"\u2265"} 0). So -2 {"<"} x<sup>2</sup> - 1 is <em>always true</em>. Dropping a condition that is always true does not change the solution set.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>x<sup>2</sup> {"\u2265"} 0 for all real x</span>
          <span>so x<sup>2</sup> - 1 {"\u2265"} -1 {">"} -2 (always true)</span>
          <span style={{ color: C.muted, fontSize: 13 }}>Dropping an always-true condition preserves "iff"</span>
          <span style={{ color: C.ok }}>x<sup>2</sup> - 1 {"<"} 2 {"\u2713"}</span>
        </div>
      ),
      color: C.ok,
    },
    {
      label: "Lines V and VI: Standard steps",
      text: <span>V adds 1 to both sides (x<sup>2</sup> {"<"} 3), and VI takes the square root (x<sup>2</sup> {"<"} 3 iff -{"\u221A"}3 {"<"} x {"<"} {"\u221A"}3). Both are standard and correct.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>x<sup>2</sup> - 1 {"<"} 2 {"\u21D4"} x<sup>2</sup> {"<"} 3</span>
          <span style={{ color: C.ok }}>x<sup>2</sup> {"<"} 3 {"\u21D4"} -{"\u221A"}3 {"<"} x {"<"} {"\u221A"}3 {"\u2713"}</span>
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
          <div key={i} style={{ marginBottom: 20, animation: "fadeSlideIn 0.4s ease-out" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", flexShrink: 0, background: s.color + "22", border: `2px solid ${s.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: s.color }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: s.color, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
                <p style={{ margin: "0 0 6px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{s.text}</p>
                <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 15, color: C.white, fontFamily: mathFont, textAlign: "center", letterSpacing: 0.5, lineHeight: 2 }}>{s.math}</div>
                {i === steps.length - 1 && (
                  <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: C.conclBg, border: `1px solid ${C.ok}44`, fontSize: 13.5, color: C.ok, fontWeight: 600, lineHeight: 1.5 }}>
                    Every line is correct. The argument is completely valid. The answer is A.
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


/* ───── Verify: x Value Tester ─────
   Slider for x. Evaluates each expression at that x and shows whether the chain holds.
*/
function ValueTester() {
  const [xVal, setXVal] = useState(0);

  const x2 = xVal * xVal;
  const x4 = x2 * x2;

  const exprs = [
    { label: "x\u2074 - 2x\u00B2 - 3", val: x4 - 2 * x2 - 3, cond: x4 - 2 * x2 - 3 < 0 },
    { label: "x\u2074 - 2x\u00B2 + 1", val: x4 - 2 * x2 + 1, cond: x4 - 2 * x2 + 1 < 4 },
    { label: "(x\u00B2 - 1)\u00B2", val: (x2 - 1) ** 2, cond: (x2 - 1) ** 2 < 4 },
    { label: "x\u00B2 - 1", val: x2 - 1, cond: x2 - 1 > -2 && x2 - 1 < 2 },
    { label: "x\u00B2 - 1 (right only)", val: x2 - 1, cond: x2 - 1 < 2 },
    { label: "x\u00B2", val: x2, cond: x2 < 3 },
  ];

  const inSolution = Math.abs(xVal) < Math.sqrt(3);
  const sqrt3 = Math.sqrt(3);

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 20px", marginBottom: 18 }}>
      {/* Slider */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.text, marginBottom: 4 }}>
          <span style={{ fontFamily: mathFont }}>x = {xVal.toFixed(2)}</span>
          <span style={{ fontSize: 11, color: inSolution ? C.ok : C.fail, fontWeight: 600 }}>
            {inSolution ? `In solution set (-\u221A3, \u221A3)` : `Outside solution set`}
          </span>
        </div>
        <input type="range" min={-3} max={3} step={0.01} value={xVal}
          onChange={e => setXVal(+e.target.value)}
          style={{ width: "100%", height: 6, borderRadius: 3, cursor: "pointer", accentColor: C.curve, background: C.border }} />
      </div>

      {/* Chain of equivalences */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        {[
          { line: "Original", lineExpr: "x\u2074-2x\u00B2-3 < 0", expr: `${(x4 - 2 * x2 - 3).toFixed(2)} < 0`, holds: x4 - 2 * x2 - 3 < -0.001 },
          { line: "I", lineExpr: "x\u2074-2x\u00B2+1 < 4", expr: `${(x4 - 2 * x2 + 1).toFixed(2)} < 4`, holds: x4 - 2 * x2 + 1 < 4 - 0.001 },
          { line: "II", lineExpr: "(x\u00B2-1)\u00B2 < 4", expr: `${((x2 - 1) ** 2).toFixed(2)} < 4`, holds: (x2 - 1) ** 2 < 4 - 0.001 },
          { line: "III", lineExpr: "-2 < x\u00B2-1 < 2", expr: `-2 < ${(x2 - 1).toFixed(2)} < 2`, holds: x2 - 1 > -2 + 0.001 && x2 - 1 < 2 - 0.001 },
          { line: "IV", lineExpr: "x\u00B2-1 < 2", expr: `${(x2 - 1).toFixed(2)} < 2`, holds: x2 - 1 < 2 - 0.001 },
          { line: "V-VI", lineExpr: "x\u00B2 < 3", expr: `${x2.toFixed(2)} < 3`, holds: x2 < 3 - 0.001 },
        ].map((e, i) => (
          <div key={i} style={{ padding: "8px 10px", borderRadius: 8, background: e.holds ? C.ok + "10" : C.fail + "10", border: `1px solid ${e.holds ? C.ok : C.fail}33`, textAlign: "center" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, marginBottom: 2 }}>{e.line}</div>
            <div style={{ fontSize: 9, color: C.muted, fontFamily: mathFont, marginBottom: 4 }}>{e.lineExpr}</div>
            <div style={{ fontSize: 11, fontFamily: mathFont, color: e.holds ? C.ok : C.fail }}>{e.expr}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: e.holds ? C.ok : C.fail }}>{e.holds ? "\u2713" : "\u2717"}</div>
          </div>
        ))}
      </div>

      {/* Key observation about line IV */}
      <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 8, background: C.assumBg, border: `1px solid ${C.assum}44` }}>
        <div style={{ fontSize: 11, color: C.assum, fontWeight: 600, marginBottom: 4 }}>Why line IV is valid</div>
        <div style={{ fontSize: 12, fontFamily: mathFont, color: C.text }}>
          x<sup>2</sup> - 1 = {(x2 - 1).toFixed(2)} {x2 - 1 >= -1 ? "\u2265" : "<"} -1 {">"} -2
          <span style={{ color: C.muted, fontFamily: bodyFont, fontSize: 11 }}> (the left bound -2 {"<"} x<sup>2</sup>-1 is always true, so dropping it is safe)</span>
        </div>
      </div>

      {/* Presets */}
      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: C.muted, alignSelf: "center", marginRight: 4 }}>Presets:</span>
        {[
          { label: "x = 0 (in set)", x: 0 },
          { label: "x = 1 (in set)", x: 1 },
          { label: "x = \u221A3 (boundary)", x: Math.sqrt(3) },
          { label: "x = 2 (outside)", x: 2 },
          { label: "x = -1.5 (outside)", x: -1.5 },
        ].map((p, i) => (
          <button key={i} onClick={() => setXVal(p.x)}
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
  { letter: "A", text: "The argument is completely correct.", ok: true,
    expl: "Every line is a valid equivalence. The trickiest step (IV) works because x\u00B2 - 1 \u2265 -1 > -2 for all real x, so the left bound is always satisfied and can be dropped without changing the solution set." },
  { letter: "B", text: "The first error occurs in line I.", ok: false,
    expl: "Line I adds 4 to both sides, which is reversible. x\u2074 - 2x\u00B2 - 3 < 0 iff x\u2074 - 2x\u00B2 + 1 < 4." },
  { letter: "C", text: "The first error occurs in line II.", ok: false,
    expl: "Line II recognises (x\u00B2-1)\u00B2 = x\u2074 - 2x\u00B2 + 1 is a perfect square identity. This is correct." },
  { letter: "D", text: "The first error occurs in line III.", ok: false,
    expl: "u\u00B2 < 4 iff -2 < u < 2. Substituting u = x\u00B2-1 gives -2 < x\u00B2-1 < 2. This is correct." },
  { letter: "E", text: "The first error occurs in line IV.", ok: false,
    expl: "This looks suspicious, but x\u00B2 - 1 \u2265 -1 for all real x, so -2 < x\u00B2 - 1 is always true. Dropping an always-true condition preserves equivalence." },
  { letter: "F", text: "The first error occurs in line V.", ok: false,
    expl: "Line V adds 1 to both sides. x\u00B2 - 1 < 2 iff x\u00B2 < 3. Correct." },
  { letter: "G", text: "The first error occurs in line VI.", ok: false,
    expl: "x\u00B2 < 3 iff -\u221A3 < x < \u221A3. This is the standard result for solving x\u00B2 < k where k > 0." },
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
            <span style={{ fontSize: 12, color: C.ps }}>Proof Checking</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TMUA 2023 {"\u00B7"} Paper 2 {"\u00B7"} Question 10</p>
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
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question 10</span>
            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: "0 0 8px" }}>Here is an attempt to solve the inequality x<sup>4</sup> - 2x<sup>2</sup> - 3 {"<"} 0 by completing the square:</p>
              <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontFamily: mathFont, fontSize: 15, lineHeight: 2.4 }}>
                <div style={{ textAlign: "center", marginBottom: 6 }}>x<sup>4</sup> - 2x<sup>2</sup> - 3 {"<"} 0</div>
                <div><span style={{ fontWeight: 700, color: C.ps, fontFamily: bodyFont, fontSize: 12, marginRight: 8 }}>I</span> if and only if x<sup>4</sup> - 2x<sup>2</sup> + 1 {"<"} 4</div>
                <div><span style={{ fontWeight: 700, color: C.ps, fontFamily: bodyFont, fontSize: 12, marginRight: 8 }}>II</span> if and only if (x<sup>2</sup> - 1)<sup>2</sup> {"<"} 4</div>
                <div><span style={{ fontWeight: 700, color: C.ps, fontFamily: bodyFont, fontSize: 12, marginRight: 8 }}>III</span> if and only if -2 {"<"} x<sup>2</sup> - 1 {"<"} 2</div>
                <div><span style={{ fontWeight: 700, color: C.assum, fontFamily: bodyFont, fontSize: 12, marginRight: 8 }}>IV</span> if and only if x<sup>2</sup> - 1 {"<"} 2</div>
                <div><span style={{ fontWeight: 700, color: C.ps, fontFamily: bodyFont, fontSize: 12, marginRight: 8 }}>V</span> if and only if x<sup>2</sup> {"<"} 3</div>
                <div><span style={{ fontWeight: 700, color: C.ps, fontFamily: bodyFont, fontSize: 12, marginRight: 8 }}>VI</span> if and only if -{"\u221A"}3 {"<"} x {"<"} {"\u221A"}3</div>
              </div>
              <p style={{ margin: "12px 0 0", fontSize: 14, color: C.assum }}>Which of the following statements is true?</p>
            </div>
          </div>
        )}

        {/* Step 1: Setup */}
        {step === 1 && (
          <>
            <QuestionSummary />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>What to look for</span>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 10px" }}>
                Each line claims "if and only if", meaning it must be a <strong style={{ color: C.assum }}>reversible equivalence</strong>. Check that each step both follows from and implies the previous one. Watch out for steps that drop information or introduce extraneous solutions.
              </p>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 0" }}>
                The most suspicious step is <strong style={{ color: C.assum }}>line IV</strong>, where one of the two inequalities from line III is dropped. The question is whether this loses any information.
              </p>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>STRATEGY</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Check each line in order. For each "if and only if", verify the forward and reverse directions. Pay special attention to where an inequality is dropped - is the dropped part always true?</p>
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
                  Slide x across the number line. Every line should give the same true/false answer for the same x. If any line disagrees, that line has an error. Notice they all agree - the argument is correct.
                </p>
              </div>
            </div>
            <ValueTester />
          </>
        )}

        {/* Step 4: Answer */}
        {step === 4 && (
          <>
            <QuestionSummary />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6, fontStyle: "italic" }}>"Which of the following statements is true?"</div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Line-by-line verdict</span>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["I", "II", "III", "IV", "V", "VI"].map(line => (
                  <div key={line} style={{ flex: "1 1 60px", minWidth: 50, background: C.ok + "12", borderRadius: 8, padding: "10px 6px", textAlign: "center" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.ok, marginBottom: 2 }}>{line}</div>
                    <div style={{ fontSize: 10, color: C.ok }}>{"\u2713"}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 8, background: C.assumBg, border: `1px solid ${C.assum}44`, fontSize: 12, color: C.assum }}>
                Line IV is the intended trap. Dropping -2 {"<"} x<sup>2</sup>-1 is valid because x<sup>2</sup> {"\u2265"} 0 makes it always true.
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
