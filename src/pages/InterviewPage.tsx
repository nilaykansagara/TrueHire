import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../store'
import { 
  setCurrentQuestionId, 
  setAudioBlob,
  transcribeAudio, 
  evaluateAnswer 
} from '../features/interview/interviewSlice'
import { markQuestionAsAsked } from '../features/questions/questionsSlice'
import QuestionCard from '../components/interview/QuestionCard'
import RecordingControls from '../components/interview/RecordingControls'
import { aiService } from '../services/aiService'

const InterviewPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  
  // Get state from Redux
  const { isConfigured } = useSelector((state: RootState) => state.setup)
  const { items: questions } = useSelector((state: RootState) => state.questions)
  const { 
    currentQuestionId, 
    evaluations,
    transcriptionStatus, 
    evaluationStatus,
    error
  } = useSelector((state: RootState) => state.interview)
  
  const [transcription, setTranscription] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  
  // If not configured, redirect to setup page
  useEffect(() => {
    if (!isConfigured || questions.length === 0) {
      navigate('/')
    }
  }, [isConfigured, questions.length, navigate])
  
  // Find the current question
  const currentQuestion = questions.find(q => q.id === currentQuestionId)
  
  // Handle question selection
  const handleQuestionSelect = (questionId: string) => {
    if (isProcessing) return
    dispatch(setCurrentQuestionId(questionId))
  }
  
  // Handle recording completion
  const handleRecordingComplete = async (audioBlob: Blob) => {
    if (!currentQuestionId || !currentQuestion) return
    
    setIsProcessing(true)
    dispatch(setAudioBlob(audioBlob))
    
    try {
      // In a real app, this would use the transcribeAudio action creator
      // For now, we'll use the service directly for better mock behavior
      const transcriptionText = await aiService.transcribeAudio(audioBlob)
      setTranscription(transcriptionText)
      
      // Show evaluation in process message
      const evaluationElement = document.createElement('div')
      evaluationElement.className = 'fixed top-4 right-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded shadow-lg z-50'
      evaluationElement.innerHTML = `
        <h3 class="font-bold">Evaluating Response</h3>
        <p class="text-sm">Analyzing how well the answer aligns with company culture and job requirements...</p>
      `
      document.body.appendChild(evaluationElement)
      
      // Simulate AI evaluation
      const { score, feedback } = await aiService.evaluateAnswer(
        currentQuestionId,
        transcriptionText,
        currentQuestion.text
      )
      
      // Show score notification
      evaluationElement.innerHTML = `
        <h3 class="font-bold">Evaluation Complete</h3>
        <p class="text-sm">Culture & Job Alignment Score: <span class="font-bold ${score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'}">${score}%</span></p>
      `
      
      // Remove notification after 3 seconds
      setTimeout(() => {
        if (document.body.contains(evaluationElement)) {
          document.body.removeChild(evaluationElement)
        }
      }, 3000)
      
      // Mark the question as asked
      dispatch(markQuestionAsAsked(currentQuestionId))
      
      // Add evaluation to state
      dispatch(evaluateAnswer({
        questionId: currentQuestionId,
        transcription: transcriptionText,
        score,
        feedback
      }).unwrap())
      
      // Clear current question
      dispatch(setCurrentQuestionId(null))
    } catch (error) {
      console.error('Error processing recording:', error)
    } finally {
      setIsProcessing(false)
    }
  }
  
  // Group questions by category
  const questionsByCategory = questions.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = []
    }
    acc[question.category].push(question)
    return acc
  }, {} as Record<string, typeof questions>)
  
  // Get evaluation for a question
  const getEvaluationForQuestion = (questionId: string) => {
    return evaluations.find(e => e.questionId === questionId)
  }
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Questions panel */}
        <div className="md:col-span-2">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Interview Questions</h1>
            <p className="text-gray-600 mb-6">
              Select a question to ask the candidate, record their response, and get an AI-powered evaluation.
            </p>
            
            {/* Status message */}
            {isProcessing && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-6">
                {transcriptionStatus === 'loading' && 'Transcribing audio...'}
                {evaluationStatus === 'loading' && 'Evaluating answer...'}
                {transcriptionStatus !== 'loading' && evaluationStatus !== 'loading' && 'Processing...'}
              </div>
            )}
            
            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}
            
            {/* Question categories */}
            <div className="space-y-8">
              {Object.entries(questionsByCategory).map(([category, categoryQuestions]) => (
                <div key={category}>
                  <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="capitalize">{category}</span>
                    <span className="ml-2 text-xs text-gray-500">
                      ({categoryQuestions.filter(q => q.isAsked).length}/{categoryQuestions.length} asked)
                    </span>
                  </h2>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {categoryQuestions.map(question => {
                      const evaluation = getEvaluationForQuestion(question.id)
                      return (
                        <QuestionCard
                          key={question.id}
                          question={question}
                          isActive={question.id === currentQuestionId}
                          isEvaluated={question.isAsked}
                          score={evaluation?.score}
                          onClick={() => handleQuestionSelect(question.id)}
                        />
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Interview completion */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => navigate('/results')}
                className="btn btn-secondary"
              >
                View Results
              </button>
            </div>
          </div>
        </div>
        
        {/* Recording panel */}
        <div className="md:col-span-1">
          <div className="sticky top-6">
            {currentQuestion ? (
              <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Current Question</h2>
                <div className="p-4 bg-primary-light rounded-lg border border-primary mb-4">
                  <p className="text-gray-800">{currentQuestion.text}</p>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
                  </span>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    currentQuestion.category === 'cultural' ? 'bg-purple-100 text-purple-800' :
                    currentQuestion.category === 'technical' ? 'bg-blue-100 text-blue-800' :
                    currentQuestion.category === 'behavioral' ? 'bg-indigo-100 text-indigo-800' :
                    'bg-teal-100 text-teal-800'
                  }`}>
                    {currentQuestion.category.charAt(0).toUpperCase() + currentQuestion.category.slice(1)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Instructions</h2>
                <p className="text-gray-600 mb-4">
                  Select a question from the list to begin. Ask the candidate the question, then use 
                  the recording controls to capture their response.
                </p>
                <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded">
                  <p>No question selected</p>
                </div>
              </div>
            )}
            
            {/* Recording controls */}
            <RecordingControls onRecordingComplete={handleRecordingComplete} />
            
            {/* Transcription preview */}
            {transcription && (
              <div className="bg-white shadow-sm rounded-lg p-6 mt-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Transcription</h2>
                <div className="p-4 bg-gray-50 rounded border border-gray-200">
                  <p className="text-gray-700 text-sm">{transcription}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InterviewPage