import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '../App.tsx'
import '../styles/globals.css'
import { HashRouter } from 'react-router-dom'

// Enable React strict mode for development
const StrictMode = import.meta.env.DEV ? React.StrictMode : React.Fragment

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)

// Performance monitoring in development
// if (import.meta.env.DEV) {
//   import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
//     getCLS(console.log)
//     getFID(console.log)
//     getFCP(console.log)
//     getLCP(console.log)
//     getTTFB(console.log)
//   }).catch(() => {
//     // web-vitals not available, ignore
//   })
// }