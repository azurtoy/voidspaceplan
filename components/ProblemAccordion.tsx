'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface ProblemAccordionProps {
  problem: any;
  formulas: any[];
  index: number;
}

export default function ProblemAccordion({ problem, formulas, index }: ProblemAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getDifficultyColor = (difficulty?: number) => {
    if (!difficulty) return 'bg-gray-100 text-gray-700';
    if (difficulty <= 2) return 'bg-green-100 text-green-700';
    if (difficulty <= 3) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const getDifficultyLabel = (difficulty?: number) => {
    if (!difficulty) return 'medium';
    if (difficulty <= 2) return 'easy';
    if (difficulty <= 3) return 'medium';
    return 'hard';
  };

  return (
    <div className="mb-4" id={`problem-${index}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="accordion-button"
      >
        <div className="flex items-center gap-3 flex-1">
          <span className="font-semibold text-gray-800">
            Problem {index + 1}
          </span>
          {problem.difficulty && (
            <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(problem.difficulty)}`}>
              {getDifficultyLabel(problem.difficulty)}
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="accordion-content">
          {/* Question */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Question:</h4>
            <div className="text-gray-800 prose prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {problem.q}
              </ReactMarkdown>
            </div>
          </div>

          {/* Solution */}
          <div className="mb-4 bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Solution:</h4>
            <div className="text-gray-700 prose prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {problem.a}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
