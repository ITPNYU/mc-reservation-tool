import React, { useContext } from 'react';

import { BookingContext } from '../bookingProvider';
import BookingFormStepper from './Stepper';
import { DatabaseContext } from '../../components/Provider';
import { useLocation } from 'react-router-dom';

export const Header = () => {
  const { isBanned, isSafetyTrained } = useContext(BookingContext);
  const { userEmail } = useContext(DatabaseContext);

  const location = useLocation();

  if (location.pathname === '/book') {
    return null;
  }

  return (
    <div>
      {/* <p className="dark:text-white">
        Email:{' '}
        {userEmail ? `${userEmail}` : `Unable to retrieve the email address.`}
      </p>
      <div>
        {!isSafetyTrained && (
          <p className="text-red-500 text-bold  ">
            You have to take safety training before booking!
          </p>
        )}
        {isBanned && <p className="text-red-500 text-bold  ">You're banned </p>}
      </div> */}
      <BookingFormStepper />
    </div>
  );
};
