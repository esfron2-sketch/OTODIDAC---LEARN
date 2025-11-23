import React from 'react';
import { RoadmapItem } from '../types';
import { CheckCircle, Lock, BookOpen } from 'lucide-react';

interface Props {
  roadmap: RoadmapItem[];
  activeItemId: number;
  onSelectItem: (id: number) => void;
}

const RoadmapSidebar: React.FC<Props> = ({ roadmap, activeItemId, onSelectItem }) => {
  return (
    <div className="w-full md:w-80 bg-white border-r border-slate-200 h-full overflow-y-auto flex-shrink-0 flex flex-col">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Syllabus
        </h2>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Kurikulum OT-LEARN</p>
      </div>
      <div className="p-4 space-y-3 flex-1">
        {roadmap.map((item) => {
          const isActive = item.id === activeItemId;
          return (
            <button
              key={item.id}
              onClick={() => !item.isLocked && onSelectItem(item.id)}
              disabled={item.isLocked}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group relative overflow-hidden
                ${isActive 
                  ? 'border-primary bg-teal-50 shadow-md ring-1 ring-primary/20' 
                  : item.isLocked 
                    ? 'border-slate-100 bg-slate-50 opacity-70 cursor-not-allowed' 
                    : 'border-slate-200 bg-white hover:border-primary/50 hover:shadow-sm'
                }
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                   <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide
                        ${isActive ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'}
                      `}>
                        Chapter {item.id}
                      </span>
                   </div>
                  <h3 className={`font-semibold text-sm ${isActive ? 'text-primary' : 'text-slate-700'}`}>
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <div className="mt-1">
                  {item.isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  ) : item.isLocked ? (
                    <Lock className="w-4 h-4 text-slate-400" />
                  ) : isActive ? (
                    <div className="w-5 h-5 rounded-full border-4 border-primary" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-primary" />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <div className="p-4 text-center border-t border-slate-100 bg-slate-50">
        <p className="text-[10px] text-slate-400">© 2025 OT-LEARN Platform</p>
      </div>
    </div>
  );
};

export default RoadmapSidebar;