import Link from 'next/link';
import { physicsData } from '@/data/physicsData';

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Physics II Self-Study Guide
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-2">
          Based on Halliday, Resnick & Walker&apos;s <em>Fundamentals of Physics</em>, 12th Edition
        </p>
        <p className="text-gray-500">
          A comprehensive resource for mastering physics with formulas, examples, and practice problems
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Link href="/formulas" className="paper-card group">
          <div className="text-4xl mb-4">📋</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
            Formula Sheet
          </h2>
          <p className="text-gray-600">
            Search and browse all formulas with textbook references and related examples
          </p>
        </Link>

        <Link href="/chapter/15" className="paper-card group">
          <div className="text-4xl mb-4">📚</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
            Start Learning
          </h2>
          <p className="text-gray-600">
            Begin with Chapter 15: Oscillations and explore step-by-step solutions
          </p>
        </Link>
      </div>

      {/* Available Chapters */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Chapters</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {physicsData.chapters.map((chapter) => (
            <Link
              key={chapter.number}
              href={`/chapter/${chapter.number}`}
              className="paper-card group"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm font-semibold text-blue-600">
                  Chapter {chapter.number}
                </span>
                <span className="text-xs text-gray-500">
                  {chapter.formulas.length} formulas · {chapter.problems.length} problems
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                {chapter.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div className="paper-card bg-blue-50 border-blue-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">About This Guide</h2>
        <div className="text-gray-700 space-y-2">
          <p>
            This website is designed to help you master Physics II concepts through:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Comprehensive formula sheets with variables and units</li>
            <li>Direct textbook page references for each concept</li>
            <li>Worked-out practice problems with step-by-step solutions</li>
            <li>Cross-referenced formulas and problems for efficient studying</li>
          </ul>
          <p className="mt-4 text-sm text-gray-600">
            Navigate using the sidebar to explore different chapters or use the formula sheet to search for specific equations.
          </p>
        </div>
      </div>
    </div>
  );
}
