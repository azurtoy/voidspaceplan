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
  const chapterNumber = parseInt(id);
  
  const chapter = physicsData.chapters.find(ch => ch.number === chapterNumber);

  if (!chapter) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Chapter Header */}
      <div className="mb-10">
        <div className="text-sm text-blue-600 font-semibold mb-2">
          CHAPTER {chapter.number}
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {chapter.title}
        </h1>
        
        {chapter.imageUrl && (
          <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={chapter.imageUrl}
              alt={chapter.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="paper-card bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Chapter Overview</h2>
          <p className="text-gray-700 leading-relaxed">{chapter.summary}</p>
        </div>
      </div>

      {/* Key Formulas Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Key Formulas</h2>
        <p className="text-gray-600 mb-6">
          All formulas include textbook page references and links to related practice problems.
        </p>
        <div>
          {chapter.formulas.map((formula) => (
            <FormulaCard key={formula.id} formula={formula} />
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
      <div className="flex justify-between items-center pt-8 border-t border-gray-200">
        <div>
          {chapterNumber > 15 && (
            <a
              href={`/chapter/${chapterNumber - 1}`}
              className="btn btn-secondary"
            >
              ← Previous Chapter
            </a>
          )}
        </div>
        <div>
          <a
            href="/formulas"
            className="btn btn-secondary"
          >
            📋 View All Formulas
          </a>
        </div>
        <div>
          {/* Add next chapter logic when more chapters are available */}
          <button disabled className="btn btn-secondary opacity-50 cursor-not-allowed">
            Next Chapter →
          </button>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return physicsData.chapters.map((chapter) => ({
    id: chapter.number.toString(),
  }));
}
