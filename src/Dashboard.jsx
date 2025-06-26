import { useState } from 'react'
import { useAuth } from './context/AuthContext'
import { useTheme } from './context/ThemeContext'
import ConversationHistory from './components/ConversationHistory'
import Settings from './components/Settings'
import './Dashboard.css'
import './DarkTheme.css'

function Dashboard() {
  const { user, logout } = useAuth()
  const { toggleTheme, isDark } = useTheme()

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: `Hello${user?.firstName ? ` ${user.firstName}` : ''}! I'm Q-bot. How can I help you today?`,
      timestamp: new Date()
    }
  ])

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [inputMessage, setInputMessage] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (inputMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: 'user',
        content: inputMessage,
        timestamp: new Date()
      }
      setMessages([...messages, newMessage])
      setInputMessage('')

      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          type: 'bot',
          content: 'I received your message. How else can I assist you?',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, botResponse])
      }, 1000)
    }
  }

  const handleFileUpload = () => {
    // File upload functionality will be added here
    console.log('File upload clicked')
  }

  const handleLogout = async () => {
    try {
      await logout()
      // Navigation will be handled by the AuthProvider
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleShowHistory = () => {
    setShowHistory(true)
  }

  const handleCloseHistory = () => {
    setShowHistory(false)
  }

  const handleShowSettings = () => {
    setShowSettings(true)
  }

  const handleCloseSettings = () => {
    setShowSettings(false)
  }

  const handleSelectConversation = (conversation) => {
    // Load the selected conversation into the current chat
    console.log('Loading conversation:', conversation)
    // For now, just show an alert. In a real app, you'd load the conversation messages
    alert(`Loading conversation: ${conversation.title}`)
  }

  return (
    <div className="dashboard-container">
      {/* Mobile Navigation Bar */}
      <nav className="mobile-navbar">
        <div className="mobile-nav-left">
          <div className="mobile-logo-section">
            <img src="/Q-bot/images/logos/Q-bot_logo.png" alt="Q-bot Logo" className="mobile-nav-logo" />
            <span className="mobile-nav-brand">Q-bot</span>
          </div>
        </div>
        <div className="mobile-nav-right">
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isMobileMenuOpen ? (
                // X icon when menu is open
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                // Hamburger icon when menu is closed
                <>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
        <ul className="mobile-menu" onClick={(e) => e.stopPropagation()}>
          <li className="mobile-nav-item">
            <button className="mobile-nav-link" onClick={() => { handleFileUpload(); setIsMobileMenuOpen(false); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.49"/>
              </svg>
              Upload File
            </button>
          </li>
          <li className="mobile-nav-item">
            <button className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10,9 9,9 8,9"></polyline>
              </svg>
              Analyze Text
            </button>
          </li>
          <li className="mobile-nav-item">
            <button className="mobile-nav-link" onClick={() => { handleShowSettings(); setIsMobileMenuOpen(false); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              Settings
            </button>
          </li>
          <li className="mobile-nav-item">
            <button className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
              Help & Tips
            </button>
          </li>
          <li className="mobile-nav-item">
            <button className="mobile-nav-link" onClick={() => { handleShowHistory(); setIsMobileMenuOpen(false); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3v5h5"></path>
                <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"></path>
                <path d="M12 7v5l4 2"></path>
              </svg>
              History
            </button>
          </li>
          <li className="mobile-nav-item">
            <button className="mobile-nav-link" onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }}>
              {isDark ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="19.78" y1="4.22" x2="18.36" y2="5.64"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="19.78" y1="19.78" x2="18.36" y2="18.36"></line>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
          </li>
        </ul>
      </div>

      <main className="chat-container">
        <div className="chat-sidebar">
          <div className="sidebar-header">
            <div className="logo-section">
              <img src="/Q-bot/images/logos/Q-bot_logo.png" alt="Q-bot Logo" className="sidebar-logo" />
              <span className="sidebar-brand">Q-bot</span>
            </div>
          </div>
          <div className="sidebar-content">
            <div className="quick-actions">

              <button className="quick-action-btn" onClick={handleFileUpload}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.49"/>
                </svg>
                Upload File
              </button>
              <button className="quick-action-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14,2 14,8 20,8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10,9 9,9 8,9"></polyline>
                </svg>
                Analyze Text
              </button>
              <button className="quick-action-btn" onClick={handleShowSettings}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                Settings
              </button>
              <button className="quick-action-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                Help & Tips
              </button>
            </div>

            <div className="sidebar-section">
              <button className="quick-action-btn history-btn" onClick={handleShowHistory}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3v5h5"></path>
                  <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"></path>
                  <path d="M12 7v5l4 2"></path>
                </svg>
                History
              </button>
            </div>
          </div>
          <div className="sidebar-footer">
            <button className="theme-toggle" onClick={toggleTheme}>
              {isDark ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button className="logout-btn-animated" onClick={handleLogout}>
              <div className="logout-icon-container">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1024 1024"
                  height="20px"
                  width="20px"
                >
                  <path
                    d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <p className="logout-text">Logout</p>
            </button>
          </div>
        </div>

        <div className="chat-main">
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                <div className="message-content">
                  {message.type === 'bot' && (
                    <div className="bot-avatar">
                      <img src="/Q-bot/images/logos/Q-bot_logo.png" alt="Q-bot" />
                    </div>
                  )}
                  <div className="message-bubble">
                    <p>{message.content}</p>
                    <span className="message-time">
                      {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="chat-input-area">
            <form onSubmit={handleSendMessage} className="message-form">
              <div className="messageBox">
                <div className="fileUploadWrapper">
                  <label htmlFor="file">
                    <svg viewBox="0 0 337 337" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle
                        cx="168.5"
                        cy="168.5"
                        r="158.5"
                        fill="none"
                        stroke="#6c6c6c"
                        strokeWidth="20"
                      />
                      <path
                        d="M167.759 79V259"
                        stroke="#6c6c6c"
                        strokeWidth="25"
                        strokeLinecap="round"
                      />
                      <path
                        d="M79 167.138H259"
                        stroke="#6c6c6c"
                        strokeWidth="25"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="tooltip">Add an image</span>
                  </label>
                  <input name="file" id="file" type="file" />
                </div>
                <input
                  id="messageInput"
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Message..."
                  required
                />
                <button id="sendButton" type="submit">
                  <svg viewBox="0 0 664 663" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
                      fill="none"
                    />
                    <path
                      d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
                      stroke="#6c6c6c"
                      strokeWidth="33.67"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <ConversationHistory
        isOpen={showHistory}
        onClose={handleCloseHistory}
        onSelectConversation={handleSelectConversation}
      />

      <Settings
        isOpen={showSettings}
        onClose={handleCloseSettings}
      />
    </div>
  )
}

export default Dashboard
