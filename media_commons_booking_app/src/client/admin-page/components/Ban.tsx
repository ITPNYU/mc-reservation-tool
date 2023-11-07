import React, { useState, useEffect } from 'react';

// This is a wrapper for google.script.run that lets us use promises.
import { serverFunctions } from '../../utils/serverFunctions';
import { formatDate } from '../../utils/date';
import { Loading } from '../../utils/Loading';
const BAN_SHEET_NAME = 'banned_users';

type Ban = {
  email: string;
  bannedAt: string;
};

export const Ban = () => {
  const [bans, setBans] = useState([]);
  const [trainedEmails, setTrainedEmails] = useState([]);
  const [mappingTrainings, setMappingTrainings] = useState([]);
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchBans();
  }, []);
  useEffect(() => {
    const mappings = bans
      .map((ban, index) => {
        if (index !== 0) {
          return mappingBanRows(ban);
        }
      })
      .filter((ban) => ban !== undefined);
    //TODO: filter out bans that are not in the future
    setMappingTrainings(mappings);
    const emails = mappings.map((mapping) => {
      return mapping.email;
    });
    setTrainedEmails(emails);
  }, [bans]);

  const fetchBans = async () => {
    serverFunctions.fetchRows(BAN_SHEET_NAME).then((rows) => {
      setBans(rows);
    });
  };

  const mappingBanRows = (values: string[]): Ban => {
    return {
      email: values[0],
      bannedAt: values[1],
    };
  };

  console.log('trainedEmails', trainedEmails);
  const addBanUser = async () => {
    setLoading(true);
    if (trainedEmails.includes(email)) {
      alert('This user is already registered');
      return;
    }

    await serverFunctions.appendRow(BAN_SHEET_NAME, [
      email,
      new Date().toString(),
    ]);

    alert('User has been registered successfully!');
    setLoading(false);
    fetchBans();
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
          onClick={addBanUser}
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
                Ban Date
              </th>
              <th scope="col" className="px-2 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {mappingTrainings.map((ban, index) => {
              return (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-2 py-4 w-36">{ban.email}</td>
                  <td className="px-2 py-4 w-36">
                    <div className=" flex items-center flex-col">
                      <div>{formatDate(ban.bannedAt)}</div>{' '}
                    </div>
                  </td>
                  <td className="px-2 py-4 w-36">
                    <button
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      onClick={async () => {
                        setLoading(true);
                        await serverFunctions.removeFromList(
                          BAN_SHEET_NAME,
                          ban.email
                        );
                        alert('Successfully removed');
                        setLoading(false);
                        fetchBans();
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
