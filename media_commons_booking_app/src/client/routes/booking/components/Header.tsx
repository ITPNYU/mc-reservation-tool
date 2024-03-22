import React from 'react';

export const Header = ({ isBanned, isSafetyTrained, userEmail }) => {
  if (!isSafetyTrained) {
    //alert('You have to take safty training before booking!');
  }
  return (
    <div>
      <p className="mt-10 dark:text-white">
        Email:{' '}
        {userEmail ? `${userEmail}` : `Unable to retrieve the email address.`}
      </p>
      <p>
        {!isSafetyTrained && (
          <span className="text-red-500 text-bold  ">
            You have to take safty training before booking!
          </span>
        )}
        {isBanned && (
          <span className="text-red-500 text-bold  ">You're Banned.</span>
        )}
      </p>
    </div>
  );
};
