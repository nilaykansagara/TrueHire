import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SetupState {
  companyCulture: string
  jobDescription: string
  questionQuantity: {
    easy: number
    medium: number
    hard: number
  }
  selectedCategories: string[]
  isConfigured: boolean
}

const initialState: SetupState = {
  companyCulture: '',
  jobDescription: '',
  questionQuantity: {
    easy: 5,
    medium: 5,
    hard: 5,
  },
  selectedCategories: [],
  isConfigured: false,
}

export const setupSlice = createSlice({
  name: 'setup',
  initialState,
  reducers: {
    setCompanyCulture: (state, action: PayloadAction<string>) => {
      state.companyCulture = action.payload
      // Save to localStorage for AI evaluation
      try {
        const setupData = localStorage.getItem('setupData') || '{}'
        const parsedData = JSON.parse(setupData)
        localStorage.setItem('setupData', JSON.stringify({
          ...parsedData,
          companyCulture: action.payload
        }))
      } catch (err) {
        console.error('Error saving company culture to localStorage:', err)
      }
    },
    setJobDescription: (state, action: PayloadAction<string>) => {
      state.jobDescription = action.payload
      // Save to localStorage for AI evaluation
      try {
        const setupData = localStorage.getItem('setupData') || '{}'
        const parsedData = JSON.parse(setupData)
        localStorage.setItem('setupData', JSON.stringify({
          ...parsedData,
          jobDescription: action.payload
        }))
      } catch (err) {
        console.error('Error saving job description to localStorage:', err)
      }
    },
    setQuestionQuantity: (state, action: PayloadAction<{ difficulty: 'easy' | 'medium' | 'hard', quantity: number }>) => {
      const { difficulty, quantity } = action.payload
      state.questionQuantity[difficulty] = quantity
    },
    setSelectedCategories: (state, action: PayloadAction<string[]>) => {
      state.selectedCategories = action.payload
    },
    setIsConfigured: (state, action: PayloadAction<boolean>) => {
      state.isConfigured = action.payload
    },
    resetSetup: () => initialState,
  },
})

export const { 
  setCompanyCulture, 
  setJobDescription, 
  setQuestionQuantity, 
  setSelectedCategories,
  setIsConfigured,
  resetSetup 
} = setupSlice.actions

export default setupSlice.reducer