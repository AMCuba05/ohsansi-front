import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { StepsProvider } from 'react-step-builder'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import App from './App.jsx'
import {RegisterProvider} from "./Context/RegisterContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <RegisterProvider>
          <StepsProvider>
              <App />
          </StepsProvider>
      </RegisterProvider>
  </StrictMode>,
)
