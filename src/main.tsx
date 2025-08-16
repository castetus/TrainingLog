import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './index.css';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'light', // switch to 'dark' if you want dark mode
    primary: {
      main: '#1976d2', // default blue, customize later
    },
    secondary: {
      main: '#d32f2f',
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* resets default browser styles */}
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
// PWA: register service worker (vite-plugin-pwa injects `virtual:pwa-register`)
import { registerSW } from 'virtual:pwa-register';
registerSW({ immediate: true });
