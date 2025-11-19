import NotFound from '@koku-ui/ui-lib/components/page/notFound';
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import AppLayout, { routes } from './AppLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: routes,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
