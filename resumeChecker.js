import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const KEYWORDS = [
  "JavaScript", "React", "Node.js", "Express", "MongoDB",
  "HTML", "CSS", "REST API", "Git", "Teamwork"
];

export default async function resumeChecker(filePath) {
  const uint8Array = new Uint8Array(fs.readFileSync(filePath)); // ✅ Fixed here
  const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
  const pdf = await loadingTask.promise;

  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(" ");
    fullText += pageText + "\n";
  }

  let score = 0;
  const suggestions = [];

  KEYWORDS.forEach(keyword => {
    if (fullText.includes(keyword)) score += 10;
  });

  if (!/education/i.test(fullText)) suggestions.push("Add an 'Education' section.");
  if (!/experience/i.test(fullText)) suggestions.push("Add a 'Work Experience' section.");
  if (!/projects?/i.test(fullText)) suggestions.push("Mention your projects clearly.");
  if (!/contact|email/i.test(fullText)) suggestions.push("Include contact or email information.");

  return {
    atsScore: Math.min(score, 100),
    suggestions,
  };
}

