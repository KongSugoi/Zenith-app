import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'
import './styles/globals.css'



// Capacitor imports

import { StatusBar, Style } from '@capacitor/status-bar'
import { SplashScreen } from '@capacitor/splash-screen'

// Initialize Capacitor for native functionality
const initializeApp = async () => {
  if ((window as any).Capacitor?.isNativePlatform?.()) {
    // Hide splash screen after app loads
    await SplashScreen.hide()
    
    // Configure status bar
    await StatusBar.setStyle({ style: Style.Default })
    await StatusBar.setBackgroundColor({ color: '#ffffff' })
  }
}

// Initialize the app
initializeApp()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)