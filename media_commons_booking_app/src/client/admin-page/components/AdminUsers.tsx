import React, { useState, useEffect } from 'react';

// This is a wrapper for google.script.run that lets us use promises.
import { serverFunctions } from '../../utils/serverFunctions';
import { formatDate } from '../../utils/date';

const ADMIN_USER_SHEET_NAME = 'admin_users';

type AdminUser = {
  email: string;
  createdAt: string;
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
      .map((adminUser, index) => {
        if (index !== 0) {
          return mappingAdminUserRows(adminUser);
        }
      })
      .filter((adminUser) => adminUser !== undefined);
    //TODO: filter out adminUsers that are not in the future
    setMappingAdminUsers(mappings);
    const emails = mappings.map((mapping) => {
      return mapping.email;
    });
    setAdminEmails(emails);
  }, [adminUsers]);

  const fetchAdminUsers = async () => {
    serverFunctions.fetchRows(ADMIN_USER_SHEET_NAME).then((rows) => {
      setAdminUsers(rows);
    });
  };

  const mappingAdminUserRows = (values: string[]): AdminUser => {
    return {
      email: values[0],
      createdAt: values[1],
    };
  };

  const addAdminUser = async () => {
    if (adminEmails.includes(email)) {
      alert('This user is already registered');
      return;
    }

    await serverFunctions.appendRow(ADMIN_USER_SHEET_NAME, [
      email,
      new Date().toString(),
    ]);

    alert('User has been registered successfully!');
    fetchAdminUsers();
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
          onClick={addAdminUser}
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
                Created Date
              </th>
              <th scope="col" className="px-2 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {mappingAdminUsers.map((adminUser, index) => {
              return (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-2 py-4 w-36">{adminUser.email}</td>
                  <td className="px-2 py-4 w-36">
                    <div className=" flex items-center flex-col">
                      <div>{formatDate(adminUser.createdAt)}</div>{' '}
                    </div>
                  </td>
                  <td className="px-2 py-4 w-36">
                    <button
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      onClick={async () => {
                        await serverFunctions.removeFromList(
                          ADMIN_USER_SHEET_NAME,
                          adminUser.email
                        );
                        alert('Successfully removed');
                        fetchAdminUsers();
                      }}
                    >
                      Remove
                    </button>
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
