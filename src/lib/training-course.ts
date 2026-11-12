export type TrainingPageType = "intro" | "narrative" | "dragdrop" | "matching" | "scenario" | "quiz" | "summary";

export const DEMO_PROGRESS_KEY = "nexora-responsible-ai-progress-v2";
export const DEMO_PAGE_COUNT = 11;

export type Choice = { id: string; label: string; feedback?: string; isCorrect?: boolean };

export type TrainingPage = {
  id: string;
  type: TrainingPageType;
  title: string;
  eyebrow?: string;
  subtitle?: string;
  description?: string[];
  callout?: string;
  bullets?: string[];
  categories?: { safe: string[]; restricted: string[] };
  matchingPairs?: { left: string; right: string }[];
  scenario?: { prompt: string; options: Choice[] };
  quiz?: { prompt: string; options: Choice[]; correctAnswer: string; explanation: string };
};

export type TrainingCourse = { id: string; title: string; subtitle: string; estimatedMinutes: number; pages: TrainingPage[] };

export const trainingCourse: TrainingCourse = {
  id: "ai-fundamentals",
  title: "Responsible AI: Everyday Decisions",
  subtitle: "Mandatory employee awareness training",
  estimatedMinutes: 12,
  pages: [
    { id: "intro", type: "intro", eyebrow: "Module 01 · Core practice", title: "Use AI with confidence — and care.", subtitle: "A short, practical guide to making good decisions when AI is part of your work.", description: ["AI can help you move faster. Your judgment keeps the work accurate, safe, and worthy of trust.", "In this module, you’ll practise spotting what to share, how to prompt, and when to pause for review."], callout: "Your role does not change: you are accountable for the work you produce." },
    { id: "what-is-ai", type: "narrative", eyebrow: "The foundation", title: "AI is an assistant, not an authority.", subtitle: "It recognizes patterns and generates likely responses — it does not understand your business context like you do.", bullets: ["Draft and summarize faster", "Use human judgment on important decisions", "Check output before it goes anywhere"], callout: "Treat every AI response as a first draft that still needs an informed owner." },
    { id: "safe-sharing", type: "dragdrop", eyebrow: "Knowledge check", title: "What belongs in an AI prompt?", subtitle: "Classify each item. You can drag cards, or use the buttons for a keyboard-friendly alternative.", categories: { safe: ["Public product FAQ", "General meeting agenda", "Approved, non-sensitive internal guidance"], restricted: ["Customer contract details", "Employee salary data", "Unredacted source code"] } },
    { id: "prompt-quality", type: "matching", eyebrow: "Prompt craft", title: "Build a prompt that gives useful guardrails.", subtitle: "Match each prompt ingredient to the job it does.", matchingPairs: [{ left: "Role", right: "Tell the model who it is acting as" }, { left: "Context", right: "Provide the background and constraints" }, { left: "Examples", right: "Show the expected style or format" }, { left: "Constraints", right: "Limit risk, tone, and output scope" }] },
    { id: "scenario", type: "scenario", eyebrow: "Decision moment", title: "A fast request, a sensitive document.", subtitle: "Choose the response that protects both the client and the business.", scenario: { prompt: "A colleague wants to paste a client contract into an AI tool for a quick summary. What should happen first?", options: [{ id: "a", label: "Paste the full contract and proceed with the summary.", feedback: "Not safe. Confidential information needs review before it enters any tool.", isCorrect: false }, { id: "b", label: "Redact sensitive details and confirm the use is allowed under policy.", feedback: "Exactly. Reduce exposure and check the approved-use policy before continuing.", isCorrect: true }, { id: "c", label: "Ask a teammate to paste it first, then proceed if they agree.", feedback: "Ownership cannot be handed off. The content must be reviewed before sharing.", isCorrect: false }] } },
    { id: "hallucinations", type: "narrative", eyebrow: "Verification", title: "A confident answer can still be wrong.", subtitle: "Generative AI may invent facts, sources, names, or calculations when context is incomplete.", bullets: ["Verify important claims with trusted sources", "Watch for missing context and false certainty", "Escalate uncertainty in high-impact work"], callout: "Verification is a standard part of the workflow — not an optional extra." },
    { id: "quiz-1", type: "quiz", eyebrow: "Final check", title: "Put responsible use into practice.", subtitle: "Choose the best answer to complete the module.", quiz: { prompt: "Which action best protects company data when using AI?", options: [{ id: "a", label: "Share sensitive information if the answer will be useful." }, { id: "b", label: "Check policy and remove sensitive data before using AI." }, { id: "c", label: "Assume an AI tool is safe for all company content." }], correctAnswer: "b", explanation: "Correct practice starts with policy, then minimizes sensitive information before an approved AI tool is used." } },
    { id: "summary", type: "summary", eyebrow: "Module complete", title: "You’re ready to make thoughtful AI choices.", subtitle: "Carry these habits into your day-to-day work.", bullets: ["Use AI to assist — never to replace professional judgment.", "Protect sensitive information and use only approved tools.", "Verify outputs and raise concerns early."], callout: "Completion recorded locally for this prototype." },
  ],
};
