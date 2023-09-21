import React, { useState, useEffect } from 'react';

// This is a wrapper for google.script.run that lets us use promises.
import { serverFunctions } from '../../utils/serverFunctions';
import { formatDate } from '@fullcalendar/core';

const SAFETY_TRAINING_SHEET_NAME = 'admin_users';

type SafetyTraining = {
  email: string;
  completedAt: string;
};

export const AdminUsers = () => {
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminEmails, setAdminEmails] = useState([]);
  const [mappingAdminUsers, setMappingAdminUsers] = useState([]);
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchAdminUsers();
  }, []);
  useEffect(() => {
    const mappings = adminUsers
      .map((safetyTraining, index) => {
        if (index !== 0) {
          return mappingSafetyTrainingRows(safetyTraining);
        }
      })
      .filter((safetyTraining) => safetyTraining !== undefined);
    //TODO: filter out adminUsers that are not in the future
    setMappingAdminUsers(mappings);
    const emails = mappings.map((mapping) => {
      return mapping.email;
    });
    setAdminEmails(emails);
  }, [adminUsers]);

  const fetchAdminUsers = async () => {
    serverFunctions.fetchRows(SAFETY_TRAINING_SHEET_NAME).then((rows) => {
      setAdminUsers(rows);
    });
  };

  const mappingSafetyTrainingRows = (values: string[]): SafetyTraining => {
    return {
      email: values[0],
      completedAt: values[1],
    };
  };

  console.log('adminEmails', adminEmails);
  const addSafetyTrainingUser = () => {
    if (adminEmails.includes(email)) {
      alert('This user is already registered');
      return;
    }

    serverFunctions.appendRow(SAFETY_TRAINING_SHEET_NAME, [
      email,
      new Date().toString(),
    ]);

    alert('User has been registered successfully!');
  };
  return (
    <div className="m-10">
      <form className="flex items-center">
        <div className="mb-6 mr-6">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            email
          </label>
          <input
            type="email"
            id="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="name@nyu.edu"
            required
          />
        </div>
        <button
          type="button"
          onClick={addSafetyTrainingUser}
          className="h-[40px] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Add User
        </button>
      </form>

      <div className="w-[500px relative sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-2 py-3">
                Email
              </th>
              <th scope="col" className="px-2 py-3">
                Completed Date
              </th>
            </tr>
          </thead>
          <tbody>
            {mappingAdminUsers.map((safetyTraining, index) => {
              return (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-2 py-4 w-36">{safetyTraining.email}</td>
                  <td className="px-2 py-4 w-36">
                    <div className=" flex items-center flex-col">
                      <div>{formatDate(safetyTraining.completedAt)}</div>{' '}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
