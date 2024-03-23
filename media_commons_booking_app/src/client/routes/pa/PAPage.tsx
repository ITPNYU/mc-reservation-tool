import React, { useEffect, useMemo, useState } from 'react';

import { Bookings } from '../admin/components/Bookings';
import Loading from '../../utils/Loading';
import { PaUser } from '../../../types';
import SafetyTrainedUsers from '../admin/components/SafetyTraining';
import { TableNames } from '../../../policy';
import { serverFunctions } from '../../utils/serverFunctions';

// This is a wrapper for google.script.run that lets us use promises.

const PAPage = () => {
  const [tab, setTab] = useState('bookings');
  const [paUsers, setPaUsers] = useState<PaUser[]>([]);
  const [userEmail, setUserEmail] = useState<string | undefined>();

  const paEmails = useMemo<string[]>(
    () => paUsers.map((user) => user.email),
    [paUsers]
  );

  useEffect(() => {
    fetchPaUsers();
    getActiveUserEmail();
  }, []);

  const getActiveUserEmail = () => {
    serverFunctions.getActiveUserEmail().then((response) => {
      console.log('userEmail response', response);
      setUserEmail(response);
    });
  };

  const fetchPaUsers = async () => {
    const paRows = await serverFunctions
      .getAllActiveSheetRows(TableNames.PAS)
      .then((rows) =>
        rows.map((row) => ({
          email: row[0],
          createdAt: row[1],
        }))
      );
    setPaUsers(paRows);
  };

  const userHasPermission = userEmail ? paEmails.includes(userEmail) : false;
  console.log('paEmails', paEmails);
  console.log('userHasPermission', userHasPermission);
  if (paEmails.length === 0 || userEmail === null) {
    return <Loading />;
  }
  return (
    <div className="m-10">
      {!userHasPermission ? (
        <div className="m-10">
          You do not have permission to view this page.
        </div>
      ) : (
        <div>
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
          {tab === 'safety_training' && <SafetyTrainedUsers />}
          {tab === 'bookings' && <Bookings showNnumber={false} />}
        </div>
      )}
    </div>
  );
};

export default PAPage;
