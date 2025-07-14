# AI Content Summarizer

## Overview

The AI Content Summarizer is a React-based web application that allows users to generate concise summaries of content from various sources. Users can either provide a URL to a web page or upload a text-based file (e.g., `.txt`, `.md`, `.html`). The application integrates with multiple AI models, offering flexibility and different levels of summary detail.

## Features

*   **Multiple Input Modes:** Summarize content from web page URLs or uploaded text files.
*   **AI Model Selection:** Choose between different AI models for summarization (currently Gemini, with mock integrations for Claude and OpenAI).
*   **Customizable Summary Detail:** Select the desired level of summary detail: Brief, Detailed, or Comprehensive.
*   **Interactive User Interface:** A clean and intuitive interface built with React.
*   **Summary Export:** Download the generated summary as a text file.
*   **Error Handling:** Provides clear feedback for any issues during the summarization process.

## Architecture

The application follows a client-side architecture, primarily built with React and leveraging external AI APIs for summarization.

### Frontend

*   **React:** The core library for building the user interface.
*   **Vite:** Used as the build tool for a fast development experience and optimized production builds.
*   **Components:** The UI is modularized into reusable React components (e.g., `Header`, `SummaryDisplay`, `Spinner`, `icons`).
*   **State Management:** React's `useState` and `useCallback` hooks are used for managing application state, including input modes, values, loading status, errors, and summary results.

### AI Service Integrations

*   The `services/` directory contains modules responsible for interacting with different AI summarization APIs.
*   **`geminiService.ts`:** This module integrates directly with the Google Gemini API. It constructs prompts based on user-selected summary detail and handles API requests for both URL and text summarization. It also manages API key access and error handling specific to the Gemini API.
*   **`claudeService.ts` and `openaiService.ts`:** These modules currently serve as placeholders with mock implementations. They simulate responses from the Claude and OpenAI APIs, respectively, allowing for future expansion and integration of these services without altering the core application logic.
*   **`types.ts`:** Defines shared TypeScript interfaces and enums (e.g., `InputMode`, `SummaryResult`, `AIModel`, `SummaryDetail`) to ensure type safety and consistency across the application.

### Core Logic

*   The `App.tsx` component acts as the central orchestrator, handling user input, dynamically selecting the appropriate AI service based on the user's choice, and managing the overall summarization workflow.
*   Input content (URL or file text) is passed to the selected AI service, which then communicates with its respective AI model to generate the summary.
*   The application provides a robust error handling mechanism to inform users of any issues during the process.

## Technologies Used

*   **Frontend:** React, TypeScript, Vite
*   **Styling:** Tailwind CSS (inferred from class names in `App.tsx`)
*   **AI Integration:** Google Gemini API (with placeholders for Claude and OpenAI)
*   **Development Utilities:** `dotenv` (for environment variables)

## Getting Started

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or Yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd ai-content-summarizer
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or yarn install
    ```
3.  Set up environment variables:
    Create a `.env.local` file in the root directory and add your API keys. For example:
    ```env
    API_KEY=YOUR_GEMINI_API_KEY
    # CLAUDE_API_KEY=YOUR_CLAUDE_API_KEY
    # OPENAI_API_KEY=YOUR_OPENAI_API_KEY
    ```
    *Note: Currently, only `API_KEY` for Gemini is actively used. The Claude and OpenAI services are mocked.*

### Running the Application

1.  Start the development server:
    ```bash
    npm run dev
    # or yarn dev
    ```
2.  Open your browser and navigate to the address shown in the console (usually `http://localhost:5173`).

### Building for Production

```bash
npm run build
# or yarn build
```

This will create a `dist` directory with the production-ready build.

## Future Enhancements

*   Full integration with Claude and OpenAI APIs.
*   Support for more file types (e.g., PDF, DOCX).
*   Advanced summarization options (e.g., keyword extraction, sentiment analysis).
*   User authentication and history of summaries.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Specify your license here, e.g., MIT License]