import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: '#0a0a0a',
          color: '#00ffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          fontFamily: 'Courier New, monospace'
        }}>
          <h1>ERROR</h1>
          <p style={{ marginTop: '20px', color: '#ff00ff' }}>
            {this.state.error?.message || 'An error occurred'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: 'transparent',
              border: '2px solid #00ffff',
              color: '#00ffff',
              cursor: 'pointer',
              fontFamily: 'Courier New, monospace'
            }}
          >
            RELOAD
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

