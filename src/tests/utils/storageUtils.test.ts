import {
  saveToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
  clearInterviewData
} from '../../utils/storageUtils'

describe('Storage Utils', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    
    // Mock localStorage methods
    jest.spyOn(window.localStorage, 'setItem')
    jest.spyOn(window.localStorage, 'getItem')
    jest.spyOn(window.localStorage, 'removeItem')
  })
  
  afterEach(() => {
    jest.restoreAllMocks()
  })
  
  test('saveToLocalStorage saves data correctly', () => {
    const testData = { name: 'Test Data', value: 42 }
    saveToLocalStorage('test-key', testData)
    
    expect(localStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(testData))
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify(testData))
  })
  
  test('getFromLocalStorage retrieves data correctly', () => {
    const testData = { name: 'Test Data', value: 42 }
    localStorage.setItem('test-key', JSON.stringify(testData))
    
    const retrievedData = getFromLocalStorage('test-key')
    expect(retrievedData).toEqual(testData)
  })
  
  test('getFromLocalStorage returns null for non-existent key', () => {
    const retrievedData = getFromLocalStorage('non-existent-key')
    expect(retrievedData).toBeNull()
  })
  
  test('getFromLocalStorage handles invalid JSON', () => {
    localStorage.setItem('invalid-json', 'not valid json')
    
    // Mock console.error to prevent the error from showing in test output
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    
    const retrievedData = getFromLocalStorage('invalid-json')
    expect(retrievedData).toBeNull()
    expect(consoleErrorSpy).toHaveBeenCalled()
    
    consoleErrorSpy.mockRestore()
  })
  
  test('removeFromLocalStorage removes item correctly', () => {
    localStorage.setItem('test-key', 'test-value')
    
    removeFromLocalStorage('test-key')
    
    expect(localStorage.removeItem).toHaveBeenCalledWith('test-key')
    expect(localStorage.getItem('test-key')).toBeNull()
  })
  
  test('clearInterviewData removes all interview-related keys', () => {
    // Set up some test data
    const testKeys = [
      'truehire_setup',
      'truehire_questions',
      'truehire_evaluations',
      'truehire_interview_state',
      'unrelated_key'
    ]
    
    testKeys.forEach(key => {
      localStorage.setItem(key, 'some-value')
    })
    
    clearInterviewData()
    
    // Interview keys should be removed
    expect(localStorage.getItem('truehire_setup')).toBeNull()
    expect(localStorage.getItem('truehire_questions')).toBeNull()
    expect(localStorage.getItem('truehire_evaluations')).toBeNull()
    expect(localStorage.getItem('truehire_interview_state')).toBeNull()
    
    // Unrelated key should still exist
    expect(localStorage.getItem('unrelated_key')).toBe('some-value')
  })
})