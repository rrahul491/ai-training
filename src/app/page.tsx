"use client";

import { useState } from "react";
import { CoursePlayer } from "@/components/training/CoursePlayer";
import { TrainingDashboard } from "@/components/training/TrainingDashboard";

export default function Home() {
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  return activeCourseId ? (
    <CoursePlayer courseId={activeCourseId} onClose={() => setActiveCourseId(null)} />
  ) : (
    <TrainingDashboard onStart={setActiveCourseId} />
  );
}
