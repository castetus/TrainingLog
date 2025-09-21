import './App.css';
import { RouterProvider } from 'react-router-dom';

import { ConfirmProvider } from '@/providers/confirmProvider';
import { router } from '@/router/router';

import InstallPWA from './InstallPWA';

function App() {
  return (
    <>
      <InstallPWA />
      <ConfirmProvider>
        <RouterProvider router={router} />
      </ConfirmProvider>
    </>
  );
}

export default App;
