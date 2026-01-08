'use client';

import { Formula } from '@/types/physics';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import Link from 'next/link';

interface FormulaCardProps {
  formula: Formula;
  showRelatedProblems?: boolean;
}

export default function FormulaCard({ formula, showRelatedProblems = true }: FormulaCardProps) {
  return (
    <div className="paper-card mb-4" id={`formula-${formula.id}`}>
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {formula.name}
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="badge">
            Ch.{formula.textbookRef.chapter} p.{formula.textbookRef.page}
          </span>
          {formula.relatedProblemIds.length > 0 && (
            <span className="badge-outline">
              {formula.relatedProblemIds.length} related problem{formula.relatedProblemIds.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      <div className="formula-display">
        <BlockMath math={formula.latex} />
      </div>

      <p className="text-gray-600 mb-4">{formula.description}</p>

      {formula.variables && formula.variables.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Variables:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {formula.variables.map((variable, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">
                  {variable.symbol}
                </span>
                <span className="text-gray-600">
                  {variable.meaning}
                  {variable.unit && <span className="text-gray-400"> [{variable.unit}]</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showRelatedProblems && formula.relatedProblemIds.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <Link
            href={`#problems`}
            className="btn btn-secondary text-sm"
            onClick={(e) => {
              e.preventDefault();
              const problemsSection = document.getElementById('problems');
              if (problemsSection) {
                problemsSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            📚 View Related Examples ({formula.relatedProblemIds.length})
          </Link>
        </div>
      )}
    </div>
  );
}
