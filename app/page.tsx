"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Clock, Activity, Star } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [keyFound, setKeyFound] = useState(false);

  useEffect(() => {
    const key = sessionStorage.getItem('ot_learn_key');
    if (!key) {
      router.push('/onboarding');
    } else {
      setKeyFound(true);
    }
  }, [router]);

  if (!keyFound) return null; // Or a loading spinner

  return (
    <div className="h-full overflow-y-auto p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-light mb-2">Dashboard</h1>
          <p className="text-muted">Welcome back, Expert. Continue your learning journey.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Modules Completed', val: '0', icon: BookOpen, color: 'text-primary' },
            { label: 'Learning Hours', val: '0h', icon: Clock, color: 'text-secondary' },
            { label: 'Current Streak', val: '1 Day', icon: Activity, color: 'text-success' },
            { label: 'Avg Score', val: '-', icon: Star, color: 'text-warning' },
          ].map((stat, i) => (
            <div key={i} className="bg-surface border border-gray-800 p-6 rounded-2xl flex items-center shadow-lg">
              <div className={`p-3 rounded-xl bg-gray-800/50 mr-4 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-light">{stat.val}</p>
                <p className="text-xs text-muted uppercase tracking-wider">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity / Continue Learning */}
        <h2 className="text-xl font-bold text-light mb-6">Start Learning</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/learn" className="group block bg-card border border-gray-800 rounded-2xl overflow-hidden hover:border-primary transition-all">
              <div className="h-32 bg-gradient-to-br from-primary to-violet-900 relative">
                <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur px-3 py-1 rounded text-xs font-bold text-white">
                  AI Generated
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-light text-lg mb-2 group-hover:text-primary transition-colors">Create New Course</h3>
                <p className="text-muted text-sm mb-4 line-clamp-2">Generate a full curriculum on any topic using Gemini AI.</p>
                <div className="text-xs text-primary font-bold mt-2">Start Now →</div>
              </div>
            </Link>
        </div>
      </div>
    </div>
  );
}