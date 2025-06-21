import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { handleApiError, validateForm } from './utils/errorHandler'
import './App.css'

function Login() {
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  // Clear errors when auth error changes
  useEffect(() => {
    if (error) {
      setErrors({ general: handleApiError(error) })
    }
  }, [error])

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

  const validateLoginForm = () => {
    return validateForm(formData, {
      email: { required: true, email: true, label: 'Email' },
      password: { required: true, minLength: 6, label: 'Password' }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Clear any previous errors
    clearError()
    setErrors({})

    const newErrors = validateLoginForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await login(formData)
      // Navigation will be handled by useEffect when isAuthenticated changes
    } catch (error) {
      // Error is handled by the auth context and useEffect
      console.error('Login failed:', error)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <img src="./images/logos/Q-bot_logo.png" alt="Q-bot Logo" className="login-logo" />
        </div>
        <h1>Q-bot</h1>
        <p className="login-subtitle">Please sign in to your account</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          {errors.general && (
            <div className="error-message general-error">
              {errors.general}
            </div>
          )}
          
          <div className="form-group">
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
          
          <div className="form-group form-group-last">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="login-footer">
          <a href="#" className="forgot-password">Forgot your password?</a>
          <div className="create-account-section">
            <span className="create-account-text">Don't have an account? </span>
            <Link to="/register" className="create-account-link">Create account</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
