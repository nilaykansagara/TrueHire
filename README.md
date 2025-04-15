# TrueHire - AI-Powered Interview Management System

TrueHire is a sophisticated interview management system that automatically generates interview questions across multiple categories based on company culture, job descriptions, and desired difficulty levels. It provides tools for recording candidate responses, transcribing them, and evaluating answers using AI.

## Features

- **Interview Setup**: Configure interview settings with company culture, job description, and question preferences
- **Question Generation**: AI-generated questions across four categories (cultural fit, technical, behavioral, situational)
- **Interview Management**: Record candidate responses with audio visualization 
- **AI Evaluation**: Automatic transcription and scoring of candidate answers
- **Results Dashboard**: View scores and analytics across categories and difficulty levels

## Tech Stack

- **Frontend**: React with TypeScript 
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Audio Processing**: Web Audio API

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/truehire.git
   cd truehire
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Setup**: Start by configuring the interview parameters with company culture, job descriptions, and selecting question categories and difficulty levels.

2. **Generate Questions**: The system will create interview questions based on your configuration.

3. **Conduct Interviews**: Select questions to ask candidates, record their responses using the built-in audio recorder.

4. **Review Results**: View the AI-generated evaluations, scores, and feedback for each response.

5. **Export**: Download interview results in JSON format for your records.

## Project Structure

```
src/
├── components/       # React components
├── features/         # Redux Toolkit slices
├── hooks/            # Custom React hooks
├── pages/            # Page components
├── services/         # API and service functions
├── store.ts          # Redux store configuration
└── utils/            # Utility functions
```

## Future Enhancements

- Integration with actual AI APIs (OpenAI, Hugging Face)
- User authentication and multi-user support
- Enhanced analytics and reporting
- Video recording capabilities
- Integration with ATS systems

## License

MIT