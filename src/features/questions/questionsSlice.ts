import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '../../store'

export interface Question {
  id: string
  text: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  isAsked: boolean
}

export interface QuestionsState {
  items: Question[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: QuestionsState = {
  items: [],
  status: 'idle',
  error: null,
}

export const generateQuestions = createAsyncThunk(
  'questions/generateQuestions',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const { companyCulture, jobDescription, questionQuantity, selectedCategories } = state.setup

      // In a real app, this would call the AI service with API keys from environment variables
      // For now, we'll just simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 1500))

      // For demo purposes we're generating mock questions
      // In production, this would be an API call to an AI service
      const mockQuestions: Question[] = []
      const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard']
      
      difficulties.forEach(difficulty => {
        const count = questionQuantity[difficulty]
        
        selectedCategories.forEach(category => {
          const questionsPerCategoryDifficulty = Math.ceil(count / selectedCategories.length)
          
          for (let i = 0; i < questionsPerCategoryDifficulty; i++) {
            mockQuestions.push({
              id: `${category}-${difficulty}-${i}`,
              text: `Sample ${category} question (${difficulty} difficulty): Related to ${jobDescription.substring(0, 20)}...`,
              category,
              difficulty,
              isAsked: false,
            })
          }
        })
      })

      return mockQuestions
    } catch (error) {
      return rejectWithValue('Failed to generate questions')
    }
  }
)

export const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    markQuestionAsAsked: (state, action: PayloadAction<string>) => {
      const question = state.items.find(q => q.id === action.payload)
      if (question) {
        question.isAsked = true
      }
    },
    resetQuestions: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateQuestions.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(generateQuestions.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(generateQuestions.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })
  },
})

export const { markQuestionAsAsked, resetQuestions } = questionsSlice.actions

export default questionsSlice.reducer