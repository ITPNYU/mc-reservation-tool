import { DatabaseContext, DatabaseContextType } from './provider';
import React, { useContext, useMemo, useState } from 'react';

import Loading from '../utils/Loading';
import { TableNames } from '../../policy';
import { serverFunctions } from '../utils/serverFunctions';

type KeysWithArrayValues = {
  [K in keyof DatabaseContextType]: DatabaseContextType[K] extends Array<any>
    ? K
    : never;
}[keyof DatabaseContextType];

type VoidFunction = () => void;
type EmailListRefreshFunctionContextKeys = {
  [K in keyof DatabaseContextType]: DatabaseContextType[K] extends VoidFunction
    ? K
    : never;
}[keyof DatabaseContextType];

interface Props {
  tableName: TableNames;
  userList: KeysWithArrayValues;
  userListRefresh: EmailListRefreshFunctionContextKeys;
}

export default function AddEmail({
  tableName,
  userList,
  userListRefresh,
}: Props) {
  const context = useContext(DatabaseContext);
  const [emailToAdd, setEmailToAdd] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const users = context[userList];
  const refresh = context[userListRefresh];

  const userEmails = useMemo<string[]>(
    () => users.map((user) => user.email),
    [users]
  );

  const addUser = async () => {
    setLoading(true);
    if (!emailToAdd) return;

    if (userEmails.includes(emailToAdd)) {
      alert('This user is already registered');
      return;
    }

    await serverFunctions.appendRowActive(tableName, [
      emailToAdd,
      new Date().toString(),
    ]);

    alert('User has been registered successfully!');
    setLoading(false);
    refresh();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="mt-10 mr-10 ml-10">
      <form className="flex items-center">
        <div className="mb-6 mr-6">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            onChange={(e) => {
              setEmailToAdd(e.target.value);
            }}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="name@nyu.edu"
            required
          />
        </div>
        <button
          type="button"
          onClick={addUser}
          className="h-[40px] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Add User
        </button>
      </form>
    </div>
  );
}
