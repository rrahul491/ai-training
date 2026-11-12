"use client";

import { useState } from "react";
import { CoursePlayer } from "@/components/training/CoursePlayer";
import { TrainingDashboard } from "@/components/training/TrainingDashboard";

export default function Home() {
  const [showPlayer, setShowPlayer] = useState(false);
  return showPlayer ? (
    <CoursePlayer onClose={() => setShowPlayer(false)} />
  ) : (
    <TrainingDashboard onStart={() => setShowPlayer(true)} />
  );
}
