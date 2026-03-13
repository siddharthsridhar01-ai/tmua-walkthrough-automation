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
  seqA: "#a29bfe", seqB: "#fd79a8", seqC: "#55efc4",
};
const mathFont = "'Cambria Math','Latin Modern Math','STIX Two Math',Georgia,serif";

const stepsMeta = [
  { id: 0, label: "Read", title: "Read the Question" },
  { id: 1, label: "Setup", title: "Identify the Approach" },
  { id: 2, label: "Solve", title: "Test Each Statement" },
  { id: 3, label: "Verify", title: "Try Concrete Examples" },
  { id: 4, label: "Answer", title: "Confirm the Answer" },
];

function QuestionSummary() {
  return (
    <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 18px", marginBottom: 16, textAlign: "center" }}>
      <p style={{ margin: "0 0 6px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
        <span style={{ fontWeight: 700, color: C.muted, letterSpacing: 0.5, marginRight: 6 }}>Q16</span>
        a<sub>n</sub> {"\u2264"} b<sub>n</sub> + c<sub>n</sub> for each n. Which statements about min/max of the sequences <strong style={{ color: C.assum }}>must be true</strong>?
      </p>
      <div style={{ fontSize: 12, color: C.text, lineHeight: 1.8, marginBottom: 6, fontFamily: mathFont }}>
        <div>I: min(a) {"\u2264"} min(b) + min(c)</div>
        <div>II: min(a) {"\u2265"} min(b) + min(c)</div>
        <div>III: max(a) {"\u2264"} max(b) + max(c)</div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, fontSize: 10, fontWeight: 600, color: C.muted, flexWrap: "wrap" }}>
        <span>A: none</span><span>B: I only</span><span>C: II only</span><span>D: III only</span><span>E: I,II</span><span>F: I,III</span><span>G: II,III</span><span>H: I,II,III</span>
      </div>
    </div>
  );
}

/* ───── Solve Step ───── */
function SolveStep() {
  const [revealed, setRevealed] = useState(0);
  const steps = [
    {
      label: "Statement I: min(a) \u2264 min(b) + min(c)",
      text: "Try to find a counterexample. The key idea: the minimum of b and minimum of c might occur at different indices, so their sum can be much smaller than any individual b\u2099 + c\u2099.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ color: C.muted, fontSize: 13 }}>Counterexample (using 2 terms for clarity):</span>
          <span>b<sub>1</sub> = 0, b<sub>2</sub> = 100</span>
          <span>c<sub>1</sub> = 100, c<sub>2</sub> = 0</span>
          <span>a<sub>1</sub> = a<sub>2</sub> = 100</span>
          <span style={{ color: C.muted, fontSize: 13 }}>a<sub>n</sub> {"\u2264"} b<sub>n</sub> + c<sub>n</sub> = 100 holds for each n</span>
          <span>min(a) = 100, but min(b) + min(c) = 0 + 0 = 0</span>
          <span style={{ color: C.fail }}>100 {"\u2264"} 0 is false. Statement I can fail.</span>
        </div>
      ),
      color: C.fail,
    },
    {
      label: "Statement II: min(a) \u2265 min(b) + min(c)",
      text: "Try another counterexample. If a\u2099 is much smaller than b\u2099 + c\u2099, then min(a) can be less than min(b) + min(c).",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ color: C.muted, fontSize: 13 }}>Counterexample:</span>
          <span>a<sub>n</sub> = 0, b<sub>n</sub> = 1, c<sub>n</sub> = 1 for all n</span>
          <span style={{ color: C.muted, fontSize: 13 }}>a<sub>n</sub> = 0 {"\u2264"} 2 = b<sub>n</sub> + c<sub>n</sub> holds</span>
          <span>min(a) = 0, but min(b) + min(c) = 1 + 1 = 2</span>
          <span style={{ color: C.fail }}>0 {"\u2265"} 2 is false. Statement II can fail.</span>
        </div>
      ),
      color: C.fail,
    },
    {
      label: "Statement III: max(a) \u2264 max(b) + max(c)",
      text: "Try to prove this must always hold. For every n, we have a\u2099 \u2264 b\u2099 + c\u2099. Now b\u2099 \u2264 max(b) and c\u2099 \u2264 max(c) for every n.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>For each n:</span>
          <span>a<sub>n</sub> {"\u2264"} b<sub>n</sub> + c<sub>n</sub> {"\u2264"} max(b) + max(c)</span>
          <span style={{ color: C.muted, fontSize: 13 }}>This holds for every n, including</span>
          <span style={{ color: C.muted, fontSize: 13 }}>the n that achieves max(a).</span>
          <span style={{ color: C.ok }}>So max(a) {"\u2264"} max(b) + max(c). Always true.</span>
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
                {i === steps.length - 1 && <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: C.conclBg, border: `1px solid ${C.ok}44`, fontSize: 13.5, color: C.ok, fontWeight: 600, lineHeight: 1.5 }}>Only III must be true. The answer is D.</div>}
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
const presets = [
  {
    name: "Counterexample for I",
    desc: "min(b) and min(c) at different indices",
    a: [100, 100, 100], b: [0, 100, 100], c: [100, 0, 100],
  },
  {
    name: "Counterexample for II",
    desc: "a much smaller than b + c",
    a: [0, 0, 0], b: [1, 1, 1], c: [1, 1, 1],
  },
  {
    name: "All equal",
    desc: "a = b + c everywhere",
    a: [5, 8, 3], b: [2, 5, 1], c: [3, 3, 2],
  },
  {
    name: "Varied example",
    desc: "a < b + c with varying gap",
    a: [1, 4, 2, 7], b: [3, 1, 5, 2], c: [0, 4, 0, 6],
  },
];

function SequenceExplorer() {
  const [idx, setIdx] = useState(0);
  const p = presets[idx];
  const n = p.a.length;

  const minA = Math.min(...p.a), maxA = Math.max(...p.a);
  const minB = Math.min(...p.b), maxB = Math.max(...p.b);
  const minC = Math.min(...p.c), maxC = Math.max(...p.c);

  const constraintHolds = p.a.every((a, i) => a <= p.b[i] + p.c[i]);
  const stmt1 = minA <= minB + minC;
  const stmt2 = minA >= minB + minC;
  const stmt3 = maxA <= maxB + maxC;

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Choose an example</span>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {presets.map((pr, i) => (
            <button key={i} onClick={() => setIdx(i)} style={{
              flex: 1, minWidth: 120, padding: "10px 8px", borderRadius: 10, cursor: "pointer",
              border: `2px solid ${idx === i ? C.accent : C.border}`,
              background: idx === i ? C.accent + "15" : C.card,
              color: idx === i ? C.accent : C.muted,
              fontSize: 11, fontWeight: 700, transition: "all 0.2s", textAlign: "center",
            }}>
              <div>{pr.name}</div>
              <div style={{ fontSize: 9, marginTop: 2, opacity: 0.7, fontWeight: 500 }}>{pr.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Sequence table */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 22px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 12 }}>Sequences</span>
        <div style={{ display: "grid", gridTemplateColumns: `auto repeat(${n}, 1fr) auto`, gap: "8px 12px", fontSize: 13, fontFamily: mathFont, alignItems: "center" }}>
          {/* Header */}
          <span style={{ color: C.muted, fontSize: 10, fontWeight: 700 }}>n</span>
          {p.a.map((_, i) => <span key={i} style={{ color: C.muted, fontSize: 10, fontWeight: 700, textAlign: "center" }}>{i + 1}</span>)}
          <span style={{ color: C.muted, fontSize: 10, fontWeight: 700, textAlign: "center" }}>min / max</span>

          {/* a row */}
          <span style={{ color: C.seqA, fontWeight: 700 }}>a<sub>n</sub></span>
          {p.a.map((v, i) => <span key={i} style={{ color: C.seqA, textAlign: "center" }}>{v}</span>)}
          <span style={{ color: C.seqA, textAlign: "center", fontSize: 11 }}>{minA} / {maxA}</span>

          {/* b row */}
          <span style={{ color: C.seqB, fontWeight: 700 }}>b<sub>n</sub></span>
          {p.b.map((v, i) => <span key={i} style={{ color: C.seqB, textAlign: "center" }}>{v}</span>)}
          <span style={{ color: C.seqB, textAlign: "center", fontSize: 11 }}>{minB} / {maxB}</span>

          {/* c row */}
          <span style={{ color: C.seqC, fontWeight: 700 }}>c<sub>n</sub></span>
          {p.c.map((v, i) => <span key={i} style={{ color: C.seqC, textAlign: "center" }}>{v}</span>)}
          <span style={{ color: C.seqC, textAlign: "center", fontSize: 11 }}>{minC} / {maxC}</span>

          {/* b+c row */}
          <span style={{ color: C.muted, fontWeight: 600 }}>b+c</span>
          {p.b.map((v, i) => <span key={i} style={{ color: C.white, textAlign: "center" }}>{v + p.c[i]}</span>)}
          <span></span>

          {/* Constraint check */}
          <span style={{ color: C.muted, fontSize: 10 }}>a{"\u2264"}b+c?</span>
          {p.a.map((v, i) => {
            const holds = v <= p.b[i] + p.c[i];
            return <span key={i} style={{ color: holds ? C.ok : C.fail, textAlign: "center", fontSize: 11 }}>{holds ? "\u2713" : "\u2717"}</span>;
          })}
          <span style={{ color: constraintHolds ? C.ok : C.fail, textAlign: "center", fontSize: 10 }}>{constraintHolds ? "All hold" : "Fails!"}</span>
        </div>
      </div>

      {/* Statement checks */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 18 }}>
        {[
          { label: "I", expr: `${minA} \u2264 ${minB}+${minC} = ${minB + minC}`, holds: stmt1, mustHold: false },
          { label: "II", expr: `${minA} \u2265 ${minB}+${minC} = ${minB + minC}`, holds: stmt2, mustHold: false },
          { label: "III", expr: `${maxA} \u2264 ${maxB}+${maxC} = ${maxB + maxC}`, holds: stmt3, mustHold: true },
        ].map(s => (
          <div key={s.label} style={{ background: C.card, border: `1px solid ${s.holds ? C.ok : C.fail}`, borderRadius: 14, padding: "14px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: s.holds ? C.ok : C.fail, marginBottom: 6 }}>Statement {s.label}</div>
            <div style={{ fontSize: 11, color: C.text, fontFamily: mathFont, marginBottom: 4 }}>{s.expr}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: s.holds ? C.ok : C.fail }}>{s.holds ? "True" : "False"}</div>
            {s.mustHold && <div style={{ fontSize: 9, color: C.ok, marginTop: 2 }}>Always true</div>}
            {!s.mustHold && !s.holds && <div style={{ fontSize: 9, color: C.fail, marginTop: 2 }}>Counterexample found</div>}
          </div>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 18px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ background: C.assumBg, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.assum, fontWeight: 700, whiteSpace: "nowrap" }}>HINT</span>
          <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, margin: 0 }}>Try "Counterexample for I" and "Counterexample for II" to see concrete failures. Statement III holds in every example because max(b) + max(c) is an upper bound for every b<sub>n</sub> + c<sub>n</sub>.</p>
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
  { letter: "A", text: "None of them", ok: false, expl: "Statement III must always hold: since a\u2099 \u2264 b\u2099 + c\u2099 \u2264 max(b) + max(c) for all n, the maximum of a is also bounded." },
  { letter: "B", text: "I only", ok: false, expl: "I fails when min(b) and min(c) occur at different indices. E.g. b = (0, 100), c = (100, 0), a = (100, 100)." },
  { letter: "C", text: "II only", ok: false, expl: "II fails when a\u2099 is much less than b\u2099 + c\u2099. E.g. a = (0, 0), b = (1, 1), c = (1, 1)." },
  { letter: "D", text: "III only", ok: true, expl: "For each n: a\u2099 \u2264 b\u2099 + c\u2099 \u2264 max(b) + max(c). So max(a) \u2264 max(b) + max(c). I and II both have counterexamples." },
  { letter: "E", text: "I and II only", ok: false, expl: "Both I and II have counterexamples. Only III is guaranteed." },
  { letter: "F", text: "I and III only", ok: false, expl: "I can fail. Only III is always true." },
  { letter: "G", text: "II and III only", ok: false, expl: "II can fail. Only III is always true." },
  { letter: "H", text: "I, II and III", ok: false, expl: "Both I and II have simple counterexamples. Only III must hold." },
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
            <span style={{ fontSize: 12, color: C.ps }}>Sequences and Inequalities</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TMUA 2022 {"\u00B7"} Paper 2 {"\u00B7"} Question 16</p>
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
              <p style={{ margin: "0 0 8px" }}>a<sub>1</sub>, ..., a<sub>100</sub> and b<sub>1</sub>, ..., b<sub>100</sub> and c<sub>1</sub>, ..., c<sub>100</sub> are three sequences of integers such that</p>
              <div style={{ textAlign: "center", fontFamily: mathFont, fontSize: 18, margin: "12px 0" }}>a<sub>n</sub> {"\u2264"} b<sub>n</sub> + c<sub>n</sub> for each n</div>
              <p style={{ margin: "0 0 12px" }}>Which of the following statements <strong style={{ color: C.assum }}>must be true</strong>?</p>
              <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontFamily: mathFont, fontSize: 14, lineHeight: 2.2 }}>
                <div>I: min(a<sub>1</sub>, ..., a<sub>100</sub>) {"\u2264"} min(b<sub>1</sub>, ..., b<sub>100</sub>) + min(c<sub>1</sub>, ..., c<sub>100</sub>)</div>
                <div>II: min(a<sub>1</sub>, ..., a<sub>100</sub>) {"\u2265"} min(b<sub>1</sub>, ..., b<sub>100</sub>) + min(c<sub>1</sub>, ..., c<sub>100</sub>)</div>
                <div>III: max(a<sub>1</sub>, ..., a<sub>100</sub>) {"\u2264"} max(b<sub>1</sub>, ..., b<sub>100</sub>) + max(c<sub>1</sub>, ..., c<sub>100</sub>)</div>
              </div>
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
                The constraint a<sub>n</sub> {"\u2264"} b<sub>n</sub> + c<sub>n</sub> holds index-by-index. But min and max pick out values that may come from different indices. The question is whether the constraint on individual terms transfers to a constraint on the global min or max.
              </p>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 10px" }}>
                For "must be true" questions: try to prove each statement, and if you suspect it fails, look for a small counterexample using 2 or 3 terms.
              </p>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>STRATEGY</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>For I and II, think about what happens when the minimums of b and c occur at different indices. For III, try chaining inequalities: a<sub>n</sub> {"\u2264"} b<sub>n</sub> + c<sub>n</sub> {"\u2264"} max(b) + max(c).</p>
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
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Click different examples to see the sequences, verify the constraint holds for each n, and check which statements are true or false. Statement III holds in every case.</p>
              </div>
            </div>
            <SequenceExplorer />
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
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.fail, marginBottom: 4 }}>I</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.fail }}>Can fail</div>
                </div>
                <div style={{ background: C.fail + "12", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.fail, marginBottom: 4 }}>II</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.fail }}>Can fail</div>
                </div>
                <div style={{ background: C.ok + "12", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.ok, marginBottom: 4 }}>III</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.ok }}>Always true</div>
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
