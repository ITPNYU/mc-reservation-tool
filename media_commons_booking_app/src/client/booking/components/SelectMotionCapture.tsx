import React from 'react';

export const SelectMotionCapture = ({ selectedRoom, handleSetRoom }) => {
  const [room, setRoom] = React.useState([]);
  return (
    <div>
      <label
        htmlFor="room"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Select Room
      </label>
      <select
        id="motionCaptureRoom"
        onChange={(e) => {
          const splitedRoom = e.target.value.split(',');
          e.stopPropagation();
          setRoom(splitedRoom);
          handleSetRoom(splitedRoom);
        }}
        className="mr-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option value="" selected>
          Select Room
        </option>
        <option value="221,222">Motion capture1(221-222)</option>
        <option value="223">Motion capture2(223)</option>
        <option value="224">Motion capture3(224)</option>
      </select>
    </div>
  );
};
