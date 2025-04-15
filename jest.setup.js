import '@testing-library/jest-dom'

// Mock the Web Audio API which isn't available in jsdom
window.AudioContext = jest.fn().mockImplementation(() => {
  return {
    createMediaStreamSource: jest.fn().mockImplementation(() => {
      return {
        connect: jest.fn(),
      }
    }),
    createAnalyser: jest.fn().mockImplementation(() => {
      return {
        frequencyBinCount: 128,
        getByteFrequencyData: jest.fn(),
        fftSize: 0,
      }
    }),
    close: jest.fn(),
  }
})

window.MediaRecorder = jest.fn().mockImplementation(() => {
  return {
    start: jest.fn(),
    stop: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
    addEventListener: jest.fn(),
    state: 'inactive',
  }
})

// Mock navigator.mediaDevices.getUserMedia
Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: jest.fn().mockImplementation(() => Promise.resolve({
      getTracks: () => [{ stop: jest.fn() }],
    })),
  },
})

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn().mockImplementation(() => 'mock-url')
global.URL.revokeObjectURL = jest.fn()