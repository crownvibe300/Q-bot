import { useState } from 'react'
import { Link } from 'react-router-dom'
import './App.css'

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function Register() {
  const [formData, setFormData] = useState({
    email: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Here you would typically make an API call to your backend
      console.log('Registration attempt:', formData)
      alert('Registration successful! (This is just a demo)')

      // Reset form
      setFormData({ email: '' })
    } catch (error) {
      setErrors({ general: 'Registration failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      setErrors({})

      // Check if Google OAuth is available
      const response = await fetch(`${API_BASE_URL}/auth/google`)

      if (!response.ok) {
        const errorData = await response.json()
        setErrors({
          general: errorData.message || 'Google login is currently unavailable. Please use email registration.'
        })
        return
      }

      // If successful, redirect to Google OAuth
      window.location.href = `${API_BASE_URL}/auth/google`

    } catch (error) {
      console.error('Google login error:', error)
      setErrors({
        general: 'Google login is currently unavailable. Please use email registration.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <img src="/images/logos/Q-bot_logo.png" alt="Q-bot Logo" className="login-logo" />
        </div>
        <h1>Create Account</h1>
        
        <form onSubmit={handleSubmit} className="login-form">
          {errors.general && (
            <div className="error-message general-error">
              {errors.general}
            </div>
          )}
          
          <div className="form-group form-group-last">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.email && (
              <div className="error-message">{errors.email}</div>
            )}
          </div>
          
          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{margin: '2rem 0'}}></div>

        <button
          className="google-login-button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Login with Google
        </button>
        
        <div className="login-footer">
          <div className="create-account-section">
            <span className="create-account-text">Already have an account? </span>
            <Link to="/" className="create-account-link">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
