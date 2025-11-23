import React, { useState } from 'react';
import { UserSettings, YouTubeSummary } from '../types';
import { summarizeVideoTopic } from '../services/geminiService';
import { Search, Youtube, Loader2, Play, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Props {
  settings: UserSettings;
}

const YouTubeAssistant: React.FC<Props> = ({ settings }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<YouTubeSummary | null>(null);

  const handleSearch = async () => {
    if (!query.trim() || !settings.apiKey) return;
    setLoading(true);
    setResult(null);
    try {
      const summary = await summarizeVideoTopic(query, settings.apiKey);
      setResult(summary);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center justify-center gap-2">
          <Youtube className="w-8 h-8 text-rose-500" />
          Pencarian & Rangkuman Video
        </h1>
        <p className="text-slate-500">Cari topik, dapatkan video relevan, dan rangkuman instan dari AI.</p>
      </div>

      {/* Search Box */}
      <div className="bg-white p-2 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-2 max-w-2xl mx-auto mb-12">
        <div className="pl-4">
          <Search className="w-5 h-5 text-slate-400" />
        </div>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Masukkan topik atau judul video..." 
          className="flex-1 py-3 px-2 outline-none text-slate-700 placeholder:text-slate-400"
        />
        <button 
          onClick={handleSearch}
          disabled={loading || !query}
          className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2.5 rounded-xl font-medium transition-colors disabled:bg-slate-300"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Cari & Rangkum'}
        </button>
      </div>

      {/* Result Card */}
      {loading && (
        <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
           <div className="aspect-video bg-slate-200 rounded-xl w-full"></div>
           <div className="h-4 bg-slate-200 rounded w-3/4"></div>
           <div className="h-20 bg-slate-200 rounded w-full"></div>
        </div>
      )}

      {result && (
        <div className="grid md:grid-cols-3 gap-8 items-start">
           {/* Video Column */}
           <div className="md:col-span-1 space-y-4">
              <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden relative group shadow-md">
                 <img src={result.thumbnail} alt="thumb" className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50">
                       <Play className="w-5 h-5 text-white fill-current ml-1" />
                    </div>
                 </div>
              </div>
              <h3 className="font-bold text-slate-800 leading-tight">{result.title}</h3>
              <div className="text-xs font-mono text-slate-400 bg-slate-50 p-2 rounded border border-slate-100">
                ID: {result.videoId}
              </div>
           </div>

           {/* Summary Column */}
           <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                 <FileText className="w-5 h-5 text-primary" />
                 <h2 className="font-bold text-lg text-slate-800">Rangkuman AI</h2>
              </div>

              <div className="space-y-8">
                 <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Pendahuluan</h3>
                    <div className="text-slate-700 leading-relaxed">
                       <ReactMarkdown>{result.summary.intro}</ReactMarkdown>
                    </div>
                 </div>
                 
                 <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Konsep Inti</h3>
                    <div className="text-slate-700 leading-relaxed p-4 bg-teal-50 rounded-xl border border-teal-100">
                       <ReactMarkdown>{result.summary.concepts}</ReactMarkdown>
                    </div>
                 </div>

                 <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Contoh & Aplikasi</h3>
                    <div className="text-slate-700 leading-relaxed">
                       <ReactMarkdown>{result.summary.examples}</ReactMarkdown>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeAssistant;
