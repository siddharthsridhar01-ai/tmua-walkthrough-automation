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
};
const mathFont = "'Cambria Math','Latin Modern Math','STIX Two Math',Georgia,serif";
const bodyFont = "'Gill Sans','Trebuchet MS',Calibri,sans-serif";

const stepsMeta = [
  { id: 0, label: "Read", title: "Read the Question" },
  { id: 1, label: "Setup", title: "Identify the Approach" },
  { id: 2, label: "Solve", title: "Classify Each Statement" },
  { id: 3, label: "Verify", title: "Test with Specific k Values" },
  { id: 4, label: "Answer", title: "Confirm the Answer" },
];

function QuestionSummary() {
  return (
    <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 18px", marginBottom: 16, textAlign: "center" }}>
      <p style={{ margin: "0 0 4px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
        <span style={{ fontWeight: 700, color: C.muted, letterSpacing: 0.5, marginRight: 6 }}>Q11</span>
        (*): If 2<sup>k</sup>+1 is prime, then k is a power of 2. Which are <strong style={{ color: C.assum }}>equivalent to (*)</strong>?
      </p>
      <div style={{ fontSize: 12, color: C.text, lineHeight: 1.8, marginBottom: 6, fontFamily: mathFont }}>
        <div>I: If k is a power of 2, then 2<sup>k</sup>+1 is prime</div>
        <div>II: 2<sup>k</sup>+1 is not prime <strong>only if</strong> k is not a power of 2</div>
        <div>III: A <strong>sufficient</strong> condition for k to be a power of 2 is that 2<sup>k</sup>+1 is prime</div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, fontSize: 10, fontWeight: 600, color: C.muted, flexWrap: "wrap" }}>
        <span>A: Y,Y,Y</span><span>B: Y,Y,N</span><span>C: Y,N,Y</span><span>D: Y,N,N</span><span>E: N,Y,Y</span><span>F: N,Y,N</span><span>G: N,N,Y</span><span>H: N,N,N</span>
      </div>
    </div>
  );
}

/* ───── Arrow Box: shows A -> B with labels ───── */
function ArrowBox({ leftLabel, rightLabel, color, label, compact }) {
  return (
    <div style={{ padding: compact ? "8px 10px" : "10px 14px", borderRadius: 8, background: color + "08", border: `1px solid ${color}33`, marginBottom: compact ? 6 : 8 }}>
      {label && <div style={{ fontSize: 10, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>{label}</div>}
      <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
        <span style={{ padding: "4px 8px", borderRadius: 5, background: color + "18", border: `1px solid ${color}44`, fontSize: compact ? 11 : 12, color, fontFamily: mathFont }}>{leftLabel}</span>
        <span style={{ fontSize: 16, color, fontFamily: mathFont }}>{"\u21D2"}</span>
        <span style={{ padding: "4px 8px", borderRadius: 5, background: color + "18", border: `1px solid ${color}44`, fontSize: compact ? 11 : 12, color, fontFamily: mathFont }}>{rightLabel}</span>
      </div>
    </div>
  );
}


/* ───── Solve Step ───── */
function SolveStep() {
  const [revealed, setRevealed] = useState(0);
  const steps = [
    {
      label: "Write (*) in A \u21D2 B form",
      text: <span>Label the two parts of (*). Let A = "2<sup>k</sup>+1 is prime" and B = "k is a power of 2". Then (*) says A {"\u21D2"} B. A statement is equivalent to (*) if and only if it also says A {"\u21D2"} B (or its contrapositive {"\u00AC"}B {"\u21D2"} {"\u00AC"}A).</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>A = "2<sup>k</sup>+1 is prime"</span>
          <span>B = "k is a power of 2"</span>
          <span style={{ color: C.ps }}>(*) is: A {"\u21D2"} B</span>
        </div>
      ),
      color: C.ps,
    },
    {
      label: "Statement I: converse (not equivalent)",
      text: <span>I says "If k is a power of 2, then 2<sup>k</sup>+1 is prime", which is B {"\u21D2"} A. This is the <strong style={{ color: C.fail }}>converse</strong> of (*). The converse is not logically equivalent to the original.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>I: B {"\u21D2"} A (converse of (*))</span>
          <span style={{ color: C.fail }}>Converse is NOT equivalent to (*)</span>
        </div>
      ),
      color: C.fail,
    },
    {
      label: "Statement II: inverse (not equivalent)",
      text: <span>II says "2<sup>k</sup>+1 is not prime only if k is not a power of 2." Recall "X only if Y" means "if X then Y". So this is: {"\u00AC"}A {"\u21D2"} {"\u00AC"}B. This is the <strong style={{ color: C.fail }}>inverse</strong> of (*). The inverse is equivalent to the converse (not to (*) itself).</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>"X only if Y" means "if X then Y"</span>
          <span>II: {"\u00AC"}A {"\u21D2"} {"\u00AC"}B (inverse of (*))</span>
          <span style={{ color: C.muted, fontSize: 13 }}>Inverse = converse of contrapositive = equivalent to converse</span>
          <span style={{ color: C.fail }}>Inverse is NOT equivalent to (*)</span>
        </div>
      ),
      color: C.fail,
    },
    {
      label: "Statement III: same as (*) (equivalent)",
      text: <span>III says "A sufficient condition for B is A." The phrase "a sufficient condition for B is A" means "if A then B" (A is enough to guarantee B). This is exactly A {"\u21D2"} B, which is (*).</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>"Sufficient condition for B is A" = "if A then B"</span>
          <span>III: A {"\u21D2"} B</span>
          <span style={{ color: C.ok }}>This IS (*). Equivalent.</span>
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
                <p style={{ margin: "0 0 6px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{s.text}</p>
                <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 15, color: C.white, fontFamily: mathFont, textAlign: "center", letterSpacing: 0.5, lineHeight: 2 }}>{s.math}</div>
                {i === steps.length - 1 && (
                  <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: C.conclBg, border: `1px solid ${C.ok}44`, fontSize: 13.5, color: C.ok, fontWeight: 600, lineHeight: 1.5 }}>
                    I: No, II: No, III: Yes. The answer is G.
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


/* ───── Verify: k Value Explorer ─────
   Select k values and see which of (*), I, II, III hold.
   Uses arrow notation with live truth values.
*/
function KExplorer() {
  const [k, setK] = useState(5);

  const isPowerOf2 = (n) => n > 0 && (n & (n - 1)) === 0;
  const isPrime = (n) => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) { if (n % i === 0) return false; } return true; };

  const val = Math.pow(2, k) + 1;
  const A = isPrime(val); // 2^k + 1 is prime
  const B = isPowerOf2(k); // k is a power of 2
  const notA = !A;
  const notB = !B;

  // (*): A => B
  // I: B => A (converse)
  // II: ~A => ~B (inverse)
  // III: A => B (same as *)

  const statements = [
    { num: "(*)", left: { label: `2\u207F+1=${val} prime`, value: A }, right: { label: `k=${k} power of 2`, value: B }, desc: "A \u21D2 B" },
    { num: "I", left: { label: `k=${k} power of 2`, value: B }, right: { label: `2\u207F+1=${val} prime`, value: A }, desc: "B \u21D2 A (converse)" },
    { num: "II", left: { label: `2\u207F+1=${val} not prime`, value: notA }, right: { label: `k=${k} not power of 2`, value: notB }, desc: "\u00ACA \u21D2 \u00ACB (inverse)" },
    { num: "III", left: { label: `2\u207F+1=${val} prime`, value: A }, right: { label: `k=${k} power of 2`, value: B }, desc: "A \u21D2 B (same as *)" },
  ];

  // Preset k values
  const presets = [1, 2, 3, 4, 5, 6, 8, 10, 16];

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 20px", marginBottom: 18 }}>
      {/* k selector */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Choose k</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {presets.map(kv => (
            <button key={kv} onClick={() => setK(kv)} style={{
              padding: "8px 14px", borderRadius: 8, cursor: "pointer",
              border: `2px solid ${k === kv ? C.accent : C.border}`,
              background: k === kv ? C.accent + "15" : "#1e2030",
              color: k === kv ? C.accent : C.text,
              fontSize: 13, fontWeight: 700, fontFamily: mathFont,
            }}>
              {kv}
            </button>
          ))}
        </div>
      </div>

      {/* Values panel */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1, padding: "10px 12px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}`, textAlign: "center", minWidth: 100 }}>
          <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>k</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.white, fontFamily: mathFont }}>{k}</div>
          <div style={{ fontSize: 11, color: B ? C.ok : C.fail, fontWeight: 600 }}>{B ? "Power of 2" : "Not power of 2"}</div>
        </div>
        <div style={{ flex: 1, padding: "10px 12px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}`, textAlign: "center", minWidth: 100 }}>
          <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>2<sup>k</sup> + 1</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.white, fontFamily: mathFont }}>{val > 999999 ? "2\u207F+1" : val}</div>
          <div style={{ fontSize: 11, color: A ? C.ok : C.fail, fontWeight: 600 }}>{val > 999999 ? "Very large" : A ? "Prime" : "Not prime"}</div>
        </div>
      </div>

      {/* Arrow-notation logic checker */}
      <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Live truth check (for this k)</div>
      {statements.map(s => {
        const leftTrue = s.left.value;
        const rightTrue = s.right.value;
        const violated = leftTrue && !rightTrue;
        const tested = leftTrue;
        const arrowColor = !tested ? C.muted : violated ? C.fail : C.ok;

        return (
          <div key={s.num} style={{ marginBottom: 8, padding: "10px 12px", borderRadius: 8, background: violated ? C.fail + "08" : tested && !violated ? C.ok + "06" : "transparent", border: `1px solid ${violated ? C.fail + "33" : C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap", marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.white, marginRight: 8, minWidth: 22 }}>{s.num}</span>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 8px", borderRadius: 5, border: `1.5px solid ${leftTrue ? C.ok : C.muted}44`, background: leftTrue ? C.ok + "10" : "transparent", marginRight: 6 }}>
                <span style={{ fontSize: 10, color: leftTrue ? C.ok : C.muted, fontFamily: mathFont }}>{s.left.label}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: leftTrue ? C.ok : C.muted }}>{leftTrue ? "\u2713" : "\u2717"}</span>
              </div>
              <span style={{ fontSize: 16, color: arrowColor, fontWeight: 700, margin: "0 4px" }}>{"\u2192"}</span>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 8px", borderRadius: 5, border: `1.5px solid ${rightTrue ? C.ok : tested ? C.fail : C.muted}44`, background: rightTrue ? C.ok + "10" : tested ? C.fail + "10" : "transparent" }}>
                <span style={{ fontSize: 10, color: rightTrue ? C.ok : tested ? C.fail : C.muted, fontFamily: mathFont }}>{s.right.label}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: rightTrue ? C.ok : tested ? C.fail : C.muted }}>{rightTrue ? "\u2713" : "\u2717"}</span>
              </div>
            </div>
            <div style={{ fontSize: 10, marginLeft: 30 }}>
              {!tested ? (
                <span style={{ color: C.muted }}>Left side false - holds vacuously (not a useful test)</span>
              ) : violated ? (
                <span style={{ color: C.fail, fontWeight: 700 }}>VIOLATED: left true but right false - counterexample</span>
              ) : (
                <span style={{ color: C.ok }}>Consistent: both sides agree</span>
              )}
            </div>
          </div>
        );
      })}

      {/* Observation */}
      <div style={{ marginTop: 10, padding: "8px 10px", borderRadius: 8, background: C.psBg, border: `1px solid ${C.ps}44`, fontSize: 11, color: C.ps, lineHeight: 1.5 }}>
        {B && A && `k=${k} is a power of 2 and 2\u207F+1 is prime. All four statements hold here, so this k does not distinguish them. Try k=5 or k=6.`}
        {B && !A && `k=${k} is a power of 2 but 2\u207F+1=${val} is not prime. Statement I (B\u21D2A) is violated here - this is a counterexample showing I is false (and so not equivalent to (*)).`}
        {!B && !A && `k=${k} is not a power of 2 and 2\u207F+1 is not prime. All implications hold vacuously or consistently. Try a power of 2 to test more.`}
        {!B && A && `k=${k} is not a power of 2 but 2\u207F+1 is prime. (*) would be violated! (But (*) is actually a true theorem, so this cannot happen.)`}
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
  { letter: "A", text: "Yes, Yes, Yes", ok: false, expl: "I is the converse and II is the inverse. Neither is equivalent to (*)." },
  { letter: "B", text: "Yes, Yes, No", ok: false, expl: "III is equivalent to (*) (it says the same thing). I and II are not." },
  { letter: "C", text: "Yes, No, Yes", ok: false, expl: "I is the converse of (*), which is not equivalent. (It is actually false: 2\u00B3\u2075+1 is not prime.)" },
  { letter: "D", text: "Yes, No, No", ok: false, expl: "I is not equivalent to (*). It is the converse." },
  { letter: "E", text: "No, Yes, Yes", ok: false, expl: "II is the inverse (\u00ACA \u21D2 \u00ACB), which is equivalent to the converse, not to (*)." },
  { letter: "F", text: "No, Yes, No", ok: false, expl: "II is the inverse of (*), equivalent to the converse. Neither is equivalent to (*)." },
  { letter: "G", text: "No, No, Yes", ok: true, expl: "I is the converse (B \u21D2 A). II is the inverse (\u00ACA \u21D2 \u00ACB). Neither is equivalent to (*). III says \"a sufficient condition for B is A\", which means A \u21D2 B - exactly (*)." },
  { letter: "H", text: "No, No, No", ok: false, expl: "III says \"a sufficient condition for B is A\" = \"if A then B\" = A \u21D2 B, which is (*)." },
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
            <span style={{ fontSize: 12, color: C.ps }}>Logic and Equivalence</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TMUA 2023 {"\u00B7"} Paper 2 {"\u00B7"} Question 11</p>
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
              <p style={{ margin: "0 0 8px" }}>In this question, k is a positive integer. Consider the following theorem:</p>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", textAlign: "center", fontFamily: mathFont, fontSize: 15, margin: "8px 0 12px" }}>
                If 2<sup>k</sup> + 1 is a prime, <strong>then</strong> k is a power of 2. &nbsp; (*)
              </div>
              <p style={{ margin: "0 0 8px" }}>Which of the following statements, taken individually, is/are equivalent to (*)?</p>
              <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, lineHeight: 2.2, fontFamily: mathFont }}>
                <div><span style={{ fontWeight: 700, color: C.ps, fontFamily: bodyFont, fontSize: 12 }}>I</span>{" "} If k is a power of 2, <strong>then</strong> 2<sup>k</sup> + 1 is prime.</div>
                <div><span style={{ fontWeight: 700, color: C.ps, fontFamily: bodyFont, fontSize: 12 }}>II</span>{" "} 2<sup>k</sup> + 1 is not prime <strong>only if</strong> k is not a power of 2.</div>
                <div><span style={{ fontWeight: 700, color: C.ps, fontFamily: bodyFont, fontSize: 12 }}>III</span>{" "} A <strong>sufficient</strong> condition for k to be a power of 2 is that 2<sup>k</sup> + 1 is prime.</div>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Setup */}
        {step === 1 && (
          <>
            <QuestionSummary />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>What does "equivalent" mean here?</span>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 10px" }}>
                Two statements are logically equivalent if they say the same thing - they are true for exactly the same values of k. For an implication A {"\u21D2"} B, the only equivalent forms are A {"\u21D2"} B itself and its <strong style={{ color: C.ok }}>contrapositive</strong> {"\u00AC"}B {"\u21D2"} {"\u00AC"}A.
              </p>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 10px" }}>
                The <strong style={{ color: C.fail }}>converse</strong> (B {"\u21D2"} A) and the <strong style={{ color: C.fail }}>inverse</strong> ({"\u00AC"}A {"\u21D2"} {"\u00AC"}B) are equivalent to each other, but <em>not</em> to the original.
              </p>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>STRATEGY</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>For each statement, identify which form it takes: original (A{"\u21D2"}B), converse (B{"\u21D2"}A), contrapositive ({"\u00AC"}B{"\u21D2"}{"\u00AC"}A), or inverse ({"\u00AC"}A{"\u21D2"}{"\u00AC"}B). Only the original and contrapositive are equivalent to (*).</p>
              </div>
            </div>
            {/* Visual summary of equivalences */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 20px", marginBottom: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <ArrowBox leftLabel="A" rightLabel="B" color={C.ok} label="Original (*)" />
                  <ArrowBox leftLabel={"\u00ACB"} rightLabel={"\u00ACA"} color={C.ok} label="Contrapositive (equivalent)" />
                </div>
                <div>
                  <ArrowBox leftLabel="B" rightLabel="A" color={C.fail} label="Converse (NOT equivalent)" />
                  <ArrowBox leftLabel={"\u00ACA"} rightLabel={"\u00ACB"} color={C.fail} label="Inverse (NOT equivalent)" />
                </div>
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
                  Pick different values of k and check the truth of each statement. Try k = 5 (a known counterexample to I, since 2<sup>5</sup>+1 = 33 = 3 x 11). Notice that (*) and III always agree, while I and II can differ.
                </p>
              </div>
            </div>
            <KExplorer />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 20px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>NOTE</span>
                <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, margin: 0 }}>Statement I (the converse) was conjectured by Fermat, who noted 2<sup>2<sup>n</sup></sup>+1 is prime for n = 1, 2, 3, 4. The smallest counterexample is 2<sup>32</sup>+1 = 641 x 6700417, found by Euler.</p>
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
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6, fontStyle: "italic" }}>"Which of the following statements, taken individually, is/are equivalent to (*)?"</div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Classification</span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <div style={{ background: C.fail + "12", borderRadius: 8, padding: "12px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.fail, marginBottom: 4 }}>I: No</div>
                  <div style={{ fontSize: 11, color: C.fail }}>Converse (B {"\u21D2"} A)</div>
                </div>
                <div style={{ background: C.fail + "12", borderRadius: 8, padding: "12px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.fail, marginBottom: 4 }}>II: No</div>
                  <div style={{ fontSize: 11, color: C.fail }}>Inverse ({"\u00AC"}A {"\u21D2"} {"\u00AC"}B)</div>
                </div>
                <div style={{ background: C.ok + "12", borderRadius: 8, padding: "12px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.ok, marginBottom: 4 }}>III: Yes</div>
                  <div style={{ fontSize: 11, color: C.ok }}>Same as (*) (A {"\u21D2"} B)</div>
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
