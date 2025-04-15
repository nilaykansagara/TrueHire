// AI service for question generation, transcription, and evaluation

import { Question } from '../features/questions/questionsSlice'
import { SetupState } from '../features/setup/setupSlice'

// Interface for more detailed AI-generated question
interface AIGeneratedQuestion {
  text: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
}

export const aiService = {
  /**
   * Generates interview questions based on setup parameters
   * This would typically call an actual AI API but is mocked for now
   */
  async generateQuestions(setupData: SetupState): Promise<Question[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const { companyCulture, jobDescription, questionQuantity, selectedCategories } = setupData
      const questions: Question[] = []
      
      // Mock question templates for each category
      const templates = {
        'cultural': [
          'How would you contribute to our company culture which emphasizes %s?',
          'Describe a time when you worked in an environment similar to %s.',
          'What aspects of our culture (%s) align with your personal values?',
          'How do you see yourself adapting to a workplace that values %s?',
          'What strategies would you use to thrive in our culture that prioritizes %s?',
        ],
        'technical': [
          'Explain how you would implement %s as mentioned in the job description.',
          'What experience do you have with %s technologies?',
          'How would you solve a problem related to %s?',
          'Describe your approach to learning new technologies like %s.',
          'What metrics would you use to evaluate the success of a %s project?',
        ],
        'behavioral': [
          'Tell me about a time when you demonstrated %s in your previous role.',
          'How have you handled conflicts with colleagues who did not share your commitment to %s?',
          'Describe a situation where you had to adapt to a new %s process.',
          'Share an example of how you have shown leadership in implementing %s practices.',
          'How do you prioritize tasks when working on %s projects?',
        ],
        'situational': [
          'How would you respond if a stakeholder requested changes that compromise %s?',
          'What would you do if you noticed a colleague not adhering to our %s principles?',
          'Imagine you are leading a project and resources for %s are suddenly cut. How would you proceed?',
          'How would you handle a situation where team members disagree on how to implement %s?',
          'If you were asked to improve our %s processes, what steps would you take?',
        ],
      }
      
      // Seed phrases extracted from job description and company culture
      const extractKeyPhrases = (text: string): string[] => {
        const phrases = text.split(/[.,;]/).filter(p => p.trim().length > 0).map(p => p.trim())
        return phrases.length > 0 ? phrases : ['our core values']
      }
      
      const culturePhrases = extractKeyPhrases(companyCulture)
      const jobPhrases = extractKeyPhrases(jobDescription)
      
      // Generate questions for each category and difficulty
      const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard']
      
      selectedCategories.forEach(category => {
        const categoryTemplates = templates[category as keyof typeof templates] || templates.behavioral
        
        difficulties.forEach(difficulty => {
          const count = questionQuantity[difficulty]
          const questionsPerCategory = Math.ceil(count / selectedCategories.length)
          
          for (let i = 0; i < questionsPerCategory; i++) {
            const templateIndex = Math.floor(Math.random() * categoryTemplates.length)
            const template = categoryTemplates[templateIndex]
            
            // Pick appropriate phrases based on category
            const phrases = category === 'cultural' ? culturePhrases : jobPhrases
            const phraseIndex = Math.floor(Math.random() * phrases.length)
            const phrase = phrases[phraseIndex]
            
            // Format the template with the phrase
            const questionText = template.replace('%s', phrase)
            
            questions.push({
              id: `${category}-${difficulty}-${i}`,
              text: questionText,
              category,
              difficulty,
              isAsked: false,
            })
          }
        })
      })
      
      return questions
    } catch (error) {
      console.error('Error generating questions:', error)
      throw new Error('Failed to generate questions')
    }
  },
  
  /**
   * Transcribes audio to text
   * This would typically call a transcription API but is mocked for now
   */
  async transcribeAudio(audioBlob: Blob): Promise<string> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In a real implementation, you would send the audio to a service like
      // Google Speech-to-Text, Amazon Transcribe, or OpenAI Whisper
      
      // Mock response
      return 'This is a simulated transcription of the candidate\'s answer. In a real implementation, ' +
        'this would be the actual transcribed text from the audio recording. The transcription would ' +
        'capture the candidate\'s response to the interview question, including their tone, pace, and ' +
        'specific points they made in their answer.'
    } catch (error) {
      console.error('Error transcribing audio:', error)
      throw new Error('Failed to transcribe audio')
    }
  },
  
  /**
   * Evaluates a candidate's answer
   * This would typically call an AI evaluation API but is mocked for now
   */
  async evaluateAnswer(questionId: string, transcription: string, questionText: string): Promise<{
    score: number,
    feedback: string
  }> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real implementation, you would send the question and transcription
      // to an AI service like GPT-4 with a structured prompt
      
      // Extract some characteristics from the question to make the mock evaluation seem more relevant
      const difficulty = questionId.includes('easy') ? 'easy' :
                        questionId.includes('medium') ? 'medium' : 'hard'
      
      const category = questionId.split('-')[0]
      
      // Get company culture from localStorage to evaluate alignment
      let companyCulture = ''
      let jobDescription = ''
      try {
        const setupData = localStorage.getItem('setupData')
        if (setupData) {
          const parsedData = JSON.parse(setupData)
          companyCulture = parsedData.companyCulture || ''
          jobDescription = parsedData.jobDescription || ''
        }
      } catch (err) {
        console.error('Error getting setup data from localStorage:', err)
      }
      
      // Calculate cultural alignment score (0-100)
      let culturalAlignmentScore = 75 // Default middle score
      
      // If we have company culture data, analyze how well the answer aligns
      if (companyCulture && transcription) {
        // In a real implementation, this would use NLP/AI to analyze alignment
        // For demo purposes, we'll do some basic keyword matching
        
        // Extract key terms from company culture (simplified)
        const cultureKeywords = companyCulture.toLowerCase()
          .replace(/[.,;:]/g, '')
          .split(/\s+/)
          .filter(word => word.length > 3) // Only consider words longer than 3 chars
        
        // Count matches in transcription
        const transcriptionLower = transcription.toLowerCase()
        let matchCount = 0
        
        cultureKeywords.forEach(keyword => {
          if (transcriptionLower.includes(keyword)) {
            matchCount++
          }
        })
        
        // Calculate match percentage (more sophisticated in real implementation)
        const keywordCount = cultureKeywords.length
        if (keywordCount > 0) {
          const matchPercentage = (matchCount / keywordCount) * 100
          
          // Weight this as 30% of total score for cultural questions, 10% for others
          if (category === 'cultural') {
            culturalAlignmentScore = matchPercentage * 0.3 + 70 * 0.7 // Blend with base score
          } else {
            culturalAlignmentScore = matchPercentage * 0.1 + 75 * 0.9 // Smaller influence
          }
        }
      }
      
      // Score adjustments based on difficulty and cultural alignment
      const baseScore = Math.floor(Math.random() * 31) + 65 // 65-95 base score
      const difficultyAdjustment = difficulty === 'easy' ? 5 : 
                                  difficulty === 'medium' ? 0 : -5
      
      // Combine scores - weighted by category
      let score = 0
      if (category === 'cultural') {
        // Cultural questions are heavily influenced by cultural alignment
        score = Math.round(baseScore * 0.4 + culturalAlignmentScore * 0.6 + difficultyAdjustment)
      } else {
        // Other questions have a smaller cultural alignment component
        score = Math.round(baseScore * 0.8 + culturalAlignmentScore * 0.2 + difficultyAdjustment)
      }
      
      // Ensure score is within bounds
      score = Math.min(100, Math.max(0, score))
      
      // Generate feedback based on category and score
      let feedback = ''
      
      if (score >= 85) {
        feedback = `Excellent response! The candidate demonstrated strong ${category} skills by `
      } else if (score >= 70) {
        feedback = `Good answer. The candidate showed decent ${category} understanding but could improve by `
      } else {
        feedback = `The answer was below expectations. The candidate's ${category} response lacked `
      }
      
      // Add category-specific feedback
      switch (category) {
        case 'technical':
          feedback += score >= 85 
            ? 'providing detailed technical knowledge and implementation strategies.'
            : score >= 70
              ? 'adding more technical depth and specific implementation details.'
              : 'technical accuracy and practical implementation knowledge.'
          break
        case 'cultural':
          feedback += score >= 85 
            ? `showing clear alignment with company values and cultural priorities. The response strongly aligns with the company's emphasis on ${companyCulture.split('.')[0]}.`
            : score >= 70
              ? `more explicitly connecting their experiences to our specific cultural elements. Could better address how they align with ${companyCulture.split('.')[0]}.`
              : `understanding of how their background aligns with our company culture. Failed to demonstrate alignment with ${companyCulture.split('.')[0]}.`
          break
        case 'behavioral':
          feedback += score >= 85 
            ? 'sharing specific examples with clear actions and measurable outcomes.'
            : score >= 70
              ? 'providing more concrete examples with measurable results.'
              : 'providing specific examples and demonstrating reflection on past experiences.'
          break
        case 'situational':
          feedback += score >= 85 
            ? 'offering thoughtful problem-solving approaches with practical implementation steps.'
            : score >= 70
              ? 'developing more comprehensive solutions with contingency plans.'
              : 'demonstrating structured thinking and practical problem-solving skills.'
          break
        default:
          feedback += 'providing a more structured and relevant response.'
      }
      
      // Add cultural alignment insight for all question types
      if (category !== 'cultural') {
        feedback += culturalAlignmentScore > 80
          ? ' The response also shows good alignment with company culture values.'
          : culturalAlignmentScore > 60
            ? ' The response shows moderate alignment with company culture values.'
            : ' The response could better demonstrate alignment with company culture values.'
      }
      
      return {
        score,
        feedback
      }
    } catch (error) {
      console.error('Error evaluating answer:', error)
      throw new Error('Failed to evaluate answer')
    }
  },
}