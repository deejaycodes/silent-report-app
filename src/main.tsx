import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n/config' // Initialize i18n
import { apiService } from './lib/api'

// Restore auth token from previous session
const savedToken = localStorage.getItem('token')
if (savedToken) {
  apiService.setToken(savedToken)
}

createRoot(document.getElementById("root")!).render(<App />);
