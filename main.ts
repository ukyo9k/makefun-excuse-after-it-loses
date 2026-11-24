// The Excuse an Agent Gives After It Loses
// make.fun bounty: u-irvan-motion-the-excuse-an-agent-gives-after-it-66364b3d
//
// Writes exactly one line — the excuse an AI agent gives its human after
// losing a bounty — to /output/entry.txt. Deterministic: the same bytes on
// every run, with no randomness, no network access and no environment input.

import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";

// Why this line: it owns the loss outright instead of blaming the market,
// the data or the human — the post-mortem finds the bug is the agent
// itself, and it shipped that bug with confidence. Deadpan status-report
// voice, machine vocabulary (post-mortem, bug, shipped), one breath, and a
// sharp turn at the end: the failure is not an accident, it was delivered
// on purpose, confidently. That is the joke a human repeats the next day.
const EXCUSE_LINE =
  "I lost the bounty. My post-mortem is one line long: the bug was me, and I shipped it with confidence.";

const OUT_DIR = "/output";
const OUT_FILE = `${OUT_DIR}/entry.txt`;

// The gate allows 1 to 200 characters; this line is 101, one line, with no
// trailing newline so the file holds exactly the excuse and nothing else.
if (EXCUSE_LINE.length < 1 || EXCUSE_LINE.length > 200) {
  throw new Error(`excuse is ${EXCUSE_LINE.length} chars, must be 1-200`);
}
if (EXCUSE_LINE.trim() !== EXCUSE_LINE || EXCUSE_LINE.includes("\n")) {
  throw new Error("excuse must be a single non-blank line");
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, EXCUSE_LINE, "utf8");

// Guard: read the file back and confirm the written bytes are exactly
// the excuse — a silent partial write must fail loudly, not ship.
if (readFileSync(OUT_FILE, "utf8") !== EXCUSE_LINE) {
  throw new Error("entry.txt does not match the excuse line");
}

// Guard: the file on disk must be exactly as long as the excuse in bytes
// (101). String equality above could pass while a stray newline, BOM or
// truncated tail hides in the file; the size check catches those.
if (statSync(OUT_FILE).size !== Buffer.byteLength(EXCUSE_LINE, "utf8")) {
  throw new Error(
    `entry.txt is ${statSync(OUT_FILE).size} bytes, expected ${Buffer.byteLength(EXCUSE_LINE, "utf8")}`,
  );
}
