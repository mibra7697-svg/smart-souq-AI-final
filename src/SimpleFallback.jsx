import React from 'react'

const container = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #0ea5e9, #22c55e)',
  color: '#ffffff',
  fontFamily: 'Cairo, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, sans-serif',
  padding: '2rem',
  textAlign: 'center'
}

const card = {
  backgroundColor: 'rgba(255,255,255,0.1)',
  backdropFilter: 'blur(8px)',
  borderRadius: '16px',
  padding: '2rem',
  maxWidth: '640px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
}

const title = {
  fontSize: '2rem',
  fontWeight: 800,
  marginBottom: '0.75rem'
}

const subtitle = {
  fontSize: '1rem',
  opacity: 0.9,
  marginBottom: '1.5rem'
}

const button = {
  display: 'inline-block',
  padding: '0.75rem 1.25rem',
  borderRadius: '10px',
  backgroundColor: '#111827',
  color: '#ffffff',
  textDecoration: 'none',
  fontWeight: 700
}

export default function SimpleFallback() {
  return (
    <div style={container}>
      <div style={card}>
        <div style={title}>Smart Souq</div>
        <div style={subtitle}>Welcome to Smart Souq Brokerage & Comparison</div>
        <a href="/" style={button}>Reload</a>
      </div>
    </div>
  )
}

