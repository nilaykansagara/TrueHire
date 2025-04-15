import { useRef, useEffect, useState } from 'react'
import { useAudioRecording } from '../../hooks/useAudioRecording'

interface RecordingControlsProps {
  onRecordingComplete: (blob: Blob) => void
}

const RecordingControls = ({ onRecordingComplete }: RecordingControlsProps) => {
  const {
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
  } = useAudioRecording({ onRecordingComplete })
  
  const timerRef = useRef<number>(0)
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [minutes, setMinutes] = useState<number>(0)
  const [seconds, setSeconds] = useState<number>(0)
  
  // Timer logic
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerIntervalRef.current = setInterval(() => {
        timerRef.current += 1
        setSeconds(timerRef.current % 60)
        setMinutes(Math.floor(timerRef.current / 60))
      }, 1000)
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
    }
    
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [isRecording, isPaused])
  
  // Reset timer when recording is stopped
  useEffect(() => {
    if (!isRecording && timerRef.current !== 0) {
      timerRef.current = 0
      setSeconds(0)
      setMinutes(0)
    }
  }, [isRecording])
  
  const formatTime = (value: number) => {
    return value.toString().padStart(2, '0')
  }
  
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      action()
    }
  }
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Recording Controls</h3>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="flex flex-col items-center space-y-4">
        {/* Timer and visualizer */}
        <div className="w-full flex flex-col items-center">
          <div className="text-3xl font-mono font-semibold text-gray-700 mb-2">
            {formatTime(minutes)}:{formatTime(seconds)}
          </div>
          
          <div className="w-full h-16 bg-gray-100 rounded-md overflow-hidden">
            <canvas 
              ref={canvasRef} 
              width="400" 
              height="64"
              className="w-full h-full"
            />
          </div>
        </div>
        
        {/* Recording controls */}
        <div className="flex justify-center space-x-3">
          {!isRecording ? (
            <button
              onClick={startRecording}
              onKeyDown={(e) => handleKeyDown(e, startRecording)}
              className="btn bg-red-500 hover:bg-red-600 text-white flex items-center space-x-1 focus:ring-red-500"
              disabled={audioBlob !== null}
              aria-label="Start recording"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <circle cx="10" cy="10" r="6" />
              </svg>
              <span>Record</span>
            </button>
          ) : isPaused ? (
            <button
              onClick={resumeRecording}
              onKeyDown={(e) => handleKeyDown(e, resumeRecording)}
              className="btn bg-blue-500 hover:bg-blue-600 text-white flex items-center space-x-1 focus:ring-blue-500"
              aria-label="Resume recording"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              <span>Resume</span>
            </button>
          ) : (
            <button
              onClick={pauseRecording}
              onKeyDown={(e) => handleKeyDown(e, pauseRecording)}
              className="btn bg-yellow-500 hover:bg-yellow-600 text-white flex items-center space-x-1 focus:ring-yellow-500"
              aria-label="Pause recording"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>Pause</span>
            </button>
          )}
          
          {isRecording && (
            <button
              onClick={stopRecording}
              onKeyDown={(e) => handleKeyDown(e, stopRecording)}
              className="btn bg-green-500 hover:bg-green-600 text-white flex items-center space-x-1 focus:ring-green-500"
              aria-label="Stop recording"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
              </svg>
              <span>Stop</span>
            </button>
          )}
          
          {isRecording && (
            <button
              onClick={cancelRecording}
              onKeyDown={(e) => handleKeyDown(e, cancelRecording)}
              className="btn bg-gray-500 hover:bg-gray-600 text-white flex items-center space-x-1 focus:ring-gray-500"
              aria-label="Cancel recording"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>Cancel</span>
            </button>
          )}
        </div>
        
        {/* Audio playback */}
        {audioBlob && (
          <div className="w-full mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Recording Preview</h4>
            <audio 
              src={URL.createObjectURL(audioBlob)} 
              controls 
              className="w-full"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default RecordingControls