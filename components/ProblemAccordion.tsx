'use client';

import { useState } from 'react';
import { Problem, Formula } from '@/types/physics';
import Link from 'next/link';

interface ProblemAccordionProps {
  problem: Problem;
  formulas: Formula[];
}

export default function ProblemAccordion({ problem, formulas }: ProblemAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const usedFormulas = formulas.filter(f => problem.usedFormulaIds.includes(f.id));

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="mb-4" id={`problem-${problem.id}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="accordion-button"
      >
        <div className="flex items-center gap-3 flex-1">
          <span className="font-semibold text-gray-800">
            Problem {problem.problemNumber}
          </span>
          {problem.difficulty && (
            <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(problem.difficulty)}`}>
              {problem.difficulty}
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
            <p className="text-gray-800">{problem.question}</p>
          </div>

          {/* Given Information */}
          {problem.given && problem.given.length > 0 && (
            <div className="mb-4 bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Given:</h4>
              <ul className="list-disc list-inside space-y-1">
                {problem.given.map((item, idx) => (
                  <li key={idx} className="text-blue-800 text-sm">{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Solution */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Solution:</h4>
            <ol className="list-decimal list-inside space-y-2">
              {problem.solution.steps.map((step, idx) => (
                <li key={idx} className="text-gray-700 ml-4">{step}</li>
              ))}
            </ol>
          </div>

          {/* Final Answer */}
          <div className="mb-4 bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <h4 className="text-sm font-semibold text-green-900 mb-1">Final Answer:</h4>
            <p className="text-green-800 font-medium">{problem.solution.finalAnswer}</p>
          </div>

          {/* Used Formulas */}
          {usedFormulas.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Formulas Used:</h4>
              <div className="flex flex-wrap gap-2">
                {usedFormulas.map((formula) => (
                  <Link
                    key={formula.id}
                    href={`#formula-${formula.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const formulaElement = document.getElementById(`formula-${formula.id}`);
                      if (formulaElement) {
                        formulaElement.scrollIntoView({ behavior: 'smooth' });
                        // Highlight effect
                        formulaElement.classList.add('ring-2', 'ring-blue-400');
                        setTimeout(() => {
                          formulaElement.classList.remove('ring-2', 'ring-blue-400');
                        }, 2000);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <span className="font-medium">{formula.name}</span>
                    <span className="text-xs text-gray-500">
                      (Ch.{formula.textbookRef.chapter} p.{formula.textbookRef.page})
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
