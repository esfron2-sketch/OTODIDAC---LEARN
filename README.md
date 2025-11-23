# OT-LEARN Professional

A Dark-Themed, Responsive Learning Platform for sourcing, validating, and studying curriculum materials from PDFs.

## 🌟 Features
*   **Ingestion Pipeline**: Upload PDFs, extract text, and use AI to structure them into courses.
*   **Dark Mode UI**: Professional `Slate` & `Violet` theme optimized for long reading sessions.
*   **Quality Control**: Automated scoring for educational value and flagged content checks.
*   **Responsive**: Works seamlessly on mobile (portrait/landscape) and desktop.

## 🛠 Setup

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Variables**
    Create a `.env.local` file:
    ```bash
    GEMINI_API_KEY=your_google_api_key_here
    DATABASE_URL=file:./db/ot-learn.db
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

## 🏗 Architecture

### 1. Ingestion Flow (Server-side)
*   **Input**: PDF File via `/upload` page.
*   **Process**:
    1.  `pdf-parse` extracts raw text.
    2.  `Gemini 2.5 Flash` analyzes chunks to create a JSON structure (Title, Sections, Exercises).
    3.  `Quality Check`: Scoring based on content policy (no hate speech, educational relevance).
*   **Output**: Saved to DB with status `needs_review`.

### 2. Review Flow (Human-in-the-loop)
*   Admins view the `/review` page.
*   They see the AI-generated structure vs Source PDF.
*   Approve/Reject updates the material status.

## 🔒 Security Notes
*   API Keys are never exposed to the client.
*   HTML content is sanitized before rendering.
*   Database schema supports audit trails via `reviews` table.

## 📏 Formatting Rules
*   **Math**: All exponents must use Unicode (e.g., x²) or HTML `<sup>`. Do NOT use `**`.
*   **Typography**: Inter font, fluid sizing.

## 📂 Project Structure
*   `app/`: Next.js App Router pages.
*   `components/`: Reusable UI (Sidebar, MaterialViewer).
*   `lib/`: Types, Prompts, DB helpers.
*   `db/`: SQL Schema.
