// Utility functions for local storage operations

/**
 * Saves data to localStorage with the specified key
 */
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Error saving to localStorage: ${error}`)
  }
}

/**
 * Retrieves data from localStorage by key
 */
export const getFromLocalStorage = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error(`Error retrieving from localStorage: ${error}`)
    return null
  }
}

/**
 * Removes data from localStorage by key
 */
export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing from localStorage: ${error}`)
  }
}

/**
 * Clears all interview-related data from localStorage
 */
export const clearInterviewData = (): void => {
  const interviewKeys = [
    'truehire_setup',
    'truehire_questions',
    'truehire_evaluations',
    'truehire_interview_state'
  ]
  
  interviewKeys.forEach(key => removeFromLocalStorage(key))
}

/**
 * Exports interview results as a JSON file for download
 */
export const exportResults = (interviewData: any): void => {
  try {
    const jsonString = JSON.stringify(interviewData, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `interview_results_${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(link)
    link.click()
    
    setTimeout(() => {
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }, 100)
  } catch (error) {
    console.error(`Error exporting results: ${error}`)
  }
}