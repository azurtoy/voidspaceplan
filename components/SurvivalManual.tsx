'use client';

import { useState } from 'react';

interface ManualSection {
  title: string;
  content: string;
}

const manualSections: ManualSection[] = [
  {
    title: "0) Tone and intent",
    content: "This is not a critique of any individual. It is a student-side operations manual: how to build a learning system and protect performance even when materials are limited and lectures are compressed.\n\nIf the instructor ever sees this, the intent is simply:\n• respect the standards\n• reduce unnecessary messages\n• ask more precise questions\n• improve student preparation"
  },
  {
    title: "1) OBSERVATIONS: What we have actually observed",
    content: "Here are the observations we can state with confidence:\n\n• The instructor explicitly said they will not upload slides or notes\n• There are few or no board worked examples, so students may lack a clear anchor during class\n• The pace is fast, making real-time note taking difficult\n• Attendance and punctuality are emphasized strongly\n• The instructor seems to prefer fewer emails rather than frequent messages\n• If the office is off campus, Zoom becomes the realistic option\n• As a result, students are turning to self study, study groups, and external resources to obtain explanations"
  },
  {
    title: "2) What this likely means: How to interpret the course structure",
    content: "Taken together, these observations suggest a course structure where students reconstruct the content through the textbook and problem solving, rather than receiving slow step-by-step explanation in lectures.\nThis is not about blame. It is about operating style.\n\n• When physics is deeply familiar, it is easy to compress explanations\n• Efficiency and clean time management may be a priority\n• Avoiding explicit exam hints can be seen as fairness"
  },
  {
    title: "3) Where grades are decided: Repeatable accuracy, not "feeling you get it"",
    content: "In courses like this, marks often come down to execution:\n\n• choosing the correct equation\n• setting initial conditions, coordinates, and signs correctly\n• carrying units consistently\n• maintaining a clean logical chain of steps\n\nRepeatability beats one-time insight. The student who can run the same type ten times without repeating the same mistake usually wins."
  },
  {
    title: "4) In-class strategy: Don't transcribe, extract signals",
    content: "Copying everything rarely works. Treat class as signal extraction.\nBefore you leave, capture:\n• 2 key definitions\n• 3 key equations with exact notation\n• 1 trap (units, signs, vectors)\n\nThen do a 10-minute reconstruction immediately after class.\n\nPost-class reconstruction checklist:\n• list symbols you saw (example: omega, phi, k, m, E)\n• rewrite the 3 equations cleanly\n• capture any emphasized words or phrases\n• open the textbook and locate where those equations live\n\nWhen nothing is uploaded, this routine becomes your lifeline."
  },
  {
    title: "5) When nothing is posted: The most realistic student-side solution",
    content: "If slides will not be posted, trying to change that may fail. The faster approach is building student-generated materials.\n\nA three-step system:\n\nStep 1: Cohort shared notes\n• create one shared Google Doc organized by lecture date\n• right after class, each person posts 3 equations they remember\n• delete duplicates and keep the cleanest versions\n• assign one editor who cleans the document once per week\n\nStep 2: Textbook-based replacement slides\n• convert each Halliday chapter into small nodes\n• whenever wording or symbols match what you saw in class, flag those nodes as high priority\n\nStep 3: A problem-solving library\n• pick 10 representative problem types per chapter\n• keep short solutions (even rough is better than nothing)\n• before exams, repeat these 10 until setups feel automatic"
  },
  {
    title: "6) Email protocol: One strong message instead of many",
    content: "If fewer emails are preferred, send fewer and make them stronger.\nUse BLUF (Bottom Line Up Front):\n• request\n• what you already checked\n• one specific question\n• one action you want\n\nSubject example:\n[PHYS 1212] Caitlyn Lee 1234 Ch15 question: phase sign convention\n\nBody example:\nHello Professor,\nI reviewed Chapter 15 and my notes from the last lecture. I am still confused about the sign convention for phase when x(0) and v(0) are given. Could you confirm whether we should express the solution using cosine with a phase shift, or sine with a different phase, for consistency in this course?\nIf possible, I can join a short Zoom office hour to clarify this in 10 minutes.\nThank you,"
  },
  {
    title: "7) Zoom office hours: Bring only two goals",
    content: "Zoom time can be short. Use rules:\n\n• limit yourself to 2 questions\n• pre-open what you will screen share\n• after each answer, confirm understanding in one sentence\n\nThis protects efficiency for both sides."
  },
  {
    title: "8) Exam prep operations: When lectures are thin, go test-driven",
    content: "Minimum routine:\n• pick 10 representative problems per chapter\n• solve and check\n• repeat after two days\n• repeat weak types three times\n\nStudy group rules:\n• each person brings 2 problems\n• explain out loud\n• peers catch wrong steps immediately\n• end with a weak-type list only"
  },
  {
    title: "9) Wording rules so this never reads like gossip",
    content: "Keep the framing as adaptation, not criticism.\nPreferred wording:\n\n• strict → consistent standards\n• cold → concise, task-focused communication\n• bad lecturing → strength in compressed delivery rather than extended explanation"
  },
  {
    title: "10) Final line",
    content: "This course may not be about waiting for perfect lectures. It may be about building a system that protects your performance.\nWe are not trying to change the instructor. We are upgrading the student-side protocol."
  }
];

export default function SurvivalManual() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-8">
      {/* Collapsed Bar */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 px-5 py-3.5 bg-neutral-900/80 border-l-4 border-[#FF358B] hover:bg-neutral-800/80 transition-all duration-200 group"
      >
        {/* Icon */}
        <div className="text-[#FF358B] transition-transform duration-200 group-hover:scale-110">
          {isExpanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          )}
        </div>

        {/* Title */}
        <span className="flex-1 text-left font-mono text-sm tracking-wide text-gray-200 group-hover:text-white transition-colors">
          📂 VOID INTEL: PHYSICS II SURVIVAL MANUAL
        </span>

        {/* Expand/Collapse Arrow */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="bg-neutral-900 border-l-4 border-[#FF358B]/30 px-6 py-6 space-y-6 animate-fade-in">
          {manualSections.map((section, index) => (
            <div key={index} className="space-y-2">
              {/* Section Title */}
              <h3 className="font-mono text-sm font-semibold tracking-wide text-[#FF358B]">
                {section.title}
              </h3>

              {/* Section Content */}
              <div className="text-xs leading-relaxed text-gray-300 whitespace-pre-line font-light">
                {section.content}
              </div>

              {/* Divider (except for last item) */}
              {index < manualSections.length - 1 && (
                <div className="pt-4">
                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>
              )}
            </div>
          ))}

          {/* Footer Note */}
          <div className="pt-4 border-t border-white/10">
            <p className="text-xs text-gray-500 italic text-center">
              End of briefing. Adapt, prepare, and execute. 🎯
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
