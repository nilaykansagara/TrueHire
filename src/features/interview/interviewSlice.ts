import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'

export interface AnswerEvaluation {
  questionId: string
  transcription: string
  score: number
  feedback?: string
}

export interface InterviewState {
  recording: boolean
  currentQuestionId: string | null
  evaluations: AnswerEvaluation[]
  audioBlob: Blob | null
  transcriptionStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  evaluationStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: InterviewState = {
  recording: false,
  currentQuestionId: null,
  evaluations: [],
  audioBlob: null,
  transcriptionStatus: 'idle',
  evaluationStatus: 'idle',
  error: null,
}

export const transcribeAudio = createAsyncThunk(
  'interview/transcribeAudio',
  async (audioBlob: Blob, { rejectWithValue }) => {
    try {
      // Import aiService to use the actual transcription service
      const { aiService } = await import('../../services/aiService')
      
      // Use AI service to transcribe audio
      return await aiService.transcribeAudio(audioBlob)
    } catch (error) {
      return rejectWithValue('Failed to transcribe audio')
    }
  }
)

export const evaluateAnswer = createAsyncThunk(
  'interview/evaluateAnswer',
  async ({ 
    questionId, 
    transcription,
    questionText
  }: { 
    questionId: string, 
    transcription: string,
    questionText?: string
  }, { rejectWithValue, getState }) => {
    try {
      // Import aiService for evaluation
      const { aiService } = await import('../../services/aiService')
      
      // Get the question text if not provided
      let text = questionText
      if (!text) {
        const state = getState() as RootState
        const question = state.questions.items.find(q => q.id === questionId)
        text = question?.text || ''
      }
      
      // Evaluate the answer using AI service
      const { score, feedback } = await aiService.evaluateAnswer(
        questionId,
        transcription,
        text
      )
      
      return {
        questionId,
        transcription,
        score,
        feedback
      }
    } catch (error) {
      return rejectWithValue('Failed to evaluate answer')
    }
  }
)

export const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    setRecording: (state, action: PayloadAction<boolean>) => {
      state.recording = action.payload
    },
    setCurrentQuestionId: (state, action: PayloadAction<string | null>) => {
      state.currentQuestionId = action.payload
    },
    setAudioBlob: (state, action: PayloadAction<Blob | null>) => {
      state.audioBlob = action.payload
    },
    resetInterview: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(transcribeAudio.pending, (state) => {
        state.transcriptionStatus = 'loading'
        state.error = null
      })
      .addCase(transcribeAudio.fulfilled, (state) => {
        state.transcriptionStatus = 'succeeded'
      })
      .addCase(transcribeAudio.rejected, (state, action) => {
        state.transcriptionStatus = 'failed'
        state.error = action.payload as string
      })
      .addCase(evaluateAnswer.pending, (state) => {
        state.evaluationStatus = 'loading'
        state.error = null
      })
      .addCase(evaluateAnswer.fulfilled, (state, action) => {
        state.evaluationStatus = 'succeeded'
        state.evaluations.push(action.payload)
      })
      .addCase(evaluateAnswer.rejected, (state, action) => {
        state.evaluationStatus = 'failed'
        state.error = action.payload as string
      })
  },
})

export const { 
  setRecording, 
  setCurrentQuestionId, 
  setAudioBlob, 
  resetInterview 
} = interviewSlice.actions

export default interviewSlice.reducer