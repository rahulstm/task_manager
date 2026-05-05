import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NavBar() {
  const { user, logout } = useAuth()

  return (
    <header className="nav-bar">
      <div className="nav-brand">
        <Link to="/">Team Task Manager</Link>
      </div>
      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/projects">Projects</Link>
      </nav>
      <div className="nav-actions">
        {user ? (
          <>
            <span>{user.name} ({user.role})</span>
            <button type="button" onClick={logout} className="button secondary">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="button">
            Login
          </Link>
        )}
      </div>
    </header>
  )
}
