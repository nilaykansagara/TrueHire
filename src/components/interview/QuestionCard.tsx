import { Question } from '../../features/questions/questionsSlice'

interface QuestionCardProps {
  question: Question
  isActive: boolean
  isEvaluated: boolean
  score?: number
  onClick: () => void
}

const QuestionCard = ({ 
  question, 
  isActive, 
  isEvaluated, 
  score,
  onClick 
}: QuestionCardProps) => {
  // Difficulty badge color
  const difficultyColor = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800'
  }
  
  // Category badge color
  const categoryColor = {
    cultural: 'bg-purple-100 text-purple-800',
    technical: 'bg-blue-100 text-blue-800',
    behavioral: 'bg-indigo-100 text-indigo-800',
    situational: 'bg-teal-100 text-teal-800'
  }
  
  // Score color based on percentage
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }
  
  // Card border and background color based on active state
  const cardClasses = isActive
    ? 'border-primary-dark bg-primary-light'
    : isEvaluated
      ? 'border-gray-300 bg-gray-50'
      : 'border-gray-300 hover:border-primary hover:shadow'
  
  return (
    <div 
      className={`p-4 border rounded-lg transition-all cursor-pointer ${cardClasses}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
    >
      <div className="flex flex-wrap gap-2 mb-2">
        <span className={`text-xs font-medium px-2 py-1 rounded ${difficultyColor[question.difficulty]}`}>
          {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
        </span>
        <span className={`text-xs font-medium px-2 py-1 rounded ${categoryColor[question.category as keyof typeof categoryColor]}`}>
          {question.category.charAt(0).toUpperCase() + question.category.slice(1)}
        </span>
        {isEvaluated && score !== undefined && (
          <span className={`ml-auto text-sm font-bold ${getScoreColor(score)}`}>
            {score}%
          </span>
        )}
      </div>
      
      <p className="text-gray-800">{question.text}</p>
      
      {isEvaluated && (
        <div className="mt-2 text-xs font-medium text-gray-500">
          Evaluated
        </div>
      )}
    </div>
  )
}

export default QuestionCard