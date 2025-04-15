import { render, screen, fireEvent } from '@testing-library/react'
import QuestionCard from '../../components/interview/QuestionCard'

describe('QuestionCard Component', () => {
  const mockQuestion = {
    id: 'test-id',
    text: 'Sample question text',
    category: 'technical',
    difficulty: 'medium',
    isAsked: false
  }
  
  const mockOnClick = jest.fn()
  
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  test('renders question text correctly', () => {
    render(
      <QuestionCard 
        question={mockQuestion} 
        isActive={false} 
        isEvaluated={false} 
        onClick={mockOnClick} 
      />
    )
    
    expect(screen.getByText('Sample question text')).toBeInTheDocument()
  })
  
  test('displays category and difficulty badges', () => {
    render(
      <QuestionCard 
        question={mockQuestion}
        isActive={false}
        isEvaluated={false}
        onClick={mockOnClick}
      />
    )
    
    expect(screen.getByText('Technical')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
  })
  
  test('shows score when evaluated', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        isActive={false}
        isEvaluated={true}
        score={85}
        onClick={mockOnClick}
      />
    )
    
    expect(screen.getByText('85%')).toBeInTheDocument()
    expect(screen.getByText('Evaluated')).toBeInTheDocument()
  })
  
  test('applies active styling when isActive is true', () => {
    const { container } = render(
      <QuestionCard
        question={mockQuestion}
        isActive={true}
        isEvaluated={false}
        onClick={mockOnClick}
      />
    )
    
    const card = container.firstChild
    expect(card).toHaveClass('border-primary-dark')
    expect(card).toHaveClass('bg-primary-light')
  })
  
  test('applies evaluated styling when isEvaluated is true', () => {
    const { container } = render(
      <QuestionCard
        question={mockQuestion}
        isActive={false}
        isEvaluated={true}
        score={75}
        onClick={mockOnClick}
      />
    )
    
    const card = container.firstChild
    expect(card).toHaveClass('bg-gray-50')
  })
  
  test('calls onClick when clicked', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        isActive={false}
        isEvaluated={false}
        onClick={mockOnClick}
      />
    )
    
    fireEvent.click(screen.getByText('Sample question text'))
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })
})