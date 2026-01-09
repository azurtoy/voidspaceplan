'use client';

import ProblemAccordion from './ProblemAccordion';

interface ProblemsSectionProps {
  problems: any[];
  formulas: any[];
}

export default function ProblemsSection({ problems, formulas }: ProblemsSectionProps) {
  return (
    <div id="problems">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Practice Problems</h2>
      <div className="space-y-4">
        {problems.map((problem, idx) => (
          <ProblemAccordion key={idx} problem={problem} formulas={formulas} index={idx} />
        ))}
      </div>
    </div>
  );
}
