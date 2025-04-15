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
      // In a real app, send the audio to a transcription service
      // For now, we'll simulate a delay and return mock text
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock transcription result
      return 'This is a simulated transcription of the candidate\'s answer. In a real implementation, this would be the actual transcribed text from the audio recording.'
    } catch (error) {
      return rejectWithValue('Failed to transcribe audio')
    }
  }
)

export const evaluateAnswer = createAsyncThunk(
  'interview/evaluateAnswer',
  async ({ questionId, transcription }: { questionId: string, transcription: string }, { rejectWithValue }) => {
    try {
      // In a real app, send the transcription to an AI evaluation service
      // For now, we'll simulate a delay and return a mock evaluation
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock evaluation result (percentage score between 0-100)
      const score = Math.floor(Math.random() * 41) + 60 // Random score between 60-100
      
      return {
        questionId,
        transcription,
        score,
        feedback: 'This is simulated feedback on the candidate\'s answer. In a real implementation, this would be AI-generated evaluation feedback.'
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