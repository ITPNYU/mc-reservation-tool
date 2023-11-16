import React, { useState, useEffect } from 'react';

// This is a wrapper for google.script.run that lets us use promises.

import { SafetyTraining } from './SafetyTraining';
import { Bookings } from './Bookings';

const PAPage = () => {
  const [tab, setTab] = useState('bookings');

  return (
    <div className="m-10">
      <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
        <li className="mr-2">
          <a
            onClick={() => setTab('bookings')}
            aria-current="page"
            className={`${
              tab === 'bookings'
                ? 'inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500'
                : 'inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300 '
            }`}
          >
            Bookings
          </a>
        </li>
        <li className="mr-2">
          <a
            onClick={() => setTab('safety_training')}
            className={`${
              tab === 'safety_training'
                ? 'inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500'
                : 'inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300 '
            }`}
          >
            Safety Training
          </a>
        </li>
      </ul>
      {tab === 'safety_training' && <SafetyTraining />}
      {tab === 'bookings' && <Bookings />}
    </div>
  );
};

export default PAPage;
