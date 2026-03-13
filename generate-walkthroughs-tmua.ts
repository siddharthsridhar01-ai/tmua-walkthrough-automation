import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";

// ============================================================
// SETUP
// ============================================================
const API_KEY = process.env.ANTHROPIC_API_KEY || "sk-ant-YOUR-KEY-HERE";
const client = new Anthropic({ apiKey: API_KEY });

// ============================================================
// DIRECTORIES
// ============================================================
const OUTPUT_DIR = path.join(process.cwd(), "generated-walkthroughs-tmua");
const SCREENSHOT_DIR = path.join(process.cwd(), "question-screenshots");
const REFERENCE_DIR = path.join(process.cwd(), "reference-code-tmua");

function loadScreenshot(filename: string): string | null {
  const fp = path.join(SCREENSHOT_DIR, filename);
  if (fs.existsSync(fp)) {
    return fs.readFileSync(fp).toString("base64");
  }
  console.warn(`  Warning: screenshot ${filename} not found`);
  return null;
}

// ============================================================
// REFERENCE FILE SELECTION
// ============================================================
const TOPIC_TO_REFERENCE: Record<string, string[]> = {
  "Trigonometric Equations": ["tmua_2022_p2_q18.jsx", "tmua_2022_p1_q15.jsx"],
  "Integration & Logarithms": ["tmua_2022_p1_q6.jsx", "tmua_2023_p2_q17.jsx"],
  "Integration & Modulus": ["tmua_2023_p2_q20.jsx"],
  "Geometric Series": ["tmua_2023_p2_q17.jsx", "tmua_2022_p1_q11.jsx"],
  "Sequences": ["tmua_2022_p1_q11.jsx", "tmua_2023_p2_q17.jsx"],
  "Integration & Functions": ["tmua_2022_p1_q6.jsx"],
  "Graph Transformations": ["tmua_2022_p1_q10.jsx", "tmua_2022_p2_q18.jsx"],
  "Quadratics & Optimisation": ["tmua_2022_p1_q12.jsx", "tmua_2022_p1_q15.jsx"],
  "Functions & Graphs": ["tmua_2022_p2_q18.jsx"],
  "Modulus & Intersections": ["tmua_2022_p2_q14.jsx"],
  "Circle Sectors": ["tmua_2022_p1_q19.jsx"],
  "Circle Geometry": ["tmua_2022_p1_q13.jsx", "tmua_2022_p1_q14.jsx"],
  "Triangle Geometry": ["tmua_2022_p1_q17.jsx", "tmua_2023_p2_q8.jsx"],
  "Coordinate Geometry": ["tmua_2022_p1_q16.jsx"],
  "Circles & Probability": ["tmua_2022_p1_q19.jsx"],
  "Logarithms & Series": ["tmua_2022_p1_q11.jsx"],
  "Surds & Algebra": ["tmua_2022_p1_q13.jsx"],
  "Trigonometry & Algebra": ["tmua_2022_p2_q18.jsx"],
  "Simultaneous Equations & Trig": ["tmua_2022_p2_q18.jsx"],
  "Completing the Square & Inequalities": ["tmua_2022_p1_q12.jsx"],
  "_default": ["tmua_2022_p2_q17.jsx"],
};

function loadBestReference(topicTag: string): string | null {
  const candidates = TOPIC_TO_REFERENCE[topicTag] || TOPIC_TO_REFERENCE["_default"];
  for (const filename of candidates) {
    const fp = path.join(REFERENCE_DIR, filename);
    if (fs.existsSync(fp)) {
      console.log(`  Reference: ${filename} (${(fs.readFileSync(fp).length / 1024).toFixed(0)}KB)`);
      return fs.readFileSync(fp, "utf-8");
    }
  }
  console.warn(`  No reference file found for topic "${topicTag}"`);
  return null;
}

// ============================================================
// SYSTEM PROMPT
// Built from the route.ts prompt (which produces excellent visuals)
// adapted for 5-step walkthrough structure + AceAdmissions aesthetic
// ============================================================
const SYSTEM_PROMPT = `You are the TMUA Interactive Walkthrough Generator for AceAdmissions (tmua.co.uk) - a premium admissions test tutoring product.

A screenshot of a TMUA question will be provided. Your job is to analyse the question, determine the best visual format for each step, and produce a single interactive React component that guides a student through the solution in 5 steps.

CRITICAL INSTRUCTIONS:
- Respond with ONLY a single React component. No explanation text before or after. No markdown fences.
- Use "export default function App()" syntax.
- Only import { useState, useEffect } from "react" at the top. No other imports.
- Use inline styles only (no Tailwind). Fully self-contained, no required props.
- All SVG rendering must be done manually.

DESIGN SYSTEM:
\`\`\`js
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
\`\`\`
Add question-specific colours as needed (curve1, curve2, sp, root, etc.).

- Body font: "'Gill Sans','Trebuchet MS',Calibri,sans-serif"
- Math: mathFont
- Title: Palatino Linotype italic
- NEVER use emojis anywhere
- NEVER use em dashes (use hyphens, colons, or restructure)
- NEVER bold mathematical variables (x, y, p, n). Bold is for structural labels only ("CORRECT:", badge text)
- Use <sub>/<sup> for subscripts/superscripts, never underscores in displayed text
- Unicode in JSX: use {"\u221A"} syntax. In plain JS strings: \u221A directly

CRITICAL LAYOUT RULES:
- Screen-shared by tutors. Design for readability at screen-share resolution
- Within each step, prefer side-by-side panels (graph left, controls/analysis right) over vertical stacking
- The Verify step MUST fit in a single viewport (~900px height). Slider, graph, status panels, and hint all visible without scrolling. Think dashboard, not document
- Use CSS grid or flexbox. Default: 60/40 or 70/30 split between visual and controls
- Max container width: 820px, centred

5-STEP WALKTHROUGH STRUCTURE:

Step 0 - READ:
- TMUA badge + Paper/Topic header
- "Interactive Walkthrough" title in Palatino italic
- Exact question wording reproduced from the screenshot
- IF the question involves a graph, curve, or geometry: build a FULL-WIDTH SVG reproduction (not a placeholder). This is the first thing the tutor shows - it must look professional
- For unknown parameters: dashed outlines, symbolic labels ("k" not concrete values)
- Answer options A-H displayed at bottom
- Do NOT show computed values or the answer

Step 1 - SETUP:
- QuestionSummary bar at top (question text condensed, ask highlighted in amber, all options shown small)
- Identify the problem type and strategy
- STRATEGY callout box (with C.ps border)
- IF the question has a parameter or visual concept: include an INTERACTIVE exploration here. A slider, a toggleable diagram, something the student can play with before seeing the solution. This is what separates a great walkthrough from a mediocre one
- Do NOT compute anything - just outline the approach

Step 2 - SOLVE (Progressive Reveal):
- QuestionSummary bar at top
- Steps revealed one at a time with "Reveal next step" button (gradient: C.accent to C.accentLight)
- Each step: numbered circle (30px, 2px border in step colour) + label + brief signpost text + math box
- Math boxes: background #1e2030, border C.border, math font, centre-aligned. Maths only, no English
- CRITICAL: each step that involves a graphical insight gets its OWN inline SVG diagram in a split-pane layout (text+math left, compact diagram right). Diagrams progressively annotate as steps reveal. Do NOT use a single persistent side panel
- Final step: green conclusion box (C.conclBg, C.ok border)
- Connector lines between steps: 2px wide, C.border colour, 12px tall

Step 3 - VERIFY:
- QuestionSummary bar at top
- TRY IT callout box explaining what to explore
- THIS IS THE CENTREPIECE. Build the best possible interactive visual for this question:
  * Interactive sliders with live-updating graphs
  * Pulsing dots at key points (intersections, critical values)
  * Preset buttons for important parameter values
  * Status panels with coloured borders (green=correct, red=incorrect, yellow=boundary)
  * Number lines synced with sliders
  * Side-by-side panels where appropriate (geometry + probability space, original + substituted)
- Dense dashboard layout: every pixel earns its place, no dead space
- HINT box at bottom (C.assum border, "HINT" badge)
- Must fit in ~900px viewport height

Step 4 - ANSWER:
- QuestionSummary bar at top
- Question restated in italic quote box
- Summary grid (verdict cards for key values/steps)
- "Click each option" prompt
- Option cards A-H with expand/reveal:
  * Unexpanded: C.card background, C.accent letter badge
  * Correct expanded: C.conclBg background, C.ok left border, "CORRECT:" prefix
  * Incorrect expanded: C.failBg background, C.fail left border, "INCORRECT:" prefix
  * Staggered animation on step entry (100ms per card)

NAVIGATION:
- 5 step buttons at top (Read/Setup/Solve/Verify/Answer), active=C.accent, completed=accent at 15%, future=#1e2030
- Previous button (left, outline style, disabled at step 0)
- Next button (right, gradient C.accent->C.accentLight). On final step: "Complete" button with C.ok gradient

FORMAT DECISION - choose visual type per question:
- Graph/intersection → Interactive graph with sliders and pulsing dots at intersections
- Trigonometric equations → Plot f(theta) + substitution parabola, dual-linked sliders
- Geometric (circles, triangles, sectors) → Accurate SVG geometry, progressive annotation, draggable points in verify
- Geometric probability → Dual panel (geometry + probability space with draggable point)
- Optimisation / parameter → Graph with parameter slider + live max/min/difference display + number line
- Sequences / series → Step function or running total chart with slider for number of terms
- Graph transformations → Overlay with coefficient comparison, toggle transforms
- Logic / must-be-true (Paper 2) → Arrow-notation logic checker: [A tick/cross] -> [B tick/cross], green/red/grey arrows
- Proof analysis / find error → Student proof with step checker + interactive function explorer
- Counterexample → Fix one variable, drag another to find it
- Graph matching → Toggle individual functions on/off
- Family of curves → Slider with ghost curves + envelope
- Absolute value / modulus → Number line with distance arcs, midpoint boundaries, shaded overlap
- Comparing equations → 2x2 grid of graphs
- Binomial / coefficient → Interactive pairing table

CRITICAL GRAPH RULES:
- ALWAYS make viewing windows significantly WIDER than needed. If solutions in [-3, 6], show [-5, 8]. Missing an intersection off-screen is a catastrophic error
- Before choosing axis ranges, analytically determine ALL solutions first, then set window to contain all with margin
- Scan range for finding intersections must EXCEED display range. Use 4000+ sample points
- Labels, counts, status text MUST come from actual computed intersections, NOT a separate formula. If graph shows 2 intersections, label says 2
- If analytical reasoning disagrees with graph computation, trust the graph and fix reasoning
- For solution-counting with slider: compute intersections numerically for current value, count live. Never hardcode rules
- Pulsing dots at key points: <circle cx={x} cy={y} r={5} fill={color}><animate attributeName="r" values="4;7;4" dur="1.5s" repeatCount="indefinite" /></circle>
- Synced number lines: indicator dot MUST move with slider via same state variable
- Adaptive scan ranges: for a^x = x with a near 1, use scanMax = max(20, 4/ln(a) + 5)

SVG TECHNICAL RULES:
- Pixel-margin layout. Fixed margins (mL, mR, mT, mB) accounting for worst-case label widths:
  const mL=44, mR=24, mT=20, mB=30, pW=400, pH=240;
  const toSx = (x) => mL + ((x-xMin)/(xMax-xMin))*pW;
  const toSy = (y) => mT + ((yMax-y)/(yMax-yMin))*pH;
  Compact (split-pane): pW~220-280, pH~140-180
- No flatlines: break polyline into segments when curve exits y-range. Never clamp y to yMax/yMin
- Dynamic y-range: adapt to parameter. Compute amplitude + 15% padding
- Dashed gridlines at key values. Y-step from [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50]
- Background rects on all SVG text: fill={C.bg} fillOpacity={0.85}
- Dynamic text rect widths: textRectW = (str, fs) => str.length * fs * 0.62 + 10
- No elements outside bounds: clamp all interactive elements within SVG viewBox
- Graph labels show actual expressions ("y = a^x") not just colour swatches
- Content-driven viewBox for geometry: compute bounding box from content, add label padding
- Use 0.01 tolerance for highlight thresholds, not 0.08 or 0.15

PEDAGOGY RULES:
- AS Level maths only (plus modular arithmetic, sequences/series). No further maths. Perpendicular gradients, not dot products
- Non-calculator exam. Known values fine (sin pi/6 = 0.5). No decimal approximations. Qualitative reasoning for unknowns
- Degrees vs radians: match the question, never mix
- Read/Setup show only given info. No computed values on diagrams
- Setup identifies approach, doesn't compute
- Solve models the exam sketch method: progressive diagrams like an idealised version of what students draw on paper
- Think like a tutor, not a markscheme. Teach optimal thinking
- Verify mirrors exam technique: if exam approach is "try values", verify lets them try values
- Formal but accessible. Brief signpost, full working in math box. Named theorems go in "Note" boxes, not main labels
- Never introduce unexplained values in Solve. Use symbolic labels for algebraic derivations, save concrete numbers for Verify
- For "which statements are true" questions: always show all statements I, II, III in the QuestionSummary
- For Paper 2 logic: translate in Setup ("A is sufficient for B" = "if A then B", "A only if B" = "if A then B", "A is necessary for B" = "if B then A")
- When a question involves a substitution (e.g. t = cos^2 theta), show BOTH perspectives: original and substituted. Link them interactively in Verify

VERIFY YOUR WORK:
- Before writing code: solve the question yourself, verify answer matches the provided correct answer
- After writing code mentally: does every step have a visual where one would help? Is the Verify step a polished dashboard or just text? Would a tutor be proud to screen-share this?

Respond with ONLY the React code. Nothing else.`;

// ============================================================
// QUESTION DEFINITIONS
// ============================================================
interface Question {
  year: number;
  paper: number;
  qNum: number;
  id: string;
  answer: string;
  topicTag: string;
  screenshotFile: string;
}

const questions: Question[] = [
  // ── 2022 Paper 1 (all 20) ──
  { year: 2022, paper: 1, qNum: 1,  id: "tmua_2022_p1_q1",  answer: "C", topicTag: "Trigonometric Equations",       screenshotFile: "tmua_2022_p1_q1.png" },
  { year: 2022, paper: 1, qNum: 2,  id: "tmua_2022_p1_q2",  answer: "D", topicTag: "Completing the Square & Inequalities", screenshotFile: "tmua_2022_p1_q2.png" },
  { year: 2022, paper: 1, qNum: 3,  id: "tmua_2022_p1_q3",  answer: "F", topicTag: "Integration & Functions",       screenshotFile: "tmua_2022_p1_q3.png" },
  { year: 2022, paper: 1, qNum: 4,  id: "tmua_2022_p1_q4",  answer: "C", topicTag: "Circle Sectors",                screenshotFile: "tmua_2022_p1_q4.png" },
  { year: 2022, paper: 1, qNum: 5,  id: "tmua_2022_p1_q5",  answer: "H", topicTag: "Sequences",                     screenshotFile: "tmua_2022_p1_q5.png" },
  { year: 2022, paper: 1, qNum: 6,  id: "tmua_2022_p1_q6",  answer: "F", topicTag: "Integration & Logarithms",      screenshotFile: "tmua_2022_p1_q6.png" },
  { year: 2022, paper: 1, qNum: 7,  id: "tmua_2022_p1_q7",  answer: "E", topicTag: "Integration & Modulus",         screenshotFile: "tmua_2022_p1_q7.png" },
  { year: 2022, paper: 1, qNum: 8,  id: "tmua_2022_p1_q8",  answer: "B", topicTag: "Geometric Series",              screenshotFile: "tmua_2022_p1_q8.png" },
  { year: 2022, paper: 1, qNum: 9,  id: "tmua_2022_p1_q9",  answer: "E", topicTag: "Simultaneous Equations & Trig", screenshotFile: "tmua_2022_p1_q9.png" },
  { year: 2022, paper: 1, qNum: 10, id: "tmua_2022_p1_q10", answer: "C", topicTag: "Graph Transformations",         screenshotFile: "tmua_2022_p1_q10.png" },
  { year: 2022, paper: 1, qNum: 11, id: "tmua_2022_p1_q11", answer: "A", topicTag: "Logarithms & Series",           screenshotFile: "tmua_2022_p1_q11.png" },
  { year: 2022, paper: 1, qNum: 12, id: "tmua_2022_p1_q12", answer: "D", topicTag: "Quadratics & Optimisation",     screenshotFile: "tmua_2022_p1_q12.png" },
  { year: 2022, paper: 1, qNum: 13, id: "tmua_2022_p1_q13", answer: "A", topicTag: "Surds & Algebra",               screenshotFile: "tmua_2022_p1_q13.png" },
  { year: 2022, paper: 1, qNum: 14, id: "tmua_2022_p1_q14", answer: "D", topicTag: "Circle Geometry",               screenshotFile: "tmua_2022_p1_q14.png" },
  { year: 2022, paper: 1, qNum: 15, id: "tmua_2022_p1_q15", answer: "H", topicTag: "Quadratics & Optimisation",     screenshotFile: "tmua_2022_p1_q15.png" },
  { year: 2022, paper: 1, qNum: 16, id: "tmua_2022_p1_q16", answer: "B", topicTag: "Trigonometry & Algebra",        screenshotFile: "tmua_2022_p1_q16.png" },
  { year: 2022, paper: 1, qNum: 17, id: "tmua_2022_p1_q17", answer: "D", topicTag: "Triangle Geometry",             screenshotFile: "tmua_2022_p1_q17.png" },
  { year: 2022, paper: 1, qNum: 18, id: "tmua_2022_p1_q18", answer: "B", topicTag: "Functions & Graphs",            screenshotFile: "tmua_2022_p1_q18.png" },
  { year: 2022, paper: 1, qNum: 19, id: "tmua_2022_p1_q19", answer: "F", topicTag: "Circles & Probability",         screenshotFile: "tmua_2022_p1_q19.png" },
  { year: 2022, paper: 1, qNum: 20, id: "tmua_2022_p1_q20", answer: "B", topicTag: "Modulus & Intersections",       screenshotFile: "tmua_2022_p1_q20.png" },

  // ── 2022 Paper 2 (remaining) ──
  { year: 2022, paper: 2, qNum: 1,  id: "tmua_2022_p2_q1",  answer: "?", topicTag: "TBD", screenshotFile: "tmua_2022_p2_q1.png" },
  { year: 2022, paper: 2, qNum: 3,  id: "tmua_2022_p2_q3",  answer: "?", topicTag: "TBD", screenshotFile: "tmua_2022_p2_q3.png" },
  { year: 2022, paper: 2, qNum: 4,  id: "tmua_2022_p2_q4",  answer: "?", topicTag: "TBD", screenshotFile: "tmua_2022_p2_q4.png" },
  { year: 2022, paper: 2, qNum: 6,  id: "tmua_2022_p2_q6",  answer: "?", topicTag: "TBD", screenshotFile: "tmua_2022_p2_q6.png" },
  { year: 2022, paper: 2, qNum: 7,  id: "tmua_2022_p2_q7",  answer: "?", topicTag: "TBD", screenshotFile: "tmua_2022_p2_q7.png" },
  { year: 2022, paper: 2, qNum: 10, id: "tmua_2022_p2_q10", answer: "?", topicTag: "TBD", screenshotFile: "tmua_2022_p2_q10.png" },
  { year: 2022, paper: 2, qNum: 12, id: "tmua_2022_p2_q12", answer: "?", topicTag: "TBD", screenshotFile: "tmua_2022_p2_q12.png" },
  { year: 2022, paper: 2, qNum: 13, id: "tmua_2022_p2_q13", answer: "?", topicTag: "TBD", screenshotFile: "tmua_2022_p2_q13.png" },
  { year: 2022, paper: 2, qNum: 15, id: "tmua_2022_p2_q15", answer: "?", topicTag: "TBD", screenshotFile: "tmua_2022_p2_q15.png" },
  { year: 2022, paper: 2, qNum: 19, id: "tmua_2022_p2_q19", answer: "?", topicTag: "TBD", screenshotFile: "tmua_2022_p2_q19.png" },

  // ── 2023 Paper 2 (remaining) ──
  { year: 2023, paper: 2, qNum: 1,  id: "tmua_2023_p2_q1",  answer: "?", topicTag: "TBD", screenshotFile: "tmua_2023_p2_q1.png" },
  { year: 2023, paper: 2, qNum: 2,  id: "tmua_2023_p2_q2",  answer: "?", topicTag: "TBD", screenshotFile: "tmua_2023_p2_q2.png" },
  { year: 2023, paper: 2, qNum: 3,  id: "tmua_2023_p2_q3",  answer: "?", topicTag: "TBD", screenshotFile: "tmua_2023_p2_q3.png" },
  { year: 2023, paper: 2, qNum: 4,  id: "tmua_2023_p2_q4",  answer: "?", topicTag: "TBD", screenshotFile: "tmua_2023_p2_q4.png" },
  { year: 2023, paper: 2, qNum: 5,  id: "tmua_2023_p2_q5",  answer: "?", topicTag: "TBD", screenshotFile: "tmua_2023_p2_q5.png" },
  { year: 2023, paper: 2, qNum: 7,  id: "tmua_2023_p2_q7",  answer: "?", topicTag: "TBD", screenshotFile: "tmua_2023_p2_q7.png" },
  { year: 2023, paper: 2, qNum: 9,  id: "tmua_2023_p2_q9",  answer: "?", topicTag: "TBD", screenshotFile: "tmua_2023_p2_q9.png" },
  { year: 2023, paper: 2, qNum: 13, id: "tmua_2023_p2_q13", answer: "?", topicTag: "TBD", screenshotFile: "tmua_2023_p2_q13.png" },
  { year: 2023, paper: 2, qNum: 14, id: "tmua_2023_p2_q14", answer: "?", topicTag: "TBD", screenshotFile: "tmua_2023_p2_q14.png" },
  { year: 2023, paper: 2, qNum: 15, id: "tmua_2023_p2_q15", answer: "?", topicTag: "TBD", screenshotFile: "tmua_2023_p2_q15.png" },
  { year: 2023, paper: 2, qNum: 16, id: "tmua_2023_p2_q16", answer: "?", topicTag: "TBD", screenshotFile: "tmua_2023_p2_q16.png" },
  { year: 2023, paper: 2, qNum: 18, id: "tmua_2023_p2_q18", answer: "?", topicTag: "TBD", screenshotFile: "tmua_2023_p2_q18.png" },
  { year: 2023, paper: 2, qNum: 19, id: "tmua_2023_p2_q19", answer: "?", topicTag: "TBD", screenshotFile: "tmua_2023_p2_q19.png" },
];

// ============================================================
// GENERATE ONE WALKTHROUGH
// ============================================================
async function generateOne(q: Question, index: number, total: number): Promise<void> {
  console.log(`\n[${index + 1}/${total}] Generating: ${q.id} (${q.year} P${q.paper} Q${q.qNum}, ${q.topicTag}, answer: ${q.answer})`);

  const screenshot = loadScreenshot(q.screenshotFile);
  if (!screenshot) {
    console.error(`  SKIPPED: No screenshot found for ${q.screenshotFile}`);
    return;
  }
  console.log(`  Screenshot: ${q.screenshotFile} loaded (${(screenshot.length * 0.75 / 1024).toFixed(0)}KB)`);

  const referenceCode = loadBestReference(q.topicTag);

  let textPrompt = `Build a 5-step interactive walkthrough for this TMUA question.

The SCREENSHOT shows the exact question from TMUA ${q.year} Paper ${q.paper}. Read all text, expressions, diagrams, and options from it.

QUESTION: ${q.qNum}  |  PAPER: ${q.paper}  |  YEAR: ${q.year}  |  TOPIC: ${q.topicTag}  |  CORRECT ANSWER: ${q.answer}

Before writing code:
1. Solve the question yourself and confirm answer = ${q.answer}
2. Check the FORMAT DECISION list for "${q.topicTag}" to pick the right visual type
3. Plan what interactive elements each step needs (sliders, graphs, animations)
4. Then build it`;

  if (referenceCode) {
    textPrompt += `

=== REFERENCE EXAMPLE (match or exceed this visual quality) ===
${referenceCode}
=== END REFERENCE ===`;
  }

  textPrompt += `\n\nOutput ONLY the React code.`;

  const userContent: Anthropic.MessageCreateParams["messages"][0]["content"] = [
    {
      type: "image",
      source: { type: "base64", media_type: "image/png", data: screenshot },
    },
    { type: "text", text: textPrompt },
  ];

  try {
    const stream = client.messages.stream({
      model: "claude-opus-4-6",
      max_tokens: 32000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userContent }],
    });

    let dotCount = 0;
    stream.on("text", () => { dotCount++; if (dotCount % 200 === 0) process.stdout.write("."); });

    const response = await stream.finalMessage();
    if (dotCount > 0) process.stdout.write("\n");

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    let code = text.trim();
    code = code.replace(/^```[\w]*\s*\n?/, "");
    code = code.replace(/\n?```\s*$/, "");
    code = code.trim();

    const outPath = path.join(OUTPUT_DIR, `${q.id}.jsx`);
    fs.writeFileSync(outPath, code, "utf-8");

    const lineCount = code.split("\n").length;
    console.log(`  Done: ${outPath} (${code.length} chars, ${lineCount} lines)`);

    // Sanity checks
    if (lineCount < 200) console.warn(`  WARNING: Output seems short (${lineCount} lines). May be incomplete.`);
    if (lineCount < 350) console.warn(`  NOTE: Under 350 lines - may lack visual richness.`);
    if (!code.includes("export default")) console.warn(`  WARNING: Missing "export default".`);
    if (!code.includes("step === 0") && !code.includes("step===0") && !code.includes("Read"))
      console.warn(`  WARNING: May be missing step structure.`);
    if (code.includes("TARA")) console.warn(`  WARNING: Contains "TARA" - should say "TMUA".`);
    if (!code.includes("<svg") && !code.includes("<circle") && !code.includes("<line"))
      console.warn(`  WARNING: No SVG elements. May lack visuals.`);
    if (!code.includes("range"))
      console.warn(`  NOTE: No range input found. May lack interactivity.`);

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  ERROR on ${q.id}: ${msg}`);
    fs.writeFileSync(path.join(OUTPUT_DIR, `${q.id}.error.txt`), msg, "utf-8");
  }
}

// ============================================================
// MAIN
// ============================================================
async function main() {
  console.log("=== TMUA Walkthrough Generator v2 ===");
  console.log(`Output:       ${OUTPUT_DIR}`);
  console.log(`Screenshots:  ${SCREENSHOT_DIR}`);
  console.log(`References:   ${REFERENCE_DIR}`);

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  if (!fs.existsSync(SCREENSHOT_DIR)) {
    console.error("\nERROR: question-screenshots/ folder not found.");
    process.exit(1);
  }

  if (fs.existsSync(REFERENCE_DIR)) {
    const refFiles = fs.readdirSync(REFERENCE_DIR).filter(f => f.endsWith(".jsx"));
    console.log(`References:   ${refFiles.length} files available`);
  } else {
    console.warn("References:   reference-code-tmua/ not found.");
  }

  const availableScreenshots = questions.filter((q) =>
    fs.existsSync(path.join(SCREENSHOT_DIR, q.screenshotFile))
  );
  console.log(`Screenshots:  ${availableScreenshots.length}/${questions.length} available`);

  const args = process.argv.slice(2);
  let toGenerate: Question[];

  if (args.length > 0) {
    toGenerate = [];
    for (const arg of args) {
      const a = arg.toLowerCase().replace(/^tmua_?/, "");
      const match = questions.find((q) => {
        const qId = q.id.toLowerCase();
        const shorthand = `p${q.paper}q${q.qNum}`;
        const medium = `${q.year}_p${q.paper}_q${q.qNum}`;
        return qId.includes(a) || a === shorthand || a === medium || (a === `q${q.qNum}` && args.length === 1);
      });
      if (match) toGenerate.push(match);
      else console.warn(`  No match for: "${arg}"`);
    }
    if (toGenerate.length === 0) {
      console.error(`\nNo matching questions for: ${args.join(", ")}`);
      process.exit(1);
    }
    console.log(`\nGenerating ${toGenerate.length}: ${toGenerate.map(q => q.id).join(", ")}\n`);
  } else {
    toGenerate = availableScreenshots;
    if (toGenerate.length === 0) { console.error("\nNo screenshots found."); process.exit(1); }
    console.log(`\nGenerating ALL ${toGenerate.length} with screenshots\n`);
  }

  for (let i = 0; i < toGenerate.length; i++) {
    await generateOne(toGenerate[i], i, toGenerate.length);
    if (i < toGenerate.length - 1) {
      console.log("  Waiting 5s...");
      await new Promise(r => setTimeout(r, 5000));
    }
  }

  console.log(`\n=== COMPLETE: ${toGenerate.length} walkthroughs in ${OUTPUT_DIR} ===`);
}

main().catch(console.error);
