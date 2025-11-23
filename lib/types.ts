// User & App Settings
export interface UserSettings {
  topic: string;
  level: 'Undergraduate' | 'Postgraduate' | 'PhD/Expert';
  language: 'Indonesian' | 'English';
  apiKey?: string;
}

export interface Material {
  id: string;
  title: string;
  author?: string;
  description: string;
  uploadDate: string;
  status: 'processing' | 'needs_review' | 'approved' | 'rejected';
  qualityScore: number;
  sections: Section[];
  reviewNotes?: string[];
}

export interface Section {
  id: string;
  title: string;
  contentHtml: string;
  pageReference?: number;
  durationMinutes: number;
  exercises?: Exercise[];
  videoSuggestions?: VideoSuggestion[];
}

export interface Exercise {
  id: string;
  question: string;
  options?: string[];
  correctAnswer?: string;
  type: 'mcq' | 'essay';
}

export interface VideoSuggestion {
  youtubeId: string;
  title: string;
  timestampStart: number;
}

// Course Generator Types
export interface ModuleOutline {
  index: number;
  title: string;
  description: string;
  status: 'pending' | 'generating' | 'completed' | 'error';
  content?: string;
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
