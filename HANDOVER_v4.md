# TMUA Interactive Walkthrough - Handover Document v4

## Project Overview

Building interactive walkthroughs for TMUA (Test of Mathematics for University Admission) questions for **tmua.co.uk** / **AceAdmissions** - a premium UK admissions test tutoring product. These are screen-shared by tutors during sessions.

The walkthroughs follow a consistent 5-step pattern. Each question is a single self-contained `.jsx` React component.

---

## Files Produced

### TMUA 2022 Paper 1:
| Question | File | Topic | Key Feature |
|----------|------|-------|-------------|
| Q6 | `tmua_2022_p1_q6.jsx` | Integration & Logarithms | Area under y=x graph, SVG integral notation, difference of squares trick |
| Q8 | `tmua_2022_p1_q8.jsx` | Geometric Series | Light verify table (no sliders), k=r^20 in power notation |
| Q10 | `tmua_2022_p1_q10.jsx` | Graph Transformations | Curve overlay with coefficient comparison panel, translation sliders |
| Q11 | `tmua_2022_p1_q11.jsx` | Logarithms & Series | Partial sum builder, n(n+1)/2 formula breakdown, running total chart |
| Q12 | `tmua_2022_p1_q12.jsx` | Quadratics & Optimisation | Family of parabolas, smooth slider, locus of vertices, toggle background curves |
| Q13 | `tmua_2022_p1_q13.jsx` | Circle Geometry (two circles) | Content-driven viewBox, max PQ with collinear alignment, drag P and Q independently |
| Q14 | `tmua_2022_p1_q14.jsx` | Circle Geometry (triangle) | Drag R around circle, progressive diagram annotation in solve, SVG angle arcs |
| Q15 | `tmua_2022_p1_q15.jsx` | Exponentials (a^cos x) | Pixel-margin graph layout, dashed gridlines, slider for a with live max/min/difference |
| Q16 | `tmua_2022_p1_q16.jsx` | Coordinate Geometry | Right-angle triangle, perpendicular gradients (not dot product), general mode for Read/Setup |
| Q17 | `tmua_2022_p1_q17.jsx` | Circles and Series | Nested circles with alternating shading, pair-by-pair area breakdown table |
| Q19 | `tmua_2022_p1_q19.jsx` | Geometric Reasoning (polygon) | Polygon inscribed in circle, toggle regular vs counterexample, degrees throughout |

### TMUA 2022 Paper 2:
| Question | File | Topic | Key Feature |
|----------|------|-------|-------------|
| Q2 | `tmua_2022_p2_q2.jsx` | Binomial Expansion | SVG summation notation, interactive coefficient pairing table, 2^n insight |
| Q5 | `tmua_2022_p2_q5.jsx` | Logic (P, converse, contrapositive) | Line through (1,2) with gradient slider, arrow-notation logic checker for all 3 statements |
| Q8 | `tmua_2022_p2_q8.jsx` | Pigeonhole / Combinatorics | Clickable pair grid, "select max safe" button, live pair completion detection |
| Q9 | `tmua_2022_p2_q9.jsx` | Logic & Inequalities | Number line verify (fix k, drag x to find counterexample), no graph needed |
| Q11 | `tmua_2022_p2_q11.jsx` | Kite Geometry (right angle) | SVG kite diagram, general mode for solve, Pythagoras on perpendicular diagonals, slider verify |
| Q14 | `tmua_2022_p2_q14.jsx` | Absolute Value Inequalities | Distance arcs on number line, midpoint boundaries, shaded overlap region |
| Q16 | `tmua_2022_p2_q16.jsx` | Sequences & Inequalities (min/max) | Preset example selector, colour-coded sequence table, statement truth-value cards |
| Q17 | `tmua_2022_p2_q17.jsx` | Proof Analysis (cubic roots) | Student proof with error identification, implication direction, interactive cubic explorer |
| Q18 | `tmua_2022_p2_q18.jsx` | Graph Matching (trig powers) | Toggle individual functions, endpoint analysis, symmetry argument (no calculator) |
| Q20 | `tmua_2022_p2_q20.jsx` | Functions & Trigonometry | Nested sin/cos, toggle individual functions, domain/range panel |

### TMUA 2023 Paper 2:
| Question | File | Topic | Key Feature |
|----------|------|-------|-------------|
| Q6 | `tmua_2023_p2_q6.jsx` | Equations & Transformations | 2x2 intersection graph grid, adaptive scan range for small a, reversibility analysis |
| Q8 | `tmua_2023_p2_q8.jsx` | Triangle Geometry (dividing lines) | Automatic altitude + angle-split line computation, preset triangle selector, line toggles |
| Q10 | `tmua_2023_p2_q10.jsx` | Proof Checking (completing square) | Line-by-line verification grid, x-slider shows all expressions agree, line IV trap explanation |
| Q11 | `tmua_2023_p2_q11.jsx` | Logic & Equivalence (Fermat primes) | Converse/inverse/contrapositive classification, k-value selector, arrow-notation checker |
| Q12 | `tmua_2023_p2_q12.jsx` | Trigonometry & Logic | Factored trig equation, n-by-p classification, dynamic y-range graph, arrow-notation for sufficient/only-if |
| Q17 | `tmua_2023_p2_q17.jsx` | Ceiling Function Integral | Step function graph, doubling rectangles, geometric series with superscript helper |
| Q20 | `tmua_2023_p2_q20.jsx` | Integration & Logic (f(|x|)) | Dual graphs (f vs f(|x|), integrand with shading), arrow-notation logic checker |

### Not yet done from 2022 Paper 1:
Q1, Q2, Q3, Q4, Q5, Q7, Q9

### Not yet done from 2022 Paper 2:
Q1, Q3-Q7, Q10, Q12, Q13, Q15, Q19

### Not yet done from 2023 Paper 2:
Q1-Q5, Q7, Q9, Q13-Q16, Q18-Q19

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
- **NO emojis** anywhere
- **NO em dashes** anywhere, use hyphens or restructure
- **NO Tailwind** - inline styles only
- Badge says **TMUA** (not TARA)
- Use `<sub>` and `<sup>` for subscripts/superscripts in HTML
- Unicode: always use `{"\u221A"}` JSX syntax, never bare `\u221A` in JSX expressions
- In plain JS strings, use `\u221A` directly (no curly braces)
- **NEVER** use `{"\uXXXX"}` inside a JS string literal - this breaks the string

---

## 5-Step Walkthrough Structure

Every question follows this pattern:

### Step 0: Read
- Header: "QUESTION [N]"
- Exact question wording copied from the paper
- Diagram showing ONLY what is given (no computed values)
- For unknown values (e.g. k), show as general/schematic (dashed outlines, "k" labels, arrows indicating freedom)
- Do NOT show computed values like "120", "PQ = 6\u221A3" here

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

16. **Pixel-margin layout for SVGs** - NEVER compute SVG viewBox dimensions from geometry alone. Use fixed pixel margins (mL, mR, mT, mB) that account for all annotations. The plot area lives inside these margins. Compute margin sizes by auditing the rightmost/bottommost pixel of every annotation element BEFORE setting the values. Formula: `mR = max_annotation_extent_right + 8px buffer`.

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

20. **Tight thresholds for highlights** - Use 0.01 tolerance for green "correct" highlights and preset button active states. 0.08 or 0.15 causes false positives when sliders are nearby but not at the target value.

21. **Adaptive scan ranges for numerical methods** - When counting intersections or finding roots numerically, scale the scan range with the problem parameters. E.g. for a^x = x with a close to 1, intersections can be at x ~ 4/ln(a), which is very large. Use `scanMax = max(20, 4/ln(a) + 5)` with high resolution (4000+ points).

22. **Content-driven viewBox for geometric diagrams** - For diagrams with circles, polygons, etc: compute bounding box from actual geometric content, add padding in math-space for labels, then derive viewBox. This prevents cropping. See Q13 TwoCirclesDiagram for the pattern.

23. **Dashed gridlines and proper axis labels** - Function graphs should have dashed horizontal gridlines at key y-values, dashed vertical gridlines at key x-values (pi, 2pi, integers), axis labels in the margins. The grid makes scale immediately legible. Y-grid step should be adaptive: pick from [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50].

24. **Background rects on all SVG text** - Every text label in SVG should have a semi-transparent background rectangle to ensure readability over curves, gridlines, and other elements. Use `fill={C.bg} fillOpacity={0.85-0.9}`.

25. **Graph labels should show actual expressions** - On graphs, always show what each curve/line/point IS, not just a colour swatch. Show the actual expression (e.g. "y = a^x", "f(|x|)") with the curve colour.

26. **Mathematically verify geometric coordinates** - NEVER eyeball vertex positions for triangles or polygons. Always compute the actual angles using the cosine rule and verify they match the intended geometry (e.g. acute, obtuse, right-angled) before using them. Obtuse triangles need the vertex CLOSE to the opposite (long) side.

27. **Consistent diagram proportions** - When showing multiple diagram variants (e.g. acute vs obtuse triangle), keep the overall bounding box proportions similar so they look consistent when placed side-by-side or in successive solve steps. A 150x90 bbox next to a 30x130 bbox looks jarring.

28. **SVG summation notation** - Use inline SVG for proper summation symbols with limits above/below, following the integral notation pattern:
```jsx
function SumNotation({ lower, upper, size }) {
  const s = size || "normal";
  const w = s === "small" ? 28 : 38;
  const h = s === "small" ? 36 : 48;
  const sigmaSize = s === "small" ? 22 : 30;
  const limSize = s === "small" ? 8 : 10;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h}
      style={{ display: "inline-block", verticalAlign: "middle" }}>
      <text x={w/2} y={limSize+1} fill={C.muted} fontSize={limSize}
        textAnchor="middle" fontFamily={mathFont}>{upper}</text>
      <text x={w/2} y={h/2+sigmaSize*0.35} fill={C.white} fontSize={sigmaSize}
        textAnchor="middle" fontFamily={mathFont}>{"\u03A3"}</text>
      <text x={w/2} y={h-1} fill={C.muted} fontSize={limSize}
        textAnchor="middle" fontFamily={mathFont}>{lower}</text>
    </svg>
  );
}
```

29. **Readable but compact diagram sizes** - Every diagram must be readable without squinting, BUT must also fit within the single-viewport constraint (principle 11). Target sweet spot: plot area pW 320-450, pH 180-250. SVG font size: 9-10px. Axis labels: 8-9px. Do NOT make diagrams oversized just because space is available. The goal is clear and legible at a reasonable size, not blown up to fill the screen. For Verify with multiple diagrams, use the smaller end of these ranges so everything fits in one viewport. For Solve split-pane, compact diagrams at pW ~280, pH ~160 are fine as long as text is 9px+.

30. **Multiple complementary diagrams** - When a question involves a substitution or transformation (e.g. letting u = cos^2 theta to reduce to a quadratic), show BOTH perspectives: the original equation's graph AND the substituted variable's graph. In the Verify step, link them interactively: as the student drags theta, highlight the corresponding u value on the quadratic parabola and the f(theta) value on the original curve. This makes the connection between the substitution and the original equation visible. More generally, if there are two natural ways to visualise a problem (e.g. number line and algebraic, or geometric and coordinate), show both rather than picking one.

31. **No elements outside bounds** - Interactive elements (draggable points, sliders, markers, dots) must NEVER visually escape their containing SVG or diagram. Clamp all positions to stay within the plot area. For number lines, the indicator dot must stay within the line endpoints. For circle/geometry diagrams, labels and points must stay within the viewBox. Test boundary values mentally: what happens at the min and max of every slider? If an element would go off-screen, clamp it.

32. **Professional layout spacing** - Diagrams should have generous padding (at least 40px margins in non-compact, 25px in compact). Status cards, value displays, and control panels should have consistent spacing (gap: 12-16px). Never crowd multiple interactive elements into a tight space. The overall feel should be a polished, premium tutoring product, not a cramped dashboard. Use maxWidth constraints on containers to prevent them stretching too wide on large screens. Cards displaying computed values should be at least 120px wide with 12px internal padding.

33. **Verify layout is flexible, not templated** - The Verify step does NOT have to follow one fixed layout, but MUST fit in one viewport (principle 11). Choose the arrangement that best serves the content at a readable-but-compact size. All content fills the same container width (~820px). Good patterns: side-by-side diagrams (each ~380px wide) with controls below; one diagram with controls beside it; two compact diagrams stacked with minimal gap. Bad patterns: two full-height diagrams stacked (too tall); tiny side-by-side panels (too small); oversized single diagram pushing controls off-screen. The Verify Design Principles table specifies WHAT to build, not HOW to lay it out.

---

## Component Patterns

### AlgebraWalkthrough / SolveStep
- Numbered circles (1, 2, 3...) with colored borders matching step type
- Each step: label (uppercase), brief explanation text (muted), math box (dark bg, math font, centered)
- Connector lines between revealed steps
- "Reveal next step ->" button with gradient
- Split-pane: text+math on left, compact diagram on right (each step gets its own diagram)
- Optional conclusion box (green) followed by optional "Note" box (blue) for wider knowledge
- Math boxes are for maths only - no English sentences inside them

### OptionCard
- Letter badge (A, B, C...) in accent color
- Expands on click to show CORRECT/INCORRECT explanation
- Green/red background + left border when expanded
- Staggered animation on mount (100ms delay per card)

### QuestionSummary
- Centered text on `#1e2030` background
- Full question with all definitions/expressions
- **Must show all numbered statements (I, II, III) written out explicitly**
- Answer options row below

### Navigation
- 5 step buttons across top (numbered, with labels)
- Previous/Next buttons at bottom
- "Complete" button on final step (green gradient)

### Diagram Components (general pattern)
```js
function MyDiagram({ ..., general, compact }) {
  // Pixel margins - compute from annotation extent + buffer
  const mL = compact ? X : Y, mR = compact ? X : Y;
  const mT = compact ? X : Y, mB = compact ? X : Y;
  const plotSize = compact ? X : Y;
  const w = mL + plotW + mR, h = mT + plotH + mB;

  // Dynamic text sizing
  const textRectW = (str, fs) => str.length * fs * 0.65 + (compact ? 6 : 10);

  // general mode: schematic, symbolic labels (x, y, z not 2, 4, 1)
  // compact mode: for split-pane in solve step
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

### SVG Integral/Summation Notation
```jsx
<svg viewBox="0 0 80 80" width="64" height="64">
  <text x="40" y="12" fill={C.muted} fontSize="11" textAnchor="middle" fontFamily={mathFont}>upper</text>
  <text x="40" y="56" fill={C.white} fontSize="42" textAnchor="middle" fontFamily={mathFont}>{"\u222B"}</text>
  <text x="40" y="76" fill={C.muted} fontSize="11" textAnchor="middle" fontFamily={mathFont}>lower</text>
</svg>
```

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

## What's Next

### Remaining questions (prioritised):
- **2022 Paper 1**: Q1-Q5, Q7, Q9 (7 questions)
- **2022 Paper 2**: Q1, Q3-Q7, Q10, Q12, Q13, Q15, Q19 (11 questions)
- **2023 Paper 2**: Q1-Q5, Q7, Q9, Q13-Q16, Q18-Q19 (12 questions)
- **2023 Paper 1**: Full paper not yet started
- **Other years**: System scales to any TMUA paper/year

### Automation considerations:
- The 5-step pattern is highly consistent - could template the outer shell (nav, step buttons, option cards)
- The solve step reveal pattern is reusable
- Diagram components are becoming reusable (NumberLine, IntersectionGraph, PolygonDiagram, StepGraph, KiteDiagram, TriangleDiagram, LineGraph)
- The arrow-notation logic checker pattern is reusable for all Paper 2 "must be true" / "only if" / "sufficient" questions
- The SVG SumNotation / integral notation components are reusable
- Main variation is in the specific diagram/verify component per question

### Design improvements for future:
- Single-viewport verify layouts (compact side-by-side instead of stacked scrolling)
- Collapsible sections in verify for complex questions
- Consistent "exam sketch" visual language in solve steps
- Consider a shared component library imported across questions
- Product notation (Pi symbol) using same SVG pattern as Sum/Integral