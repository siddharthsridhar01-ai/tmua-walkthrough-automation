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
  { id: 2, label: "Solve", title: "Find the Coefficient" },
  { id: 3, label: "Verify", title: "Check by Expansion" },
  { id: 4, label: "Answer", title: "Confirm the Answer" },
];

function QuestionSummary() {
  return (
    <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 18px", marginBottom: 16, textAlign: "center" }}>
      <p style={{ margin: "0 0 6px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
        <span style={{ fontWeight: 700, color: C.muted, letterSpacing: 0.5, marginRight: 6 }}>Q2</span>
        Find the <strong style={{ color: C.assum }}>coefficient of x<sup>5</sup></strong> in (1+x)<sup>5</sup> {"\u00D7"} (1 + x + x<sup>2</sup> + x<sup>3</sup> + x<sup>4</sup> + x<sup>5</sup>)
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 10, fontSize: 11, fontWeight: 600, color: C.muted, flexWrap: "wrap" }}>
        <span>A: 1</span><span>B: 5</span><span>C: 16</span><span>D: 25</span><span>E: 32</span>
      </div>
    </div>
  );
}

// Binomial coefficient
const choose = (n, k) => {
  if (k < 0 || k > n) return 0;
  let r = 1;
  for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1);
  return Math.round(r);
};

/* ───── SVG Summation Symbol with limits ───── */
function SumNotation({ lower, upper, size }) {
  const s = size || "normal"; // "normal" or "small"
  const w = s === "small" ? 28 : 38;
  const h = s === "small" ? 36 : 48;
  const sigmaSize = s === "small" ? 22 : 30;
  const limSize = s === "small" ? 8 : 10;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ display: "inline-block", verticalAlign: "middle" }}>
      <text x={w / 2} y={limSize + 1} fill={C.muted} fontSize={limSize} textAnchor="middle" fontFamily={mathFont}>{upper}</text>
      <text x={w / 2} y={h / 2 + sigmaSize * 0.35} fill={C.white} fontSize={sigmaSize} textAnchor="middle" fontFamily={mathFont}>{"\u03A3"}</text>
      <text x={w / 2} y={h - 1} fill={C.muted} fontSize={limSize} textAnchor="middle" fontFamily={mathFont}>{lower}</text>
    </svg>
  );
}

/* ───── Solve Step ───── */
function SolveStep() {
  const [revealed, setRevealed] = useState(0);

  const pairs = [0, 1, 2, 3, 4, 5].map(i => ({
    fromSum: i,
    fromBinom: 5 - i,
    coeff: choose(5, 5 - i),
  }));

  const steps = [
    {
      label: "Expand the sum",
      text: <span>Write out the summation explicitly. It is just the sum of all powers of x from x<sup>0</sup> to x<sup>5</sup>.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><SumNotation lower="i=0" upper="5" size="small" /><span>x<sup>i</sup> = 1 + x + x<sup>2</sup> + x<sup>3</sup> + x<sup>4</sup> + x<sup>5</sup></span></span>
        </div>
      ),
      color: C.ps,
    },
    {
      label: "Expand (1+x)\u2075 using the binomial theorem",
      text: <span>The binomial expansion gives coefficients C(5,k) for each power x<sup>k</sup>.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>(1+x)<sup>5</sup> = 1 + 5x + 10x<sup>2</sup> + 10x<sup>3</sup> + 5x<sup>4</sup> + x<sup>5</sup></span>
          <span style={{ color: C.muted, fontSize: 13 }}>Coefficients: 1, 5, 10, 10, 5, 1</span>
        </div>
      ),
      color: C.ps,
    },
    {
      label: "Collect all pairs that give x\u2075",
      text: <span>To get x<sup>5</sup> in the product, we need x<sup>i</sup> from the sum and x<sup>5-i</sup> from (1+x)<sup>5</sup>. Each such pair contributes 1 {"\u00D7"} C(5, 5-i) to the x<sup>5</sup> coefficient.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Pairing table */}
          <div style={{ display: "grid", gridTemplateColumns: "auto auto auto auto", gap: "2px 12px", fontSize: 14 }}>
            <span style={{ color: C.muted, fontSize: 11, fontWeight: 600 }}>From sum</span>
            <span style={{ color: C.muted, fontSize: 11, fontWeight: 600 }}>From (1+x)<sup>5</sup></span>
            <span style={{ color: C.muted, fontSize: 11, fontWeight: 600 }}>Product</span>
            <span style={{ color: C.muted, fontSize: 11, fontWeight: 600 }}>Coeff</span>
            {pairs.map(p => (
              <React.Fragment key={p.fromSum}>
                <span>x<sup>{p.fromSum}</sup></span>
                <span>{choose(5, p.fromBinom)}x<sup>{p.fromBinom}</sup></span>
                <span style={{ color: C.muted }}>{"\u2192"} x<sup>5</sup></span>
                <span style={{ color: C.ok }}>{p.coeff}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      ),
      color: C.assum,
    },
    {
      label: "Sum the contributions",
      text: <span>Add up all the coefficients from each pair.</span>,
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>1 + 5 + 10 + 10 + 5 + 1</span>
          <span style={{ color: C.ok, fontSize: 17 }}>= 32</span>
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
                  <>
                    <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 8, background: C.psBg, border: `1px solid ${C.ps}44`, fontSize: 12, color: C.ps }}>
                      This is 2<sup>5</sup> = 32. In fact, the sum of all binomial coefficients C(n,0) + C(n,1) + ... + C(n,n) always equals 2<sup>n</sup>.
                    </div>
                    <div style={{ marginTop: 8, padding: "10px 14px", borderRadius: 8, background: C.conclBg, border: `1px solid ${C.ok}44`, fontSize: 13.5, color: C.ok, fontWeight: 600, lineHeight: 1.5 }}>
                      The coefficient of x<sup>5</sup> is 32. The answer is E.
                    </div>
                  </>
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


/* ───── Verify: Interactive Coefficient Builder ─────
   Let student pick which target power to find.
   Shows the pairing table with contributions highlighted.
*/
function CoefficientExplorer() {
  const [targetPower, setTargetPower] = useState(5);

  // (1+x)^5 coefficients
  const binomCoeffs = [1, 5, 10, 10, 5, 1];
  // Sum has x^0 to x^5, each with coefficient 1

  // Pairs that contribute to x^targetPower
  const pairs = [];
  for (let i = 0; i <= 5; i++) {
    const j = targetPower - i; // need x^j from (1+x)^5
    if (j >= 0 && j <= 5) {
      pairs.push({ fromSum: i, fromBinom: j, coeff: binomCoeffs[j] });
    }
  }
  const total = pairs.reduce((s, p) => s + p.coeff, 0);

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 20px", marginBottom: 18 }}>
      {/* Target power selector */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Choose the target power of x</div>
        <div style={{ display: "flex", gap: 6 }}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(p => (
            <button key={p} onClick={() => setTargetPower(p)} style={{
              padding: "8px 12px", borderRadius: 8, cursor: "pointer",
              border: `2px solid ${targetPower === p ? C.accent : C.border}`,
              background: targetPower === p ? C.accent + "15" : "#1e2030",
              color: targetPower === p ? C.accent : p === 5 ? C.assum : C.text,
              fontSize: 13, fontWeight: 700, fontFamily: mathFont, minWidth: 36, textAlign: "center",
            }}>
              x<sup>{p}</sup>
            </button>
          ))}
        </div>
      </div>

      {/* Pairing table */}
      <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
          Pairs giving x<sup>{targetPower}</sup> in the product
        </div>
        {pairs.length === 0 ? (
          <p style={{ fontSize: 13, color: C.muted }}>No pairs produce x<sup>{targetPower}</sup> (the sum only goes up to x<sup>5</sup> and (1+x)<sup>5</sup> only goes up to x<sup>5</sup>).</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "8px 16px", alignItems: "center" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase" }}>From sum</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase" }}>From (1+x)<sup>5</sup></div>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase" }}>Product</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase" }}>Coeff</div>
            {pairs.map((p, idx) => (
              <React.Fragment key={idx}>
                <div style={{ fontSize: 14, fontFamily: mathFont, color: C.text, padding: "4px 8px", borderRadius: 4, background: C.ps + "12" }}>
                  1 {"\u00B7"} x<sup>{p.fromSum}</sup>
                </div>
                <div style={{ fontSize: 14, fontFamily: mathFont, color: C.text, padding: "4px 8px", borderRadius: 4, background: C.assum + "12" }}>
                  {p.coeff}x<sup>{p.fromBinom}</sup>
                </div>
                <div style={{ fontSize: 14, fontFamily: mathFont, color: C.muted }}>
                  {p.coeff}x<sup>{targetPower}</sup>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, fontFamily: mathFont, color: C.ok, textAlign: "center" }}>
                  {p.coeff}
                </div>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Total */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ flex: 1, padding: "12px 16px", borderRadius: 8, background: C.ok + "12", border: `1px solid ${C.ok}44`, textAlign: "center" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
            Coefficient of x<sup>{targetPower}</sup>
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: C.ok, fontFamily: mathFont }}>
            {pairs.length > 0 ? total : 0}
          </div>
          {pairs.length > 0 && (
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
              {pairs.map(p => p.coeff).join(" + ")} = {total}
            </div>
          )}
        </div>
        {targetPower === 5 && (
          <div style={{ padding: "10px 14px", borderRadius: 8, background: C.psBg, border: `1px solid ${C.ps}44`, fontSize: 12, color: C.ps, lineHeight: 1.5, flex: 1 }}>
            This is the sum of all binomial coefficients: C(5,0)+C(5,1)+...+C(5,5) = 2<sup>5</sup> = 32. This always works because every term in the sum pairs with exactly one binomial coefficient.
          </div>
        )}
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
  { letter: "A", text: "1", ok: false, expl: "This is only the contribution from x\u2075 \u00D7 1 (one of six pairs). The full sum is 1+5+10+10+5+1 = 32." },
  { letter: "B", text: "5", ok: false, expl: "5 is C(5,1), the coefficient of x in (1+x)\u2075. But we need to add all six pair contributions." },
  { letter: "C", text: "16", ok: false, expl: "16 = 2\u2074. The correct answer uses 2\u2075 = 32." },
  { letter: "D", text: "25", ok: false, expl: "25 = 5\u00B2 has no connection to this problem. The sum of binomial coefficients is 2\u2075." },
  { letter: "E", text: "32", ok: true, expl: "Each x\u2071 from the sum pairs with the x\u2075\u207B\u2071 term from (1+x)\u2075, contributing C(5, 5-i). The total is C(5,0)+C(5,1)+...+C(5,5) = 2\u2075 = 32." },
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
            <span style={{ fontSize: 12, color: C.ps }}>Binomial Expansion</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TMUA 2022 {"\u00B7"} Paper 2 {"\u00B7"} Question 2</p>
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
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question 2</span>
            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: "0 0 8px" }}>Find the coefficient of the x<sup>5</sup> term in the expansion of</p>
              <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 20px", textAlign: "center", fontFamily: mathFont, fontSize: 18, margin: "8px 0 12px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <span>(1 + x)<sup>5</sup></span>
                <span>{"\u00D7"}</span>
                <SumNotation lower="i=0" upper="5" />
                <span>x<sup>i</sup></span>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Setup */}
        {step === 1 && (
          <>
            <QuestionSummary />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Key idea</span>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 10px" }}>
                We are multiplying two polynomials. To find the coefficient of x<sup>5</sup>, we need all pairs of terms - one from each polynomial - whose powers add to 5.
              </p>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 0" }}>
                The summation is just 1 + x + x<sup>2</sup> + x<sup>3</sup> + x<sup>4</sup> + x<sup>5</sup>, with every coefficient equal to 1. So we pair each x<sup>i</sup> (coefficient 1) with the x<sup>5-i</sup> term from (1+x)<sup>5</sup>.
              </p>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>STRATEGY</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Expand both polynomials, list all pairs of terms whose powers sum to 5, and add up their coefficient contributions.</p>
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
                  Click different powers of x to see which pairs contribute to that coefficient. Notice that x<sup>5</sup> is the only power where every binomial coefficient appears exactly once, giving the maximum coefficient of 32.
                </p>
              </div>
            </div>
            <CoefficientExplorer />
          </>
        )}

        {/* Step 4: Answer */}
        {step === 4 && (
          <>
            <QuestionSummary />
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6, fontStyle: "italic" }}>"Find the coefficient of the x<sup>5</sup> term."</div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Calculation</span>
              <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", textAlign: "center", fontFamily: mathFont, fontSize: 16, lineHeight: 2 }}>
                <div style={{ color: C.muted }}>C(5,0) + C(5,1) + C(5,2) + C(5,3) + C(5,4) + C(5,5)</div>
                <div>1 + 5 + 10 + 10 + 5 + 1 = <span style={{ color: C.ok, fontWeight: 700, fontSize: 20 }}>32</span></div>
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
