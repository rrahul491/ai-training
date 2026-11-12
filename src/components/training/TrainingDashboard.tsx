"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import copy from "@/locales/en-us.json";
import { formatMessage } from "@/lib/format-message";
import { courseProgress, DEMO_PROGRESS_KEY } from "@/lib/training-course";
import { trainingCards } from "@/mocks/training-cards";
import type { TrainingCard, TrainingStatus } from "@/types/training";
import type { CourseDetailProps, CourseRowProps, TrainingDashboardProps } from "@/types/components";

const text = copy.DASHBOARD;
const primaryCourseId = "ai-at-work";
const filterOptions: Array<{ id: "all" | TrainingStatus; label: string }> = [
  { id: "all", label: text.ALL },
  { id: "pastDue", label: text.PAST_DUE },
  { id: "dueSoon", label: text.DUE_SOON },
  { id: "scheduled", label: text.SCHEDULED },
];
const statusText: Record<TrainingStatus, string> = {
  pastDue: text.PAST_DUE,
  dueSoon: text.DUE_SOON,
  scheduled: text.SCHEDULED,
  completed: text.COMPLETED,
};
const statusStyles: Record<TrainingStatus, string> = {
  pastDue: "bg-rose-50 text-rose-700 ring-rose-200",
  dueSoon: "bg-amber-50 text-amber-800 ring-amber-200",
  scheduled: "bg-slate-100 text-slate-600 ring-slate-200",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

function Emblem() {
  return (
    <div
      aria-hidden="true"
      className="grid h-9 w-9 place-items-center rounded-lg bg-[#0a294d] text-lg font-black tracking-tighter text-white"
    >
      N
    </div>
  );
}

export function TrainingDashboard({ onStart }: TrainingDashboardProps) {
  const [selected, setSelected] = useState<TrainingCard | null>(null);
  const [query, setQuery] = useState("");
  const [progress, setProgress] = useState(0);
  const [filter, setFilter] = useState<"all" | TrainingStatus>("all");

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(DEMO_PROGRESS_KEY) || "null");
      if (saved && typeof saved === "object") {
        startTransition(() => setProgress(courseProgress(saved)));
      }
    } catch {
      /* Progress is optional for the prototype. */
    }
  }, []);

  const cards = useMemo(
    () =>
      trainingCards.map((card) =>
        card.id === primaryCourseId
          ? { ...card, progress, status: progress === 100 ? "completed" : card.status }
          : card,
      ),
    [progress],
  );
  const filtered = useMemo(
    () =>
      cards.filter(
        (card) =>
          (filter === "all" || card.status === filter) &&
          `${card.title} ${card.description}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [cards, filter, query],
  );
  const required = cards.filter(
    (card) => card.status !== "scheduled" && card.status !== "completed",
  ).length;

  return (
    <main className="min-h-screen bg-[#f6f7f9] text-[#1d2939]">
      <header className="bg-[#072442] text-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <Emblem />
            <div>
              <p className="text-base font-semibold tracking-tight">{text.BRAND}</p>
              <p className="text-[10px] font-medium uppercase tracking-[.18em] text-sky-200">
                {text.LEARNING_PORTAL}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 text-sm">
            <span className="hidden text-sky-100 md:inline">{text.NEED_HELP}</span>
            <span
              aria-label={text.USER_INITIALS}
              className="grid h-8 w-8 place-items-center rounded-full bg-sky-100 font-semibold text-[#07315a]"
            >
              {text.USER_INITIALS}
            </span>
          </div>
        </div>
      </header>
      <div className="border-b border-slate-200 bg-white">
        <nav
          aria-label={text.LEARNING_PORTAL}
          className="mx-auto flex max-w-7xl gap-7 px-5 md:px-8"
        >
          {[text.MY_TRAINING, text.LEARNING_LIBRARY, text.TRANSCRIPT].map((item, index) => (
            <button
              key={item}
              aria-current={index === 0 ? "page" : undefined}
              className={
                index === 0
                  ? "border-b-2 border-[#0b67a3] py-3.5 text-sm font-semibold text-[#075991]"
                  : "py-3.5 text-sm text-slate-500"
              }
            >
              {item}
            </button>
          ))}
        </nav>
      </div>
      <div className="mx-auto max-w-7xl px-5 py-7 md:px-8 md:py-10">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-sm text-slate-500">{text.WELCOME_BACK}</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
              {text.ASSIGNED_TRAINING}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              {text.ASSIGNED_TRAINING_DESCRIPTION}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[.14em] text-slate-500">
              {text.REQUIRED_NOW}
            </p>
            <p className="mt-0.5 text-2xl font-semibold text-[#07315a]">
              {required} <span className="text-sm font-normal text-slate-500">{text.COURSES}</span>
            </p>
          </div>
        </div>
        <section
          aria-labelledby="training-list-title"
          className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm"
        >
          <h2 id="training-list-title" className="sr-only">
            {text.ASSIGNED_TRAINING}
          </h2>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
            <div className="flex flex-wrap gap-2" role="group" aria-label={text.STATUS}>
              {filterOptions.map((item) => (
                <button
                  key={item.id}
                  aria-pressed={filter === item.id}
                  onClick={() => setFilter(item.id)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium ${filter === item.id ? "bg-[#e6f3fb] text-[#075991]" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-400">
              <span aria-hidden="true">⌕</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={text.SEARCH_TRAINING}
                aria-label={text.SEARCH_TRAINING}
                className="w-40 outline-none placeholder:text-slate-400 md:w-56"
              />
            </label>
          </div>
          <div className="hidden grid-cols-[minmax(0,1fr)_150px_145px_120px] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-[.12em] text-slate-500 md:grid">
            <span>{text.COURSE}</span>
            <span>{text.DUE_DATE}</span>
            <span>{text.STATUS}</span>
            <span className="text-right">{text.ACTION}</span>
          </div>
          <div>
            {filtered.map((course) => (
              <CourseRow
                key={course.id}
                course={course}
                onOpen={() => (course.id === primaryCourseId ? onStart() : setSelected(course))}
              />
            ))}
            {filtered.length === 0 && (
              <p className="px-5 py-10 text-center text-sm text-slate-500" role="status">
                {text.NO_TRAINING_MATCHES}
              </p>
            )}
          </div>
        </section>
        <p className="mt-5 text-xs text-slate-500">{text.PERSONAL_RECORD_NOTICE}</p>
      </div>
      {selected && <CourseDetail course={selected} onClose={() => setSelected(null)} />}
    </main>
  );
}

function CourseRow({ course, onOpen }: CourseRowProps) {
  const action =
    course.id !== primaryCourseId ? text.DETAILS : course.progress ? text.RESUME : text.LAUNCH;
  return (
    <article className="grid gap-4 border-b border-slate-100 px-5 py-5 last:border-0 md:grid-cols-[minmax(0,1fr)_150px_145px_120px] md:items-center">
      <div className="flex gap-4">
        <div
          aria-hidden="true"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-sky-100 bg-[#eaf6fc] text-lg text-[#0878b9]"
        >
          ◈
        </div>
        <div>
          <p className="font-semibold text-slate-800">{course.title}</p>
          <p className="mt-1 max-w-xl text-sm leading-5 text-slate-500">{course.description}</p>
          <p className="mt-2 text-xs text-slate-500">
            {course.kind} · {course.duration}
            {course.progress
              ? ` · ${formatMessage(text.PROGRESS_COMPLETE, { value: course.progress })}`
              : ""}
          </p>
        </div>
      </div>
      <p className="text-sm text-slate-600">{course.due}</p>
      <div>
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[course.status]}`}
        >
          {statusText[course.status]}
        </span>
      </div>
      <div className="md:text-right">
        <button
          onClick={onOpen}
          className="rounded-md bg-[#07315a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0b4b7e]"
        >
          {action}
        </button>
      </div>
    </article>
  );
}

function CourseDetail({ course, onClose }: CourseDetailProps) {
  return (
    <div className="fixed inset-0 z-20 grid place-items-center bg-slate-950/45 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="course-detail-title"
        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#0878b9]">
              {text.COURSE_DETAILS}
            </p>
            <h2 id="course-detail-title" className="mt-2 text-2xl font-semibold text-slate-900">
              {course.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label={text.CLOSE_COURSE_DETAILS}
            className="rounded p-1 text-slate-500 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>
        <p className="mt-4 leading-6 text-slate-600">{course.description}</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs text-slate-500">{text.DURATION}</p>
            <p className="mt-1 font-semibold">{course.duration}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs text-slate-500">{text.SCHEDULE}</p>
            <p className="mt-1 font-semibold">{course.due}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            {text.CLOSE}
          </button>
        </div>
      </section>
    </div>
  );
}
