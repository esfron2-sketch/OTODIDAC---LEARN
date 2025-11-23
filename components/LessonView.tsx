import React from 'react';
import ReactMarkdown from 'react-markdown';
import { RoadmapItem } from '../types';
import { PlayCircle, BookOpen } from 'lucide-react';

interface Props {
  roadmapItem: RoadmapItem;
  content: string;
  loading: boolean;
  onComplete: () => void;
}

const LessonView: React.FC<Props> = ({ roadmapItem, content, loading, onComplete }) => {
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-8 space-y-6 animate-pulse">
        <div className="h-12 bg-slate-200 rounded-lg w-3/4"></div>
        <div className="h-4 bg-slate-200 rounded w-full"></div>
        <div className="h-4 bg-slate-200 rounded w-full"></div>
        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
        <div className="h-64 bg-slate-100 rounded-xl mt-8"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12">
      <div className="mb-8 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-primary font-bold tracking-wider text-xs uppercase mb-2">
            <BookOpen className="w-4 h-4" />
            <span>Chapter {roadmapItem.id}</span>
        </div>
        <h1 className="text-4xl font-serif font-bold text-slate-900 mt-2">{roadmapItem.title}</h1>
      </div>
      
      <div className="markdown-body font-sans text-lg leading-relaxed text-slate-700">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>

      <div className="mt-12 pt-8 border-t border-slate-200 flex justify-end">
        <button
          onClick={onComplete}
          className="flex items-center gap-2 bg-primary hover:bg-teal-800 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-teal-100 transition-all transform hover:-translate-y-0.5"
        >
          <PlayCircle className="w-5 h-5" />
          Lanjut ke Ujian (Expert Exam)
        </button>
      </div>
    </div>
  );
};

export default LessonView;