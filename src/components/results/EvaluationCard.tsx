import { AnswerEvaluation } from '../../features/interview/interviewSlice'
import { Question } from '../../features/questions/questionsSlice'

interface EvaluationCardProps {
  evaluation: AnswerEvaluation
  question: Question
}

const EvaluationCard = ({ evaluation, question }: EvaluationCardProps) => {
  // Score color based on percentage
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-400 text-white'
    if (score >= 60) return 'from-yellow-500 to-yellow-400 text-white'
    return 'from-red-500 to-red-400 text-white'
  }
  
  // Score label
  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    return 'Needs Improvement'
  }
  
  // Category and difficulty badge colors
  const categoryColors = {
    cultural: 'bg-purple-100 text-purple-800',
    technical: 'bg-blue-100 text-blue-800',
    behavioral: 'bg-indigo-100 text-indigo-800',
    situational: 'bg-teal-100 text-teal-800'
  }
  
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800'
  }
  
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div className="p-5">
        {/* Question info */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`text-xs font-medium px-2 py-1 rounded ${categoryColors[question.category as keyof typeof categoryColors]}`}>
            {question.category.charAt(0).toUpperCase() + question.category.slice(1)}
          </span>
          <span className={`text-xs font-medium px-2 py-1 rounded ${difficultyColors[question.difficulty]}`}>
            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
          </span>
        </div>
        
        {/* Question text */}
        <h3 className="text-lg font-medium text-gray-900 mb-3">{question.text}</h3>
        
        {/* Score display */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Score</span>
            <span className="text-sm font-medium text-gray-700">{getScoreLabel(evaluation.score)}</span>
          </div>
          <div className="relative h-4 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${getScoreColor(evaluation.score)}`}
              style={{ width: `${evaluation.score}%` }}
            ></div>
          </div>
          <div className="flex justify-end mt-1">
            <span className="text-lg font-bold text-gray-800">{evaluation.score}%</span>
          </div>
        </div>
      </div>
      
      {/* Transcription and feedback sections */}
      <div className="border-t border-gray-200">
        <div className="p-4 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Answer Transcription</h4>
          <p className="text-gray-600 text-sm bg-white p-3 rounded border border-gray-200">
            {evaluation.transcription}
          </p>
        </div>
      </div>
      
      {evaluation.feedback && (
        <div className="border-t border-gray-200">
          <div className="p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Feedback</h4>
            <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded border border-gray-200">
              {evaluation.feedback}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default EvaluationCard