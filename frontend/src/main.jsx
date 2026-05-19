import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Auth from './Auth.jsx'

function Root() {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('jt_token')
    const savedUser = localStorage.getItem('jt_user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setChecking(false)
  }, [])

  function handleAuth(user, token) {
    setUser(user)
    setToken(token)
  }

  function handleLogout() {
    localStorage.removeItem('jt_token')
    localStorage.removeItem('jt_user')
    setUser(null)
    setToken(null)
  }

  if (checking) return null

  if (!user || !token) {
    return <Auth onAuth={handleAuth} />
  }

  return <App user={user} token={token} onLogout={handleLogout} />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
