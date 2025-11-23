import React, { useState, useEffect } from 'react';
import { 
  AppState, 
  DashboardTab, 
  UserSettings, 
  ModuleOutline, 
} from './types';
import Onboarding from './components/Onboarding';
import CourseGenerator from './components/CourseGenerator';
import YouTubeAssistant from './components/YouTubeAssistant';
import { generateCourseOutline } from './services/geminiService';
import { 
  LayoutDashboard, 
  BookOpen, 
  Search, 
  Settings, 
  GraduationCap, 
  LogOut 
} from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.ONBOARDING);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.GENERATE);
  const [modules, setModules] = useState<ModuleOutline[]>([]);
  const [loading, setLoading] = useState(false);

  // Check for existing session key
  useEffect(() => {
    const savedKey = sessionStorage.getItem('ot_learn_key');
    if (savedKey) {
        // We still need topic, so we don't auto-login fully, 
        // but we could pre-fill if we had persistent storage for settings too.
        // For now, we strictly follow the Onboarding flow.
    }
  }, []);

  const handleStart = async (userSettings: UserSettings) => {
    setLoading(true);
    setSettings(userSettings);
    
    // Auto-generate outline immediately
    try {
      if (userSettings.apiKey) {
        const outline = await generateCourseOutline(userSettings, userSettings.apiKey);
        setModules(outline);
        setAppState(AppState.DASHBOARD);
      }
    } catch (error) {
      alert("⚠️ Gagal membuat outline. Periksa API Key Anda.");
      setAppState(AppState.ONBOARDING);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('ot_learn_key');
    setSettings(null);
    setModules([]);
    setAppState(AppState.ONBOARDING);
  };

  const updateModuleStatus = (index: number, status: ModuleOutline['status'], content?: string) => {
    setModules(prev => prev.map((m, i) => i === index ? { ...m, status, content: content || m.content } : m));
  };

  if (appState === AppState.ONBOARDING) {
    return <Onboarding onStart={handleStart} loading={loading} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
           <div className="w-8 h-8 bg-gradient-to-br from-primary to-teal-500 rounded-lg flex items-center justify-center text-white">
             <GraduationCap className="w-5 h-5" />
           </div>
           <span className="font-bold text-white tracking-wide">OT-LEARN</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
           <button 
             onClick={() => setActiveTab(DashboardTab.GENERATE)}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === DashboardTab.GENERATE ? 'bg-primary text-white font-medium shadow-lg shadow-teal-900/50' : 'hover:bg-slate-800'}`}
           >
             <BookOpen className="w-5 h-5" />
             Materi
           </button>
           <button 
             onClick={() => setActiveTab(DashboardTab.SEARCH)}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === DashboardTab.SEARCH ? 'bg-primary text-white font-medium shadow-lg shadow-teal-900/50' : 'hover:bg-slate-800'}`}
           >
             <Search className="w-5 h-5" />
             Pencarian
           </button>
           <button 
             onClick={() => setActiveTab(DashboardTab.DASHBOARD)}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === DashboardTab.DASHBOARD ? 'bg-primary text-white font-medium shadow-lg shadow-teal-900/50' : 'hover:bg-slate-800'}`}
           >
             <LayoutDashboard className="w-5 h-5" />
             Dashboard
           </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
           {settings && (
             <div className="mb-4 px-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Pengguna</p>
                <div className="flex items-center gap-2 text-sm text-slate-200">
                   <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                   API Terhubung
                </div>
             </div>
           )}
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-slate-800 rounded-lg transition-colors"
           >
             <LogOut className="w-4 h-4" />
             🔄 Reset Key
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">
           <div>
              <h2 className="text-lg font-bold text-slate-800">
                {activeTab === DashboardTab.GENERATE && 'Editor Materi'}
                {activeTab === DashboardTab.SEARCH && 'Asisten Video'}
                {activeTab === DashboardTab.DASHBOARD && 'Ringkasan Belajar'}
              </h2>
              {settings && activeTab === DashboardTab.GENERATE && (
                <p className="text-xs text-slate-500">Topik: {settings.topic}</p>
              )}
           </div>
           
           <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-mono text-slate-500">
                 v1.0.0
              </span>
           </div>
        </header>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
           {activeTab === DashboardTab.GENERATE && settings && (
             <CourseGenerator 
                modules={modules} 
                settings={settings}
                updateModuleStatus={updateModuleStatus}
             />
           )}
           {activeTab === DashboardTab.SEARCH && settings && (
             <YouTubeAssistant settings={settings} />
           )}
           {activeTab === DashboardTab.DASHBOARD && (
             <div className="p-12 text-center">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                   <LayoutDashboard className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-700">Dashboard belum tersedia</h3>
                <p className="text-slate-500 mt-2">Silakan gunakan menu Materi untuk generate konten.</p>
             </div>
           )}
        </div>
      </main>
    </div>
  );
};

export default App;
