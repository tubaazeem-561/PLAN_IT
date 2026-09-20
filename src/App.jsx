import { useState } from 'react'
import { signUp, signIn, signOut } from './lib/auth'
import { supabase } from './lib/supabase'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [user, setUser] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSignUp() {
    try {
      const newUser = await signUp(username, password)
      setUser(newUser)
      setMessage(`Signed up as ${username}`)
    } catch (err) {
      setMessage(err.message)
    }
  }

  async function handleSignIn() {
    try {
      const loggedInUser = await signIn(username, password)
      setUser(loggedInUser)
      setMessage(`Signed in as ${username}`)
    } catch (err) {
      setMessage(err.message)
    }
  }

  async function handleSignOut() {
    await signOut()
    setUser(null)
    setMessage('Signed out')
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>PlanIt Auth Test</h1>

      {user ? (
        <div>
          <p>Logged in. User ID: {user.id}</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <div>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
                  <div style={{ position: 'relative', display: 'inline-block' }}>
            <input
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ marginLeft: '0.5rem' }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <br />
          <button onClick={handleSignUp}>Sign Up</button>
          <button onClick={handleSignIn}>Sign In</button>
        </div>
      )}

      <p>{message}</p>
    </div>
  )
}

export default App