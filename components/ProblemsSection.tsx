'use client';

import { Problem, Formula } from '@/types/physics';
import ProblemAccordion from './ProblemAccordion';

interface ProblemsSectionProps {
  problems: Problem[];
  formulas: Formula[];
}

export default function ProblemsSection({ problems, formulas }: ProblemsSectionProps) {
  return (
    <div id="problems">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Practice Problems</h2>
      <div className="space-y-4">
        {problems.map((problem) => (
          <ProblemAccordion key={problem.id} problem={problem} formulas={formulas} />
        ))}
      </div>
    </div>
  );
}
