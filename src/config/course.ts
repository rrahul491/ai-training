export const COURSE_CONFIG = {
  progressStorageKey: "nexora-ai-at-work-course-v3",
  narrationStorageKey: "nexora-training-narration-muted",
  cardModuleIndex: 0,
  moduleCount: 6,
  sectionsPerModule: 4,
  assessmentQuestionCount: 8,
  assessmentPassScore: 7,
} as const;

export const COURSE_STEP_COUNT =
  COURSE_CONFIG.moduleCount * (COURSE_CONFIG.sectionsPerModule + 1) + 1;

export const INITIAL_PROGRESS = {
  module: -1,
  page: 0,
  viewed: [],
  checks: [],
  passed: false,
} as const;
