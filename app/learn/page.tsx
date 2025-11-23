"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CourseGenerator from '@/components/CourseGenerator';
import { ModuleOutline, UserSettings } from '@/lib/types';
import { generateCourseOutline } from '@/services/geminiService';

export default function LearnPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [modules, setModules] = useState<ModuleOutline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const key = sessionStorage.getItem('ot_learn_key');
    const topic = sessionStorage.getItem('ot_learn_topic');
    const level = sessionStorage.getItem('ot_learn_level') as any;

    if (!key) {
      router.push('/onboarding');
      return;
    }

    const userSettings: UserSettings = {
        apiKey: key,
        topic: topic || 'General Science',
        level: level || 'Postgraduate',
        language: 'Indonesian'
    };
    
    setSettings(userSettings);
    
    // Initial fetch
    generateCourseOutline(userSettings, key)
        .then(setModules)
        .catch(console.error)
        .finally(() => setLoading(false));

  }, [router]);

  const updateModuleStatus = (index: number, status: ModuleOutline['status'], content?: string) => {
    setModules(prev => prev.map((m, i) => i === index ? { ...m, status, content: content || m.content } : m));
  };

  if (loading || !settings) {
      return <div className="flex h-screen items-center justify-center text-primary animate-pulse">Generative AI is thinking...</div>;
  }

  return (
    <div className="h-[calc(100vh-4rem)] lg:h-screen">
      <CourseGenerator 
         modules={modules} 
         settings={settings}
         updateModuleStatus={updateModuleStatus}
      />
    </div>
  );
}