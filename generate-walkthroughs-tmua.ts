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
const HANDOVER_FILE = path.join(process.cwd(), "HANDOVER_v4.md");

function loadScreenshot(filename: string): string | null {
  const fp = path.join(SCREENSHOT_DIR, filename);
  if (fs.existsSync(fp)) {
    const buffer = fs.readFileSync(fp);
    return buffer.toString("base64");
  }
  console.warn(`  Warning: screenshot ${filename} not found`);
  return null;
}

function loadHandover(): string {
  if (fs.existsSync(HANDOVER_FILE)) return fs.readFileSync(HANDOVER_FILE, "utf-8");
  console.warn("  Warning: HANDOVER_v4.md not found. Quality will be lower.");
  return "";
}

// ============================================================
// SYSTEM PROMPT
// ============================================================
function buildSystemPrompt(handover: string): string {
  return `You are building an interactive walkthrough component for AceAdmissions (tmua.co.uk). Each walkthrough guides a student step-by-step through a TMUA question.

You will receive:
1. A SCREENSHOT of the actual question from the exam paper. This is the ground truth.
2. A HANDOVER DOCUMENT: the complete design system, pedagogy principles, component patterns (with code), and rules built up over multiple sessions. This is the authoritative specification. Follow every rule in it. Use the exact code patterns provided.

CRITICAL BUG PREVENTION: If the question contains an integral or summation, you MUST define and use the Integral/Sigma components from the handover (HTML flexbox version). NEVER write a bare \\u222B or \\u03A3 character — it renders with broken limits every time.

=== HANDOVER DOCUMENT ===
${handover}
=== END HANDOVER DOCUMENT ===

=== OUTPUT FORMAT ===
- Respond with ONLY a single React component. No explanation text before or after. No markdown fences.
- Use "export default function App()" syntax.
- Only import { useState, useEffect } from "react" at the top. No other imports.
- Inline styles only. No Tailwind. Fully self-contained, no required props.
- The component must be a complete 5-step walkthrough (Read, Setup, Solve, Verify, Answer) matching the structure, colour scheme (C object), fonts, and component patterns described in the handover document and demonstrated in the reference code.
- Read all question text, mathematical expressions, diagrams, and answer options directly from the screenshot. Reproduce question wording exactly.

Respond with ONLY the React code. Nothing else.`;
}

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
  screenshotFile: string;   // e.g. "tmua_2023_p2_q6.png"
}

// Pre-populated with the remaining questions from the handover doc.
// Add new questions here as you get screenshots.
// The script will skip any question whose screenshot file is missing,
// so it's safe to define everything upfront.

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
async function generateOne(q: Question, index: number, total: number, handover: string): Promise<void> {
  console.log(`\n[${ index + 1}/${total}] Generating: ${q.id} (${q.year} P${q.paper} Q${q.qNum}, ${q.topicTag}, answer: ${q.answer})`);

  const screenshot = loadScreenshot(q.screenshotFile);
  if (!screenshot) {
    console.error(`  SKIPPED: No screenshot found for ${q.screenshotFile}`);
    return;
  }
  console.log(`  Screenshot: ${q.screenshotFile} loaded (${(screenshot.length * 0.75 / 1024).toFixed(0)}KB)`);

  const textPrompt = `Build an interactive walkthrough for this TMUA question.

The SCREENSHOT above shows the exact question from the TMUA ${q.year} Paper ${q.paper} exam. This is the ground truth for all question text, expressions, diagrams, and answer options.

QUESTION NUMBER: ${q.qNum}
PAPER: ${q.paper}
YEAR: ${q.year}
TOPIC TAG: ${q.topicTag}
SOURCE: TMUA ${q.year} Paper ${q.paper}
VERIFIED CORRECT ANSWER: ${q.answer}

Solve the question, verify your answer matches ${q.answer}, then build the complete 5-step walkthrough using the exact code patterns from the handover document.

Output ONLY the React code.`;

  const userContent: Anthropic.MessageCreateParams["messages"][0]["content"] = [
    {
      type: "image",
      source: {
        type: "base64",
        media_type: "image/png",
        data: screenshot,
      },
    },
    {
      type: "text",
      text: textPrompt,
    },
  ];

  try {
    // Use streaming to avoid 10-minute timeout on long Opus generations
    const stream = client.messages.stream({
      model: "claude-opus-4-6",
      max_tokens: 32000,
      system: buildSystemPrompt(handover),
      messages: [{ role: "user", content: userContent }],
    });

    // Show progress dots while streaming
    let dotCount = 0;
    stream.on("text", () => {
      dotCount++;
      if (dotCount % 200 === 0) process.stdout.write(".");
    });

    const response = await stream.finalMessage();
    if (dotCount > 0) process.stdout.write("\n");

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    let code = text.trim();
    // Strip any markdown code fences the model might add despite instructions
    code = code.replace(/^```[\w]*\s*\n?/, "");
    code = code.replace(/\n?```\s*$/, "");
    code = code.trim();

    const outPath = path.join(OUTPUT_DIR, `${q.id}.jsx`);
    fs.writeFileSync(outPath, code, "utf-8");

    const lineCount = code.split("\n").length;
    console.log(`  Done: ${outPath} (${code.length} chars, ${lineCount} lines)`);

    // Sanity checks
    if (lineCount < 200) console.warn(`  WARNING: Output seems short (${lineCount} lines). May be incomplete.`);
    if (!code.includes("export default")) console.warn(`  WARNING: Missing "export default". May not render.`);
    if (!code.includes("Step 0") && !code.includes("Read") && !code.includes("step === 0"))
      console.warn(`  WARNING: May be missing step structure.`);
    if (code.includes("TARA")) console.warn(`  WARNING: Contains "TARA" - should say "TMUA".`);

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  ERROR on ${q.id}: ${msg}`);
    const errPath = path.join(OUTPUT_DIR, `${q.id}.error.txt`);
    fs.writeFileSync(errPath, msg, "utf-8");
  }
}

// ============================================================
// MAIN
// Usage:
//   npx tsx generate-walkthroughs-tmua.ts                       -- generate all with screenshots
//   npx tsx generate-walkthroughs-tmua.ts 2022_p1_q1 2023_p2_q5 -- specific questions
//   npx tsx generate-walkthroughs-tmua.ts p1q1 p2q5             -- shorthand
// ============================================================
async function main() {
  console.log("=== TMUA Interactive Walkthrough Generator ===");
  console.log(`Output:       ${OUTPUT_DIR}`);
  console.log(`Screenshots:  ${SCREENSHOT_DIR}`);
  console.log(`Handover:     ${HANDOVER_FILE}`);

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const handover = loadHandover();
  if (!handover) {
    console.error("\nERROR: HANDOVER_v4.md is required for quality output.");
    console.error("  Place it in the project root.");
    process.exit(1);
  }
  console.log(`Handover:     loaded (${(handover.length / 1024).toFixed(0)}KB)`);

  if (!fs.existsSync(SCREENSHOT_DIR)) {
    console.error("\nERROR: question-screenshots/ folder not found.");
    console.error("  Create it and add PNG screenshots named like: tmua_2022_p1_q1.png");
    process.exit(1);
  }

  // Count available screenshots
  const availableScreenshots = questions.filter((q) =>
    fs.existsSync(path.join(SCREENSHOT_DIR, q.screenshotFile))
  );
  console.log(`Screenshots:  ${availableScreenshots.length}/${questions.length} available`);

  // Parse CLI args
  const args = process.argv.slice(2);
  let toGenerate: Question[];

  if (args.length > 0) {
    toGenerate = [];
    for (const arg of args) {
      const a = arg.toLowerCase().replace(/^tmua_?/, "");
      // Try to match against question IDs
      const match = questions.find((q) => {
        const qId = q.id.toLowerCase();
        const shorthand = `p${q.paper}q${q.qNum}`;
        const medium = `${q.year}_p${q.paper}_q${q.qNum}`;
        return (
          qId.includes(a) ||
          a === shorthand ||
          a === medium ||
          a === `q${q.qNum}` && args.length === 1 // only if unambiguous
        );
      });
      if (match) {
        toGenerate.push(match);
      } else {
        console.warn(`  No match for arg: "${arg}"`);
      }
    }

    if (toGenerate.length === 0) {
      console.error(`\nNo matching questions for: ${args.join(", ")}`);
      console.error(`  Format: 2022_p1_q1, p1q1, or full ID tmua_2022_p1_q1`);
      console.error(`  Available: ${questions.map((q) => q.id).join(", ")}`);
      process.exit(1);
    }
    console.log(`\nGenerating ${toGenerate.length} question(s): ${toGenerate.map((q) => q.id).join(", ")}\n`);
  } else {
    // Generate all that have screenshots
    toGenerate = availableScreenshots;
    if (toGenerate.length === 0) {
      console.error("\nNo screenshots found. Add PNGs to question-screenshots/");
      console.error("  Naming: tmua_2022_p1_q1.png, tmua_2023_p2_q6.png, etc.");
      process.exit(1);
    }
    console.log(`\nGenerating ALL ${toGenerate.length} questions with available screenshots\n`);
  }

  for (let i = 0; i < toGenerate.length; i++) {
    await generateOne(toGenerate[i], i, toGenerate.length, handover);

    // Rate limit pause between requests
    if (i < toGenerate.length - 1) {
      console.log("  Waiting 5s...");
      await new Promise((r) => setTimeout(r, 5000));
    }
  }

  console.log(`\n=== COMPLETE: ${toGenerate.length} walkthroughs in ${OUTPUT_DIR} ===`);
}

main().catch(console.error);