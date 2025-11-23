import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ModuleOutline, UserSettings, QuizQuestion } from '../lib/types';
import { generateModuleContent, generateQuiz } from '../services/geminiService';
import { BookOpen, CheckCircle, Loader2, PlayCircle, Award, Lock } from 'lucide-react';
import QuizView from './QuizView';

interface Props {
  modules: ModuleOutline[];
  settings: UserSettings;
  updateModuleStatus: (index: number, status: ModuleOutline['status'], content?: string) => void;
}

type ViewMode = 'content' | 'quiz';

const CourseGenerator: React.FC<Props> = ({ modules, settings, updateModuleStatus }) => {
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<ViewMode>('content');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  // Auto-generate the first module if pending
  useEffect(() => {
    if (modules.length > 0 && modules[0].status === 'pending') {
      handleGenerateContent(0);
    }
  }, [modules]);

  const handleGenerateContent = async (index: number) => {
    if (!settings.apiKey) return;
    updateModuleStatus(index, 'generating');
    try {
      const content = await generateModuleContent(
        settings.topic,
        modules[index].title,
        settings.level,
        settings.language,
        settings.apiKey
      );
      updateModuleStatus(index, 'completed', content);
    } catch (e) {
      updateModuleStatus(index, 'error');
    }
  };

  const handleStartQuiz = async () => {
    if (!settings.apiKey) return;
    setLoadingQuiz(true);
    setViewMode('quiz');
    
    try {
      const questions = await generateQuiz(modules[activeModuleIndex].title, settings.apiKey);
      setQuizQuestions(questions);
    } catch (error) {
      console.error("Failed to generate quiz", error);
      setViewMode('content'); // Revert on error
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleQuizPass = () => {
    // Logic to mark as strictly passed could go here (e.g., updating a 'passed' status in module)
    // For now, we unlock/move to the next module
    const nextIdx = activeModuleIndex + 1;
    if (nextIdx < modules.length) {
      setActiveModuleIndex(nextIdx);
      setViewMode('content');
      setQuizQuestions([]);
      if (modules[nextIdx].status === 'pending') {
        handleGenerateContent(nextIdx);
      }
    } else {
      alert("🎉 Selamat! Anda telah menyelesaikan seluruh kurikulum ini.");
      setViewMode('content');
    }
  };

  const activeModule = modules[activeModuleIndex];

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden bg-slate-50">
      
      {/* Sidebar / Syllabus */}
      <div className="w-full md:w-80 bg-white border-r border-slate-200 overflow-y-auto flex-shrink-0 z-10">
        <div className="p-5 border-b border-slate-100 bg-slate-50/80 backdrop-blur">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Kurikulum
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">{settings.topic}</p>
        </div>
        <div className="p-3 space-y-2">
          {modules.map((m, idx) => {
             // Simple logic: locked if previous not completed (or generated)
             const isLocked = idx > 0 && modules[idx-1].status !== 'completed';
             // Ideally we check if quiz passed, but for MVP checking content status is okay
             
             return (
              <button
                key={idx}
                onClick={() => !isLocked && setActiveModuleIndex(idx)}
                disabled={isLocked}
                className={`w-full text-left p-3 rounded-xl text-sm transition-all flex items-start gap-3 group
                  ${idx === activeModuleIndex 
                    ? 'bg-teal-50 border border-teal-200 shadow-sm' 
                    : isLocked 
                      ? 'opacity-50 cursor-not-allowed bg-slate-50' 
                      : 'hover:bg-slate-50 border border-transparent hover:border-slate-200'}
                `}
              >
                <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border shrink-0 transition-colors
                  ${m.status === 'completed' 
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                    : m.status === 'generating' 
                      ? 'bg-amber-100 text-amber-700 border-amber-200 animate-pulse'
                      : isLocked
                        ? 'bg-slate-100 text-slate-400 border-slate-200'
                        : 'bg-white text-slate-500 border-slate-300 group-hover:border-primary'}
                `}>
                  {m.status === 'completed' ? <CheckCircle className="w-3.5 h-3.5" /> : isLocked ? <Lock className="w-3 h-3" /> : idx + 1}
                </div>
                <div className="min-w-0">
                  <span className={`font-semibold block truncate ${idx === activeModuleIndex ? 'text-primary' : 'text-slate-700'}`}>
                    {m.title}
                  </span>
                  <span className="text-[10px] text-slate-400 capitalize flex items-center gap-1">
                    {m.status === 'generating' ? 'Menulis...' : m.status === 'pending' ? 'Belum dimulai' : 'Selesai'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Editor / Viewer */}
      <div className="flex-1 overflow-y-auto bg-slate-50 relative scroll-smooth">
        {activeModule && (
          <div className="min-h-full">
            {/* View Mode: Content */}
            {viewMode === 'content' && (
              <div className="max-w-4xl mx-auto p-6 md:p-12 animate-in fade-in duration-500">
                <div className="mb-8 border-b border-slate-200 pb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary tracking-wider uppercase border border-primary/20">
                        Module {activeModule.index}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                         {settings.level} Level
                      </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 leading-tight">
                      {activeModule.title}
                    </h1>
                </div>

                {/* Content Logic */}
                {activeModule.status === 'pending' && (
                  <div className="py-20 flex flex-col items-center justify-center text-center">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                        <BookOpen className="w-8 h-8 text-slate-300" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-700 mb-2">Materi Belum Tersedia</h3>
                      <p className="text-slate-500 mb-8 max-w-md">Dosen AI siap menulis materi tingkat expert untuk topik ini. Klik tombol di bawah untuk memulai.</p>
                      <button 
                        onClick={() => handleGenerateContent(activeModuleIndex)}
                        className="bg-primary hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-teal-900/20 flex items-center gap-2 group"
                      >
                        <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Generate Materi
                      </button>
                  </div>
                )}

                {activeModule.status === 'generating' && (
                  <div className="space-y-8 animate-pulse max-w-2xl mx-auto py-12">
                      <div className="flex items-center justify-center gap-3 mb-8 text-primary font-bold">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Sedang menyusun materi akademik...
                      </div>
                      <div className="h-4 bg-slate-200 rounded w-full"></div>
                      <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                      <div className="h-4 bg-slate-200 rounded w-full"></div>
                      <div className="h-32 bg-slate-200 rounded-xl mt-8"></div>
                      <div className="h-4 bg-slate-200 rounded w-4/6"></div>
                  </div>
                )}

                {activeModule.status === 'error' && (
                  <div className="p-6 bg-rose-50 text-rose-800 rounded-2xl border border-rose-200 flex flex-col items-center gap-4 text-center">
                    <p className="font-bold">⚠️ Terjadi kesalahan saat menghubungi API.</p>
                    <button onClick={() => handleGenerateContent(activeModuleIndex)} className="underline hover:text-rose-900">Coba Lagi</button>
                  </div>
                )}

                {activeModule.status === 'completed' && activeModule.content && (
                  <>
                    <div className="markdown-body prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-slate-900 prose-a:text-primary prose-code:text-secondary">
                      <ReactMarkdown>{activeModule.content}</ReactMarkdown>
                    </div>
                    
                    <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50 rounded-2xl p-6 border border-slate-100">
                       <div>
                          <h4 className="font-bold text-slate-800">Selesaikan Module Ini</h4>
                          <p className="text-sm text-slate-500">Ambil ujian singkat untuk membuktikan kompetensi.</p>
                       </div>
                       <button 
                         onClick={handleStartQuiz}
                         className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all transform hover:-translate-y-0.5"
                       >
                         <Award className="w-5 h-5 text-accent" />
                         Ambil Ujian (Expert Exam)
                       </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* View Mode: Quiz */}
            {viewMode === 'quiz' && (
              <div className="animate-in slide-in-from-right duration-300">
                <QuizView 
                  questions={quizQuestions} 
                  loading={loadingQuiz} 
                  onPass={handleQuizPass}
                  onRetry={() => {
                     setQuizQuestions([]); 
                     handleStartQuiz();
                  }}
                />
                {!loadingQuiz && (
                  <button 
                    onClick={() => setViewMode('content')} 
                    className="fixed top-24 left-6 md:left-auto md:right-12 text-sm text-slate-500 hover:text-slate-800 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 z-50"
                  >
                    ← Kembali ke Materi
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseGenerator;