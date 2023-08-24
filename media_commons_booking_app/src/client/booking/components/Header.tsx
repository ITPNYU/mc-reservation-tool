import React from 'react';

export const Header = ({ isSafetyTrained, userEmail }) => {
  return (
    <div>
      <h2 className="text-4xl font-extrabold dark:text-white">
        370🅙 Shared Spaces Reservation Form
      </h2>
      <p className="my-4 text-lg text-gray-500">
        <a
          href="https://docs.google.com/document/d/1vAajz6XRV0EUXaMrLivP_yDq_LyY43BvxOqlH-oNacc/edit"
          target="_blank"
          className="font-medium text-blue-600 underline dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 hover:no-underline"
        >
          Please read our Policy for using the 370 Jay Street Shared Spaces
        </a>
      </p>
      <p className="my-4 text-lg text-gray-500">
        Booking requests must be made through this form. Verbal requests, email
        requests, and requests directly from students are not allowed. Booking
        requests for students must include sign-off by a sponsoring or
        supervising faculty member who accepts responsibility for their use.
        <br />
        <br />
        <b>Booking Confirmation:</b> You will receive an email response from the
        370J Operations team and a calendar invite once your request has been
        reviewed and processed. Please allow a minimum of 3 days for your
        request to be approved. If you do not hear back about your request
        within 48 hours, you can contact Jhanele Green ({' '}
        <a
          href="mailto:jg5626@nyu.edu"
          className="font-medium text-blue-600 underline dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 hover:no-underline"
        >
          jg5626@nyu.edu
        </a>
        ) to follow up. A request does not guarantee a booking.
        <br />
        <br />
        <b>Cancellation Policy:</b> To cancel reservations please email Jhanele
        Green(
        <a
          href="mailto:jg5626@nyu.edu"
          className="font-medium text-blue-600 underline dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 hover:no-underline"
        >
          jg5626@nyu.edu
        </a>
        ) at least 24 hours before the date of the event. Failure to cancel may
        result in restricted use of event spaces.
      </p>
      <p className="mt-10">Email: {userEmail}</p>
      <p>
        Did you take safty training:
        <span>{isSafetyTrained ? 'Yes' : 'No'}</span>
        {!isSafetyTrained && (
          <span className="text-red-500 text-bold  ">
            You have to take safty training before booking!
          </span>
        )}
      </p>
    </div>
  );
};
