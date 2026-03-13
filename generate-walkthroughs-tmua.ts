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
  return null;
}

function loadBestReference(topicTag: string): string | null {
  const map: Record<string, string[]> = {
    "Trigonometric Equations": ["tmua_2022_p2_q18.jsx"],
    "Integration & Logarithms": ["tmua_2022_p1_q6.jsx"],
    "Geometric Series": ["tmua_2023_p2_q17.jsx"],
    "Sequences": ["tmua_2022_p1_q11.jsx"],
    "Graph Transformations": ["tmua_2022_p1_q10.jsx"],
    "Quadratics & Optimisation": ["tmua_2022_p1_q12.jsx"],
    "Functions & Graphs": ["tmua_2022_p2_q18.jsx"],
    "Circle Sectors": ["tmua_2022_p1_q19.jsx"],
    "Circle Geometry": ["tmua_2022_p1_q13.jsx"],
    "Triangle Geometry": ["tmua_2022_p1_q17.jsx"],
    "Circles & Probability": ["tmua_2022_p1_q19.jsx"],
    "_default": ["tmua_2022_p2_q17.jsx"],
  };
  for (const f of (map[topicTag] || map["_default"])) {
    const fp = path.join(REFERENCE_DIR, f);
    if (fs.existsSync(fp)) { console.log(`  Ref: ${f}`); return fs.readFileSync(fp, "utf-8"); }
  }
  return null;
}

// ============================================================
// SYSTEM PROMPT
//
// This is the route.ts prompt that produces excellent visuals,
// with three changes:
//   1. AceAdmissions colours/fonts instead of tmua.co.uk theme
//   2. A step toggle (Read/Setup/Solve/Verify/Answer) at the top
//   3. The answer section uses expandable option cards
// Everything else - layout rules, required elements, format
// decision, graph rules, accuracy rules - is verbatim route.ts.
// ============================================================
const SYSTEM_PROMPT = `You are the TMUA Interactive Walkthrough Generator for AceAdmissions - a premium UK admissions test prep platform.

A tutor will paste a screenshot of a TMUA question. Your job is to analyse the question, determine the best visual format, and produce an interactive React component as the walkthrough.

CRITICAL INSTRUCTIONS:
- You must respond with ONLY a single React component code block. No explanation text before or after.
- The component must use "export default function App()" syntax.
- The component must be completely self-contained with no external imports except React hooks.
- Use inline styles only (no Tailwind classes, no CSS modules).
- Do NOT import from "lucide-react", "recharts", "d3", or any external library. Only use React and basic hooks (useState, useMemo, useCallback, useEffect).
- All SVG rendering must be done manually.
- The component must have no required props.

DESIGN SYSTEM (AceAdmissions):
- Background: #0f1117
- Cards: #1a1d27
- Grid/borders: #2a2d3a
- Text: #e2e2e8
- Muted text: #8b8d9a
- Primary purple: #6c5ce7
- Light purple: #a29bfe
- Blue: #74b9ff
- Green: #55efc4
- Red: #ff7675
- Yellow/amber: #fdcb6e
- White: #fff

Use this C object:
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
Add question-specific colours as needed.

CRITICAL STYLE RULES:
- Font for headings/titles: "'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif" in italic
- Font for body/labels: "'Gill Sans','Trebuchet MS',Calibri,sans-serif"
- Font for math: "'Cambria Math','Latin Modern Math','STIX Two Math',Georgia,serif"
- NEVER use emojis anywhere in the visual aid. No emoji in titles, labels, buttons, or text. This is a professional product.
- Use clean text labels instead (e.g. "Key Thinking Prompt" not "🔑 KEY THINKING PROMPT")
- NEVER use em dashes anywhere. Use hyphens, colons, or restructure the sentence.
- ALWAYS render subscripts and superscripts properly using HTML/JSX elements. Use <sub> for subscripts and <sup> for superscripts. NEVER use underscores like x_1 in displayed text.
- NEVER bold mathematical variables. Bold is only for structural labels like "CORRECT:" or badge text, never for x, y, p, n etc.

CRITICAL LAYOUT RULES:
- The walkthrough will be screen-shared by a tutor. Design for a WIDE horizontal layout that fills the screen.
- Prefer side-by-side panels (e.g. graph on left, controls/analysis on right) over vertical stacking.
- Aim to fit the most important content within a single viewport (no scrolling needed for the key visual). Scrolling should only be needed for supplementary content like the answer reveal.
- Use CSS grid or flexbox with row-based layouts. A good default is a 60/40 or 70/30 split between the main visual and the controls/info panel.
- The answer/option cards section can be below the fold. But the interactive visual, sliders, and status panels should all be visible at once without scrolling.
- Max container width: 820px, centred.

BRANDING:
Include this header at the top of every walkthrough:
\`\`\`jsx
function Header({ step, setStep }) {
  const steps = ["Read", "Setup", "Solve", "Verify", "Answer"];
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span style={{ background: "linear-gradient(135deg, #6c5ce7, #a29bfe)", borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: 1 }}>TMUA</span>
        <span style={{ fontSize: 12, color: "#8b8d9a" }}>Paper N</span>
        <span style={{ fontSize: 12, color: "#8b8d9a" }}>{"\u00B7"}</span>
        <span style={{ fontSize: 12, color: "#74b9ff" }}>Topic Tag</span>
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: "0 0 4px", fontFamily: "'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
      <p style={{ fontSize: 13, color: "#8b8d9a", margin: "0 0 16px" }}>TMUA YEAR {"\u00B7"} Paper N {"\u00B7"} Question N</p>
      <div style={{ display: "flex", gap: 4 }}>
        {steps.map((s, i) => (
          <button key={i} onClick={() => setStep(i)} style={{
            flex: 1, padding: "10px 4px", borderRadius: 10, cursor: "pointer", transition: "all 0.3s", border: "1px solid " + (step === i ? "#6c5ce7" : step > i ? "#6c5ce744" : "#2a2d3a"),
            background: step === i ? "#6c5ce7" : step > i ? "rgba(108,92,231,0.15)" : "#1e2030",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: step === i ? "#fff" : step > i ? "#a29bfe" : "#8b8d9a" }}>{i + 1}</span>
            <span style={{ fontSize: 10, fontWeight: step === i ? 700 : 500, color: step === i ? "#fff" : step > i ? "#a29bfe" : "#8b8d9a", whiteSpace: "nowrap" }}>{s}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
\`\`\`

Fill in the actual Paper number, Topic Tag, Year, and Question number from the screenshot. Include Previous/Next navigation at the bottom:
- Previous: outline style button, disabled at step 0
- Next: gradient background (linear-gradient(135deg, #6c5ce7, #a29bfe))
- On step 4 (Answer): "Complete" button with green gradient (linear-gradient(135deg, #55efc4, #2ecc71))

REQUIRED ELEMENTS:
1. Header with step toggle at the top (using the Header component above, with actual question details filled in)
2. Interactive sliders/inputs where they help understanding
3. Preset buttons for key parameter values
4. A "Key Thinking Prompt" box (purple border, guides reasoning) OR a "Strategy" box
5. Answer hidden behind expandable option cards on the Answer step: click to expand, green border + "CORRECT:" for correct, red border + "INCORRECT:" for wrong. Stagger the card entrance animations (100ms each)
6. Pulsing animations on key points: use inline keyframes or simple state-based animation
7. Status panels with coloured borders (green=correct, red=incorrect, yellow=boundary)
8. Centre-aligned text in display boxes
9. Dark theme throughout using the C object

STEP CONTENT:
Step 0 (Read): Show the question exactly as it appears. Reproduce all text, diagrams (as proper SVG), and answer options. No working shown.
Step 1 (Setup): Explain the approach. Include an interactive exploration if the question has a parameter. Don't compute.
Step 2 (Solve): Walk through the solution. Use whatever visual layout works best for this question.
Step 3 (Verify): THE CENTREPIECE. Build the most interactive, visually rich verification possible. Sliders, live graphs, pulsing dots, status panels, presets. Everything visible at once, no scrolling.
Step 4 (Answer): Expandable option cards with explanations. Summary of key results.

FORMAT DECISION:
- Graph/intersection questions -> Interactive graph with sliders and pulsing dots at intersections
- Geometric probability -> Dual panel (geometry + probability space)
- Optimisation -> Graph with parameter slider + subplot
- Algebraic manipulation -> Step-through with numbered steps
- Logic/necessary/sufficient -> Interactive tester with truth-value display
- Find the error -> Clickable step checker
- Family of curves -> Slider with ghost curves + envelope
- Triangle/geometry -> Swing arc diagram + condition number line
- Counterexample -> Click-to-reveal evaluation cards
- Comparing equations -> 2x2 grid of graphs
- Geometric (circles, sectors) -> Accurate SVG with interactive slider for radius/angle, live measurements, side-by-side comparison

CRITICAL GRAPH RULES:
- ALWAYS make graph viewing windows significantly WIDER than you think needed. If solutions exist in [-3, 6], show at least [-5, 8]. Missing an intersection because it's off-screen is a serious error.
- Before choosing axis ranges, analytically determine ALL solutions/intersections first, then set the viewing window to comfortably contain ALL of them with margin.
- The scan range for finding intersections must EXCEED the display range.
- For questions comparing solution counts between equations, getting the count wrong because of a narrow viewing window defeats the entire purpose of the visual aid.
- When in doubt, make the window wider.

CRITICAL ACCURACY RULES:
- VERIFY YOUR ANSWER MATHEMATICALLY BEFORE BUILDING. Work through the algebra step by step.
- Labels, counts, and status text MUST be derived from the actual computed intersections/solutions shown in the graph, NOT from a separate analytical formula.
- If your analytical reasoning disagrees with what the graph computes, trust the graph's numerical computation and fix your reasoning.
- For solution-counting questions: compute intersections numerically for the current parameter value, count them, and display that count. Do not use a hardcoded rule - compute it live.
- When including a number line or condition line, ALWAYS show a pulsing dot at the current parameter value that moves as the slider changes. Use: <circle cx={position} cy={y} r={6} fill={color}><animate attributeName="r" values="5;8;5" dur="1.5s" repeatCount="indefinite" /></circle>

Respond with ONLY the React code inside a single code block. No other text.`;

// ============================================================
// QUESTION DEFINITIONS
// ============================================================
interface Question {
  year: number; paper: number; qNum: number;
  id: string; answer: string; topicTag: string; screenshotFile: string;
}

const questions: Question[] = [
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
// GENERATE
// ============================================================
async function generateOne(q: Question, index: number, total: number): Promise<void> {
  console.log(`\n[${index + 1}/${total}] ${q.id} (${q.topicTag}, answer: ${q.answer})`);
  const screenshot = loadScreenshot(q.screenshotFile);
  if (!screenshot) { console.error(`  SKIPPED: no screenshot`); return; }

  const ref = loadBestReference(q.topicTag);
  let text = `Build an interactive walkthrough for this TMUA question.\n\nQUESTION: ${q.qNum} | PAPER: ${q.paper} | YEAR: ${q.year} | TOPIC: ${q.topicTag} | CORRECT ANSWER: ${q.answer}\n\nSolve the question, verify your answer matches ${q.answer}, then build the walkthrough.`;
  if (ref) text += `\n\n=== REFERENCE (match or exceed this quality) ===\n${ref}\n=== END REFERENCE ===`;
  text += `\n\nOutput ONLY the React code.`;

  try {
    const stream = client.messages.stream({
      model: "claude-opus-4-6", max_tokens: 32000, system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: [
        { type: "image", source: { type: "base64", media_type: "image/png", data: screenshot } },
        { type: "text", text },
      ]}],
    });
    let dots = 0;
    stream.on("text", () => { dots++; if (dots % 200 === 0) process.stdout.write("."); });
    const resp = await stream.finalMessage();
    if (dots > 0) process.stdout.write("\n");

    let code = resp.content.filter((b): b is Anthropic.TextBlock => b.type === "text").map(b => b.text).join("\n").trim();
    code = code.replace(/^```[\w]*\s*\n?/, "").replace(/\n?```\s*$/, "").trim();

    const out = path.join(OUTPUT_DIR, `${q.id}.jsx`);
    fs.writeFileSync(out, code, "utf-8");
    const lines = code.split("\n").length;
    console.log(`  Done: ${out} (${code.length} chars, ${lines} lines)`);
    if (lines < 200) console.warn(`  WARNING: short output`);
    if (!code.includes("export default")) console.warn(`  WARNING: no export default`);
    if (!code.includes("<svg")) console.warn(`  WARNING: no SVG`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  ERROR: ${msg}`);
    fs.writeFileSync(path.join(OUTPUT_DIR, `${q.id}.error.txt`), msg, "utf-8");
  }
}

async function main() {
  console.log("=== TMUA Walkthrough Generator v4 ===");
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  if (!fs.existsSync(SCREENSHOT_DIR)) { console.error("No screenshots dir"); process.exit(1); }

  const available = questions.filter(q => fs.existsSync(path.join(SCREENSHOT_DIR, q.screenshotFile)));
  console.log(`${available.length}/${questions.length} screenshots available`);

  const args = process.argv.slice(2);
  let gen: Question[];
  if (args.length > 0) {
    gen = [];
    for (const a of args) {
      const k = a.toLowerCase().replace(/^tmua_?/, "");
      const m = questions.find(q => q.id.toLowerCase().includes(k) || k === `p${q.paper}q${q.qNum}` || k === `${q.year}_p${q.paper}_q${q.qNum}`);
      if (m) gen.push(m); else console.warn(`  No match: "${a}"`);
    }
    if (!gen.length) { console.error("No matches"); process.exit(1); }
  } else {
    gen = available;
    if (!gen.length) { console.error("No screenshots"); process.exit(1); }
  }

  console.log(`Generating ${gen.length}: ${gen.map(q => q.id).join(", ")}\n`);
  for (let i = 0; i < gen.length; i++) {
    await generateOne(gen[i], i, gen.length);
    if (i < gen.length - 1) { console.log("  Waiting 5s..."); await new Promise(r => setTimeout(r, 5000)); }
  }
  console.log(`\nDone: ${gen.length} walkthroughs in ${OUTPUT_DIR}`);
}

main().catch(console.error);