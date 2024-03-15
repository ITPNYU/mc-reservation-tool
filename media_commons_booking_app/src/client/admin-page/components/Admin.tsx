import React, { useEffect, useMemo, useState } from 'react';

import { AdminUser } from '../../../types';
import AdminUsers from './AdminUsers';
import { Ban } from './Ban';
import { Bookings } from './Bookings';
import { Liaisons } from './Liaisons';
import { Loading } from '../../utils/Loading';
import { PAUsers } from './PAUsers';
import { SafetyTraining } from './SafetyTraining';
import { TableNames } from '../../../policy';
import { serverFunctions } from '../../utils/serverFunctions';

// This is a wrapper for google.script.run that lets us use promises.

const Admin = () => {
  const [tab, setTab] = useState('bookings');

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [userEmail, setUserEmail] = useState<string | undefined>();

  const adminEmails = useMemo<string[]>(
    () => adminUsers.map((user) => user.email),
    [adminUsers]
  );
  const userHasPermission = adminEmails.includes(userEmail);

  useEffect(() => {
    fetchAdminUsers();
    getActiveUserEmail();
  }, []);

  const getActiveUserEmail = () => {
    serverFunctions.getActiveUserEmail().then((response) => {
      console.log('userEmail response', response);
      setUserEmail(response);
    });
  };

  const fetchAdminUsers = async () => {
    const admins = await serverFunctions
      .getAllActiveSheetRows(TableNames.ADMINS)
      .then((rows) =>
        rows.map((row) => ({
          email: row[0],
          createdAt: row[1],
        }))
      );

    setAdminUsers(admins);
  };

  if (adminEmails.length === 0 || userEmail == null) {
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
            <li className="mr-2">
              <a
                onClick={() => setTab('ban')}
                className={`${
                  tab === 'ban'
                    ? 'inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500'
                    : 'inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300 '
                }`}
              >
                Ban
              </a>
            </li>
            <li className="mr-2">
              <a
                onClick={() => setTab('paUsers')}
                className={`${
                  tab === 'paUsers'
                    ? 'inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500'
                    : 'inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300 '
                }`}
              >
                PA users
              </a>
            </li>
            <li className="mr-2">
              <a
                onClick={() => setTab('adminUsers')}
                className={`${
                  tab === 'adminUsers'
                    ? 'inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500'
                    : 'inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300 '
                }`}
              >
                Admin users
              </a>
            </li>
            <li className="mr-2">
              <a
                onClick={() => setTab('liaesons')}
                className={`${
                  tab === 'liaesons'
                    ? 'inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500'
                    : 'inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300 '
                }`}
              >
                Liaisons
              </a>
            </li>
          </ul>
          {tab === 'safety_training' && <SafetyTraining />}
          {tab === 'ban' && <Ban />}
          {tab === 'adminUsers' && <AdminUsers />}
          {tab === 'paUsers' && <PAUsers />}
          {tab === 'liaesons' && <Liaisons />}
          {tab === 'bookings' && <Bookings showNnumber={true} />}
        </div>
      )}
    </div>
  );
};

export default Admin;
