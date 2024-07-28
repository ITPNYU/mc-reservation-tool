import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import AdminPage from './routes/admin/adminPage';
import BookingForm from './routes/booking/BookingForm';
import BookingFormConfirmationPage from './routes/booking/formPages/BookingFormConfirmationPage';
import BookingFormDetailsPage from './routes/booking/formPages/BookingFormDetailsPage';
import ErrorPage from './errorPage';
import LandingPage from './routes/booking/formPages/LandingPage';
import MyBookingsPage from './routes/myBookings/myBookingsPage';
import PAPage from './routes/pa/PAPage';
import React from 'react';
import Root from './routes/root';
import SelectRoomPage from './routes/booking/formPages/SelectRoomPage';
import UserRolePage from './routes/booking/formPages/UserRolePage';
import WalkInLandingPage from './routes/pa/walkin/WalkInLandingPage';
import { createRoot } from 'react-dom/client';

const router = createMemoryRouter([
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
        element: <MyBookingsPage />,
      },
      {
        path: '/book',
        element: <BookingForm />,
        children: [
          {
            path: '/book/role',
            element: <UserRolePage />,
          },
          {
            path: '/book/selectRoom',
            element: <SelectRoomPage />,
          },
          {
            path: '/book/form',
            element: <BookingFormDetailsPage />,
          },
          {
            path: '/book/confirmation',
            element: <BookingFormConfirmationPage />,
          },
          {
            path: '/book',
            element: <LandingPage />,
          },
        ],
      },
      {
        path: '/walkIn',
        element: <BookingForm />,
        children: [
          {
            path: '/walkIn/selectRoom',
            element: <SelectRoomPage isWalkIn={true} />,
          },
          {
            path: '/walkIn/role',
            element: <UserRolePage isWalkIn={true} />,
          },
          {
            path: '/walkIn',
            element: <WalkInLandingPage />,
          },
        ],
      },
    ],
  },
]);

const container = document.getElementById('index');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
