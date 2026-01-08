import { physicsData } from '@/data/physicsData';
import FormulaSearch from '@/components/FormulaSearch';

export default function FormulasPage() {
  // Collect all formulas from all chapters
  const allFormulas = physicsData.chapters.flatMap(chapter => 
    chapter.formulas.map(formula => ({
      ...formula,
      chapterNumber: chapter.number,
      chapterTitle: chapter.title,
    }))
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Formula Sheet</h1>
        <p className="text-gray-600">
          Search and browse all formulas with textbook references and related practice problems.
          Click on any formula to see its details and related examples.
        </p>
      </div>

      <FormulaSearch formulas={allFormulas} />
    </div>
  );
}
