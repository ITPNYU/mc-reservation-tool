import React, { useState } from 'react';

export const RoleModal = ({ handleClick }) => {
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [enrolledThesis, setEnrolledThesis] = useState(false);

  // Nextボタンのクリックイベントハンドラ
  const handleNextClick = () => {
    if (!role || !department) {
      // 適切なエラーメッセージを設定
      alert('Please make sure all fields are selected.');
      return; // ここで処理を中断
    }
    handleClick(role, department, enrolledThesis);
  };

  return (
    <div
      id="staticModal"
      data-modal-backdrop="static"
      tabIndex={-1}
      aria-hidden="true"
      className="fixed top-0 left-0 bg-white right-0 z-50 w-full h-120 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div className="relative w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600"></div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Select Department
          </label>
          <select
            onChange={(e) => setDepartment(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="">Choose a Department</option>
            <option value="ALT">ALT</option>
            <option value="GameCenter">Game Center</option>
            <option value="IDM">IDM</option>
            <option value="ITP / IMA / Low Res">ITP / IMA / Low Res</option>
            <option value="MARL">MARL</option>
            <option value="Music Tech">Music Tech</option>
            <option value="Recorded Music">Recorded Music</option>
          </select>

          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Select Role
          </label>
          <select
            onChange={(e) => setRole(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="">Choose a Role</option>
            <option value="Student">Student</option>
            <option value="Resident/Fellow">Resident / Fellow</option>
            <option value="Faculty">Faculty</option>
            <option value="Admin/Staff">Admin / Staff</option>
          </select>

          {role === 'Student' && (
            <>
              <input
                id="default-checkbox"
                type="checkbox"
                checked={enrolledThesis}
                onChange={(e) => setEnrolledThesis(e.target.checked)}
                className="mt-4 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="default-checkbox"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Enrolled in thesis
              </label>
            </>
          )}

          <button
            onClick={handleNextClick}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
