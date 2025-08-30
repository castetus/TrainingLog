import './App.css';
import { RouterProvider } from 'react-router-dom';

import { ConfirmProvider } from '@/providers/confirmProvider';
import { DataProvider } from '@/providers/dataProvider';
import { router } from '@/router/router';

function App() {
  return (
    <>
      <DataProvider>
        <ConfirmProvider>
          <RouterProvider router={router} />
        </ConfirmProvider>
      </DataProvider>
    </>
  );
}

export default App;
