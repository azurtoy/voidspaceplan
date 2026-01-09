import { physicsData } from '@/data/physicsData';
import { notFound } from 'next/navigation';
import FormulaCard from '@/components/FormulaCard';
import ProblemsSection from '@/components/ProblemsSection';
import Image from 'next/image';

interface ChapterPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { id } = await params;
  const chapterId = id;
  
  const chapter = physicsData.find(ch => ch.id === chapterId);

  if (!chapter) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Chapter Header */}
      <div className="mb-10">
        <div className="text-sm text-lca-pink font-semibold mb-2">
          CHAPTER {chapter.id}
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {chapter.title}
        </h1>

        <div className="paper-card bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Chapter Overview</h2>
          <p className="text-gray-700 leading-relaxed">{chapter.summary}</p>
        </div>
      </div>

      {/* Key Formulas Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Key Formulas</h2>
        <p className="text-gray-600 mb-6">
          Essential formulas for this chapter.
        </p>
        <div>
          {chapter.formulas.map((formula, idx) => (
            <FormulaCard key={idx} formula={formula} />
          ))}
        </div>
      </div>

      {/* Practice Problems Section */}
      {chapter.problems.length > 0 && (
        <div className="mb-12">
          <ProblemsSection problems={chapter.problems} formulas={chapter.formulas} />
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-center items-center pt-8 border-t border-gray-200 mb-12">
        <a
          href="/study"
          className="btn btn-secondary"
        >
          ← Back to Study Dashboard
        </a>
      </div>

      {/* Comments Section - Placeholder for Phase 3 */}
      <div className="text-center py-8 border-t border-gray-200">
        <p className="text-gray-500 text-sm">
          Comments system initializing... (Phase 3)
        </p>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return physicsData.map((chapter) => ({
    id: chapter.id,
  }));
}
