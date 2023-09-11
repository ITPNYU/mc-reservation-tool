import React from 'react';

export const InitialModal = ({ handleClick }) => {
  return (
    <div
      id="staticModal"
      data-modal-backdrop="static"
      tabIndex={-1}
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div className="relative w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Please read our Policy for using the 370 Jay Street Shared Spaces
            </h3>
          </div>
          <p className="p-6 space-y-6">
            <b>Booking Confirmation:</b> You will receive an email response from
            the 370J Operations team and a calendar invite once your request has
            been reviewed and processed. Please allow a minimum of 3 days for
            your request to be approved. If you do not hear back about your
            request within 48 hours, you can contact Jhanele Green (
            <a
              href="mailto:jg5626@nyu.edu"
              className="font-medium text-blue-600 underline dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 hover:no-underline"
            >
              jg5626@nyu.edu
            </a>
            ) to follow up. A request does not guarantee a booking.
            <br />
            <br />
            <b>Cancellation Policy:</b> To cancel reservations please email
            Jhanele Green(
            <a
              href="mailto:jg5626@nyu.edu"
              className="font-medium text-blue-600 underline dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 hover:no-underline"
            >
              jg5626@nyu.edu
            </a>
            ) at least 24 hours before the date of the event. Failure to cancel
            may result in restricted use of event spaces.
          </p>
          <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
            <button
              data-modal-hide="staticModal"
              type="button"
              onClick={() => handleClick()}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              I accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
