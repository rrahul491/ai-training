import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Mechanically generate the reader and player data from the approved course document.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const markdown = readFileSync(
  resolve(root, "docs/training/AI_TRAINING_CONTENT_DRAFT.md"),
  "utf8",
).replace(/\r\n/g, "\n");
const textOnly = (s) => s.replace(/\*\*/g, "").replace(/`/g, "").trim();
const modulesRaw = markdown.match(/## [4-9]\. Module[\s\S]*?(?=\n---\n)/g) ?? [];
const modules = modulesRaw.map((source, moduleIndex) => {
  const title = source.match(/^## \d+\. Module \d+ — (.+?) — \d+ minutes/m)?.[1];
  const sections = [
    ...source.matchAll(
      /^### Section (\d+\.\d+) — (.+)\n([\s\S]*?)(?=\n### Section |\n\*\*(?:Quick check|Practice activity):?|\n\*\*Quick check \d+:)/gm,
    ),
  ].map((m) => ({ number: m[1], title: m[2], body: m[3].trim() }));
  const checkMatch = source.match(
    /\*\*(?:Quick check \d+|Practice activity):\*\*\s*([^\n]+)\n([\s\S]*?)\n\*\*Feedback:\*\*\s*(.+)/,
  );
  if (!title || sections.length !== 4 || !checkMatch)
    throw new Error(
      `Module ${moduleIndex + 1} did not parse: title=${Boolean(title)}, sections=${sections.length}, check=${Boolean(checkMatch)}`,
    );
  const options = [...checkMatch[2].matchAll(/^- [A-C]\. (.+)$/gm)].map((m) => ({
    text: textOnly(m[1].replace(/\s*\*\*Correct\*\*/, "")),
    correct: m[1].includes("**Correct**"),
  }));
  if (options.length !== 3 || options.filter((item) => item.correct).length !== 1)
    throw new Error(`Invalid check ${moduleIndex + 1}`);
  return {
    title,
    sections,
    check: {
      prompt: textOnly(checkMatch[1]),
      options,
      feedback: textOnly(checkMatch[3]),
    },
  };
});
if (modules.length !== 6) throw new Error(`Expected six modules; got ${modules.length}`);
const assessmentSource = markdown
  .split("## 10. Final assessment — 5 minutes")[1]
  ?.split("### Completion message")[0];
if (!assessmentSource) throw new Error("Final assessment not found");
const assessment = [
  ...assessmentSource.matchAll(/^\d+\. \*\*(.+?)\*\*\n([\s\S]*?)(?=\n\d+\. \*\*|(?![\s\S]))/gm),
].map((m) => {
  const options = [...m[2].matchAll(/^\s+- [A-C]\. (.+)$/gm)].map((option) => ({
    text: textOnly(option[1].replace(/\s*\*\*Correct\*\*/, "")),
    correct: option[1].includes("**Correct**"),
  }));
  const explanation = m[2].match(/\*\*Explanation:\*\*\s*(.+)/)?.[1];
  if (options.length !== 3 || options.filter((item) => item.correct).length !== 1 || !explanation)
    throw new Error(`Invalid assessment question: ${m[1]}`);
  return { prompt: m[1], options, feedback: textOnly(explanation) };
});
if (assessment.length !== 8)
  throw new Error(`Expected eight final questions; got ${assessment.length}`);
const welcome = markdown
  .split("## 3. Welcome — 2 minutes")[1]
  .split("---")[0]
  .replace(/\*\*Learner-facing copy\*\*/, "")
  .trim();
const data = {
  title: "AI at Work: Foundations, Safe Use and What's Next",
  minutes: 39,
  welcome,
  modules,
  assessment,
};
const jsonPath = resolve(root, "training-app/src/lib/course-content.generated.json");
writeFileSync(jsonPath, `${JSON.stringify(data, null, 2)}\n`);

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const inline = (s) =>
  esc(s)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
function renderMarkdown(source) {
  const lines = source.split("\n");
  let output = "",
    list = "",
    paragraph = [];
  const endParagraph = () => {
    if (paragraph.length) {
      output += `<p>${inline(paragraph.join(" "))}</p>\n`;
      paragraph = [];
    }
  };
  const endList = () => {
    if (list) {
      output += `</${list}>\n`;
      list = "";
    }
  };
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i],
      line = raw.trim();
    if (!line) {
      endParagraph();
      endList();
      continue;
    }
    const heading = line.match(/^(#{1,3}) (.+)$/);
    if (heading) {
      endParagraph();
      endList();
      const level = heading[1].length;
      output += `<h${level} id="section-${i}">${inline(heading[2])}</h${level}>\n`;
      continue;
    }
    if (line === "---") {
      endParagraph();
      endList();
      output += "<hr>\n";
      continue;
    }
    if (line.startsWith("|")) {
      endParagraph();
      endList();
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) rows.push(lines[i++].trim());
      i--;
      output += '<div class="table-wrap"><table>';
      rows
        .filter((row) => !/^\|[\s:|-]+\|$/.test(row))
        .forEach((row, index) => {
          const tag = index === 0 ? "th" : "td";
          output += `<tr>${row
            .slice(1, -1)
            .split("|")
            .map((cell) => `<${tag}>${inline(cell.trim())}</${tag}>`)
            .join("")}</tr>`;
        });
      output += "</table></div>\n";
      continue;
    }
    if (line.startsWith("> ")) {
      endParagraph();
      endList();
      output += `<blockquote>${inline(line.slice(2))}</blockquote>\n`;
      continue;
    }
    const item = line.match(/^(?:- |(\d+)\. )(.+)$/);
    if (item) {
      endParagraph();
      const kind = item[1] ? "ol" : "ul";
      if (list !== kind) {
        endList();
        list = kind;
        output += kind === "ol" ? `<ol start="${item[1]}">\n` : "<ul>\n";
      }
      output += `<li>${inline(item[2])}</li>\n`;
      continue;
    }
    endList();
    paragraph.push(line);
  }
  endParagraph();
  endList();
  return output;
}
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>AI at Work — Training Content</title><style>body{margin:0;background:#f3f6fa;color:#1c2938;font:16px/1.65 system-ui,-apple-system,sans-serif}header{background:#092d52;color:white;padding:40px max(24px,calc((100vw - 950px)/2))}header p{margin:4px 0 0;color:#d9e9f9}main{max-width:950px;margin:32px auto;padding:32px 48px;background:white;border:1px solid #dce5ef;border-radius:12px}h1{font-size:2.1rem;line-height:1.2}h2{font-size:1.45rem;margin-top:2.5rem;padding-bottom:.5rem;border-bottom:1px solid #dbe4ee;color:#123c66}h3{font-size:1.1rem;margin-top:1.7rem;color:#17466d}p,li{max-width:80ch}a{color:#075f9e}blockquote{margin:1rem 0;padding:14px 20px;border-left:4px solid #1680ba;background:#eef7fc}.table-wrap{overflow:auto}table{border-collapse:collapse;width:100%;font-size:.92rem}td,th{border:1px solid #dce5ef;padding:9px;text-align:left}th{background:#eef4f9}hr{border:0;border-top:1px solid #dce5ef;margin:2.5rem 0}code{background:#eef3f8;padding:2px 4px;border-radius:3px}@media(max-width:650px){main{margin:0;padding:22px;border:0;border-radius:0}header{padding:25px 22px}h1{font-size:1.65rem}}@media print{body{background:white}header{background:white;color:#111;padding:0}header p{color:#333}main{border:0;margin:0;padding:0}h2,h3{break-after:avoid}tr,blockquote{break-inside:avoid}}</style></head><body><header><strong>TRAINING CONTENT · READER EDITION</strong><p>Course content, knowledge checks, answer key and implementation decisions</p></header><main>${renderMarkdown(markdown)}</main></body></html>`;
const htmlPath = resolve(root, "training-content/AI at Work - Training Content.html");
mkdirSync(dirname(htmlPath), { recursive: true });
writeFileSync(htmlPath, html);
console.log(
  `Generated ${modules.length} modules, ${modules.reduce((sum, item) => sum + item.sections.length, 0)} sections and ${assessment.length} assessment questions.`,
);
console.log(`Reader: ${htmlPath}\nPlayer content: ${jsonPath}`);
