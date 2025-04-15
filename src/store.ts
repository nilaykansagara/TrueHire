import { configureStore } from '@reduxjs/toolkit'
import setupReducer from './features/setup/setupSlice'
import questionsReducer from './features/questions/questionsSlice'
import interviewReducer from './features/interview/interviewSlice'

export const store = configureStore({
  reducer: {
    setup: setupReducer,
    questions: questionsReducer,
    interview: interviewReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch