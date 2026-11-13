const AI_COLLABORATION_IMAGE = "/images/section-media/ai-collaboration.jpg";
const AI_WORKFLOW_IMAGE = "/images/section-media/ai-workflow.webp";
const DATA_PROTECTION_IMAGE = "/images/section-media/data-protection.webp";

const sectionMedia = {
  "0.0": {
    src: AI_COLLABORATION_IMAGE,
    alt: "Colleagues discussing an AI visual on a computer screen",
  },
  "0.1": { src: AI_WORKFLOW_IMAGE, alt: "Team reviewing an AI-enabled workflow" },
  "0.2": { src: AI_COLLABORATION_IMAGE, alt: "Workplace team exploring an AI system" },
  "0.3": {
    src: AI_WORKFLOW_IMAGE,
    alt: "Digital workflow visual representing context and information flow",
  },
  "1.0": { src: AI_WORKFLOW_IMAGE, alt: "Team using technology to improve a work process" },
  "1.1": { src: AI_COLLABORATION_IMAGE, alt: "Colleagues planning a task with an AI assistant" },
  "1.2": { src: AI_WORKFLOW_IMAGE, alt: "AI workflow being reviewed by a workplace team" },
  "1.3": { src: AI_COLLABORATION_IMAGE, alt: "Team reviewing information before using it" },
  "2.0": {
    src: DATA_PROTECTION_IMAGE,
    alt: "Padlock on a laptop representing approved and protected technology use",
  },
  "2.1": {
    src: DATA_PROTECTION_IMAGE,
    alt: "Padlock protecting information on a computer keyboard",
  },
  "2.2": {
    src: DATA_PROTECTION_IMAGE,
    alt: "Digital security visual representing limited data sharing",
  },
  "2.3": {
    src: DATA_PROTECTION_IMAGE,
    alt: "Security lock representing data retention and incident reporting",
  },
  "3.0": { src: AI_COLLABORATION_IMAGE, alt: "People reviewing AI-supported work together" },
  "3.1": { src: AI_WORKFLOW_IMAGE, alt: "Collaborative team workflow with digital information" },
  "3.2": { src: AI_COLLABORATION_IMAGE, alt: "Team checking information and sources together" },
  "3.3": {
    src: DATA_PROTECTION_IMAGE,
    alt: "Security visual representing responsible use and escalation",
  },
  "4.0": { src: AI_WORKFLOW_IMAGE, alt: "AI-enabled workflow in a modern office" },
  "4.1": { src: AI_COLLABORATION_IMAGE, alt: "People working alongside an AI-enabled computer" },
  "4.2": { src: DATA_PROTECTION_IMAGE, alt: "Data protection visual for responsible automation" },
  "4.3": { src: AI_WORKFLOW_IMAGE, alt: "Team reviewing an automated workflow" },
  "5.0": { src: AI_COLLABORATION_IMAGE, alt: "Team planning future work with AI" },
  "5.1": { src: AI_WORKFLOW_IMAGE, alt: "Workplace team analysing an AI-supported process" },
  "5.2": { src: DATA_PROTECTION_IMAGE, alt: "Security lock representing safe future AI use" },
  "5.3": { src: AI_COLLABORATION_IMAGE, alt: "Colleagues collaborating on a technology plan" },
} as const;

const fallbackMedia = sectionMedia["0.0"];

export function getSectionMedia(moduleIndex: number, sectionIndex: number) {
  const media =
    sectionMedia[`${moduleIndex}.${sectionIndex}` as keyof typeof sectionMedia] ?? fallbackMedia;
  return { ...media, layout: sectionIndex % 2 === 0 ? "side" : "wide" };
}
