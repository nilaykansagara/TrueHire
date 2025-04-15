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

      // Import the aiService to generate questions
      const { aiService } = await import('../../services/aiService')
      
      // Generate questions using the AI service
      return await aiService.generateQuestions({
        companyCulture,
        jobDescription,
        questionQuantity,
        selectedCategories
      })
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