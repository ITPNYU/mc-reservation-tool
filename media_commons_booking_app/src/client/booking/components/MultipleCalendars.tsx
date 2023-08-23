import React, { useState, useEffect, useRef } from 'react';
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timeGrid'; // a plugin!
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import dayGridPlugin from '@fullcalendar/daygrid';
import { MultipleTimegridCalendar } from './MultipleTimegridCalendar';

export const MultipleCalendars = ({
  apiKey,
  rooms,
  enrolledThisis,
  bookInfo,
  setBookInfo,
}) => {
  const [calendarRefs, setCalendarRefs] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log('rooms', rooms);
  useEffect(() => {
    setCalendarRefs((refs) =>
      [...Array(rooms.length)].map((_, i) => refs[i] || React.createRef())
    );
    setLoading(false);
  }, []);
  const handleDateSelect = (room, selectInfo) => {
    setBookInfo(selectInfo);
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  console.log('calendarRefs', calendarRefs);
  return (
    <div className="w-[2000px]">
      {calendarRefs.length > 0 && (
        <div className="mt-5 ml-20 flex justify-center">
          {rooms.map((room, i) => (
            <MultipleTimegridCalendar
              room={room}
              apiKey={apiKey}
              ref={calendarRefs[i]}
              handleDateSelect={handleDateSelect}
              enrolledThisis={enrolledThisis}
            />
          ))}
        </div>
      )}
    </div>
  );
};
