import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { ModuleOutline, QuizQuestion, UserSettings, YouTubeSummary } from "../lib/types";

// Helper to get client with dynamic key
const getClient = (apiKey?: string) => {
  const key = apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!key) throw new Error("API Key Missing");
  return new GoogleGenerativeAI(key);
};

const MODEL_NAME = 'gemini-1.5-flash';

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
  const genAI = getClient(apiKey);
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            index: { type: SchemaType.INTEGER },
            title: { type: SchemaType.STRING },
            description: { type: SchemaType.STRING },
          },
          required: ["index", "title", "description"],
        },
      },
    }
  });
  
  const prompt = `Create a rigorous, expert-level academic syllabus for: "${settings.topic}". 
  Level: ${settings.level}. Language: ${settings.language}.
  Break it down into 4-6 major distinct modules.
  Return ONLY valid JSON.
  ${FORMATTING_INSTRUCTION}`;

  try {
    const result = await model.generateContent(prompt);
    const rawData = JSON.parse(result.response.text());
    
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
  const genAI = getClient(apiKey);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
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
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Content Error:", error);
    return "Error loading content. Please check your API Key quota.";
  }
};

/**
 * Step 3: Generate Quiz
 */
export const generateQuiz = async (chapterTitle: string, apiKey: string): Promise<QuizQuestion[]> => {
  const genAI = getClient(apiKey);
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            id: { type: SchemaType.INTEGER },
            question: { type: SchemaType.STRING },
            options: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            correctAnswerIndex: { type: SchemaType.INTEGER },
            explanation: { type: SchemaType.STRING }
          },
          required: ["id", "question", "options", "correctAnswerIndex", "explanation"],
        },
      },
    }
  });
  
  const prompt = `Create 3 difficult, expert-level multiple choice questions for the chapter: "${chapterTitle}".
  ${FORMATTING_INSTRUCTION}
  Ensure options are not obvious. Include detailed explanations.`;

  try {
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error("Quiz Error", error);
    return [];
  }
};

/**
 * YouTube Summarization (Mocking Transcript Fetch)
 */
export const summarizeVideoTopic = async (query: string, apiKey: string): Promise<YouTubeSummary> => {
  const genAI = getClient(apiKey);
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          intro: { type: SchemaType.STRING },
          concepts: { type: SchemaType.STRING },
          examples: { type: SchemaType.STRING },
        },
        required: ["intro", "concepts", "examples"],
      },
    }
  });

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

  try {
    const result = await model.generateContent(prompt);
    const summary = JSON.parse(result.response.text());

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
export const createMentorChat = (settings: UserSettings) => {
  const genAI = getClient(settings.apiKey);
  const model = genAI.getGenerativeModel({ 
    model: MODEL_NAME,
    systemInstruction: `You are an expert academic mentor for the course "${settings.topic}".
    Target Level: ${settings.level}. Language: ${settings.language}.
    Provide helpful, rigorous, and encouraging guidance.
    ${FORMATTING_INSTRUCTION}`
  });
  
  return model.startChat();
};