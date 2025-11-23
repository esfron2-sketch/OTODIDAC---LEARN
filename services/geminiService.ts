
import { GoogleGenAI, Type, Schema, Chat } from "@google/genai";
import { ModuleOutline, QuizQuestion, UserSettings, YouTubeSummary } from "../types";

// Helper to get client with dynamic key
const getClient = (apiKey?: string) => {
  const key = apiKey || process.env.API_KEY;
  if (!key) throw new Error("API Key Missing");
  return new GoogleGenAI({ apiKey: key });
};

const MODEL_FLASH = 'gemini-2.5-flash';

// Strict formatting rules for professional output
const FORMATTING_INSTRUCTION = `
STRICT FORMATTING RULES (MATHEMATICS & SYMBOLS):
1. EXPONENTS/POWERS: 
   - NEVER use the caret symbol (^) in plain text for display.
   - NEVER use double asterisks (**) for exponents in plain text.
   - MUST use Unicode Superscripts (e.g., x², y³, 10⁻⁴, aᵇ, eˣ).
   - If generating code (Python/JS), use explicit functions: Math.pow(base, exp) or pow(base, exp).
2. SYMBOLS: 
   - Use icons (🔑, 🛡️, 🏅, 🧩, ⚠️) sparingly. 
   - Do NOT use emojis in academic headers or body text unless strictly necessary for UI indicators.
3. TONE:
   - Rigorous, academic, expert-level.
   - No fluff. Direct and concise.
`;

/**
 * Step 1: Generate the Course Outline (Title & Sections)
 */
export const generateCourseOutline = async (settings: UserSettings, apiKey: string): Promise<ModuleOutline[]> => {
  const ai = getClient(apiKey);
  
  const prompt = `Create a rigorous, expert-level academic syllabus for: "${settings.topic}". 
  Level: ${settings.level}. Language: ${settings.language}.
  Break it down into 4-6 major distinct modules.
  Return ONLY valid JSON.
  ${FORMATTING_INSTRUCTION}`;

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        index: { type: Type.INTEGER },
        title: { type: Type.STRING },
        description: { type: Type.STRING },
      },
      required: ["index", "title", "description"],
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are a university dean. " + FORMATTING_INSTRUCTION,
      },
    });

    const rawData = response.text ? JSON.parse(response.text) : [];
    return rawData.map((item: any, idx: number) => ({
      ...item,
      index: idx + 1,
      status: 'pending',
      content: ''
    }));
  } catch (error) {
    console.error("Outline Error:", error);
    throw error;
  }
};

/**
 * Step 2: Generate Content for a Single Module
 */
export const generateModuleContent = async (
  topic: string,
  moduleTitle: string,
  level: string,
  language: string,
  apiKey: string
): Promise<string> => {
  const ai = getClient(apiKey);
  
  const prompt = `Write a comprehensive, expert-level lecture for the module "${moduleTitle}" within the course "${topic}".
  Target Audience: ${level}. Language: ${language}.
  
  Structure:
  1. Introduction
  2. Theoretical Framework / Core Concepts (Deep Dive)
  3. Mathematical Proofs or Technical Implementation (if applicable) -> REMEMBER UNICODE SUPERSCRIPTS for formulas (e.g. E=mc², not mc^2).
  4. Real-world Application / Case Studies
  5. Executive Summary
  
  Use Markdown. Use Bold for key terms.
  ${FORMATTING_INSTRUCTION}`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
      config: {
        systemInstruction: "You are a distinguished professor. " + FORMATTING_INSTRUCTION,
      },
    });

    return response.text || "Failed to generate content.";
  } catch (error) {
    console.error("Content Error:", error);
    return "Error loading content. Please check your API Key quota.";
  }
};

/**
 * Step 3: Generate Quiz
 */
export const generateQuiz = async (chapterTitle: string, apiKey: string): Promise<QuizQuestion[]> => {
  const ai = getClient(apiKey);
  
  const prompt = `Create 3 difficult, expert-level multiple choice questions for the chapter: "${chapterTitle}".
  ${FORMATTING_INSTRUCTION}
  Ensure options are not obvious. Include detailed explanations.`;

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.INTEGER },
        question: { type: Type.STRING },
        options: { type: Type.ARRAY, items: { type: Type.STRING } },
        correctAnswerIndex: { type: Type.INTEGER },
        explanation: { type: Type.STRING }
      },
      required: ["id", "question", "options", "correctAnswerIndex", "explanation"],
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });
    return response.text ? JSON.parse(response.text) : [];
  } catch (error) {
    console.error("Quiz Error", error);
    return [];
  }
};

/**
 * YouTube Summarization (Mocking Transcript Fetch)
 */
export const summarizeVideoTopic = async (query: string, apiKey: string): Promise<YouTubeSummary> => {
  const ai = getClient(apiKey);

  // In a real app, we would search YouTube API and fetch captions here.
  // We will simulate a transcript for demonstration.
  const mockTranscript = `
    Welcome to this advanced lecture on ${query}. Today we discuss the fundamental equation E = mc². 
    This means energy equals mass times the speed of light squared (c²). 
    Let's look at an example. If we have 10³ kg of mass...
  `;

  const prompt = `Summarize this video transcript about "${query}".
  Structure the summary into: Intro, Core Concepts, and Examples.
  ${FORMATTING_INSTRUCTION}
  Transcript: ${mockTranscript}`;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      intro: { type: Type.STRING },
      concepts: { type: Type.STRING },
      examples: { type: Type.STRING },
    },
    required: ["intro", "concepts", "examples"],
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const summary = response.text ? JSON.parse(response.text) : { intro: '', concepts: '', examples: '' };

    return {
      videoId: 'mock-id-' + Date.now(),
      title: `Expert Lecture: ${query}`,
      thumbnail: 'https://placehold.co/600x400/0f766e/ffffff?text=Video+Thumbnail',
      summary: summary
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Chat with Mentor
 */
export const createMentorChat = (settings: UserSettings): Chat => {
  const ai = getClient(settings.apiKey);
  return ai.chats.create({
    model: MODEL_FLASH,
    config: {
      systemInstruction: `You are an expert academic mentor for the course "${settings.topic}".
      Target Level: ${settings.level}. Language: ${settings.language}.
      Provide helpful, rigorous, and encouraging guidance.
      ${FORMATTING_INSTRUCTION}`,
    },
  });
};
