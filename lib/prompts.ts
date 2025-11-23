/**
 * TEMPLATES FOR GEMINI INTERACTION
 * Rule: NO `**` for exponents. Use Unicode superscripts.
 */

export const GENERATE_STRUCTURE_PROMPT = (textChunk: string) => `
You are an expert curriculum designer. Analyze the following raw text extracted from a PDF.
Your goal is to structure this into a high-quality learning module.

CRITERIA:
1. Divide into logical Sections.
2. Ensure math formulas use UNICODE SUPERSCRIPTS (e.g. x², y³, 10⁻⁹) or HTML <sup> tags. NEVER use ** for exponents.
3. Identify key concepts and create a short exercise (MCQ) for each section.
4. Estimate reading time.

RAW TEXT:
${textChunk.substring(0, 15000)}... (truncated)

OUTPUT JSON FORMAT:
{
  "title": "Module Title",
  "description": "Executive summary of the material",
  "sections": [
    {
      "title": "Section Title",
      "contentHtml": "<p>Content with <strong>bold key terms</strong> and clean HTML structure...</p>",
      "durationMinutes": 5,
      "exercises": [
        {
          "type": "mcq",
          "question": "Question text?",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": "A"
        }
      ]
    }
  ],
  "qualityScore": 85
}
`;

export const QUALITY_CHECK_PROMPT = `
Analyze the provided text for:
1. Educational value (Score 0-100)
2. Presence of Hate Speech/Discrimination (Boolean)
3. Structural completeness (Boolean)

Return JSON: { "score": number, "flagged": boolean, "reasons": [] }
`;