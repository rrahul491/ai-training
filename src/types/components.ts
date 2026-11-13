import type { TrainingCard } from "@/types/training";

export type CoursePlayerProps = { courseId: string; onClose?: () => void };
export type RichTextProps = { text: string };
export type ContentProps = { body: string };
export type TrainingDashboardProps = { onStart: (courseId: string) => void };
export type CourseRowProps = { course: TrainingCard; onOpen: () => void };
export type CourseDetailProps = { course: TrainingCard; onClose: () => void };
