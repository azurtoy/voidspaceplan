'use client';

import { Globe, BookOpen, FileText, Calculator } from 'lucide-react';

interface UplinkItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  link: string;
  type: 'external' | 'file';
}

const uplinks: UplinkItem[] = [
  {
    id: 'course-site',
    label: 'D2L / Course Site',
    icon: <Globe className="w-5 h-5" />,
    link: 'https://mycourselink.lakeheadu.ca/',
    type: 'external'
  },
  {
    id: 'wileyplus',
    label: 'WileyPLUS',
    icon: <BookOpen className="w-5 h-5" />,
    link: 'https://www.wileyplus.com',
    type: 'external'
  },
  {
    id: 'course-outline',
    label: 'Course Outline',
    icon: <FileText className="w-5 h-5" />,
    link: '/PHYS1212outline2026.pdf',
    type: 'file'
  },
  {
    id: 'formula-sheet',
    label: 'Formula Sheet',
    icon: <Calculator className="w-5 h-5" />,
    link: '/study/formulas',
    type: 'external'
  }
];

export default function DataUplinks() {
  const handleClick = (item: UplinkItem) => {
    if (item.type === 'file') {
      // Open file in new tab
      window.open(item.link, '_blank');
    } else {
      // Open external link in new tab
      window.open(item.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="mb-4">
        <p className="text-xs font-mono tracking-widest text-gray-500 uppercase">
          // SYSTEM UPLINKS
        </p>
      </div>

      {/* Grid of Uplink Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {uplinks.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item)}
            className="group relative flex flex-col items-center justify-center gap-3 px-4 py-5 bg-white/5 border border-white/10 hover:border-[#FF358B]/50 hover:bg-white/8 transition-all duration-300 overflow-hidden"
          >
            {/* Glow Effect on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF358B]/0 via-[#FF358B]/0 to-[#FF358B]/0 group-hover:from-[#FF358B]/5 group-hover:via-[#FF358B]/10 group-hover:to-[#FF358B]/5 transition-all duration-300" />

            {/* Icon */}
            <div className="relative z-10 text-gray-400 group-hover:text-[#FF358B] transition-colors duration-300 group-hover:scale-110 transform">
              {item.icon}
            </div>

            {/* Label */}
            <span className="relative z-10 text-xs font-light text-gray-300 group-hover:text-white transition-colors duration-300 text-center leading-tight">
              {item.label}
            </span>

            {/* Pulse Effect on Hover */}
            <div className="absolute inset-0 border border-[#FF358B]/0 group-hover:border-[#FF358B]/30 group-hover:animate-pulse transition-all duration-300" />
          </button>
        ))}
      </div>

      {/* Subtle Footer Hint */}
      <div className="mt-3 text-center">
        <p className="text-[10px] text-gray-600 font-mono">
          ⚡ Quick access to essential course resources
        </p>
      </div>
    </div>
  );
}
