import aiAtWorkCourse from "@/lib/course-content.generated.json";
import { additionalCourses } from "@/mocks/additional-course-content";
import type { CourseContent } from "@/types/training";

const courses: Record<string, CourseContent> = {
  "ai-at-work": aiAtWorkCourse as CourseContent,
  ...additionalCourses,
};

export function getCourse(courseId: string): CourseContent {
  return courses[courseId] ?? courses["ai-at-work"];
}
