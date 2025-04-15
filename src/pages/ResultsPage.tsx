import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../store'
import EvaluationCard from '../components/results/EvaluationCard'
import { exportResults } from '../utils/storageUtils'

const ResultsPage = () => {
  const navigate = useNavigate()
  
  // Get state from Redux
  const { evaluations } = useSelector((state: RootState) => state.interview)
  const { items: questions } = useSelector((state: RootState) => state.questions)
  const { isConfigured } = useSelector((state: RootState) => state.setup)
  
  // If not configured, redirect to setup page
  useEffect(() => {
    if (!isConfigured || questions.length === 0) {
      navigate('/')
    }
  }, [isConfigured, questions.length, navigate])
  
  // Calculate stats
  const stats = useMemo(() => {
    if (evaluations.length === 0) return null
    
    // Overall average score
    const overallAverage = evaluations.reduce((sum, evaluation) => sum + evaluation.score, 0) / evaluations.length
    
    // Category averages
    const categoryScores: Record<string, { total: number, count: number }> = {}
    evaluations.forEach(evaluation => {
      const question = questions.find(q => q.id === evaluation.questionId)
      if (question) {
        if (!categoryScores[question.category]) {
          categoryScores[question.category] = { total: 0, count: 0 }
        }
        categoryScores[question.category].total += evaluation.score
        categoryScores[question.category].count += 1
      }
    })
    
    const categoryAverages = Object.entries(categoryScores).map(([category, data]) => ({
      category,
      average: data.total / data.count
    }))
    
    // Sort by highest score
    categoryAverages.sort((a, b) => b.average - a.average)
    
    // Difficulty averages
    const difficultyScores: Record<string, { total: number, count: number }> = {}
    evaluations.forEach(evaluation => {
      const question = questions.find(q => q.id === evaluation.questionId)
      if (question) {
        if (!difficultyScores[question.difficulty]) {
          difficultyScores[question.difficulty] = { total: 0, count: 0 }
        }
        difficultyScores[question.difficulty].total += evaluation.score
        difficultyScores[question.difficulty].count += 1
      }
    })
    
    const difficultyAverages = Object.entries(difficultyScores).map(([difficulty, data]) => ({
      difficulty,
      average: data.total / data.count
    }))
    
    return {
      overallAverage,
      categoryAverages,
      difficultyAverages,
      questionCount: evaluations.length,
      totalQuestionCount: questions.length
    }
  }, [evaluations, questions])
  
  // Handle export results
  const handleExport = () => {
    const exportData = {
      evaluations,
      summary: stats,
      questions: questions.filter(q => q.isAsked)
    }
    
    exportResults(exportData)
  }
  
  // Score color based on percentage
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Interview Results</h1>
          
          <div className="space-x-3">
            <button
              onClick={() => navigate('/interview')}
              className="btn btn-secondary"
            >
              Continue Interview
            </button>
            
            <button
              onClick={handleExport}
              className="btn btn-primary"
              disabled={evaluations.length === 0}
            >
              Export Results
            </button>
          </div>
        </div>
        
        {/* No evaluations yet */}
        {evaluations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No evaluations yet. Ask some questions in the interview section.</p>
            <button
              onClick={() => navigate('/interview')}
              className="btn btn-primary mt-4"
            >
              Go to Interview
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stats panel */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Summary</h2>
                
                {/* Overall score */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-medium text-gray-700">Overall Score</h3>
                    <span className={`text-xl font-bold ${getScoreColor(stats?.overallAverage || 0)}`}>
                      {Math.round(stats?.overallAverage || 0)}%
                    </span>
                  </div>
                  <div className="relative h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${stats?.overallAverage && stats.overallAverage >= 80 ? 'bg-green-500' : stats?.overallAverage && stats.overallAverage >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${stats?.overallAverage || 0}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats?.questionCount} of {stats?.totalQuestionCount} questions evaluated
                  </p>
                </div>
                
                {/* Category breakdown */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Score by Category</h3>
                  <div className="space-y-3">
                    {stats?.categoryAverages.map(cat => (
                      <div key={cat.category}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium text-gray-600 capitalize">{cat.category}</span>
                          <span className={`text-xs font-bold ${getScoreColor(cat.average)}`}>
                            {Math.round(cat.average)}%
                          </span>
                        </div>
                        <div className="relative h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${cat.average >= 80 ? 'bg-green-500' : cat.average >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${cat.average}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Difficulty breakdown */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Score by Difficulty</h3>
                  <div className="space-y-3">
                    {stats?.difficultyAverages.map(diff => (
                      <div key={diff.difficulty}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium text-gray-600 capitalize">{diff.difficulty}</span>
                          <span className={`text-xs font-bold ${getScoreColor(diff.average)}`}>
                            {Math.round(diff.average)}%
                          </span>
                        </div>
                        <div className="relative h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${diff.average >= 80 ? 'bg-green-500' : diff.average >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${diff.average}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Evaluations panel */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Question Evaluations</h2>
              <div className="space-y-6">
                {evaluations.map(evaluation => {
                  const question = questions.find(q => q.id === evaluation.questionId)
                  if (!question) return null
                  
                  return (
                    <EvaluationCard
                      key={evaluation.questionId}
                      evaluation={evaluation}
                      question={question}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResultsPage