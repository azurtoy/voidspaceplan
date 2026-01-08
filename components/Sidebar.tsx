'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Chapter {
  number: number;
  title: string;
  path: string;
}

const chapters: Chapter[] = [
  // Oscillations & Waves
  { number: 15, title: "Oscillations", path: "/chapter/15" },
  { number: 16, title: "Waves - I", path: "/chapter/16" },
  { number: 17, title: "Waves - II", path: "/chapter/17" },
  
  // Thermodynamics
  { number: 18, title: "Temperature, Heat, and First Law", path: "/chapter/18" },
  { number: 19, title: "Kinetic Theory of Gases", path: "/chapter/19" },
  { number: 20, title: "Entropy and Second Law", path: "/chapter/20" },
  
  // Electromagnetism
  { number: 21, title: "Coulomb's Law", path: "/chapter/21" },
  { number: 22, title: "Electric Fields", path: "/chapter/22" },
  { number: 23, title: "Gauss' Law", path: "/chapter/23" },
  { number: 24, title: "Electric Potential", path: "/chapter/24" },
  { number: 25, title: "Capacitance", path: "/chapter/25" },
  { number: 26, title: "Current and Resistance", path: "/chapter/26" },
  { number: 27, title: "Circuits", path: "/chapter/27" },
  { number: 28, title: "Magnetic Fields", path: "/chapter/28" },
  { number: 29, title: "Magnetic Fields Due to Currents", path: "/chapter/29" },
  { number: 30, title: "Induction and Inductance", path: "/chapter/30" },
  { number: 31, title: "Electromagnetic Oscillations", path: "/chapter/31" },
  
  // Optics
  { number: 34, title: "Images", path: "/chapter/34" },
  { number: 35, title: "Interference", path: "/chapter/35" },
  { number: 36, title: "Diffraction", path: "/chapter/36" },
];

const sectionHeaders = [
  { title: "Oscillations & Waves", chapters: [15, 16, 17] },
  { title: "Thermodynamics", chapters: [18, 19, 20] },
  { title: "Electromagnetism", chapters: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] },
  { title: "Optics", chapters: [34, 35, 36] },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 px-4 py-3">
        <h1 className="text-lg font-bold text-gray-800">Physics II</h1>
        <p className="text-xs text-gray-500">Halliday 12th Edition</p>
      </div>

      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 overflow-y-auto pt-16 lg:pt-0 z-40">
        <div className="p-6 border-b border-gray-200 hidden lg:block">
          <Link href="/">
            <h1 className="text-xl font-bold text-gray-800 mb-1">Physics II</h1>
            <p className="text-sm text-gray-500">Halliday 12th Ed.</p>
          </Link>
        </div>

        <nav className="p-4">
          {/* Formula Sheet Link */}
          <Link
            href="/formulas"
            className={`block px-4 py-2.5 mb-4 rounded-lg font-medium transition-colors ${
              pathname === '/formulas'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            📋 Formula Sheet
          </Link>

          {/* Chapters by Section */}
          {sectionHeaders.map((section) => (
            <div key={section.title} className="mb-6">
              <h3 className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {chapters
                  .filter(ch => section.chapters.includes(ch.number))
                  .map((chapter) => (
                    <li key={chapter.number}>
                      <Link
                        href={chapter.path}
                        className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                          pathname === chapter.path
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="font-medium">Ch. {chapter.number}</span>
                        <span className="ml-2">{chapter.title}</span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
