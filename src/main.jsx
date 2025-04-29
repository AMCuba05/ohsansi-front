import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { StepsProvider } from 'react-step-builder'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <StepsProvider>
          <App />
      </StepsProvider>
  </StrictMode>,
)
