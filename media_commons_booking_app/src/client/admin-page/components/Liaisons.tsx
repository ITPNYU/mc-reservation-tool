import React, { useState, useEffect } from 'react';

// This is a wrapper for google.script.run that lets us use promises.
import { serverFunctions } from '../../utils/serverFunctions';
import { formatDate } from '../../utils/date';
import { Loading } from '../../utils/Loading';

const LIAISON_SHEET_NAME = 'liaisons';

type LiaisonType = {
  email: string;
  department: string;
  completedAt: string;
};

export const Liaisons = () => {
  const [liaisonUsers, setLiaisonUsers] = useState([]);
  const [liaisonEmails, setAdminEmails] = useState([]);
  const [mappingLiaisonUsers, setMappingLiaisonUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');

  useEffect(() => {
    fetchLiaisonUsers();
  }, []);
  useEffect(() => {
    const mappings = liaisonUsers
      .map((liaison, index) => {
        if (index !== 0) {
          return mappingSafetyTrainingRows(liaison);
        }
      })
      .filter((liaison) => liaison !== undefined);
    //TODO: filter out liaisonUsers that are not in the future
    setMappingLiaisonUsers(mappings);
    const emails = mappings.map((mapping) => {
      return mapping.email;
    });
    setAdminEmails(emails);
  }, [liaisonUsers]);

  const fetchLiaisonUsers = async () => {
    serverFunctions.fetchRows(LIAISON_SHEET_NAME).then((rows) => {
      setLiaisonUsers(rows);
    });
  };

  const mappingSafetyTrainingRows = (values: string[]): LiaisonType => {
    return {
      email: values[0],
      department: values[1],
      completedAt: values[2],
    };
  };

  console.log('liaisonEmails', liaisonEmails);
  const addLiaisonUser = async () => {
    setLoading(true);
    if (email === '' || department === '') {
      alert('Please fill in all the fields');
      return;
    }

    if (liaisonEmails.includes(email)) {
      alert('This user is already registered');
      return;
    }

    await serverFunctions.appendRow(LIAISON_SHEET_NAME, [
      email,
      department,
      new Date().toString(),
    ]);

    alert('User has been registered successfully!');
    setLoading(false);
    fetchLiaisonUsers();
  };
  const [loading, setLoading] = useState(false);
  if (loading) {
    return <Loading />;
  }
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
        <div className="mr-6">
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[200px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(e) => {
              setDepartment(e.target.value);
            }}
            value={department}
          >
            <option value="" disabled>
              Select option
            </option>
            <option value="ALT">ALT</option>
            <option value="GameCenter">Game Center</option>
            <option value="IDM">IDM</option>
            <option value="ITP / IMA / Low Res">ITP / IMA / Low Res</option>
            <option value="MARL">MARL</option>
            <option value="Music Tech">Music Tech</option>
            <option value="Recorded Music">Recorded Music</option>
            <option value="others">Other Group</option>
          </select>
        </div>
        <button
          type="button"
          onClick={addLiaisonUser}
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
                Department
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
            {mappingLiaisonUsers.map((liaison, index) => {
              return (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-2 py-4 w-36">{liaison.email}</td>
                  <td className="px-2 py-4 w-36">{liaison.department}</td>
                  <td className="px-2 py-4 w-36">
                    <div className=" flex items-center flex-col">
                      <div>{formatDate(liaison.completedAt)}</div>{' '}
                    </div>
                  </td>
                  <td className="px-2 py-4 w-36">
                    <button
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      onClick={async () => {
                        setLoading(true);
                        await serverFunctions.removeFromList(
                          LIAISON_SHEET_NAME,
                          liaison.email
                        );
                        alert('Successfully removed');
                        setLoading(false);
                        fetchLiaisonUsers();
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
