# TMUA Interactive Walkthrough - Handover Document v4

## Project Overview

Building interactive walkthroughs for TMUA (Test of Mathematics for University Admission) questions for **tmua.co.uk** / **AceAdmissions** - a premium UK admissions test tutoring product. These are screen-shared by tutors during sessions.

The walkthroughs follow a consistent 5-step pattern. Each question is a single self-contained `.jsx` React component.

---

---

## Design System & Style Rules

### Color Constants (use this exact `C` object)
```js
const C = {
  bg: "#0f1117", card: "#1a1d27", border: "#2a2d3a",
  accent: "#6c5ce7", accentLight: "#a29bfe",
  concl: "#55efc4", conclBg: "rgba(85,239,196,0.10)",
  ok: "#55efc4", fail: "#ff7675", failBg: "rgba(255,118,117,0.10)",
  assum: "#fdcb6e", assumBg: "rgba(253,203,110,0.12)",
  text: "#e2e2e8", muted: "#8b8d9a", white: "#fff",
  ps: "#74b9ff", psBg: "rgba(116,185,255,0.10)",
  calc: "#fdcb6e",
  // Add question-specific colors as needed
};
```

### Fonts
- **Body/labels**: `"'Gill Sans','Trebuchet MS',Calibri,sans-serif"`
- **Math expressions**: `"'Cambria Math','Latin Modern Math','STIX Two Math',Georgia,serif"`
- **Headings**: Use Palatino Linotype italic for the main "Interactive Walkthrough" title

### Critical Style Rules
- **NO bare ∫ or Σ characters ANYWHERE.** These render with broken limit positioning. Always use the `Integral` and `Sigma` components defined in Component Patterns. If you write `∫` or `{"\u222B"}` as a bare character in HTML text, the limits will be mispositioned. This is the single most common rendering bug. Use `<Integral lower="0" upper="1" />` instead. ALWAYS. In Read step, QuestionSummary, Solve math boxes, everywhere.
- **NO emojis** anywhere
- **NO em dashes** anywhere, use hyphens or restructure
- **NO Tailwind** - inline styles only
- Badge says **TMUA** (not TARA)
- Use `<sub>` and `<sup>` for subscripts/superscripts in HTML
- Unicode: always use `{"\u221A"}` JSX syntax, never bare `\u221A` in JSX expressions
- In plain JS strings, use `\u221A` directly (no curly braces)
- **NEVER** use `{"\uXXXX"}` inside a JS string literal - this breaks the string
- **NO bold/strong on variables** in question text. Do not wrap x, y, p, n, etc. in `<strong>` or `<b>`. Variables should be in math font at normal weight, not bold. Bold is only for structural labels like "CORRECT:" or badge text, never for mathematical content.
- **Consistent styling across ALL questions.** Question text is always fontSize 15.5, lineHeight 2, color C.text. Option cards always use the exact OptionCard pattern from Component Patterns. QuestionSummary always uses fontSize 13 with all options on one row. The header, step nav, step title, and navigation buttons are identical every time — use the App Shell pattern exactly. Do not improvise new styles per question.
- **ZERO blackspace.** No large empty dark areas inside any card or panel. Cards should shrink-wrap their content. Arrange visuals and status cards to fill available space with no dead zones.

---

## 5-Step Walkthrough Structure

Every question follows this pattern:

### Step 0: Read
- Header: "QUESTION [N]"
- Exact question wording copied from the paper
- Diagram showing ONLY what is given (no computed values)
- **Diagrams must match the original question EXACTLY.** Match orientation (if sectors point up-right in the paper, they point up-right in the walkthrough, not inverted), match relative sizes, match label positions, match layout (side-by-side, stacked, etc.). Study the screenshot carefully: which direction do shapes face? Where are labels placed? What proportions are used? Reproduce all of this. The Read step diagram IS the question — it should look like the student is reading the actual exam paper in dark mode.
- For unknown values (e.g. k), show as general/schematic (dashed outlines, "k" labels, arrows indicating freedom)
- Do NOT show computed values like "120", "PQ = 6\u221A3" here
- **Integrals and sums in question text:** When the question text contains an integral or summation with limits, use the `Integral` or `Sigma` component (see Component Patterns) inline within JSX. Do NOT use a plain `∫` character with sub/sup. Example: `<p>...and <Integral lower="0" upper="1" /> f(x) dx = 1</p>`. This applies everywhere: Read step, QuestionSummary, Solve steps.
- **Options display (MUST be identical across all questions):** After the question card, show options in a fixed 4-column grid with consistent box sizes. Add marginBottom to separate from nav buttons. Use this exact pattern:
```jsx
<div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 14, marginBottom: 24 }}>
  {[{l:"A",v:"..."},{l:"B",v:"..."}, /* all options A-H */].map(o => (
    <div key={o.l} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", textAlign: "center", fontSize: 14, color: C.text }}>
      <span style={{ fontWeight: 700, color: C.accent, marginRight: 8 }}>{o.l}</span>{o.v}
    </div>
  ))}
</div>
```
This gives 2 rows of 4 for 8 options, or 2 rows of 3+3/4+2 for 6-7 options, all boxes identical width. Do NOT use flexbox for options. Do NOT vary this between questions.

### Step 1: Setup
- **Question refresher** at top
- Identify what type of problem this is and where to start
- Show a general picture of the configuration (no computed values on diagrams)
- Use `general` prop on diagram components to show schematic versions
- STRATEGY or KEY INSIGHT callout box
- Do NOT compute anything - just outline the approach

### Step 2: Solve (Reveal Steps)
- **Question refresher** at top
- Steps revealed one at a time with "Reveal next step ->" button
- **Brief signpost text** (1-2 sentences describing what we're about to do)
- **Full working in the math box** (every algebraic step visible, no prose mixed in)
- Split-pane layout with compact diagrams where applicable (diagrams progressively annotate as steps reveal)
- Each step gets its OWN inline diagram that stays visible (not a single persistent side panel)
- Final step has green conclusion box with answer
- Optional: blue "Note" box for wider knowledge (e.g. pigeonhole principle name) that isn't the main method
- Math boxes are for maths only - no English sentences inside them

### Step 3: Verify
- **Question refresher** at top
- Interactive element appropriate to the question type (see Verify Design Principles below)
- Status cards showing key values
- HINT box at bottom

### Step 4: Answer
- **Question refresher** at top
- Question restated in italic quote box
- Summary visualization (grid of key values, verdict cards, etc.)
- "Click each option" prompt
- Option cards A-H with expand/reveal explanations

---

## Key Principles (Lessons Learned - Sessions 1-4)

### Content & Pedagogy

1. **AS Level maths only** - Solutions should only use AS level knowledge plus select topics (modular arithmetic, sequences/series). No further maths content. If there's a choice between methods, prefer the AS-accessible one. E.g. perpendicular gradients (m1 x m2 = -1), not dot products.

2. **Non-calculator awareness** - This is a non-calc exam. Never include reasoning that requires a calculator. E.g. "sin(pi/6) = 0.5" is fine (known value), but "0.5^0.5 ~ 0.707" is not something a student can compute. Use qualitative reasoning instead ("sin x is small near 0, so sin^sin dips early").

3. **Degrees vs radians** - If the question uses degrees or the topic is more natural in degrees (polygon angles, basic trig), use degrees throughout. If the question uses radians, stick to radians. Never mix. For AS students, degrees is generally more comfortable unless the question specifically uses radians.

4. **Formal but accessible** - This is a premium product. No casual language, no slang. But also not a wall of text. Brief signpost, full working in math box. Named theorems/principles should go in "Note" boxes, not be the main method label (e.g. "Count safe picks" not "Apply the pigeonhole principle").

5. **Read/Setup show only given info** - Diagrams in Steps 0-1 should only annotate what the question explicitly states. No computed values. Use `general` mode on diagram components: dashed outlines, symbolic labels ("k" not "1"), arrows indicating degrees of freedom.

6. **Setup identifies approach, doesn't compute** - Setup should explain WHAT to do, not DO it.

7. **Solve models the exam sketch method** - The solve diagrams should look like an idealised version of what the student should be drawing on paper under exam conditions. E.g. for absolute value inequalities: mark points on number line, find midpoints, draw boundary lines, shade sides, read the overlap. The progressive reveal should build up exactly this sketch.

8. **Think like a tutor, not a markscheme** - Teach optimal thinking, not replicate the markscheme step order.

9. **Verify matches what students can do on paper** - Prefer simpler verify tools that mirror exam techniques. A number line with draggable x is better than a y = x^2 graph when the student's actual reasoning is "try x = -1, check if x^2 >= k". Don't add visual complexity that doesn't help the student verify faster in an exam.

10. **Arrow-notation logic for Paper 2** - For "only if", "necessary/sufficient", and implication questions, display statements as explicit logic chains: [A tick/cross] -> [B tick/cross] with live truth-value colouring. Green arrow when consistent, red when violated (A true, B false), grey when vacuously true (A false). Include explanation: "Left side is false, so implication holds vacuously (not a useful test)".

11. **Single-viewport verify - PRIMARY LAYOUT GOAL** - The Verify step MUST fit in a single browser viewport (~900px height) without scrolling. The student should see the slider/controls, all diagrams, and status values simultaneously. This is the most important layout constraint and overrides diagram size preferences. To achieve this: use compact but readable diagram sizes (not oversized), place elements efficiently (side-by-side when both fit at 380px+, stacked only when necessary), keep status cards small and dense, and avoid excessive padding. If the verify has two diagrams, they should sit side by side or use a compact stacked layout, not two full-height diagrams that push the page to 1500px. Think of it as designing a dashboard, not a scrolling document.

12. **Never introduce unexplained values in Solve** - Solve diagrams that use concrete numbers must justify them (e.g. "Let x=2, y=4, z=1 satisfying x^2=yz"). Better: use `general` mode with symbolic labels throughout solve whenever the derivation is purely algebraic. Save specific numbers for the Verify step where sliders provide context.

13. **Always show statements I, II, III in the QuestionSummary** - For any "which statements are true" question, write out all statements explicitly in the refresher bar so the student can always see what I/II/III say without scrolling back.

14. **Solve diagrams: one per step, not a single persistent panel** - Each reveal step should have its own inline diagram (split-pane: text+math left, diagram right) that stays visible as new steps appear. Do NOT put one diagram in a side panel that updates with each step. This follows the Q13 pattern: `graphForStep(s.graph)` renders a different diagram for each step.

15. **Translate logic language in Setup** - For Paper 2 questions, always translate: "A is sufficient for B" = "if A then B"; "A only if B" = "if A then B"; "A is necessary for B" = "if B then A"; converse = swap; contrapositive = negate and swap. Show these translations explicitly before solving.

### Visual & Technical

16. **Pixel-margin layout for SVGs** - NEVER compute SVG viewBox dimensions from geometry alone. Use fixed pixel margins (mL, mR, mT, mB) that account for ALL annotations including dynamic labels that change with slider values. The plot area lives inside these margins. Compute margin sizes by considering the WORST CASE: what is the longest label text at extreme slider values? For number lines, the indicator label "p = -3.5" needs more right margin than "p = 1". Use mR = max_possible_label_width + 12px buffer. If a label would extend beyond the viewBox at any slider position, the margins are wrong.

17. **Dynamic text background rectangles** - Never hardcode `<rect>` widths for text labels. Use a helper: `textRectW = (str, fontSize) => str.length * fontSize * 0.65 + padding`. Every text label in SVG should have a background rect sized by this formula.

18. **No SVG flatlines** - When a curve exits the visible y-range, SKIP the point (break the polyline into segments). Never clamp y values to yMax/yMin, as this creates ugly horizontal plateaus at the edges. Use the `buildSegments` helper pattern:
```js
const buildSegments = (evalFn) => {
  const segments = [];
  let seg = [];
  for (let i = 0; i <= N; i++) {
    const x = xMinM + (xMaxM - xMinM) * i / N;
    const y = evalFn(x);
    if (y >= yMinM && y <= yMaxM && isFinite(y)) {
      seg.push(`${toSx(x).toFixed(1)},${toSy(y).toFixed(1)}`);
    } else {
      if (seg.length > 1) segments.push(seg);
      seg = [];
    }
  }
  if (seg.length > 1) segments.push(seg);
  return segments;
};
```

19. **Dynamic y-range for function graphs** - When the curve amplitude depends on a parameter (e.g. p^2 sin x), the y-range MUST adapt. Compute the actual amplitude from the parameter and add 15% padding. Never use a fixed y-range like [-0.5, 0.5] when the curve could go outside it.

20. **Strict correctness checks — use analytical values, not numerical approximations** - Define `const TOL = 0.01;` at the top of every verify component. But more importantly: when checking whether the answer is correct at a preset/answer value, compute the check using the EXACT ANALYTICAL formula, not a numerical approximation. For example, if the integral of (a/2)x^2 + bx + c from 0 to 1 should equal 1, compute it as `a/6 + b/2 + c` (the exact antiderivative evaluated), NOT as a Riemann sum that gives 0.992. Numerical methods are for plotting curves, not for checking correctness. The `allCorrect` flag should use exact formulas so it is precisely true at the answer value and precisely false everywhere else. See the Verify Layout code pattern for the full structure.

21. **Adaptive scan ranges for numerical methods** - When counting intersections or finding roots numerically, scale the scan range with the problem parameters. E.g. for a^x = x with a close to 1, intersections can be at x ~ 4/ln(a), which is very large. Use `scanMax = max(20, 4/ln(a) + 5)` with high resolution (4000+ points).

22. **Content-driven viewBox for geometric diagrams** - For diagrams with circles, polygons, etc: compute bounding box from actual geometric content, add padding in math-space for labels, then derive viewBox. This prevents cropping. See Q13 TwoCirclesDiagram for the pattern.

23. **Dashed gridlines and proper axis labels** - Function graphs should have dashed horizontal gridlines at key y-values, dashed vertical gridlines at key x-values (pi, 2pi, integers), axis labels in the margins. The grid makes scale immediately legible. Y-grid step should be adaptive: pick from [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50].

24. **Background rects on all SVG text** - Every text label in SVG should have a semi-transparent background rectangle to ensure readability over curves, gridlines, and other elements. Use `fill={C.bg} fillOpacity={0.85-0.9}`.

25. **Graph labels should show actual expressions** - On graphs, always show what each curve/line/point IS, not just a colour swatch. Show the actual expression (e.g. "y = a^x", "f(|x|)") with the curve colour.

26. **Mathematically verify geometric coordinates** - NEVER eyeball vertex positions for triangles or polygons. Always compute the actual angles using the cosine rule and verify they match the intended geometry (e.g. acute, obtuse, right-angled) before using them. Obtuse triangles need the vertex CLOSE to the opposite (long) side.

27. **Consistent diagram proportions** - When showing multiple diagram variants (e.g. acute vs obtuse triangle), keep the overall bounding box proportions similar so they look consistent when placed side-by-side or in successive solve steps. A 150x90 bbox next to a 30x130 bbox looks jarring.

28. **SVG summation notation** - Use the `Sigma` component from the Integral/Summation section in Component Patterns. Never write a bare Σ character. Same rules as integrals.

29. **Readable but compact diagram sizes** - Every diagram must be readable without squinting, BUT must also fit within the single-viewport constraint (principle 11). Minimum readable sizes: plot area pW ~300, pH ~170, SVG font 9px+, axis labels 8px+. These are floors, not targets. Diagrams can and should grow larger to fill their container and eliminate dead space. For Verify with multiple diagrams, use the smaller end so everything fits in one viewport. For Solve split-pane, compact diagrams at pW ~280, pH ~160 are fine as long as text is 9px+.

30. **Multiple complementary diagrams** - When a question involves a substitution or transformation (e.g. letting u = cos^2 theta to reduce to a quadratic), show BOTH perspectives: the original equation's graph AND the substituted variable's graph. In the Verify step, link them interactively: as the student drags theta, highlight the corresponding u value on the quadratic parabola and the f(theta) value on the original curve. This makes the connection between the substitution and the original equation visible. More generally, if there are two natural ways to visualise a problem (e.g. number line and algebraic, or geometric and coordinate), show both rather than picking one.

31. **No elements outside bounds** - Interactive elements (draggable points, sliders, markers, dots) must NEVER visually escape their containing SVG or diagram. Clamp all positions to stay within the plot area. For number lines, the indicator dot must stay within the line endpoints. For circle/geometry diagrams, labels and points must stay within the viewBox. Test boundary values mentally: what happens at the min and max of every slider? If an element would go off-screen, clamp it.

32. **Verify layout is flexible, dense, and fits one viewport** - Choose whatever layout best fills the space for each question. The only hard constraints are: fits in ~900px height (principle 11), maxWidth 820px, no large empty dark areas, and `alignItems: "flex-start"` on any flex row with side-by-side panels. Size diagrams to fill their containers using `width="100%"` with a `viewBox` rather than fixed pixel widths.

GOOD example (Q4 sectors verify): Two sector diagrams side by side, status cards in a tight 4-column grid row below, perimeter formulas in a 2-column row below that. Fluid multi-row layout, every row packed.

GOOD example (Q3 integral verify): Graph in one column, status cards stacked in the other column matching the graph height through content.

BAD example: A graph in a full-width card that only fills 60% of the width with dead space beside it. Or a small number line stretched to match a taller neighbour with 300px of empty padding.

33. **Show formulas being applied, not just results** - In Solve steps and Verify status cards, show the formula and the substitution, not just the final number. E.g. for a sector perimeter, show "Perimeter = 2r + arc = 2(9) + 6 = 24" not just "24". For area difference, show "Area = (1/2)r^2 theta" then the subtraction. The student needs to see WHERE the number comes from. In Verify, status cards can show the formula label (e.g. "2r + arc") and the computed value. This is a tutoring product: the working is the point.

34. **Use shared labels to show relationships visually** - When the question states a relationship between objects (similar, congruent, equal angles, parallel), make it visually obvious through shared labels and annotations. E.g. if two sectors are similar, label BOTH with the same angle theta to show they share it. If two triangles share a side, label it with the same variable on both. If gradients are perpendicular, annotate both with their gradient values. The diagram should communicate the relationship at a glance without the student needing to read the text.

---

## Component Patterns (with code)

These are the exact JSX patterns to follow. Do NOT deviate from these structural patterns.

### App Shell
```jsx
export default function App() {
  const [step, setStep] = useState(0);
  const [expanded, setExpanded] = useState(null);
  const [optAnim, setOptAnim] = useState(opts.map(() => false));
  useEffect(() => {
    if (step === 4) { opts.forEach((_, i) => { setTimeout(() => setOptAnim(p => { const n = [...p]; n[i] = true; return n; }), i * 100); }); }
    else { setOptAnim(opts.map(() => false)); setExpanded(null); }
  }, [step]);
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Gill Sans','Trebuchet MS',Calibri,sans-serif", letterSpacing: 0.2, padding: "24px 16px" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ background: `linear-gradient(135deg,${C.accent},${C.accentLight})`, borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: C.white, letterSpacing: 1 }}>TMUA</span>
            <span style={{ fontSize: 12, color: C.muted }}>Paper N</span>
            <span style={{ fontSize: 12, color: C.muted }}>{"\u00B7"}</span>
            <span style={{ fontSize: 12, color: C.ps }}>Topic Tag</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TMUA YEAR {"\u00B7"} Paper N {"\u00B7"} Question N</p>
        </div>
        {/* Step nav buttons */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
          {stepsMeta.map(s => (
            <button key={s.id} onClick={() => setStep(s.id)} style={{
              flex: 1, minWidth: 0,
              background: step === s.id ? C.accent : step > s.id ? "rgba(108,92,231,0.15)" : "#1e2030",
              border: `1px solid ${step === s.id ? C.accent : step > s.id ? C.accent + "44" : C.border}`,
              borderRadius: 10, padding: "10px 4px", cursor: "pointer", transition: "all 0.3s",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: step === s.id ? C.white : step > s.id ? C.accentLight : C.muted }}>{s.id + 1}</span>
              <span style={{ fontSize: 10, fontWeight: step === s.id ? 700 : 500, color: step === s.id ? C.white : step > s.id ? C.accentLight : C.muted, whiteSpace: "nowrap" }}>{s.label}</span>
            </button>
          ))}
        </div>
        {/* Step title */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span style={{ background: C.accent, borderRadius: 6, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: C.white }}>{step + 1}</span>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: C.white, margin: 0 }}>{stepsMeta[step].title}</h2>
        </div>
        {/* Steps 0-4 rendered conditionally here */}
        {/* Navigation — marginTop ensures gap from content above on ALL steps */}
        <div style={{ display: "flex", gap: 12, marginTop: 24, paddingBottom: 32 }}>
          <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{ flex: 1, padding: "13px 20px", borderRadius: 10, border: `1px solid ${C.border}`, background: step === 0 ? C.card : "#1e2030", color: step === 0 ? C.muted : C.text, fontSize: 14, fontWeight: 600, cursor: step === 0 ? "not-allowed" : "pointer", opacity: step === 0 ? 0.4 : 1 }}>{"\u2190"} Previous</button>
          {step < 4 ? (
            <button onClick={() => setStep(step + 1)} style={{ flex: 1, padding: "13px 20px", borderRadius: 10, border: "none", background: `linear-gradient(135deg,${C.accent},${C.accentLight})`, color: C.white, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Next {"\u2192"}</button>
          ) : (
            <button onClick={() => {}} style={{ flex: 1, padding: "13px 20px", borderRadius: 10, border: "none", background: `linear-gradient(135deg,${C.ok},#2ecc71)`, color: C.white, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Back to Question Review</button>
          )}
        </div>
      </div>
    </div>
  );
}
```

### QuestionSummary
Use Integral/Sigma components here too when the question contains integrals or sums. They work inline within `<p>` tags.
```jsx
function QuestionSummary() {
  return (
    <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 18px", marginBottom: 16, textAlign: "center" }}>
      <p style={{ margin: "0 0 6px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
        <span style={{ fontWeight: 700, color: C.muted, letterSpacing: 0.5, marginRight: 6 }}>QN</span>
        Question text here. Use mathFont for expressions. Highlight the ask in <strong style={{ color: C.assum }}>amber</strong>.
        {/* For integrals: <Integral lower="0" upper="1" size="small" /> f(x) dx = 1 */}
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, fontSize: 10, fontWeight: 600, color: C.muted, flexWrap: "wrap" }}>
        <span>A: ...</span><span>B: ...</span>{/* all 8 options A-H */}
      </div>
    </div>
  );
}
```

### SolveStep (progressive reveal)
The `text` field should use JSX (not a plain string) whenever it contains unicode symbols or math expressions. This avoids the `{"\uXXXX"}` inside string literal bug. Use Integral/Sigma in `math` fields when showing integral or sum working.

**Step colour assignment (mandatory).** Each step's `color` property controls the numbered circle, its background tint, and the uppercase label. Assign colours in this order:
- **First step:** `C.ps` (#74b9ff, blue) — always the opening/identification step
- **Middle steps:** `C.calc` (#fdcb6e, gold) — for algebraic manipulation, computation, substitution
- **Final step:** `C.ok` (#55efc4, teal) — always the concluding step that states the answer

For questions with 4+ solve steps, you may add question-specific colours to the `C` object for variety in the middle (e.g. `C.shaded`, `C.step`), but the default middle colour is `C.calc`. The progression should always read **blue → gold/mid → teal**, never two adjacent steps with the same colour. Never use `C.ok`/`C.concl` on any step except the last.

**Paper 2 exception (statement-by-statement logic questions).** When the Solve step analyses multiple statements individually (e.g. "which of these is always true?", proof checking, statement classification), the step colour should reflect the *verdict* on that statement, not its position in the sequence:
- **Statement proven true / valid:** `C.ok` (#55efc4, teal)
- **Statement proven false / counterexample found / error identified:** `C.fail` (#ff7675, red)
- **Setup or preliminary step before a verdict:** `C.ps` (#74b9ff, blue)

This overrides the blue → gold → teal rule for Paper 2 logic questions only. The colour tells the student at a glance which statements survived and which didn't.

```jsx
function SolveStep() {
  const [revealed, setRevealed] = useState(0);
  const steps = [
    { label: "STEP NAME", text: <span>Brief signpost with {"\u00D7"} symbol.</span>, math: (<div><Integral lower="0" upper="1" size="small" /> f(x) dx = ...</div>), color: C.ps, graph: "graphType" },
    { label: "MIDDLE STEP", text: <span>Algebraic working.</span>, math: (<div>...</div>), color: C.calc },
    { label: "FINAL STEP", text: <span>Conclude.</span>, math: (<div>...</div>), color: C.ok },
    // IMPORTANT: use JSX <span> for text, not "string", when text contains unicode or math
    // IMPORTANT: use Integral/Sigma/EvalBracket in math fields, never plain ∫ or Σ
  ];
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
      {steps.map((s, i) => {
        if (i > revealed) return null;
        return (
          <div key={i} style={{ marginBottom: 22 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              {/* Numbered circle */}
              <div style={{ width: 30, height: 30, borderRadius: "50%", flexShrink: 0, background: s.color + "22", border: `2px solid ${s.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: s.color }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: s.color, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
                <p style={{ margin: "0 0 6px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{s.text}</p>
                {/* Math box + optional diagram side by side */}
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 240px", background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 15, color: C.white, fontFamily: mathFont, textAlign: "center", lineHeight: 2 }}>{s.math}</div>
                  {s.graph && <div style={{ flex: "0 0 280px" }}>{/* compact diagram */}</div>}
                </div>
                {/* Green conclusion on final step */}
                {i === steps.length - 1 && (
                  <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: C.conclBg, border: `1px solid ${C.ok}44`, fontSize: 13.5, color: C.ok, fontWeight: 600 }}>Answer text here.</div>
                )}
              </div>
            </div>
            {i < revealed && i < steps.length - 1 && <div style={{ marginLeft: 14, width: 2, height: 12, background: C.border }} />}
          </div>
        );
      })}
      {revealed < steps.length - 1 && (
        <button onClick={() => setRevealed(p => p + 1)} style={{ marginTop: 4, padding: "11px 22px", borderRadius: 10, border: "none", background: `linear-gradient(135deg,${C.accent},${C.accentLight})`, color: C.white, fontSize: 13, fontWeight: 600, cursor: "pointer", marginLeft: 42 }}>Reveal next step {"\u2192"}</button>
      )}
    </div>
  );
}
```

### Verify Step Components
The verify step must fit in one viewport (~900px) without scrolling. Pack the components below into whatever spatial arrangement best eliminates dead space for the specific question. You choose the layout (side-by-side columns, fluid rows, grid, etc.) — the only constraints are: no blackspace, everything visible without scrolling, and every component below must appear.

**MANDATORY: TOL and correctness checks at the top of the verify component.**
```jsx
function VerifyExplorer() {
  const [param, setParam] = useState(defaultValue);
  
  const TOL = 0.01;
  const check1 = Math.abs(computedValue1 - target1) < TOL;
  const check2 = Math.abs(computedValue2 - target2) < TOL;
  const allCorrect = check1 && check2;
  // Use allCorrect for: success banner, green borders on status cards
  // Use individual checks (check1, check2) for per-card highlights
  // NEVER use a different tolerance anywhere else in this component
```

**Component 1: Controls card (slider + preset buttons).** Always appears at the top.
```jsx
<div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 20px", marginBottom: 14 }}>
  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
    <input type="range" ... style={{ flex: 1, accentColor: C.accent, height: 6 }} />
    <span style={{ minWidth: 80, fontSize: 16, fontWeight: 700, color: C.curve1, fontFamily: mathFont }}>label = value</span>
  </div>
  <div style={{ display: "flex", gap: 6 }}>
    <button style={{ flex: 1, padding: "8px 4px", borderRadius: 8, border: `1px solid ${Math.abs(param - presetVal) < TOL ? C.ok : C.border}`, background: Math.abs(param - presetVal) < TOL ? C.ok + "15" : C.card, color: Math.abs(param - presetVal) < TOL ? C.ok : C.muted, fontSize: 11, cursor: "pointer" }}>preset</button>
  </div>
</div>
```

**Component 2: Diagram(s).** Graph, SVG, number line, circle preview, etc. Use the styling from the C object and mathFont. No specific layout prescribed - place wherever best fills the space.

**Component 3: Status cards.** Use `check1`, `check2` etc. for individual card borders.
```jsx
<div style={{ background: C.card, border: `1px solid ${check1 ? C.ok + "66" : C.border}`, borderRadius: 12, padding: "12px 14px", textAlign: "center" }}>
  <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Label</div>
  <div style={{ fontSize: 20, fontWeight: 700, color: check1 ? C.ok : C.white, fontFamily: mathFont }}>value</div>
  {check1 && <div style={{ fontSize: 10, color: C.ok }}>Target: X {"\u2713"}</div>}
</div>
```

**Component 4: Success banner.** ONLY renders when `allCorrect` is true.
```jsx
{allCorrect && (
  <div style={{ background: C.conclBg, border: `1px solid ${C.ok}44`, borderRadius: 12, padding: "12px 16px", textAlign: "center" }}>
    <span style={{ fontSize: 14, fontWeight: 700, color: C.ok }}>All conditions satisfied!</span>
  </div>
)}
```

**Component 5: Hint box.** Always appears at the bottom.
```jsx
<div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 18px" }}>
  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
    <span style={{ background: C.assumBg, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.assum, fontWeight: 700, whiteSpace: "nowrap" }}>HINT</span>
    <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, margin: 0 }}>Hint text.</p>
  </div>
</div>
```

**Arrangement rules:**
- Controls card always first, hint box always last
- Components 2, 3, and 4 go in between — arrange them however best fills the space with no dead areas
- All content must stay within maxWidth 820px
- Use `alignItems: "flex-start"` on any flex row with side-by-side panels

### OptionCard
```jsx
function OptionCard({ o, expanded, animate, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: expanded ? (o.ok ? C.conclBg : C.failBg) : C.card,
      border: `1px solid ${expanded ? (o.ok ? C.ok : C.fail) + "55" : C.border}`,
      borderLeft: expanded ? `4px solid ${o.ok ? C.ok : C.fail}` : `1px solid ${C.border}`,
      borderRadius: 10, padding: "12px 16px", cursor: "pointer",
      transition: "all 0.3s", opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(12px)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8,
          background: expanded ? (o.ok ? C.ok + "22" : C.fail + "22") : C.accent + "22",
          border: `1.5px solid ${expanded ? (o.ok ? C.ok : C.fail) : C.accent}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 700, color: expanded ? (o.ok ? C.ok : C.fail) : C.accent, flexShrink: 0
        }}>{o.letter}</div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 14, color: C.text }}>{o.text}</p>
          {expanded && (
            <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, fontSize: 13, lineHeight: 1.6,
              background: o.ok ? C.conclBg : C.failBg, color: o.ok ? C.ok : C.fail,
              borderLeft: `3px solid ${o.ok ? C.ok : C.fail}` }}>
              {o.ok ? <span style={{ fontWeight: 700 }}>CORRECT: </span> : <span style={{ fontWeight: 700 }}>INCORRECT: </span>}{o.expl}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

### Arrow-Notation Logic Checker (Paper 2 pattern)
For any "if A then B" / "only if" / "sufficient/necessary" statement:
```
[A label tick/cross] -> [B label tick/cross]
  Verdict: "VIOLATED" / "Consistent" / "Vacuously true (not a useful test)"
```
- Left box green with tick when A is true, grey with cross when false
- Right box green with tick when B is true, red with cross when B is false AND A was true
- Arrow green when consistent, red when violated, grey when vacuously true
- Include explanation text below

### Integral, Summation, and Evaluation Bracket Notation — MANDATORY
**NEVER use a bare ∫ or Σ character.** They cannot show limits and look broken. Use these tested components:

```jsx
function Integral({ lower, upper }) {
  return (
    <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", verticalAlign: "middle", margin: "0 4px", lineHeight: 1 }}>
      <span style={{ fontSize: 13, fontFamily: "serif", color: C.white, paddingBottom: 4 }}>{upper}</span>
      <span style={{ fontSize: 30, fontFamily: "serif", color: C.white, transform: "scaleY(0.7)" }}>{"\u222B"}</span>
      <span style={{ fontSize: 13, fontFamily: "serif", color: C.white }}>{lower}</span>
    </span>
  );
}

function Sigma({ lower, upper }) {
  return (
    <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", verticalAlign: "middle", margin: "0 4px", lineHeight: 1 }}>
      <span style={{ fontSize: 13, fontFamily: "serif", color: C.white, paddingBottom: 3 }}>{upper}</span>
      <span style={{ fontSize: 26, fontFamily: "serif", color: C.white, transform: "scaleY(0.8)" }}>{"\u03A3"}</span>
      <span style={{ fontSize: 13, fontFamily: "serif", color: C.white }}>{lower}</span>
    </span>
  );
}

function EvalBracket({ lower, upper, children }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", verticalAlign: "middle" }}>
      <span style={{ fontSize: 22, fontFamily: "serif", color: C.white, fontWeight: 300 }}>[</span>
      <span style={{ fontFamily: "serif", color: C.white }}>{children}</span>
      <span style={{ fontSize: 22, fontFamily: "serif", color: C.white, fontWeight: 300 }}>]</span>
      <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", verticalAlign: "middle", margin: "0 2px", lineHeight: 1, gap: 6 }}>
        <span style={{ fontSize: 11, fontFamily: "serif", color: C.white }}>{upper}</span>
        <span style={{ fontSize: 11, fontFamily: "serif", color: C.white }}>{lower}</span>
      </span>
    </span>
  );
}
```
Usage:
```jsx
// Integral with limits:
<Integral lower="0" upper="1" /> f(x) dx = 1

// Evaluated integral with bracket notation:
<Integral lower="0" upper="2" /> x dx = <EvalBracket lower="0" upper="2">x<sup>2</sup>/2</EvalBracket> = 2

// Summation:
<Sigma lower="n=1" upper="100" /> log(3<sup>1-n</sup>)
```
Key details: `Integral` uses `scaleY(0.7)` and `paddingBottom: 4` on upper limit. `Sigma` uses `scaleY(0.8)` and `paddingBottom: 3`. `EvalBracket` uses `gap: 6` between stacked limits. All three use `lineHeight: 1` to isolate from parent line-height. Limits use slash fractions (e.g. "π/6" not stacked) to match exam style and stay legible at small sizes. Define these at the top of any walkthrough that uses integrals, sums, or evaluated expressions.

---

## Verify Design Principles

Match the verify format to the question type:

| Question Type | Verify Format | Example |
|---------------|---------------|---------|
| Geometric (circles, triangles) | Slider(s) to move points, live measurements | Q13: drag P and Q on circles |
| Function graphs | Toggle functions on/off, slider for parameter | Q15: slide a, watch max/min change |
| Algebraic with parameter | Slider for parameter + live evaluation | Q16: drag k, see gradient products |
| Pigeonhole / combinatorics | Clickable selection grid with pair detection | P2 Q8: click terms, see pairs complete |
| Logic / "must be true" | Arrow-notation logic checker + preset examples | P2 Q5, Q16, Q20, 2023 Q11, Q12 |
| Counterexample search | Fix one variable, drag another to hunt | P2 Q9: fix k, drag x on number line |
| Graph matching | Toggle individual curves on/off | P2 Q18: build up curves one at a time |
| Step function / series | Slider for number of terms, running total | 2023 P2 Q17: add rectangles |
| Proof checking | x-value slider with per-line evaluation grid | 2023 P2 Q10: all lines should agree |
| Binomial / coefficient | Target power selector with pairing table | 2022 P2 Q2: click x^k to see pairs |
| Triangle geometry | Preset triangle selector + line toggles | 2023 P2 Q8: toggle each line on/off |
| Equivalence of statements | k-value selector + truth checker for all variants | 2023 P2 Q11: pick k, see which hold |

**Key principle**: The verify should let the student do what they would do in the exam, just with computational assistance. If the exam technique is "try a few values", the verify should let them try values. If it's "sketch and shade", the verify should build up that sketch.

---