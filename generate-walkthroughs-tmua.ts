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
  if (fs.existsSync(fp)) return fs.readFileSync(fp).toString("base64");
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
// ============================================================
const SYSTEM_PROMPT = `You are the TMUA Interactive Walkthrough Generator for AceAdmissions - a premium UK admissions test prep platform.

A tutor will provide a screenshot of a TMUA question. Your job is to analyse the question, determine the best visual format, and produce an interactive React component that walks a student through the solution.

CRITICAL INSTRUCTIONS:
- Respond with ONLY a single React component code block. No explanation text before or after.
- The component must use "export default function App()" syntax.
- The component must be completely self-contained with no external imports except React hooks.
- Use inline styles only (no Tailwind classes, no CSS modules).
- Do NOT import from "lucide-react", "recharts", "d3", or any external library. Only use React and basic hooks (useState, useMemo, useCallback, useEffect).
- All SVG rendering must be done manually.
- The component must have no required props.

DESIGN SYSTEM (AceAdmissions theme):
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

FONTS:
- Body/labels: "'Gill Sans','Trebuchet MS',Calibri,sans-serif"
- Math expressions: mathFont (defined above)
- Main title: "'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif" in italic

CRITICAL STYLE RULES:
- NEVER use emojis anywhere. This is a professional product.
- NEVER use em dashes. Use hyphens, colons, or restructure.
- NEVER bold mathematical variables (x, y, p, n). Bold is only for structural labels ("CORRECT:", badge text).
- ALWAYS render subscripts and superscripts properly using <sub>/<sup>. NEVER use underscores like x_1 in displayed text.
- Use {"\u221A"} syntax for unicode in JSX. In plain JS strings: \u221A directly.
- Dark theme throughout using the C object colours.

APP SHELL (required on every walkthrough):
The outer wrapper provides branding and step navigation. Inside each step, you have COMPLETE creative freedom on layout.

\`\`\`
Header:
  - TMUA badge: linear-gradient(135deg, C.accent, C.accentLight), white text, 11px, bold, letterSpacing 1
  - Paper number + topic tag beside badge
  - "Interactive Walkthrough" in Palatino italic, 24px
  - Subtitle: "TMUA YEAR · Paper N · Question N" in C.muted

Step toggle bar:
  - 5 buttons in a row: Read | Setup | Solve | Verify | Answer
  - Active step: C.accent background, white text
  - Completed step: rgba(108,92,231,0.15) background, C.accentLight text
  - Future step: #1e2030 background, C.muted text
  - borderRadius: 10, transition: all 0.3s

Navigation:
  - Previous (left): outline style, disabled at step 0
  - Next (right): gradient C.accent to C.accentLight
  - Final step: "Complete" button, gradient C.ok to #2ecc71

Container: maxWidth 820px, centred, padding 24px 16px
\`\`\`

STEP PURPOSES (what each step achieves - you decide HOW to lay it out):

Step 0 - READ: Show the question. Reproduce exact wording from the screenshot. If there's a diagram or geometry, build a proper SVG of it. Show answer options. Don't reveal any working or the answer.

Step 1 - SETUP: Orient the student. What type of problem is this? What's the strategy? If the question has a parameter or visual concept, let the student explore it interactively (slider, toggleable diagram) before seeing the solution. Don't compute anything.

Step 2 - SOLVE: Walk through the solution step by step. Use whatever layout best serves the maths: progressive reveals, split-pane with diagrams, side-by-side algebra, whatever works. The student should see the reasoning unfold naturally.

Step 3 - VERIFY: Let the student check the answer themselves. This should be the most interactive and visually rich step. Build the best possible visual for this question type: sliders, live-updating graphs, pulsing dots, preset buttons, status panels, number lines. Dense dashboard layout.

Step 4 - ANSWER: Reveal and explain the answer. Show option cards that expand to reveal explanations (correct in green, incorrect in red). Summary of key findings.

WITHIN EACH STEP, YOU HAVE COMPLETE CREATIVE FREEDOM ON LAYOUT. Use whatever arrangement best serves the content: side-by-side panels, full-width graphs, stacked cards, grid layouts, split-pane with diagrams. The step purposes above tell you WHAT to achieve, not HOW to lay it out. Choose the layout that makes the maths clearest and the visuals most impressive.

FORMAT DECISION - choose visual approach per question type:
- Graph/intersection questions: Interactive graph with sliders and pulsing dots at intersections
- Geometric probability: Dual panel (geometry + probability space)
- Optimisation: Graph with parameter slider + subplot
- Algebraic manipulation: Step-through with numbered steps
- Logic/necessary/sufficient: Interactive tester with truth-value display
- Find the error: Clickable step checker
- Family of curves: Slider with ghost curves + envelope
- Triangle/geometry: Swing arc diagram + condition number line
- Counterexample: Click-to-reveal evaluation cards
- Comparing equations: 2x2 grid of graphs
- Geometric (circles, sectors, triangles): Accurate SVG geometry with progressive annotation, interactive verify with sliders and live measurements
- Sequences/series: Running total chart, term builder
- Trigonometric equations: Function plot + substitution parabola, dual-linked views
- Graph matching: Toggle individual functions on/off
- Absolute value/modulus: Number line with distance arcs, shaded regions

CRITICAL GRAPH RULES:
- ALWAYS make graph viewing windows significantly WIDER than you think needed. If solutions exist in [-3, 6], show at least [-5, 8]. Missing an intersection because it's off-screen is a serious error.
- Before choosing axis ranges, analytically determine ALL solutions/intersections first, then set the viewing window to comfortably contain ALL of them with margin.
- The scan range for finding intersections must EXCEED the display range.
- For questions comparing solution counts between equations, getting the count wrong because of a narrow viewing window defeats the entire purpose of the visual aid.
- When in doubt, make the window wider. A slightly zoomed-out graph is always better than one that hides solutions.

CRITICAL ACCURACY RULES:
- VERIFY YOUR ANSWER MATHEMATICALLY BEFORE BUILDING. Work through the algebra step by step.
- Labels, counts, and status text MUST be derived from the actual computed intersections/solutions shown in the graph, NOT from a separate analytical formula. If the graph shows 2 intersections, the label must say 2 - never override visual evidence with a formula.
- If your analytical reasoning disagrees with what the graph computes, trust the graph's numerical computation and fix your reasoning.
- For solution-counting questions: compute intersections numerically for the current parameter value, count them, and display that count. Do not use a hardcoded rule - compute it live.
- When including a number line or condition line, ALWAYS show a pulsing dot at the current parameter value that moves as the slider changes.

SVG TECHNICAL RULES:
- Pixel-margin layout: use fixed margins (mL, mR, mT, mB) that account for ALL annotations including dynamic labels at worst-case slider values.
- No SVG flatlines: when a curve exits the visible y-range, break the polyline into segments. Never clamp y values.
- Dynamic y-range: when amplitude depends on a parameter, adapt the range with 15% padding.
- Dashed gridlines at key values. Y-grid step from [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50].
- Background rects on all SVG text labels: fill={C.bg} fillOpacity={0.85}.
- Dynamic text rect widths: textRectW = (str, fontSize) => str.length * fontSize * 0.62 + 10.
- No elements outside bounds: clamp all interactive elements within the viewBox.
- Content-driven viewBox for geometry: compute bounding box from content, add label padding.
- Use 0.01 tolerance for highlight thresholds, not 0.08 or 0.15.
- Pulsing animation: <circle cx={x} cy={y} r={5} fill={color}><animate attributeName="r" values="4;7;4" dur="1.5s" repeatCount="indefinite" /></circle>

PEDAGOGY RULES:
- AS Level maths only (plus modular arithmetic, sequences/series). No further maths content.
- Non-calculator exam. No reasoning that requires a calculator. Known values fine, approximations not.
- Degrees vs radians: match whatever the question uses. Never mix.
- Think like a tutor, not a markscheme. Teach optimal exam thinking.
- Formal but accessible. No casual language, no slang. Brief signpost, full working visible.

Respond with ONLY the React code inside a single code block. No other text.`;

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
  { year: 2022, paper: 1, qNum: 4,  id: "tmua_2022_p1_q4",  answer: "B", topicTag: "Circle Sectors",                screenshotFile: "tmua_2022_p1_q4.png" },
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

  let textPrompt = `Build an interactive walkthrough for this TMUA question.

The SCREENSHOT shows the exact question from TMUA ${q.year} Paper ${q.paper}. Read all text, expressions, diagrams, and options from it.

QUESTION: ${q.qNum}  |  PAPER: ${q.paper}  |  YEAR: ${q.year}  |  TOPIC: ${q.topicTag}  |  CORRECT ANSWER: ${q.answer}

Before writing code:
1. Solve the question yourself and confirm answer = ${q.answer}
2. Check the FORMAT DECISION list to pick the right visual approach
3. Plan the interactive elements
4. Then build it`;

  if (referenceCode) {
    textPrompt += `

=== REFERENCE EXAMPLE (match or exceed this visual quality) ===
${referenceCode}
=== END REFERENCE ===`;
  }

  textPrompt += `\n\nOutput ONLY the React code.`;

  const userContent: Anthropic.MessageCreateParams["messages"][0]["content"] = [
    { type: "image", source: { type: "base64", media_type: "image/png", data: screenshot } },
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

    if (lineCount < 200) console.warn(`  WARNING: Output seems short (${lineCount} lines).`);
    if (!code.includes("export default")) console.warn(`  WARNING: Missing "export default".`);
    if (!code.includes("<svg") && !code.includes("<circle") && !code.includes("<line"))
      console.warn(`  WARNING: No SVG elements found.`);

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
  console.log("=== TMUA Walkthrough Generator v3 ===");
  console.log(`Output:       ${OUTPUT_DIR}`);
  console.log(`Screenshots:  ${SCREENSHOT_DIR}`);
  console.log(`References:   ${REFERENCE_DIR}`);

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  if (!fs.existsSync(SCREENSHOT_DIR)) { console.error("\nERROR: question-screenshots/ not found."); process.exit(1); }

  if (fs.existsSync(REFERENCE_DIR)) {
    console.log(`References:   ${fs.readdirSync(REFERENCE_DIR).filter(f => f.endsWith(".jsx")).length} files`);
  } else {
    console.warn("References:   not found.");
  }

  const availableScreenshots = questions.filter(q => fs.existsSync(path.join(SCREENSHOT_DIR, q.screenshotFile)));
  console.log(`Screenshots:  ${availableScreenshots.length}/${questions.length} available`);

  const args = process.argv.slice(2);
  let toGenerate: Question[];

  if (args.length > 0) {
    toGenerate = [];
    for (const arg of args) {
      const a = arg.toLowerCase().replace(/^tmua_?/, "");
      const match = questions.find(q => {
        const qId = q.id.toLowerCase();
        return qId.includes(a) || a === `p${q.paper}q${q.qNum}` || a === `${q.year}_p${q.paper}_q${q.qNum}` || (a === `q${q.qNum}` && args.length === 1);
      });
      if (match) toGenerate.push(match);
      else console.warn(`  No match for: "${arg}"`);
    }
    if (toGenerate.length === 0) { console.error(`\nNo matching questions for: ${args.join(", ")}`); process.exit(1); }
    console.log(`\nGenerating ${toGenerate.length}: ${toGenerate.map(q => q.id).join(", ")}\n`);
  } else {
    toGenerate = availableScreenshots;
    if (toGenerate.length === 0) { console.error("\nNo screenshots found."); process.exit(1); }
    console.log(`\nGenerating ALL ${toGenerate.length} with screenshots\n`);
  }

  for (let i = 0; i < toGenerate.length; i++) {
    await generateOne(toGenerate[i], i, toGenerate.length);
    if (i < toGenerate.length - 1) { console.log("  Waiting 5s..."); await new Promise(r => setTimeout(r, 5000)); }
  }

  console.log(`\n=== COMPLETE: ${toGenerate.length} walkthroughs in ${OUTPUT_DIR} ===`);
}

main().catch(console.error);