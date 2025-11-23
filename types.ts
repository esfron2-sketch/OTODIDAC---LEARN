export interface UserSettings {
  topic: string;
  level: 'Undergraduate' | 'Postgraduate' | 'PhD/Expert';
  language: 'Indonesian' | 'English';
  apiKey?: string; // Optional because we might use env var or user input
}

export interface CourseOutline {
  title: string;
  description: string;
  modules: ModuleOutline[];
}

export interface ModuleOutline {
  index: number;
  title: string;
  description: string;
  status: 'pending' | 'generating' | 'completed' | 'error';
  content?: string; // Markdown content
}

export interface RoadmapItem {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isLocked: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface YouTubeSummary {
  videoId: string;
  title: string;
  thumbnail: string;
  summary: {
    intro: string;
    concepts: string;
    examples: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum AppState {
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
}

export enum DashboardTab {
  DASHBOARD = 'DASHBOARD',
  GENERATE = 'GENERATE',
  SEARCH = 'SEARCH', // YouTube & Global Search
  SETTINGS = 'SETTINGS',
}