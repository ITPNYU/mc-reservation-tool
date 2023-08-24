import React, { useState, useEffect, useRef } from 'react';
import { Calendars } from './Calendars';

export const MultipleCalendars = ({
  apiKey,
  allRooms,
  bookInfo,
  setBookInfo,
  handleSetDate,
}) => {
  const [calendarRefs, setCalendarRefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedRoomIds, setCheckedRoomIds] = useState([]);
  const [checkedRooms, setCheckedRooms] = useState([]);

  console.log('checkedRoomIds', checkedRoomIds);
  const allRoomWithCalendarRefs = allRooms.map((room, i) => {
    room.calendarRef = React.createRef();
  });
  useEffect(() => {
    const refs = allRoomWithCalendarRefs;
    setCalendarRefs(refs);
    setLoading(false);
  }, []);
  useEffect(() => {
    const checked = allRooms.filter((room) =>
      checkedRoomIds.includes(room.roomId)
    );
    setCheckedRooms(checked);
  }, [checkedRoomIds]);
  const handleDateSelect = (selectInfo) => {
    setBookInfo(selectInfo);
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setCheckedRoomIds((prev) => [...prev, value]);
    } else {
      setCheckedRoomIds((prev) => prev.filter((item) => item !== value));
    }
  };
  return (
    <div className="my-4">
      <div className="flex space-x-4">
        {allRooms.map((room, i) => {
          return (
            <div
              key={`${room.roomId}_${i}_checkbox`}
              className="flex items-center mb-4"
            >
              <input
                id={`checkbox${i}`}
                type="checkbox"
                onChange={handleCheckboxChange}
                value={room.roomId}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor={`checkbox${i}`}
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                {room.roomId} {room.name}
              </label>
            </div>
          );
        })}
      </div>
      {calendarRefs.length > 0 && (
        <div className="mt-5 ml-20 flex justify-center">
          <Calendars
            allRooms={allRooms}
            selectedRooms={checkedRooms}
            apiKey={apiKey}
            handleSetDate={handleSetDate}
          />
        </div>
      )}
    </div>
  );
};
