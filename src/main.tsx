import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// PWA: register service worker (vite-plugin-pwa injects `virtual:pwa-register`)
import { registerSW } from 'virtual:pwa-register'
registerSW({ immediate: true })
