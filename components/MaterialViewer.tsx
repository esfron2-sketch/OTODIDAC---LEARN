import React, { useState } from 'react';
import { Material, Section } from '@/lib/types';
import { ChevronRight, PlayCircle, CheckCircle } from 'lucide-react';

interface Props {
  material: Material;
}

export default function MaterialViewer({ material }: Props) {
  const [activeSectionId, setActiveSectionId] = useState<string>(material.sections[0]?.id);
  
  const activeSection = material.sections.find(s => s.id === activeSectionId) || material.sections[0];

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden bg-main">
      {/* TOC Sidebar (Left) */}
      <div className="w-full lg:w-72 bg-surface border-r border-gray-800 overflow-y-auto shrink-0">
        <div className="p-5 border-b border-gray-800">
          <h2 className="text-sm font-bold text-muted uppercase tracking-wider">Table of Contents</h2>
          <p className="text-light font-bold mt-1 line-clamp-2">{material.title}</p>
        </div>
        <div className="p-2">
          {material.sections.map((section, idx) => (
            <button
              key={section.id}
              onClick={() => setActiveSectionId(section.id)}
              className={`w-full text-left p-3 rounded-lg mb-1 flex items-start text-sm transition-all
                ${activeSectionId === section.id 
                  ? 'bg-primary/20 text-light border border-primary/30' 
                  : 'text-muted hover:bg-card hover:text-light'}
              `}
            >
              <span className="mr-3 text-xs font-mono opacity-50 mt-0.5">{idx + 1}.</span>
              <span className="line-clamp-2">{section.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content (Right) */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center text-xs text-muted mb-6">
            <span>Library</span>
            <ChevronRight size={14} className="mx-2" />
            <span className="truncate max-w-[150px]">{material.title}</span>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-primary">{activeSection.title}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-light mb-6">
            {activeSection.title}
          </h1>

          {/* Content Render */}
          <div 
            className="prose prose-invert prose-lg max-w-none text-gray-300
              prose-headings:text-light prose-strong:text-secondary prose-a:text-primary
              prose-code:text-secondary prose-code:bg-card prose-code:px-1 prose-code:rounded
              prose-blockquote:border-l-primary prose-blockquote:bg-surface/50 prose-blockquote:py-1
            "
            dangerouslySetInnerHTML={{ __html: activeSection.contentHtml }}
          />

          {/* Interactive Exercises */}
          {activeSection.exercises && activeSection.exercises.length > 0 && (
            <div className="mt-12 bg-card rounded-xl border border-gray-800 p-6">
              <h3 className="text-xl font-bold text-light mb-4 flex items-center">
                <CheckCircle className="text-secondary mr-2" />
                Quick Check
              </h3>
              <div className="space-y-4">
                {activeSection.exercises.map((ex) => (
                  <div key={ex.id} className="p-4 bg-surface rounded-lg border border-gray-700">
                    <p className="font-medium text-light mb-3">{ex.question}</p>
                    {ex.options && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {ex.options.map((opt, i) => (
                          <button key={i} className="px-4 py-2 text-left text-sm rounded border border-gray-700 hover:border-primary hover:bg-primary/10 transition-colors">
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video Integration */}
          {activeSection.videoSuggestions && activeSection.videoSuggestions.length > 0 && (
             <div className="mt-8">
               <h4 className="text-sm font-bold text-muted uppercase mb-4">Recommended Videos</h4>
               <div className="grid gap-4 md:grid-cols-2">
                 {activeSection.videoSuggestions.map(vid => (
                   <div key={vid.youtubeId} className="flex items-center p-3 bg-surface rounded-lg border border-gray-800 hover:border-primary cursor-pointer group">
                     <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3 group-hover:bg-primary group-hover:text-white transition-colors">
                       <PlayCircle size={20} />
                     </div>
                     <div>
                       <p className="text-sm font-medium text-light line-clamp-1">{vid.title}</p>
                       <p className="text-xs text-muted">Starts at {Math.floor(vid.timestampStart / 60)}:{(vid.timestampStart % 60).toString().padStart(2, '0')}</p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}