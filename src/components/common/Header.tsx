import { Link, useLocation } from 'react-router-dom'

const Header = () => {
  const location = useLocation()
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            TrueHire
          </Link>
          <span className="text-xs bg-secondary-light text-secondary-dark px-2 py-1 rounded ml-2">
            v3.0
          </span>
        </div>
        
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li>
              <Link 
                to="/" 
                className={`${location.pathname === '/' ? 'text-primary font-medium' : 'text-gray-500 hover:text-primary'}`}
              >
                Setup
              </Link>
            </li>
            <li>
              <Link 
                to="/interview" 
                className={`${location.pathname === '/interview' ? 'text-primary font-medium' : 'text-gray-500 hover:text-primary'}`}
              >
                Interview
              </Link>
            </li>
            <li>
              <Link 
                to="/results" 
                className={`${location.pathname === '/results' ? 'text-primary font-medium' : 'text-gray-500 hover:text-primary'}`}
              >
                Results
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header