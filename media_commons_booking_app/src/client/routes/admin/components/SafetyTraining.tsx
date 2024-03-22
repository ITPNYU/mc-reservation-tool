import React, { useEffect, useMemo, useState } from 'react';

import Loading from '../../../utils/Loading';
import { SafetyTraining } from '../../../../types';
import { TableNames } from '../../../../policy';
import { formatDate } from '../../../utils/date';
// This is a wrapper for google.script.run that lets us use promises.
import { serverFunctions } from '../../../utils/serverFunctions';

export const SafetyTrainedUsers = () => {
  const [safetyTrainings, setSafetyTrainings] = useState<SafetyTraining[]>([]);
  const [email, setEmail] = useState('');

  const trainedEmails = useMemo<string[]>(
    () => safetyTrainings.map((user) => user.email),
    [safetyTrainings]
  );

  useEffect(() => {
    fetchSafetyTrainings();
  }, []);

  const fetchSafetyTrainings = async () => {
    const rows = await serverFunctions
      .getAllActiveSheetRows(TableNames.SAFETY_TRAINING)
      .then((rows) =>
        rows.map((row) => ({
          email: row[0],
          completedAt: row[1],
        }))
      );
    setSafetyTrainings(rows);
  };

  console.log('trainedEmails', trainedEmails);
  const addSafetyTrainingUser = async () => {
    setLoading(true);
    if (trainedEmails.includes(email)) {
      alert('This user is already registered');
      return;
    }

    await serverFunctions.appendRowActive(TableNames.SAFETY_TRAINING, [
      email,
      new Date().toString(),
    ]);

    alert('User has been registered successfully!');
    setLoading(false);
    fetchSafetyTrainings();
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
              <th scope="col" className="px-2 py-3">
                action
              </th>
            </tr>
          </thead>
          <tbody>
            {safetyTrainings.map((safetyTraining, index) => {
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
                  <td className="px-2 py-4 w-36">
                    <button
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      onClick={async () => {
                        setLoading(true);
                        await serverFunctions.removeFromListByEmail(
                          TableNames.SAFETY_TRAINING,
                          safetyTraining.email
                        );
                        alert('Successfully removed');
                        setLoading(false);
                        fetchSafetyTrainings();
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
