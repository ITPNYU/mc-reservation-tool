import { RouterProvider, createHashRouter } from 'react-router-dom';

import AdminPage from './routes/admin/adminPage';
import BookingPage from './routes/booking/bookingPage';
import ErrorPage from './errorPage';
import PAPage from './routes/pa/PAPage';
import React from 'react';
import ReactDOM from 'react-dom';
import Root from './routes/root';

const router = createHashRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/admin',
        element: <AdminPage />,
      },
      {
        path: '/pa',
        element: <PAPage />,
      },
      {
        path: '/',
        element: <BookingPage />,
      },
    ],
  },
]);

ReactDOM.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
  document.getElementById('index')
);
