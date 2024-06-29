import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { BookingContext } from '../bookingProvider';
import BookingFormStepper from './Stepper';
import BookingStatusBar from './BookingStatusBar';
import { DatabaseContext } from '../../components/Provider';

export const Header = () => {
  const { isBanned, needsSafetyTraining } = useContext(BookingContext);
  const { userEmail } = useContext(DatabaseContext);

  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === '/book') {
    return null;
  }

  const goBack = () => {
    switch (location.pathname) {
      case '/book/selectRoom':
        return () => navigate('/book/role');
      case '/book/form':
        return () => navigate('/book/selectRoom');
      default:
        return () => {};
    }
  };

  const goNext = () => {
    switch (location.pathname) {
      case '/book/selectRoom':
        return () => navigate('/book/form');
      default:
        return () => {};
    }
  };

  const showStatusBar =
    location.pathname === '/book/selectRoom' ||
    location.pathname === '/book/form';

  return (
    <div>
      {/* <p className="dark:text-white">
        Email:{' '}
        {userEmail ? `${userEmail}` : `Unable to retrieve the email address.`}
      </p>
      <div>
        {needsSafetyTraining && (
          <p className="text-red-500 text-bold  ">
            You have to take safety training before booking!
          </p>
        )}
        {isBanned && <p className="text-red-500 text-bold  ">You're banned </p>}
      </div> */}
      <BookingFormStepper />
      {showStatusBar && (
        <BookingStatusBar goBack={goBack()} goNext={goNext()} />
      )}
    </div>
  );
};
