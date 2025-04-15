// Audio recording service using Web Audio API

class AudioRecordingService {
  private mediaRecorder: MediaRecorder | null = null
  private audioChunks: Blob[] = []
  private stream: MediaStream | null = null

  async startRecording() {
    try {
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      this.audioChunks = []

      // Create media recorder
      this.mediaRecorder = new MediaRecorder(this.stream)

      // Add data chunks when available
      this.mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data)
        }
      })

      // Start recording
      this.mediaRecorder.start()
      return true
    } catch (error) {
      console.error('Error starting recording:', error)
      return false
    }
  }

  async stopRecording(): Promise<Blob | null> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        resolve(null)
        return
      }

      this.mediaRecorder.addEventListener('stop', () => {
        // Create blob from chunks
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' })
        
        // Stop all audio tracks
        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop())
          this.stream = null
        }
        
        resolve(audioBlob)
      })

      this.mediaRecorder.stop()
    })
  }

  pauseRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause()
      return true
    }
    return false
  }

  resumeRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume()
      return true
    }
    return false
  }

  cancelRecording() {
    if (this.mediaRecorder) {
      if (this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop()
      }
      
      // Stop all audio tracks
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop())
        this.stream = null
      }
      
      this.audioChunks = []
      this.mediaRecorder = null
      return true
    }
    return false
  }

  createAudioVisualization(canvas: HTMLCanvasElement): (() => void) | null {
    if (!this.stream) return null

    const audioContext = new AudioContext()
    const source = audioContext.createMediaStreamSource(this.stream)
    const analyser = audioContext.createAnalyser()
    
    analyser.fftSize = 256
    source.connect(analyser)
    
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    
    const canvasWidth = canvas.width
    const canvasHeight = canvas.height
    
    const visualize = () => {
      const animationId = requestAnimationFrame(visualize)
      
      analyser.getByteFrequencyData(dataArray)
      
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)
      ctx.fillStyle = '#63B3ED' // Use the sky blue color
      
      const barWidth = (canvasWidth / bufferLength) * 2.5
      let x = 0
      
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvasHeight
        
        ctx.fillRect(x, canvasHeight - barHeight, barWidth, barHeight)
        
        x += barWidth + 1
      }
      
      // Return a cleanup function
      return () => {
        cancelAnimationFrame(animationId)
        audioContext.close()
      }
    }
    
    return visualize()
  }
}

export const audioRecordingService = new AudioRecordingService()