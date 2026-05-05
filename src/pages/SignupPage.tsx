import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'Admin' | 'Member'>('Member')
  const [error, setError] = useState<string | null>(null)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    try {
      await signup(name, email, password, role)
      navigate('/')
    } catch (err) {
      setError('Signup failed. Please try again.')
    }
  }

  return (
    <section className="page-shell auth-page">
      <div className="form-card">
        <h1>Create account</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </label>
          <label>
            Password
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </label>
          <label>
            Role
            <select value={role} onChange={(e) => setRole(e.target.value as 'Admin' | 'Member')}>
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>
          </label>
          {error && <div className="form-error">{error}</div>}
          <button type="submit" className="button">Create account</button>
        </form>
        <p>
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </section>
  )
}
