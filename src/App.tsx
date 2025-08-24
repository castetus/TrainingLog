import './App.css';
import { RouterProvider } from 'react-router-dom';

import { ConfirmProvider } from '@/providers/confirmProvider';
import { router } from '@/router/router';

function App() {
  return (
    <>
      <ConfirmProvider>
        <RouterProvider router={router} />
      </ConfirmProvider>
    </>
  );
}

export default App;
