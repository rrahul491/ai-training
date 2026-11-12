export type Progress = {
  module: number;
  page: number;
  viewed: string[];
  checks: number[];
  passed: boolean;
};

export type TrainingStatus = "pastDue" | "dueSoon" | "scheduled" | "completed";

export type TrainingCard = {
  id: string;
  title: string;
  description: string;
  duration: string;
  due: string;
  status: TrainingStatus;
  progress?: number;
  kind: string;
};

export type CourseOption = { text: string; correct: boolean };
export type CourseSection = { number: string; title: string; body: string };
export type CourseModule = {
  title: string;
  sections: CourseSection[];
  check: { prompt: string; options: CourseOption[]; feedback: string };
};
export type CourseQuestion = { prompt: string; options: CourseOption[]; feedback: string };
export type CourseContent = {
  title: string;
  minutes: number;
  welcome: string;
  modules: CourseModule[];
  assessment: CourseQuestion[];
};
