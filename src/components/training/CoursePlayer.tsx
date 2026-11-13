"use client";

import { startTransition, useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  LockKeyhole,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { DEMO_PROGRESS_KEY, courseProgress } from "@/lib/training-course";
import { getCourse } from "@/mocks/course-catalog";
import { getSectionMedia } from "@/config/section-media";
import { useNarration } from "@/hooks/useNarration";
import type { Progress } from "@/types/training";
import type { ContentProps, CoursePlayerProps, RichTextProps } from "@/types/components";

const initialProgress: Progress = { module: -1, page: 0, viewed: [], checks: [], passed: false };

function RichText({ text }: RichTextProps) {
  return (
    <>
      {text
        .split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
        .map((part, index) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={index}>{part.slice(2, -2)}</strong>
          ) : part.startsWith("`") && part.endsWith("`") ? (
            <code key={index}>{part.slice(1, -1)}</code>
          ) : (
            part
          ),
        )}
    </>
  );
}

function Content({ body }: ContentProps) {
  return (
    <div className="course-reading">
      {body
        .split(/\n\s*\n/)
        .filter(Boolean)
        .map((block, index) =>
          block.startsWith("> ") ? (
            <blockquote key={index}>
              <RichText text={block.slice(2)} />
            </blockquote>
          ) : (
            <p key={index}>
              <RichText text={block.replace(/\n/g, " ")} />
            </p>
          ),
        )}
    </div>
  );
}

function CardContent({ body }: ContentProps) {
  return (
    <>
      {body
        .split(/\n\s*\n/)
        .filter(Boolean)
        .map((block, index) => (
          <span
            className={block.startsWith("> ") ? "learning-card-quote" : "learning-card-paragraph"}
            key={index}
          >
            <RichText text={block.startsWith("> ") ? block.slice(2) : block.replace(/\n/g, " ")} />
          </span>
        ))}
    </>
  );
}

export function CoursePlayer({ courseId, onClose }: CoursePlayerProps) {
  const course = getCourse(courseId);
  const progressKey = `${DEMO_PROGRESS_KEY}-${courseId}`;
  const [progress, setProgress] = useState<Progress>(initialProgress);
  const [loaded, setLoaded] = useState(false);
  const [choice, setChoice] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [openCard, setOpenCard] = useState<number | null>(null);
  const current =
    progress.module >= 0 && progress.module < course.modules.length
      ? course.modules[progress.module]
      : null;
  const isAssessment = progress.module === course.modules.length;
  const isCheck = current !== null && progress.page === 4;
  const isCardModule = current !== null && !isCheck && progress.module === 0;
  const allCurrentSectionsViewed =
    current !== null &&
    current.sections.every((_, index) => progress.viewed.includes(`${progress.module}.${index}`));
  const selectedSectionMedia = getSectionMedia(progress.module, progress.page);
  const completed = courseProgress(progress);
  const unlocked = progress.checks.length;
  const narrationText =
    progress.module === -1
      ? `${course.title}. ${course.welcome}`
      : isAssessment
        ? `Final assessment. Answer all eight questions. You need seven correct answers to pass. ${course.assessment.map((question, index) => `Question ${index + 1}. ${question.prompt}. ${question.options.map((option, optionIndex) => `Option ${String.fromCharCode(65 + optionIndex)}. ${option.text}`).join(". ")}`).join(". ")}`
        : current && isCheck
          ? `Knowledge check. ${current.check.prompt}. ${current.check.options.map((option, index) => `Option ${String.fromCharCode(65 + index)}. ${option.text}`).join(". ")}`
          : current
            ? `${current.sections[progress.page].title}. ${current.sections[progress.page].body}`
            : "";
  const narration = useNarration(narrationText, loaded);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(progressKey) || "null");
      if (
        saved &&
        Number.isInteger(saved.module) &&
        saved.module >= -1 &&
        saved.module <= course.modules.length &&
        Number.isInteger(saved.page) &&
        saved.page >= 0 &&
        saved.page <= 4 &&
        Array.isArray(saved.viewed) &&
        Array.isArray(saved.checks)
      ) {
        startTransition(() =>
          setProgress({
            module: saved.module,
            page: saved.page,
            viewed: saved.viewed.filter((x: unknown): x is string => typeof x === "string"),
            checks: saved.checks.filter(
              (x: unknown): x is number =>
                Number.isInteger(x) && (x as number) >= 0 && (x as number) < course.modules.length,
            ),
            passed: saved.passed === true,
          }),
        );
      }
    } catch {
      /* Keep working if storage is unavailable. */
    }
    startTransition(() => setLoaded(true));
  }, [course.modules.length, progressKey]);

  useEffect(() => {
    if (loaded) {
      try {
        localStorage.setItem(progressKey, JSON.stringify(progress));
      } catch {
        /* Progress remains in memory. */
      }
    }
  }, [loaded, progress, progressKey]);
  useEffect(() => {
    if (!expanded) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [expanded]);

  const go = (module: number, page: number) => {
    if (module === progress.module && page === progress.page) return;
    narration.stop();
    setChoice(null);
    setSubmitted(false);
    setOpenCard(null);
    setProgress((state) => ({ ...state, module, page }));
  };
  const revealCard = (cardIndex: number) => {
    if (!current) return;
    narration.stop();
    setChoice(null);
    setSubmitted(false);
    setOpenCard((value) => (value === cardIndex ? null : cardIndex));
    const key = `${progress.module}.${cardIndex}`;
    setProgress((state) => ({
      ...state,
      page: cardIndex,
      viewed: state.viewed.includes(key) ? state.viewed : [...state.viewed, key],
    }));
  };
  const next = () => {
    if (progress.module === -1) {
      go(0, 0);
      return;
    }
    if (!current) return;
    if (isCardModule) {
      if (allCurrentSectionsViewed) go(progress.module, 4);
      return;
    }
    if (progress.page < 4) {
      const key = `${progress.module}.${progress.page}`;
      setProgress((state) => ({
        ...state,
        page: state.page + 1,
        viewed: state.viewed.includes(key) ? state.viewed : [...state.viewed, key],
      }));
      narration.stop();
      setChoice(null);
      setSubmitted(false);
      return;
    }
    if (progress.checks.includes(progress.module)) go(progress.module + 1, 0);
  };
  const previous = () => {
    if (isAssessment) {
      go(course.modules.length - 1, 4);
      return;
    }
    if (progress.module === -1) return;
    if (progress.page > 0) go(progress.module, progress.page - 1);
    else if (progress.module > 0) go(progress.module - 1, 4);
    else go(-1, 0);
  };
  const submitAssessment = () => {
    const result = course.assessment.reduce(
      (total, question, index) => total + (question.options[answers[index]]?.correct ? 1 : 0),
      0,
    );
    setScore(result);
    narration.speak(
      `${result} out of 8 correct. ${result >= 7 ? "You passed and completed the course." : "Please review your answers and retry."}`,
    );
    if (result >= 7) setProgress((state) => ({ ...state, passed: true }));
  };

  return (
    <main
      className="reference-player"
      style={
        expanded
          ? { position: "fixed", inset: 0, zIndex: 1000, overflow: "auto", minHeight: "100dvh" }
          : undefined
      }
    >
      <header className="reference-topbar">
        <div>
          <strong>{course.title}</strong>
        </div>
        <button
          className="course-expand"
          onClick={() => setExpanded((value) => !value)}
          aria-label={expanded ? "Restore player size" : "Expand player to browser window"}
          title={expanded ? "Restore player size" : "Expand player to browser window"}
          aria-pressed={expanded}
        >
          {expanded ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
        </button>
      </header>
      <div className="reference-blue-frame">
        <div className="reference-layout" style={expanded ? { maxWidth: "none" } : undefined}>
          <aside className="reference-sidebar">
            <div className="reference-brand">
              <span className="reference-brand-mark">◒</span>
              <strong>Nexora</strong>
            </div>
            <h1>{course.title}</h1>
            <p>
              Learn how to use AI confidently and responsibly at work. Complete each section and
              knowledge check to move on.
            </p>
            <div className="course-outline-heading">COURSE OUTLINE</div>
            <nav className="reference-outline" aria-label="Course outline">
              <button className={progress.module === -1 ? "active" : ""} onClick={() => go(-1, 0)}>
                <span className="outline-label">Welcome</span>
                <span className="outline-state">
                  <ChevronRight size={14} />
                </span>
              </button>
              {course.modules.map((module, index) => {
                const locked = index > unlocked;
                const selected = progress.module === index;
                return (
                  <div key={module.title}>
                    <button
                      className={selected ? "active" : ""}
                      disabled={locked}
                      onClick={() => go(index, 0)}
                      aria-current={selected ? "step" : undefined}
                    >
                      <span className="outline-label">
                        {index + 1}. {module.title}
                      </span>
                      <span className="outline-state">
                        {locked ? (
                          <LockKeyhole size={13} />
                        ) : progress.checks.includes(index) ? (
                          <Check size={14} />
                        ) : selected ? (
                          <ChevronDown size={14} />
                        ) : (
                          <ChevronRight size={14} />
                        )}
                      </span>
                    </button>
                    {selected && (
                      <div className="course-subsections">
                        {module.sections.map((section, sectionIndex) => (
                          <button
                            key={section.number}
                            disabled={
                              index !== 0 &&
                              sectionIndex > 0 &&
                              !progress.viewed.includes(`${index}.${sectionIndex - 1}`)
                            }
                            onClick={() =>
                              index === 0 ? revealCard(sectionIndex) : go(index, sectionIndex)
                            }
                            className={progress.page === sectionIndex ? "is-current" : ""}
                          >
                            <span>
                              {section.number} {section.title}
                            </span>
                            {progress.viewed.includes(`${index}.${sectionIndex}`) && (
                              <Check size={12} />
                            )}
                          </button>
                        ))}
                        <button
                          disabled={
                            !module.sections.every((_, sectionIndex) =>
                              progress.viewed.includes(`${index}.${sectionIndex}`),
                            )
                          }
                          onClick={() => go(index, 4)}
                          className={isCheck ? "is-current" : ""}
                        >
                          <span>Knowledge check</span>
                          {progress.checks.includes(index) && <Check size={12} />}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              <button
                disabled={unlocked < course.modules.length}
                className={isAssessment ? "active" : ""}
                onClick={() => go(course.modules.length, 0)}
              >
                <span className="outline-label">Final assessment</span>
                <span className="outline-state">
                  {unlocked < course.modules.length ? (
                    <LockKeyhole size={13} />
                  ) : progress.passed ? (
                    <Check size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </span>
              </button>
            </nav>
          </aside>
          <section className="reference-course" aria-label="Training content">
            <div className="reference-slide course-slide">
              {progress.module === -1 && (
                <div className="course-panel course-welcome">
                  <span className="course-kicker">WELCOME · ABOUT 39 MINUTES</span>
                  <h2>{course.title}</h2>
                  <Content body={course.welcome} />
                </div>
              )}
              {isCardModule && (
                <div className="course-panel course-card-panel">
                  <div className="course-kicker">MODULE 1 · EXPLORE ALL FOUR SECTIONS</div>
                  <h2>Build your AI foundation</h2>
                  <p className="course-card-intro">
                    Select each card to turn it over. Read all four sections to unlock the knowledge
                    check.
                  </p>
                  <div className="course-card-grid">
                    {current.sections.map((section, index) => {
                      const viewed = progress.viewed.includes(`0.${index}`);
                      const flipped = openCard === index;
                      return (
                        <button
                          key={section.number}
                          className={`learning-card ${flipped ? "is-flipped" : ""} ${viewed ? "is-viewed" : ""}`}
                          onClick={() => revealCard(index)}
                          aria-pressed={flipped}
                          aria-label={`${flipped ? "Close" : "Open"} section ${section.number}: ${section.title}${viewed ? ", completed" : ""}`}
                        >
                          <span className="learning-card-inner">
                            <span
                              className="learning-card-face learning-card-front"
                              style={{ position: "relative" }}
                            >
                              <Image
                                className="learning-card-image"
                                src={getSectionMedia(progress.module, index).src}
                                alt=""
                                fill
                                sizes="(max-width: 700px) 100vw, 420px"
                              />
                              <span className="learning-card-number">{section.number}</span>
                              <strong>{section.title}</strong>
                              <span className="learning-card-prompt">
                                {viewed ? "Review section" : "Select to reveal"}
                              </span>
                              {viewed && (
                                <Check
                                  className="learning-card-check"
                                  size={17}
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                            <span className="learning-card-face learning-card-back">
                              <span className="learning-card-number">{section.number}</span>
                              <strong>{section.title}</strong>
                              <span className="learning-card-copy">
                                <CardContent body={section.body} />
                              </span>
                              <span className="learning-card-prompt">Select to close</span>
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="course-card-status" role="status">
                    {progress.viewed.filter((key) => /^0\.[0-3]$/.test(key)).length} of 4 sections
                    explored
                  </p>
                </div>
              )}
              {current && !isCheck && !isCardModule && (
                <div
                  className={`course-panel course-panel-with-media is-${selectedSectionMedia.layout}-media`}
                >
                  <div className="course-copy-column">
                    <div className="course-kicker">
                      MODULE {progress.module + 1} · SECTION {progress.page + 1} OF 4
                    </div>
                    <h2>{current.sections[progress.page].title}</h2>
                    <Content body={current.sections[progress.page].body} />
                  </div>
                  <figure
                    key={`${progress.module}-${progress.page}`}
                    className="course-section-media"
                  >
                    <Image
                      src={selectedSectionMedia.src}
                      alt={selectedSectionMedia.alt}
                      fill
                      sizes="(max-width: 700px) 100vw, 45vw"
                    />
                  </figure>
                </div>
              )}
              {current && isCheck && (
                <div className="course-panel">
                  <div className="course-kicker">
                    MODULE {progress.module + 1} · KNOWLEDGE CHECK
                  </div>
                  <h2>{current.check.prompt}</h2>
                  <p className="course-instruction">Select one answer, then check your response.</p>
                  <div className="course-options">
                    {current.check.options.map((option, index) => (
                      <button
                        key={option.text}
                        onClick={() => {
                          setChoice(index);
                          setSubmitted(false);
                        }}
                        className={choice === index ? "selected" : ""}
                        aria-pressed={choice === index}
                      >
                        <span className="course-radio">{choice === index ? "●" : "○"}</span>
                        <span>{option.text}</span>
                      </button>
                    ))}
                  </div>
                  <button
                    className="course-submit"
                    disabled={choice === null}
                    onClick={() => {
                      setSubmitted(true);
                      const correct = choice !== null && current.check.options[choice].correct;
                      narration.speak(
                        `${correct ? "Correct." : "Not quite. Try again."} ${current.check.feedback}`,
                      );
                      if (correct)
                        setProgress((state) => ({
                          ...state,
                          checks: state.checks.includes(state.module)
                            ? state.checks
                            : [...state.checks, state.module],
                        }));
                    }}
                  >
                    Check answer
                  </button>
                  {submitted && (
                    <div
                      className={`course-feedback ${choice !== null && current.check.options[choice].correct ? "correct" : "incorrect"}`}
                      role="status"
                    >
                      <strong>
                        {choice !== null && current.check.options[choice].correct
                          ? "Correct."
                          : "Not quite. Try again."}
                      </strong>{" "}
                      {current.check.feedback}
                    </div>
                  )}
                </div>
              )}
              {isAssessment && (
                <div className="course-panel course-assessment">
                  <div className="course-kicker">FINAL ASSESSMENT · 8 QUESTIONS</div>
                  <h2>
                    {progress.passed ? "Assessment passed" : "Put your learning into practice"}
                  </h2>
                  <p className="course-instruction">
                    Answer all eight questions. You need seven correct answers to pass. You can
                    review the feedback and retry.
                  </p>
                  {course.assessment.map((question, index) => (
                    <fieldset key={question.prompt} className="assessment-question">
                      <legend>
                        {index + 1}. {question.prompt}
                      </legend>
                      {question.options.map((option, optionIndex) => (
                        <label key={option.text}>
                          <input
                            type="radio"
                            name={`question-${index}`}
                            checked={answers[index] === optionIndex}
                            onChange={() => {
                              setAnswers((state) => ({ ...state, [index]: optionIndex }));
                              setScore(null);
                            }}
                          />{" "}
                          <span>{option.text}</span>
                        </label>
                      ))}
                      {score !== null && (
                        <p className="assessment-feedback">
                          <strong>
                            {question.options[answers[index]]?.correct ? "Correct." : "Review."}
                          </strong>{" "}
                          {question.feedback}
                        </p>
                      )}
                    </fieldset>
                  ))}
                  <button
                    className="course-submit"
                    disabled={Object.keys(answers).length !== course.assessment.length}
                    onClick={submitAssessment}
                  >
                    Submit assessment
                  </button>
                  {score !== null && (
                    <div
                      className={`course-feedback ${score >= 7 ? "correct" : "incorrect"}`}
                      role="status"
                    >
                      <strong>
                        {score} of 8 correct.{" "}
                        {score >= 7 ? "You passed." : "Please review and retry."}
                      </strong>{" "}
                      {score >= 7
                        ? "You have completed the course."
                        : "Change your answers and submit again."}
                    </div>
                  )}
                  {progress.passed && (
                    <button className="course-finish" onClick={onClose}>
                      Finish training <Check size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="reference-controls">
              <div
                className="reference-progress"
                role="progressbar"
                aria-label="Course progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={completed}
              >
                <div style={{ width: `${completed}%` }} />
              </div>
              <div className="reference-control-row">
                <div className="reference-audio">
                  <button
                    onClick={narration.toggleMute}
                    disabled={!narration.available}
                    aria-label={narration.muted ? "Unmute narration" : "Mute narration"}
                    title={narration.muted ? "Unmute narration" : "Mute narration"}
                    aria-pressed={narration.muted}
                  >
                    {narration.muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  </button>
                  <button
                    onClick={narration.replay}
                    disabled={!narration.available || narration.muted}
                    style={{ width: "auto", padding: "0 9px", borderRadius: 5, fontSize: 11 }}
                    aria-label="Play narration from the beginning"
                  >
                    {narration.playing ? "Replay" : "Play narration"}
                  </button>
                  <span>
                    {!narration.available
                      ? "Narration unavailable"
                      : narration.muted
                        ? "Muted"
                        : "1x"}
                  </span>
                </div>
                <div className="reference-nav">
                  <span className="reference-percentage">{completed}%</span>
                  <button
                    className="reference-previous"
                    onClick={previous}
                    disabled={progress.module === -1}
                    aria-label="Previous page"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  {!isAssessment && (
                    <button
                      className="reference-next"
                      onClick={next}
                      disabled={
                        (isCheck && !progress.checks.includes(progress.module)) ||
                        (isCardModule && !allCurrentSectionsViewed)
                      }
                    >
                      <span>Next</span>
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
              {narration.message && (
                <p role="status" style={{ margin: "3px 0", color: "#934800", fontSize: 11 }}>
                  {narration.message}
                </p>
              )}
              {isCardModule && !allCurrentSectionsViewed && (
                <p className="course-gate-hint">
                  Explore all four cards to unlock the knowledge check.
                </p>
              )}
              {isCheck && !progress.checks.includes(progress.module) && (
                <p className="course-gate-hint">Answer correctly to unlock the next module.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
