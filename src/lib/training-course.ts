import { COURSE_CONFIG, COURSE_STEP_COUNT } from "@/config/course";
import type { Progress } from "@/types/training";

export const DEMO_PROGRESS_KEY = COURSE_CONFIG.progressStorageKey;

export function courseProgress(value: Partial<Progress>): number {
  const viewed = new Set((value.viewed ?? []).filter((item) => /^\d+\.\d+$/.test(item))).size;
  const checks = new Set(
    (value.checks ?? []).filter(
      (item) => Number.isInteger(item) && item >= 0 && item < COURSE_CONFIG.moduleCount,
    ),
  ).size;
  const totalViewed = COURSE_CONFIG.moduleCount * COURSE_CONFIG.sectionsPerModule;
  const completedSteps =
    viewed +
    checks +
    Number(value.passed === true && viewed === totalViewed && checks === COURSE_CONFIG.moduleCount);
  return Math.round((completedSteps / COURSE_STEP_COUNT) * 100);
}
