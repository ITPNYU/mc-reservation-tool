import React from 'react';

export const Header = ({ isSafetyTrained, userEmail }) => {
  if (!isSafetyTrained) {
    //alert('You have to take safty training before booking!');
  }
  return (
    <div>
      <p className="mt-10">
        Email:{' '}
        {userEmail ? `${userEmail}` : `Unable to retrieve the email address.`}
      </p>
      <p>
        {!isSafetyTrained && (
          <span className="text-red-500 text-bold  ">
            You have to take safty training before booking!
          </span>
        )}
      </p>
    </div>
  );
};
