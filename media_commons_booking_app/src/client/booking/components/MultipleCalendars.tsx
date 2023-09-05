import React, { useState, useEffect, useRef } from 'react';
import { Calendars } from './Calendars';
import { SelectRooms } from './SelectRooms';
import { SelectMotionCapture } from './SelectMotionCapture';

export const MultipleCalendars = ({ apiKey, allRooms, handleSetDate }) => {
  const [calendarRefs, setCalendarRefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedRoomIds, setCheckedRoomIds] = useState([]);
  const [checkedRooms, setCheckedRooms] = useState([]);

  const allRoomWithCalendarRefs = allRooms.map((room, i) => {
    room.calendarRef = React.createRef();
  });
  useEffect(() => {
    const refs = allRoomWithCalendarRefs;
    console.log('refs', refs);
    setCalendarRefs(refs);
    setLoading(false);
  }, [allRooms]);
  useEffect(() => {
    const checked = allRooms.filter((room) =>
      checkedRoomIds.includes(room.roomId)
    );
    setCheckedRooms(checked);
  }, [checkedRoomIds]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;

    const valuesArray = value.split(',');

    if (checked) {
      setCheckedRoomIds((prev) => [...prev, ...valuesArray]);
    } else {
      setCheckedRoomIds((prev) =>
        prev.filter((item) => !valuesArray.includes(item))
      );
    }
  };
  const handleSubmit = (bookInfo) => {
    handleSetDate(bookInfo, checkedRooms);
  };
  return (
    <div className="my-4">
      <SelectRooms
        allRooms={allRooms}
        handleCheckboxChange={handleCheckboxChange}
      />

      {calendarRefs.length > 0 && (
        <div className="mt-5 ml-20 flex justify-center">
          <Calendars
            allRooms={allRooms}
            selectedRooms={checkedRooms}
            apiKey={apiKey}
            handleSetDate={handleSubmit}
          />
        </div>
      )}
    </div>
  );
};
