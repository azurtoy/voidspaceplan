'use client';

import { useState } from 'react';

interface CourseCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  href?: string;
}

export default function CourseCard({ title, subtitle, description, icon, href }: CourseCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="paper-card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left"
      >
        <div className="flex items-start gap-4">
          <div className="text-5xl">{icon}</div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-lca-pink transition-colors">
              {title}
            </h3>
            <p className="text-sm text-lca-pink font-medium mb-2">{subtitle}</p>
            <p className="text-gray-600">{description}</p>
          </div>
          <div className="text-gray-400">
            <svg
              className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-gray-700 mb-4">
            {description}
          </p>
          {href && (
            <a
              href={href}
              className="btn btn-primary inline-flex items-center gap-2"
            >
              Enter Course →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
