import { useState } from 'react'
import { Link } from 'react-router'
import { registerUser } from '../services/authService'
import '../cartNotice.css'

export default function Register() {
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    const form = new FormData(event.currentTarget)
    try {
      const result = await registerUser({ name: form.get('name'), email: form.get('email'), password: form.get('password') })
      setMessage(result.message || 'Account created. Please log in.')
      window.setTimeout(() => window.location.assign('/login'), 1000)
    } catch (error) { setMessage(error.message) }
    finally { setBusy(false) }
  }
  return <main className="auth-page page-shell"><div className="auth-art"><img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=90" alt="Shop online with Exclusive"/></div><section className="auth-panel"><h1>Create an account</h1><p>Enter your details below</p><form onSubmit={submit}><label>Name<input name="name" required placeholder="Your name"/></label><label>Email Address<input name="email" type="email" required placeholder="Enter your email"/></label><label>Password<input name="password" type="password" required minLength="8" placeholder="At least 8 characters"/></label><button className="primary-btn full-btn" disabled={busy}>{busy?'Creating account…':'Create Account'}</button>{message&&<p className="form-message error-message">{message}</p>}</form><p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p></section></main>
}
