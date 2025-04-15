// Custom hook for managing audio recording functionality

import { useState, useEffect, useCallback, useRef } from 'react'
import { audioRecordingService } from '../services/audioService'

interface UseAudioRecordingProps {
  onRecordingComplete?: (blob: Blob) => void
}

export function useAudioRecording({ onRecordingComplete }: UseAudioRecordingProps = {}) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const visualizationCleanupRef = useRef<(() => void) | null>(null)

  // Cleanup visualization when component unmounts
  useEffect(() => {
    return () => {
      if (visualizationCleanupRef.current) {
        visualizationCleanupRef.current()
      }
    }
  }, [])

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      setAudioBlob(null)
      
      const success = await audioRecordingService.startRecording()
      
      if (success) {
        setIsRecording(true)
        setIsPaused(false)
        
        // Create visualization if canvas ref is available
        if (canvasRef.current) {
          const cleanup = audioRecordingService.createAudioVisualization(canvasRef.current)
          if (cleanup) {
            visualizationCleanupRef.current = cleanup
          }
        }
      } else {
        setError('Failed to start recording')
      }
    } catch (err) {
      setError('Error starting recording')
      console.error(err)
    }
  }, [])

  const stopRecording = useCallback(async () => {
    try {
      if (!isRecording) return
      
      const blob = await audioRecordingService.stopRecording()
      
      setIsRecording(false)
      setIsPaused(false)
      
      if (blob) {
        setAudioBlob(blob)
        if (onRecordingComplete) {
          onRecordingComplete(blob)
        }
      }
      
      // Clean up visualization
      if (visualizationCleanupRef.current) {
        visualizationCleanupRef.current()
        visualizationCleanupRef.current = null
      }
    } catch (err) {
      setError('Error stopping recording')
      console.error(err)
    }
  }, [isRecording, onRecordingComplete])

  const pauseRecording = useCallback(() => {
    if (!isRecording || isPaused) return
    
    const success = audioRecordingService.pauseRecording()
    if (success) {
      setIsPaused(true)
    }
  }, [isRecording, isPaused])

  const resumeRecording = useCallback(() => {
    if (!isRecording || !isPaused) return
    
    const success = audioRecordingService.resumeRecording()
    if (success) {
      setIsPaused(false)
    }
  }, [isRecording, isPaused])

  const cancelRecording = useCallback(() => {
    audioRecordingService.cancelRecording()
    setIsRecording(false)
    setIsPaused(false)
    setAudioBlob(null)
    
    // Clean up visualization
    if (visualizationCleanupRef.current) {
      visualizationCleanupRef.current()
      visualizationCleanupRef.current = null
    }
  }, [])

  return {
    isRecording,
    isPaused,
    audioBlob,
    error,
    canvasRef,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    cancelRecording
  }
}