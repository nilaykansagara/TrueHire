import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../store'
import SetupForm from '../components/setup/SetupForm'

const SetupPage = () => {
  const { isConfigured } = useSelector((state: RootState) => state.setup)
  const navigate = useNavigate()
  
  // If already configured, redirect to interview page
  useEffect(() => {
    if (isConfigured) {
      navigate('/interview')
    }
  }, [isConfigured, navigate])
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Interview Setup</h1>
        <p className="text-gray-600 mb-8">
          Configure your interview process by providing information about your company culture, 
          job description, and the types of questions you want to ask. TrueHire will use AI to 
          generate tailored interview questions based on your input.
        </p>
        
        <SetupForm />
      </div>
    </div>
  )
}

export default SetupPage