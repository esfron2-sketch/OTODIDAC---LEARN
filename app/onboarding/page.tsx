"use client";
import React, { useEffect } from 'react';
import Onboarding from '@/components/Onboarding';
import { useRouter } from 'next/navigation';
import { UserSettings } from '@/lib/types';

export default function OnboardingPage() {
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (sessionStorage.getItem('ot_learn_key')) {
        router.push('/');
    }
  }, [router]);

  const handleStart = (settings: UserSettings) => {
    // Store key temporarily (as per requirements)
    if (settings.apiKey) {
        sessionStorage.setItem('ot_learn_key', settings.apiKey);
        sessionStorage.setItem('ot_learn_topic', settings.topic);
        sessionStorage.setItem('ot_learn_level', settings.level);
        router.push('/learn');
    }
  };

  return <Onboarding onStart={handleStart} loading={false} />;
}