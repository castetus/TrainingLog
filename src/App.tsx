import './App.css';
import { RouterProvider } from 'react-router-dom';

import { ConfirmProvider } from '@/providers/confirmProvider';
import { AppThemeProvider } from '@/providers/themeProvider';
import { router } from '@/router/router';

import InstallPWA from './InstallPWA';

function App() {
  return (
    <AppThemeProvider>
      <InstallPWA />
      <ConfirmProvider>
        <RouterProvider router={router} />
      </ConfirmProvider>
    </AppThemeProvider>
  );
}

export default App;
