import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { StepsProvider } from 'react-step-builder'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import App from './App.jsx'
import {RegisterProvider} from "./Context/RegisterContext.jsx";
import {AuthProvider} from "./Context/AuthContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <RegisterProvider>
          <AuthProvider>
              <StepsProvider>
                  <App />
              </StepsProvider>
          </AuthProvider>
      </RegisterProvider>
  </StrictMode>,
)
