'use client';

import Link from 'next/link';
import { physicsData } from '@/data/physicsData';
import SurvivalManual from '@/components/SurvivalManual';
import DataUplinks from '@/components/DataUplinks';
import DashboardChat from '@/components/DashboardChat';

export default function StudyPage() {
  return (
    <div className="p-8 lg:p-16">
      
      {/* Glass Panel Container */}
      <div className="max-w-5xl mx-auto bg-black/40 backdrop-blur-md border border-white/10 p-8 lg:p-12 rounded-lg">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 border-2 border-[#FF358B] rounded-full">
            <div className="w-3 h-3 bg-[#FF358B] rounded-full shadow-[0_0_15px_#FF358B]" />
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-light tracking-[0.3em] text-white mb-4">
            PHYSICS II
          </h1>
          
          {/* Description */}
          <div className="text-sm text-gray-200 leading-relaxed max-w-3xl mx-auto mb-4">
            <p>Unofficial survival guide for the Physics II crew.{' '}
            <span className="text-[#FF358B]">
              Strictly for our current cohort—please keep the passcode secure.
            </span>{' '}
            Built by a student, for students. Expect typos, missing sections, and occasional chaos—use at your own risk. 
            &quot;All models are wrong, but some are useful.&quot; (Alpha Stage / Starting from Ch.15)</p>
            <p className="text-xs text-gray-400 mt-2">— DCEK</p>
          </div>

          {/* Welcome Message */}
          <div className="mt-6 inline-block">
            <p className="text-xs text-[#FF358B] font-light tracking-[0.2em]">
              ◆ WELCOME, COMMANDER ◆
            </p>
          </div>
        </div>

        {/* Survival Manual */}
        <div className="mb-8">
          <SurvivalManual />
        </div>

        {/* Data Uplinks */}
        <div className="mb-8">
          <DataUplinks />
        </div>

        {/* Live Chat */}
        <div className="mb-12 p-6 bg-white/5 border border-white/10 rounded">
          <DashboardChat />
        </div>

        {/* Mission Control */}
        <div className="mb-8">
          <h2 className="text-sm font-light tracking-[0.3em] text-gray-300 mb-4">
            MISSION CONTROL
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              href="/study/formulas"
              className="p-4 bg-white/5 border border-white/10 rounded hover:border-[#FF358B] hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[#FF358B]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <h3 className="text-sm font-light text-white group-hover:text-[#FF358B] transition-colors">
                  Formula Database
                </h3>
              </div>
              <p className="text-xs text-gray-200 pl-7">Quick reference for all formulas</p>
            </Link>

            <Link 
              href="/study/15"
              className="p-4 bg-white/5 border border-white/10 rounded hover:border-[#FF358B] hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-[#FF358B] rounded-full shadow-[0_0_8px_#FF358B]" />
                <h3 className="text-sm font-light text-white group-hover:text-[#FF358B] transition-colors">
                  Begin Mission
                </h3>
              </div>
              <p className="text-xs text-gray-200 pl-5">Ch 15. Oscillations</p>
            </Link>
          </div>
        </div>

        {/* Chapter Grid */}
        <div>
          <h2 className="text-sm font-light tracking-[0.3em] text-gray-300 mb-4">
            ALL CHAPTERS
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {physicsData.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/study/${chapter.id}`}
                className="p-4 bg-white/5 border border-white/10 rounded hover:border-[#FF358B] hover:bg-white/10 transition-all duration-300 text-center group"
              >
                <div className="text-2xl font-light text-[#FF358B] mb-2">
                  {chapter.id}
                </div>
                <div className="text-xs text-gray-200 font-light group-hover:text-white transition-colors">
                  {chapter.title.replace(/^Ch \d+\.\s*/, '')}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
