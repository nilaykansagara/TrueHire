import { useState, ChangeEvent, FormEvent } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { 
  setCompanyCulture, 
  setJobDescription, 
  setQuestionQuantity, 
  setSelectedCategories,
  setIsConfigured
} from '../../features/setup/setupSlice'
import { generateQuestions } from '../../features/questions/questionsSlice'
import { AppDispatch } from '../../store'

const categories = [
  { id: 'cultural', label: 'Cultural Fit' },
  { id: 'technical', label: 'Technical' },
  { id: 'behavioral', label: 'Behavioral' },
  { id: 'situational', label: 'Situational' },
]

const difficultyLevels = [
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
]

const SetupForm = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  
  const [companyCulture, setCompanyCultureLocal] = useState('')
  const [jobDescription, setJobDescriptionLocal] = useState('')
  const [questionCounts, setQuestionCounts] = useState({ easy: 5, medium: 5, hard: 5 })
  const [selectedCats, setSelectedCats] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})  
  const [isLoading, setIsLoading] = useState(false)
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!companyCulture.trim()) {
      newErrors.companyCulture = 'Company culture description is required'
    }
    
    if (!jobDescription.trim()) {
      newErrors.jobDescription = 'Job description is required'
    }
    
    if (selectedCats.length === 0) {
      newErrors.categories = 'At least one question category must be selected'
    }
    
    // Check if at least one question count is greater than 0
    const totalQuestions = Object.values(questionCounts).reduce((sum, count) => sum + count, 0)
    if (totalQuestions === 0) {
      newErrors.questionCounts = 'At least one question difficulty level must have questions'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleCompanyCultureChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCompanyCultureLocal(e.target.value)
    if (errors.companyCulture) {
      setErrors({ ...errors, companyCulture: '' })
    }
  }
  
  const handleJobDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setJobDescriptionLocal(e.target.value)
    if (errors.jobDescription) {
      setErrors({ ...errors, jobDescription: '' })
    }
  }
  
  const handleQuestionCountChange = (difficulty: 'easy' | 'medium' | 'hard', value: number) => {
    setQuestionCounts({ ...questionCounts, [difficulty]: value })
    if (errors.questionCounts) {
      setErrors({ ...errors, questionCounts: '' })
    }
  }
  
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const updatedCategories = checked
      ? [...selectedCats, categoryId]
      : selectedCats.filter(id => id !== categoryId)
    
    setSelectedCats(updatedCategories)
    if (errors.categories && updatedCategories.length > 0) {
      setErrors({ ...errors, categories: '' })
    }
  }
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    // Dispatch actions to update state
    dispatch(setCompanyCulture(companyCulture))
    dispatch(setJobDescription(jobDescription))
    
    // Dispatch actions for each difficulty level
    Object.entries(questionCounts).forEach(([difficulty, count]) => {
      dispatch(setQuestionQuantity({ 
        difficulty: difficulty as 'easy' | 'medium' | 'hard', 
        quantity: count 
      }))
    })
    
    dispatch(setSelectedCategories(selectedCats))
    dispatch(setIsConfigured(true))
    
    // Generate questions
    setIsLoading(true)
    try {
      await dispatch(generateQuestions()).unwrap()
      navigate('/interview')
    } catch (error) {
      console.error('Failed to generate questions:', error)
      setErrors({ ...errors, general: 'Failed to generate questions. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Company and Job Information</h2>
        
        <div>
          <label htmlFor="companyCulture" className="label">
            Company Culture Description
          </label>
          <textarea
            id="companyCulture"
            value={companyCulture}
            onChange={handleCompanyCultureChange}
            placeholder="Describe your company culture, values, and work environment..."
            className={`input h-32 ${errors.companyCulture ? 'border-red-500' : ''}`}
          />
          {errors.companyCulture && (
            <p className="text-red-500 text-xs mt-1">{errors.companyCulture}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="jobDescription" className="label">
            Job Description
          </label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={handleJobDescriptionChange}
            placeholder="Enter the job description, responsibilities, and required skills..."
            className={`input h-32 ${errors.jobDescription ? 'border-red-500' : ''}`}
          />
          {errors.jobDescription && (
            <p className="text-red-500 text-xs mt-1">{errors.jobDescription}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Question Settings</h2>
        
        <div>
          <label className="label">Question Categories</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map(category => (
              <div key={category.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`category-${category.id}`}
                  checked={selectedCats.includes(category.id)}
                  onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor={`category-${category.id}`} className="ml-2 block text-sm text-gray-700">
                  {category.label}
                </label>
              </div>
            ))}
          </div>
          {errors.categories && (
            <p className="text-red-500 text-xs mt-1">{errors.categories}</p>
          )}
        </div>
        
        <div>
          <label className="label">Number of Questions per Difficulty Level</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {difficultyLevels.map(level => (
              <div key={level.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-700 mb-2">{level.label}</h3>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => handleQuestionCountChange(level.id as 'easy' | 'medium' | 'hard', Math.max(0, questionCounts[level.id as 'easy' | 'medium' | 'hard'] - 1))}
                    className="p-1 rounded-md bg-gray-200 hover:bg-gray-300"
                    aria-label={`Decrease ${level.label} questions`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <span className="mx-4 text-lg font-medium w-6 text-center">
                    {questionCounts[level.id as 'easy' | 'medium' | 'hard']}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuestionCountChange(level.id as 'easy' | 'medium' | 'hard', questionCounts[level.id as 'easy' | 'medium' | 'hard'] + 1)}
                    className="p-1 rounded-md bg-gray-200 hover:bg-gray-300"
                    aria-label={`Increase ${level.label} questions`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          {errors.questionCounts && (
            <p className="text-red-500 text-xs mt-1">{errors.questionCounts}</p>
          )}
        </div>
      </div>
      
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {errors.general}
        </div>
      )}
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className={`btn btn-primary ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Questions...
            </span>
          ) : 'Generate Interview Questions'}
        </button>
      </div>
    </form>
  )
}

export default SetupForm