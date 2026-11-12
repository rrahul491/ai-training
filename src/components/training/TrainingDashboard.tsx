"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { DEMO_PAGE_COUNT, DEMO_PROGRESS_KEY, trainingCourse } from "@/lib/training-course";

type TrainingStatus = "Past due" | "Due soon" | "Scheduled" | "Completed";
type TrainingCard = { id: string; title: string; description: string; duration: string; due: string; status: TrainingStatus; progress?: number; kind: string };

const trainingCards: TrainingCard[] = [
  { id: trainingCourse.id, title: "Responsible AI: Everyday Decisions", description: "Use AI tools safely, verify output, and protect information in your daily work.", duration: "12 minutes", due: "Due 22 Nov 2026", status: "Past due", progress: 0, kind: "Online course" },
  { id: "phishing", title: "Recognising Phishing", description: "Spot suspicious messages before they become an incident.", duration: "8 minutes", due: "Due 29 Nov 2026", status: "Due soon", kind: "Preview course" },
  { id: "data-handling", title: "Data Handling Essentials", description: "A concise refresher on classifying and protecting work information.", duration: "15 minutes", due: "Available 1 Dec 2026", status: "Scheduled", kind: "Online course" },
];

const statusStyles: Record<TrainingStatus, string> = {
  "Past due": "bg-rose-50 text-rose-700 ring-rose-200", "Due soon": "bg-amber-50 text-amber-800 ring-amber-200", Scheduled: "bg-slate-100 text-slate-600 ring-slate-200", Completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

function Emblem() { return <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#0a294d] text-lg font-black tracking-tighter text-white">N</div>; }

export function TrainingDashboard({ onStart }: { onStart: () => void }) {
  const [selected, setSelected] = useState<TrainingCard | null>(null);
  const [query, setQuery] = useState("");
  const [courseProgress, setCourseProgress] = useState(0);
  const [filter, setFilter] = useState<"All" | TrainingStatus>("All");
  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(DEMO_PROGRESS_KEY) || "null");
      if (Array.isArray(saved?.visited)) startTransition(() => setCourseProgress(Math.min(100, Math.round((new Set(saved.visited).size / DEMO_PAGE_COUNT) * 100))));
    } catch { /* No saved progress is available. */ }
  }, []);
  const cards = useMemo(() => trainingCards.map((card) => card.id === trainingCourse.id ? { ...card, progress: courseProgress, status: courseProgress === 100 ? "Completed" as const : card.status } : card), [courseProgress]);
  const filtered = useMemo(() => cards.filter((card) => (filter === "All" || card.status === filter) && `${card.title} ${card.description}`.toLowerCase().includes(query.toLowerCase())), [cards, filter, query]);
  const required = cards.filter((item) => item.status !== "Scheduled" && item.status !== "Completed").length;

  return <main className="min-h-screen bg-[#f6f7f9] text-[#1d2939]">
    <header className="bg-[#072442] text-white shadow-sm"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8"><div className="flex items-center gap-3"><Emblem /><div><p className="text-base font-semibold tracking-tight">Nexora</p><p className="text-[10px] font-medium uppercase tracking-[.18em] text-sky-200">Learning portal</p></div></div><div className="flex items-center gap-5 text-sm"><span className="hidden text-sky-100 md:inline">Need help?</span><span className="grid h-8 w-8 place-items-center rounded-full bg-sky-100 font-semibold text-[#07315a]">RC</span></div></div></header>
    <div className="border-b border-slate-200 bg-white"><nav className="mx-auto flex max-w-7xl gap-7 px-5 md:px-8"><button className="border-b-2 border-[#0b67a3] py-3.5 text-sm font-semibold text-[#075991]">My training</button><button className="py-3.5 text-sm text-slate-500">Learning library</button><button className="py-3.5 text-sm text-slate-500">Transcript</button></nav></div>
    <div className="mx-auto max-w-7xl px-5 py-7 md:px-8 md:py-10"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-sm text-slate-500">Welcome back, Rahul</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">My assigned training</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Complete required courses by their due dates. Your completion record updates when you finish the final assessment.</p></div><div className="rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm"><p className="text-[11px] font-semibold uppercase tracking-[.14em] text-slate-500">Required now</p><p className="mt-0.5 text-2xl font-semibold text-[#07315a]">{required} <span className="text-sm font-normal text-slate-500">courses</span></p></div></div>
      <section className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-5 py-4"><div className="flex flex-wrap gap-2">{(["All", "Past due", "Due soon", "Scheduled"] as const).map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-md px-3 py-1.5 text-sm font-medium ${filter === item ? "bg-[#e6f3fb] text-[#075991]" : "text-slate-600 hover:bg-slate-50"}`}>{item}</button>)}</div><label className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-400"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search training" className="w-40 outline-none placeholder:text-slate-400 md:w-56" /></label></div><div className="hidden grid-cols-[minmax(0,1fr)_150px_145px_120px] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-[.12em] text-slate-500 md:grid"><span>Course</span><span>Due date</span><span>Status</span><span className="text-right">Action</span></div><div>{filtered.map((course) => <CourseRow key={course.id} course={course} onOpen={() => course.id === trainingCourse.id ? onStart() : setSelected(course)} />)}{filtered.length === 0 && <p className="px-5 py-10 text-center text-sm text-slate-500">No training matches your search.</p>}</div></section><p className="mt-5 text-xs text-slate-500">Training status is shown for your personal learning record. Contact your learning administrator for assignment support.</p></div>
    {selected && <CourseDetail course={selected} onClose={() => setSelected(null)} />}
  </main>;
}

function CourseRow({ course, onOpen }: { course: TrainingCard; onOpen: () => void }) { return <article className="grid gap-4 border-b border-slate-100 px-5 py-5 last:border-0 md:grid-cols-[minmax(0,1fr)_150px_145px_120px] md:items-center"><div className="flex gap-4"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-sky-100 bg-[#eaf6fc] text-lg text-[#0878b9]">◈</div><div><p className="font-semibold text-slate-800">{course.title}</p><p className="mt-1 max-w-xl text-sm leading-5 text-slate-500">{course.description}</p><p className="mt-2 text-xs text-slate-500">{course.kind} · {course.duration}{course.progress ? ` · ${course.progress}% complete` : ""}</p></div></div><p className="text-sm text-slate-600">{course.due}</p><div><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[course.status]}`}>{course.status}</span></div><div className="md:text-right"><button onClick={onOpen} className="rounded-md bg-[#07315a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0b4b7e]">{course.id !== trainingCourse.id ? "Details" : course.progress ? "Resume" : "Launch"}</button></div></article>; }

function CourseDetail({ course, onClose }: { course: TrainingCard; onClose: () => void }) { return <div className="fixed inset-0 z-20 grid place-items-center bg-slate-950/45 p-4"><section role="dialog" aria-modal="true" aria-labelledby="course-detail-title" className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.14em] text-[#0878b9]">Course details</p><h2 id="course-detail-title" className="mt-2 text-2xl font-semibold text-slate-900">{course.title}</h2></div><button onClick={onClose} aria-label="Close course details" className="rounded p-1 text-slate-500 hover:bg-slate-100">✕</button></div><p className="mt-4 leading-6 text-slate-600">{course.description}</p><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">Duration</p><p className="mt-1 font-semibold">{course.duration}</p></div><div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">Schedule</p><p className="mt-1 font-semibold">{course.due}</p></div></div><div className="mt-6 flex justify-end"><button onClick={onClose} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Close</button></div></section></div>; }
