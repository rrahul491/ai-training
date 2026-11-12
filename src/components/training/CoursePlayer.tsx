"use client";

import { startTransition, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, BrainCircuit, Check, CheckCircle2, ChevronRight, CircleHelp, Database, ExternalLink, FileCheck2, FileText, Laptop, Lightbulb, LockKeyhole, MailCheck, Maximize2, MessageCircle, Minimize2, ShieldCheck, UserRoundCheck, Volume2, VolumeX } from "lucide-react";
import { DEMO_PROGRESS_KEY } from "@/lib/training-course";

const principles = [
  { icon: Laptop, title: "Only use approved AI tools and approved use cases", detail: "Use only the AI tools and use cases approved by your organisation. Check the applicable policy before sharing any work information with an AI tool." },
  { icon: ShieldCheck, title: "Handle data in AI with care", detail: "Protect confidential information. Never enter customer, employee, or other sensitive information into an unapproved AI tool." },
  { icon: UserRoundCheck, title: "You are personally accountable for every AI output you produce or act on", detail: "AI can assist your work, but you remain responsible for checking its accuracy, appropriateness, and quality before using or sharing it." },
  { icon: FileCheck2, title: "Your AI use must comply with company policy and applicable laws", detail: "Follow your organisation’s policies and the laws that apply to your work. Ask your manager or the appropriate team if you are unsure." },
];

const sections = ["Welcome - Safe AI Use Training", "Effective, Responsible & Secure AI Use", "Using Approved AI Tools, Features, and Use Cases", "Data Handling and Confidentiality in AI Tools", "Understanding AI Risks: Input and Output", "Comprehension Check", "Course Closure"];

type Lesson = { title: string; subtitle?: string; text?: string; section: number; kind: "principles" | "security" | "approved" | "role" | "recommendations" | "confidentiality" | "data" | "retention" | "risk" | "quiz" | "complete" };
const lessons: Lesson[] = [
  { title: "AI Use Principles", subtitle: "Click on each card to learn more:", kind: "principles", section: 0 },
  { title: "Why AI Security Matters", subtitle: "AI tools can improve productivity, but they can also create new risks.", text: "A single careless prompt can expose sensitive information. Thoughtful choices help protect our data, our customers, and the trust they place in us.", kind: "security", section: 1 },
  { title: "What Are Approved AI Tools and Features?", text: "Use AI tools and features that have been reviewed and authorised for your work. The approval process considers security, privacy, compliance, and risk.", kind: "approved", section: 2 },
  { title: "Departmental and Role-Based Restrictions", text: "Some departments and roles have additional restrictions on how AI tools can be used. These controls protect sensitive information such as financial records, HR data, and legal documents.", kind: "role", section: 2 },
  { title: "Recommendations for Using AI Safely and Securely", text: "Use AI thoughtfully. Stay accountable, apply human judgment, protect data, and watch for bias.", kind: "recommendations", section: 2 },
  { title: "Data Handling and Confidentiality: Why It Matters", text: "Data is one of our most valuable assets. Each of us has a role in protecting sensitive information and maintaining the trust of customers, partners, and colleagues.", kind: "confidentiality", section: 3 },
  { title: "What Data Can and Cannot Be Entered into Approved AI Tools?", text: "Not all data is appropriate for every AI tool. Both the type of data and the specific use case must be approved before information is entered.", kind: "data", section: 3 },
  { title: "Data Retention and Privacy in AI Tools", text: "It is not just what you enter that matters. Check how information is stored, retained, used, and shared before using an AI tool for work.", kind: "retention", section: 3 },
  { title: "Input Risk", text: "Sensitive details entered into AI tools may be stored, reviewed, or used in ways you do not expect. Protect information by using approved tools and use cases.", kind: "risk", section: 4 },
  { title: "Comprehension Check", subtitle: "Select the best answer:", kind: "quiz", section: 5 },
  { title: "Course Closure", subtitle: "You have completed the course.", text: "Use approved tools, protect sensitive information, and take responsibility for checking AI output. These habits help everyone use AI safely and effectively.", kind: "complete", section: 6 },
];

function DemoIllustration({ variant }: { variant: "approved" | "role" | "data" | "confidentiality" | "risk" | "recommendations" }) {
  return <div className={`demo-illustration illustration-${variant}`} aria-hidden="true">
    {variant === "approved" && <><div className="illustration-paper"><FileText size={65} /><span>?</span></div><MessageCircle className="illustration-bubble bubble-one" size={36} fill="#ffc53d" /><MessageCircle className="illustration-bubble bubble-two" size={36} fill="#37b978" /></>}
    {variant === "role" && <><Laptop size={108} strokeWidth={1.1} /><span className="illustration-badge badge-one"><BrainCircuit size={25} /></span><span className="illustration-badge badge-two"><Lightbulb size={24} /></span></>}
    {variant === "data" && <><div className="data-screen"><BrainCircuit size={70} /><span>AI</span></div><span className="data-lock"><LockKeyhole size={25} /></span></>}
    {variant === "confidentiality" && <><div className="confidential-grid"><Database size={58} /><BrainCircuit size={58} /><ShieldCheck size={58} /></div><div className="illustration-caption">DATA&nbsp; · &nbsp;PRIVACY&nbsp; · &nbsp;TRUST</div></>}
    {variant === "risk" && <div className="document-art"><div className="document-lines"><b /><b /><i /><i /><i /><span /><span /><span /></div></div>}
    {variant === "recommendations" && <><div className="recommend-graphic"><ShieldCheck size={76} /><span><MailCheck size={35} /></span></div></>}
  </div>;
}

function DemoSlide({ lesson }: { lesson: Lesson }) {
  if (lesson.kind === "security") return <div className="demo-centered"><h2>{lesson.title}</h2><p>{lesson.subtitle}</p><div className="demo-quote"><ShieldCheck size={26} /><strong>Protecting information starts with the choices we make every day.</strong></div><p>{lesson.text}</p></div>;
  if (lesson.kind === "approved") return <div className="demo-split demo-split-mid"><DemoIllustration variant="approved" /><div className="demo-copy"><h2>{lesson.title}</h2><p>{lesson.text}</p><p>Using unapproved tools can expose the organisation to risk. Always check that the tool and intended use are approved.</p></div></div>;
  if (lesson.kind === "role") return <div className="demo-split demo-split-mid"><div className="demo-copy"><h2>{lesson.title}</h2><p>{lesson.text}</p><p>Follow company policy and the specific requirements set by your department or role.</p></div><DemoIllustration variant="role" /></div>;
  if (lesson.kind === "recommendations") return <div className="demo-recommendations"><h2>{lesson.title}</h2><p>{lesson.text}</p><div className="recommendation-body"><div className="recommendation-list"><div>Use approved tools and features for your work.</div><div>Use the minimum necessary data and follow your department’s requirements.</div><div>Check the output and ask for guidance when a use case is unclear.</div></div><DemoIllustration variant="recommendations" /></div></div>;
  if (lesson.kind === "confidentiality") return <div className="demo-centered demo-media-centered"><h2>{lesson.title}</h2><DemoIllustration variant="confidentiality" /><p>{lesson.text} Careful data handling is at the core of responsible AI use.</p></div>;
  if (lesson.kind === "data") return <div className="demo-data"><h2>{lesson.title}</h2><div className="demo-split"><DemoIllustration variant="data" /><div className="demo-copy"><p>{lesson.text}</p><p>Check the applicable policy and remove sensitive details when required.</p></div></div></div>;
  if (lesson.kind === "retention") return <div className="demo-retention"><h2>{lesson.title}</h2><div className="demo-email"><div className="demo-email-header"><strong>Important to know:</strong><span>Inbox</span></div><div className="demo-email-recipient"><ShieldCheck size={25} /> <span>YOU@YOURCOMPANY.COM</span></div><p>{lesson.text} <mark>How data is stored, retained, and used is equally important.</mark> Follow your organisation’s approved retention and privacy requirements.</p></div></div>;
  if (lesson.kind === "risk") return <div className="demo-centered demo-risk"><h2>{lesson.title}</h2><DemoIllustration variant="risk" /><p>{lesson.text}</p><div className="demo-warning">Do not use unapproved AI tools or unapproved use cases with company data.</div></div>;
  return <div className="reference-lesson"><h2>{lesson.title}</h2><p className="lesson-subtitle">{lesson.subtitle}</p><div className="lesson-copy">{lesson.text}</div><div className="complete-mark">✓ &nbsp; Course complete</div></div>;
}

export function CoursePlayer({ onClose }: { onClose?: () => void } = {}) {
  const [current, setCurrent] = useState(0);
  const [visited, setVisited] = useState<number[]>([0]);
  const [opened, setOpened] = useState<number[]>([]);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [answer, setAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [passed, setPassed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [fullWidth, setFullWidth] = useState(false);
  const lesson = lessons[current];
  const progress = Math.round((visited.length / lessons.length) * 100);
  const readyToComplete = passed && lessons.slice(0, -1).every((_, index) => visited.includes(index));
  const canContinue = lesson.kind !== "quiz" || readyToComplete;

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(DEMO_PROGRESS_KEY) || "null");
      if (saved && typeof saved === "object") {
        startTransition(() => {
          if (Array.isArray(saved.visited)) setVisited(saved.visited.filter((index: unknown): index is number => Number.isInteger(index) && (index as number) >= 0 && (index as number) < lessons.length));
          if (Array.isArray(saved.opened)) setOpened(saved.opened.filter((index: unknown): index is number => Number.isInteger(index) && (index as number) >= 0 && (index as number) < principles.length));
          if (saved.passed === true) setPassed(true);
          if (Number.isInteger(saved.current) && saved.current >= 0 && saved.current < lessons.length && (saved.current !== lessons.length - 1 || saved.passed === true)) setCurrent(saved.current);
        });
      }
    } catch { /* The course still works if browser storage is unavailable. */ }
    startTransition(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { window.localStorage.setItem(DEMO_PROGRESS_KEY, JSON.stringify({ current, visited, opened, passed })); } catch { /* Progress is kept for this session. */ }
  }, [current, visited, opened, passed, loaded]);

  useEffect(() => () => { if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel(); }, []);

  useEffect(() => {
    if (!fullWidth) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFullWidth(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [fullWidth]);

  const navigate = (next: number) => {
    if (next < 0 || next >= lessons.length || (next === lessons.length - 1 && !readyToComplete)) return;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
    setActiveCard(null);
    setCurrent(next);
    setVisited((items) => items.includes(next) ? items : [...items, next]);
  };

  const toggleAudio = () => {
    if (!("speechSynthesis" in window)) return;
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    const utterance = new SpeechSynthesisUtterance([lesson.title, lesson.subtitle, lesson.text, ...(lesson.kind === "principles" ? principles.map((item) => item.title) : [])].filter(Boolean).join(". "));
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const ActiveIcon = activeCard === null ? null : principles[activeCard].icon;

  return <main className="reference-player" style={fullWidth ? { position: "fixed", inset: 0, zIndex: 1000, overflow: "auto", minHeight: "100dvh" } : undefined}>
    <header className="reference-topbar"><div><strong>Safe AI Use | Using AI Responsibly</strong><CircleHelp size={17} aria-label="Course information" /></div><div className="reference-topbar-actions"><button className="reference-width-toggle" onClick={() => setFullWidth((value) => !value)} aria-label={fullWidth ? "Restore player size" : "Expand player to browser window"} title={fullWidth ? "Restore player size" : "Expand player to browser window"} aria-pressed={fullWidth}>{fullWidth ? <Minimize2 size={17} /> : <Maximize2 size={17} />}</button></div></header>
    <div className={`reference-blue-frame${fullWidth ? " is-full-width" : ""}`}>
      <div className="reference-layout" style={fullWidth ? { maxWidth: "none" } : undefined}>
        <aside className="reference-sidebar">
          <div className="reference-brand"><span className="reference-brand-mark">◒</span><strong>Nexora</strong></div>
          <h1>Safe AI Use | Using AI Responsibly</h1>
          <p>We believe AI should help people work smarter while being used safely, responsibly, and with sound judgment. The ultimate goal of this course is to enable more effective, efficient, ethical, and secure human-AI collaboration, regardless of which approved AI models or tools you use in your daily work.</p>
          <nav aria-label="Course outline" className="reference-outline">{sections.map((section, index) => { const firstPage = lessons.findIndex((item) => item.section === index); const sectionVisited = lessons.every((item, page) => item.section !== index || visited.includes(page)); const locked = index === sections.length - 1 && !readyToComplete; return <button key={section} disabled={locked} onClick={() => navigate(firstPage)} className={index === lesson.section ? "active" : ""}><span className="outline-label">{section}</span><span className="outline-state" aria-hidden="true">{index === lesson.section ? <ChevronRight size={13} /> : sectionVisited ? <Check size={14} /> : locked ? <LockKeyhole size={13} /> : <ChevronRight size={14} />}</span></button>; })}</nav>
        </aside>
        <section className="reference-course" aria-label="Training content">
          <div className="reference-slide">
            {lesson.kind === "principles" ? <div className="principles-content"><h2>{lesson.title}</h2><p>{lesson.subtitle}</p><div className="principle-list">{principles.map((card, index) => <button key={card.title} onClick={() => { setActiveCard(index); setOpened((items) => items.includes(index) ? items : [...items, index]); }} className={`principle-card ${opened.includes(index) ? "viewed" : ""}`}><card.icon className="principle-icon" size={19} aria-hidden="true" /><span>{card.title}</span>{opened.includes(index) && <CheckCircle2 className="principle-check" size={16} aria-hidden="true" />}</button>)}</div><div className="principle-resource"><ExternalLink size={16} aria-hidden="true" /> AI Use Principles and Guidelines</div></div>
              : lesson.kind === "quiz" ? <div className="reference-lesson"><h2>{lesson.title}</h2><p>{lesson.subtitle}</p><div className="quiz-box"><h3>Which action best protects company data when using AI?</h3>{["Share sensitive information if the answer will be useful.", "Check policy and remove sensitive data before using AI.", "Assume any AI tool is safe for company content."].map((option, index) => <button key={option} onClick={() => { setAnswer(index); setSubmitted(false); }} className={`quiz-option ${answer === index ? "selected" : ""}`}><span>{answer === index ? "●" : "○"}</span>{option}</button>)}<button className="quiz-submit" disabled={answer === null} onClick={() => { setSubmitted(true); if (answer === 1) setPassed(true); }}>Submit answer</button>{submitted && <p className={answer === 1 ? "quiz-correct" : "quiz-feedback"}>{answer === 1 ? "Correct. Check policy and protect sensitive data before using an approved AI tool." : "Not quite. Review the options and try again."}</p>}{passed && !submitted && <p className="quiz-correct">Assessment passed. {readyToComplete ? "You can continue to course closure." : "Visit the remaining pages before course closure."}</p>}</div></div>
              : <DemoSlide lesson={lesson} />}
            {activeCard !== null && <div className="reference-modal-overlay" onClick={() => setActiveCard(null)}><div className="reference-modal" role="dialog" aria-modal="true" aria-labelledby="principle-title" onClick={(event) => event.stopPropagation()}><h3 id="principle-title">{principles[activeCard].title}</h3>{ActiveIcon && <ActiveIcon className="modal-icon" size={72} strokeWidth={1.5} aria-hidden="true" />}<p>{principles[activeCard].detail}</p><button onClick={() => setActiveCard(null)}>Close</button></div></div>}
          </div>
          <div className="reference-controls"><div className="reference-progress"><div style={{ width: `${progress}%` }} /></div><div className="reference-control-row"><div className="reference-audio"><button onClick={toggleAudio} aria-label={speaking ? "Stop narration" : "Play narration"}>{speaking ? <VolumeX size={15} /> : <Volume2 size={15} />}</button><span>1x</span></div><div className="reference-nav"><span className="reference-percentage">{progress}%</span><button className="reference-previous" onClick={() => navigate(current - 1)} disabled={current === 0} aria-label="Previous page"><ArrowLeft size={16} /></button>{current < lessons.length - 1 ? <button className="reference-next" onClick={() => navigate(current + 1)} disabled={!canContinue}><span>Next</span><ArrowRight size={14} /></button> : <button className="reference-next" onClick={onClose}><span>Finish</span><Check size={14} /></button>}</div></div>{!canContinue && <span className="reference-hint">{passed ? "Visit the remaining sections to continue" : "Answer the question correctly to continue"}</span>}</div>
        </section>
      </div>
    </div>
  </main>;
}
