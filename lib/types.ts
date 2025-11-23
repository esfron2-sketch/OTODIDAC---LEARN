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
  contentHtml: string; // Sanitized HTML
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

export interface IngestResponse {
  success: boolean;
  message: string;
  data?: Material;
}