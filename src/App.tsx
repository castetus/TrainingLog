import './App.css';
import { RouterProvider } from 'react-router-dom'
import { router } from '@/router/router'
import { ConfirmProvider } from '@/providers/confirmProvider'

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
