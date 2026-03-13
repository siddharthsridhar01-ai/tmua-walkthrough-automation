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
  pair: "#a29bfe", solo: "#8b8d9a", selected: "#6c5ce7", matched: "#55efc4",
};
const mathFont = "'Cambria Math','Latin Modern Math','STIX Two Math',Georgia,serif";

const stepsMeta = [
  { id: 0, label: "Read", title: "Read the Question" },
  { id: 1, label: "Setup", title: "Identify the Approach" },
  { id: 2, label: "Solve", title: "Count Safe Picks vs Forced Pairs" },
  { id: 3, label: "Verify", title: "Build a Selection" },
  { id: 4, label: "Answer", title: "Confirm the Answer" },
];

// The sequence: 1, 4, 7, ..., 70
const SEQ = [];
for (let t = 1; t <= 70; t += 3) SEQ.push(t);
// SEQ has 24 terms

// Pairs summing to 74
const PAIRS = [];
const PAIRED = new Set();
for (let i = 0; i < SEQ.length; i++) {
  const partner = 74 - SEQ[i];
  if (partner !== SEQ[i] && SEQ.includes(partner) && !PAIRED.has(SEQ[i])) {
    PAIRS.push([SEQ[i], partner]);
    PAIRED.has(SEQ[i]);
    PAIRED.add(SEQ[i]);
    PAIRED.add(partner);
  }
}
// Unpaired terms
const UNPAIRED = SEQ.filter(t => !PAIRED.has(t));

function QuestionSummary() {
  return (
    <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 18px", marginBottom: 16, textAlign: "center" }}>
      <p style={{ margin: "0 0 6px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
        <span style={{ fontWeight: 700, color: C.muted, letterSpacing: 0.5, marginRight: 6 }}>Q8</span>
        Select n terms from 1, 4, 7, ..., 70. (*) Two distinct terms sum to 74. Find the <strong style={{ color: C.assum }}>smallest n</strong> for which (*) is necessarily true.
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 10, fontSize: 11, fontWeight: 600, color: C.muted, flexWrap: "wrap" }}>
        <span>A: 12</span><span>B: 13</span><span>C: 14</span><span>D: 21</span><span>E: 22</span><span>F: 23</span>
      </div>
    </div>
  );
}

/* ───── Solve Step ───── */
function SolveStep() {
  const [revealed, setRevealed] = useState(0);
  const steps = [
    {
      label: "Count the terms in the sequence",
      text: "The arithmetic sequence 1, 4, 7, ..., 70 has common difference 3.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>Number of terms = (70 - 1)/3 + 1 = 24</span>
        </div>
      ),
      color: C.ps,
    },
    {
      label: "Find all pairs summing to 74",
      text: "List the pairs of distinct terms from the sequence that add to 74.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>4+70, 7+67, 10+64, 13+61, 16+58,</span>
          <span>19+55, 22+52, 25+49, 28+46, 31+43, 34+40</span>
          <span style={{ color: C.calc }}>11 pairs</span>
        </div>
      ),
      color: C.calc,
    },
    {
      label: "Identify unpaired terms",
      text: "Check which terms have no partner. 74 - 1 = 73 (not in the sequence). 74 - 37 = 37 (same term, not distinct).",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>1 has no partner (73 is not in the sequence)</span>
          <span>37 has no distinct partner (74 - 37 = 37)</span>
          <span style={{ color: C.solo }}>2 unpaired terms</span>
        </div>
      ),
      color: C.muted,
    },
    {
      label: "Count safe picks",
      text: "To avoid (*), pick at most one term from each pair, plus both unpaired terms. That gives a maximum selection of 11 + 2 = 13 terms with no pair summing to 74.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>Max without a pair = 11 + 2 = 13</span>
          <span>So n = 13 terms can avoid (*)</span>
          <span>But n = 14 forces at least one complete pair</span>
          <span style={{ color: C.ok }}>Smallest n = <strong>14</strong></span>
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
                <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", fontSize: 16, color: C.white, fontFamily: mathFont, textAlign: "center", letterSpacing: 0.5, lineHeight: 2 }}>{s.math}</div>
                {i === steps.length - 1 && <><div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: C.conclBg, border: `1px solid ${C.ok}44`, fontSize: 13.5, color: C.ok, fontWeight: 600, lineHeight: 1.5 }}>The answer is C: 14.</div><div style={{ marginTop: 8, padding: "8px 14px", borderRadius: 8, background: C.psBg, border: `1px solid ${C.ps}44`, fontSize: 12, color: C.ps, lineHeight: 1.5 }}><strong>Note:</strong> This type of argument, where having more items than containers forces two items into the same container, is known as the <em>pigeonhole principle</em>. Here the 11 pairs are the "containers" and selecting 14 terms forces two into the same pair.</div></>}
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
function PairExplorer() {
  const [selected, setSelected] = useState(new Set());

  const toggle = (t) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t); else next.add(t);
      return next;
    });
  };

  const selectMaxSafe = () => {
    // Select one from each pair (first element) + unpaired
    const safe = new Set();
    PAIRS.forEach(([a]) => safe.add(a));
    UNPAIRED.forEach(t => safe.add(t));
    setSelected(safe);
  };

  const clearAll = () => setSelected(new Set());

  // Check for a completed pair
  const completedPairs = PAIRS.filter(([a, b]) => selected.has(a) && selected.has(b));
  const hasMatch = completedPairs.length > 0;

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 12 }}>Click terms to select them</span>

        {/* Pairs displayed as boxes */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: C.pair, fontWeight: 700, marginBottom: 8 }}>11 PAIRS (each sums to 74)</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
            {PAIRS.map(([a, b], i) => {
              const aIn = selected.has(a), bIn = selected.has(b);
              const matched = aIn && bIn;
              return (
                <div key={i} style={{
                  background: matched ? C.matched + "15" : "#1e2030",
                  border: `1px solid ${matched ? C.matched : C.border}`,
                  borderRadius: 8, padding: "6px 4px", textAlign: "center",
                }}>
                  <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 2 }}>
                    <button onClick={() => toggle(a)} style={{
                      padding: "4px 8px", borderRadius: 6, cursor: "pointer",
                      border: `1.5px solid ${aIn ? (matched ? C.matched : C.selected) : C.border}`,
                      background: aIn ? (matched ? C.matched + "30" : C.selected + "25") : "transparent",
                      color: aIn ? (matched ? C.matched : C.selected) : C.muted,
                      fontSize: 12, fontWeight: 700, fontFamily: mathFont, transition: "all 0.15s",
                    }}>{a}</button>
                    <button onClick={() => toggle(b)} style={{
                      padding: "4px 8px", borderRadius: 6, cursor: "pointer",
                      border: `1.5px solid ${bIn ? (matched ? C.matched : C.selected) : C.border}`,
                      background: bIn ? (matched ? C.matched + "30" : C.selected + "25") : "transparent",
                      color: bIn ? (matched ? C.matched : C.selected) : C.muted,
                      fontSize: 12, fontWeight: 700, fontFamily: mathFont, transition: "all 0.15s",
                    }}>{b}</button>
                  </div>
                  {matched && <div style={{ fontSize: 8, color: C.matched, fontWeight: 700 }}>= 74</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Unpaired terms */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: C.solo, fontWeight: 700, marginBottom: 6 }}>2 UNPAIRED TERMS (safe to include)</div>
          <div style={{ display: "flex", gap: 6 }}>
            {UNPAIRED.map(t => {
              const tIn = selected.has(t);
              return (
                <button key={t} onClick={() => toggle(t)} style={{
                  padding: "6px 14px", borderRadius: 8, cursor: "pointer",
                  border: `1.5px solid ${tIn ? C.selected : C.border}`,
                  background: tIn ? C.selected + "25" : "transparent",
                  color: tIn ? C.selected : C.muted,
                  fontSize: 13, fontWeight: 700, fontFamily: mathFont, transition: "all 0.15s",
                }}>{t}</button>
              );
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={selectMaxSafe} style={{
            flex: 1, padding: "10px", borderRadius: 8, cursor: "pointer",
            border: `2px solid ${C.assum}`, background: C.assum + "15",
            color: C.assum, fontSize: 11, fontWeight: 700,
          }}>Select max safe (13)</button>
          <button onClick={clearAll} style={{
            flex: 1, padding: "10px", borderRadius: 8, cursor: "pointer",
            border: `2px solid ${C.border}`, background: C.card,
            color: C.muted, fontSize: 11, fontWeight: 700,
          }}>Clear all</button>
        </div>
      </div>

      {/* Status */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 18 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, marginBottom: 4 }}>Selected (n)</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: C.white }}>{selected.size}</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${hasMatch ? C.matched : C.border}`, borderRadius: 14, padding: "14px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: hasMatch ? C.matched : C.muted, fontWeight: 700, marginBottom: 4 }}>Pair found?</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: hasMatch ? C.matched : C.muted }}>{hasMatch ? `Yes (${completedPairs.map(([a, b]) => `${a}+${b}`).join(", ")})` : "No"}</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${selected.size >= 14 ? C.ok : C.border}`, borderRadius: 14, padding: "14px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: selected.size >= 14 ? C.ok : C.muted, fontWeight: 700, marginBottom: 4 }}>n {"\u2265"} 14?</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: selected.size >= 14 ? C.ok : C.muted }}>{selected.size >= 14 ? "Yes" : "No"}</div>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 18px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ background: C.assumBg, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.assum, fontWeight: 700, whiteSpace: "nowrap" }}>HINT</span>
          <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, margin: 0 }}>Click "Select max safe (13)" to see the largest selection with no pair summing to 74. Then try to add a 14th term - you will be forced to complete a pair. Once all safe slots are taken, the next pick must complete a pair.</p>
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
  { letter: "A", text: "12", ok: false, expl: "12 terms can be selected without completing a pair: take one from each of 10 pairs plus both unpaired terms. Not enough to force (*)." },
  { letter: "B", text: "13", ok: false, expl: "13 is the maximum safe selection: one from each of 11 pairs plus 2 unpaired = 13. So 13 terms can still avoid (*)." },
  { letter: "C", text: "14", ok: true, expl: "With 14 terms, you must take both terms from at least one of the 11 pairs (only 13 safe slots). Since there are only 13 safe slots, the 14th term must complete a pair." },
  { letter: "D", text: "21", ok: false, expl: "Far too large. Much too large. There are only 11 pairs + 2 unpaired = 13 safe slots." },
  { letter: "E", text: "22", ok: false, expl: "Same issue as D. The answer is 14, not 22." },
  { letter: "F", text: "23", ok: false, expl: "23 would leave only 1 term unselected. But (*) is forced much earlier, at n = 14." },
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
            <span style={{ fontSize: 12, color: C.ps }}>Combinatorics</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TMUA 2022 {"\u00B7"} Paper 2 {"\u00B7"} Question 8</p>
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
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question 8</span>
            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: "0 0 8px" }}>A selection, S, of n terms is taken from the arithmetic sequence 1, 4, 7, 10, ..., 70.</p>
              <p style={{ margin: "0 0 8px" }}>Consider the following statement:</p>
              <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", textAlign: "center", fontFamily: mathFont, fontSize: 15, margin: "8px 0 12px" }}>
                (*) There are two distinct terms in S whose sum is 74.
              </div>
              <p style={{ margin: 0 }}>What is the <strong style={{ color: C.assum }}>smallest value of n</strong> for which (*) is necessarily true?</p>
            </div>
          </div>
        )}

        {/* Step 1: Setup */}
        {step === 1 && (
          <>
            <QuestionSummary />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>What does "necessarily true" mean?</span>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 10px" }}>
                We need the smallest n such that every possible selection of n terms from the sequence contains a pair summing to 74. In other words, it is impossible to pick n terms without completing such a pair.
              </p>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 10px" }}>
                The approach is to find the maximum number of terms we can select while avoiding any pair summing to 74. Then the answer is one more than that.
              </p>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>STRATEGY</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Group the 24 terms into pairs that sum to 74, plus any unpaired terms. From each pair, we can safely select at most one term. Count the pairs and unpaired terms to find the maximum safe selection.</p>
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
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Click terms to build your selection. Try to pick 14 or more without completing a pair that sums to 74. Use "Select max safe" to see the largest possible selection that avoids (*), then try adding one more.</p>
              </div>
            </div>
            <PairExplorer />
          </>
        )}

        {/* Step 4: Answer */}
        {step === 4 && (
          <>
            <QuestionSummary />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6, fontStyle: "italic" }}>"What is the smallest value of n for which (*) is necessarily true?"</div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Why 14 is the threshold</span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <div style={{ background: C.pair + "12", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: C.pair, fontWeight: 700, marginBottom: 4 }}>Pairs summing to 74</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: C.pair }}>11</div>
                </div>
                <div style={{ background: C.solo + "12", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: C.solo, fontWeight: 700, marginBottom: 4 }}>Unpaired terms</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: C.solo }}>2</div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>1 and 37</div>
                </div>
                <div style={{ background: C.ok + "12", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: C.ok, fontWeight: 700, marginBottom: 4 }}>Smallest n</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: C.ok }}>14</div>
                  <div style={{ fontSize: 10, color: C.ok, marginTop: 2 }}>= 11 + 2 + 1</div>
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
