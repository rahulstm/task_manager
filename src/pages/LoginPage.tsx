import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError('Login failed. Please check your credentials.')
    }
  }

  return (
    <section className="page-shell auth-page">
      <div className="form-card">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </label>
          <label>
            Password
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </label>
          {error && <div className="form-error">{error}</div>}
          <button type="submit" className="button">Sign in</button>
        </form>
        <p>
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </section>
  )
}
