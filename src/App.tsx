import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SetupPage from './pages/SetupPage'
import InterviewPage from './pages/InterviewPage'
import ResultsPage from './pages/ResultsPage'
import Header from './components/common/Header'

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<SetupPage />} />
            <Route path="/interview" element={<InterviewPage />} />
            <Route path="/results" element={<ResultsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App