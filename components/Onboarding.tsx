import React, { useState } from 'react';
import { UserSettings } from '../lib/types';
import { BookOpen, Eye, EyeOff } from 'lucide-react';

interface Props {
  onStart: (settings: UserSettings) => void;
  loading: boolean;
}

const Onboarding: React.FC<Props> = ({ onStart, loading }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState<UserSettings['level']>('Postgraduate');
  const [saveLocally, setSaveLocally] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validateKey = (key: string) => {
    // Simple regex check for Google API keys (starts with AIza)
    const valid = key.length > 30 && key.startsWith('AIza');
    setIsValid(valid);
    return valid;
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setApiKey(val);
    if (val.length > 10) validateKey(val);
    else setIsValid(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateKey(apiKey)) return;
    
    if (saveLocally) {
      sessionStorage.setItem('ot_learn_key', apiKey);
    }
    
    onStart({ topic, level, language: 'Indonesian', apiKey });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-teal-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-violet-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl z-10 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-100 p-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4">
             <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">🔐 Selamat datang di OT-LEARN</h1>
          <p className="text-slate-500 text-sm">Masukkan API GEMINI (Free Tier) Anda untuk mulai — 🔑</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* API Key Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Google Gemini API Key
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 select-none">
                  🔑
                </div>
                <input 
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={handleKeyChange}
                  placeholder="•••• •••• ••••"
                  className={`w-full pl-10 pr-12 py-3 bg-slate-50 border rounded-xl text-sm font-mono transition-all outline-none
                    ${isValid === true ? 'border-emerald-400 focus:ring-emerald-200' : 
                      isValid === false ? 'border-rose-400 focus:ring-rose-200' : 
                      'border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20'}
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              <div className="flex justify-between items-center h-5">
                 <div className="text-[10px] text-slate-400 flex items-center gap-1">
                   {isValid === true && <span className="text-emerald-600 font-medium flex items-center gap-1">🟢 Valid</span>}
                   {isValid === false && <span className="text-rose-500 font-medium flex items-center gap-1">🔴 Tidak Valid</span>}
                 </div>
                 <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-[10px] text-primary hover:underline">
                   Dapatkan Key di Google AI Studio ↗
                 </a>
              </div>
            </div>

            {/* Topic Input */}
            <div>
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Topik Materi
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Contoh: Astrophysics, Linear Algebra..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-slate-700"
              />
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Tingkat</label>
                  <select 
                    value={level} 
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full px-3 py-3 rounded-xl border border-slate-200 bg-white text-sm"
                  >
                    <option value="Undergraduate">S1 (Sarjana)</option>
                    <option value="Postgraduate">S2 (Master)</option>
                    <option value="PhD/Expert">S3 / Expert</option>
                  </select>
               </div>
               <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 text-sm p-2 hover:bg-slate-50 rounded-lg w-full transition-colors">
                    <input 
                      type="checkbox" 
                      checked={saveLocally} 
                      onChange={(e) => setSaveLocally(e.target.checked)}
                      className="rounded text-primary focus:ring-primary" 
                    />
                    <span className="flex items-center gap-1.5">
                       🛡️ Simpan sementara
                    </span>
                  </label>
               </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!topic || !isValid || loading}
              className="w-full bg-primary hover:bg-teal-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-100 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-pulse">Memproses...</span>
              ) : (
                <>🔓 Masuk dengan API</>
              )}
            </button>
          </form>
        </div>
        
        <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400">
             OT-LEARN tidak menyimpan API Key Anda di server kami. Key digunakan langsung dari browser Anda.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;