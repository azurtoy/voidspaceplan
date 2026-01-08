'use client';

import Giscus from '@giscus/react';
import { giscusConfig, contactEmail } from '@/config/giscus';

interface CommentsProps {
  chapterNumber: number;
  chapterTitle: string;
}

export default function Comments({ chapterNumber, chapterTitle }: CommentsProps) {
  const emailSubject = `Error Report - Chapter ${chapterNumber}: ${chapterTitle}`;
  const emailBody = `Hello,\n\nI found an error in Chapter ${chapterNumber}: ${chapterTitle}\n\nDetails:\n[Please describe the error here]\n\nPage section: [Specify where you found the error]\n\nThank you!`;
  
  return (
    <div className="mt-16 mb-12">
      {/* Error Report Button */}
      <div className="mb-6 flex justify-center">
        <a
          href={`mailto:${contactEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span className="text-lg">⚠️</span>
          <span>Found an error in this content?</span>
        </a>
      </div>

      {/* Giscus Comments */}
      <div className="paper-card">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Comments & Discussions
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Share your thoughts, ask questions, or provide feedback using GitHub Discussions below.
        </p>
        
        <Giscus
          id="comments"
          repo={giscusConfig.repo}
          repoId={giscusConfig.repoId}
          category={giscusConfig.category}
          categoryId={giscusConfig.categoryId}
          mapping="specific"
          term={`Chapter ${chapterNumber}: ${chapterTitle}`}
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme={giscusConfig.theme}
          lang={giscusConfig.lang}
          loading={giscusConfig.loading}
        />
      </div>

      {/* Setup Instructions */}
      <details className="mt-4 text-xs text-gray-500">
        <summary className="cursor-pointer hover:text-gray-700">
          🔧 Setup Instructions (Click to expand)
        </summary>
        <div className="mt-2 p-4 bg-gray-50 rounded-lg space-y-2">
          <p className="font-semibold">To enable comments, you need to:</p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Create a public GitHub repository for this project</li>
            <li>Enable GitHub Discussions in your repository settings</li>
            <li>Visit <a href="https://giscus.app" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">giscus.app</a></li>
            <li>Follow the setup wizard to get your repo ID and category ID</li>
            <li>Edit <code className="bg-gray-200 px-1 rounded">config/giscus.ts</code> with your values</li>
          </ol>
          <p className="mt-2 text-gray-600">
            Example: <code className="bg-gray-200 px-1 rounded">repo: &quot;username/physics-ii&quot;</code>
          </p>
        </div>
      </details>
    </div>
  );
}
