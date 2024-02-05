import React, { useState, useEffect, useRef } from 'react';
import { CalendarDatePicker } from './CalendarDatePicker';
import { DateSelectArg } from '@fullcalendar/core';
import { RoomSetting } from './SheetEditor';
import { formatDate } from '../../utils/date';
import { RoomCalendar } from './RoomCalendar';

type CalendarProps = {
  allRooms: any[];
  selectedRooms: RoomSetting[];
  handleSetDate: any;
  refs?: any[];
};

const TITLE_TAG = '[Click to Delete]';

export const Calendars = ({
  allRooms,
  selectedRooms,
  handleSetDate,
}: CalendarProps) => {
  console.log('allrooms', allRooms);
  const [enrolledThisis, setEnrolledThesis] = useState(false);
  const [faculty, setFaculty] = useState(false);
  const [bookingTimeEvent, setBookingTimeEvent] = useState<DateSelectArg>();
  const isOverlap = (info) => {
    return selectedRooms.some((room, i) => {
      const calendarApi = room.calendarRef.current.getApi();

      const allEvents = calendarApi.getEvents();
      return allEvents.some((event) => {
        if (event.title.includes(TITLE_TAG)) return false;
        return (
          (event.start >= info.start && event.start < info.end) ||
          (event.end > info.start && event.end <= info.end) ||
          (event.start <= info.start && event.end >= info.end)
        );
      });
    });
  };

  const validateEvents = (e) => {
    e.stopPropagation;
    const overlap = isOverlap(bookingTimeEvent);
    const past = bookingTimeEvent.start < new Date();
    if (past) {
      alert("You can't schedule events in the past");
      return;
    }

    if (overlap) {
      alert('The new event overlaps with an existing event on the same day!');
      return;
    }
    if (bookingTimeEvent) {
      const isConfirmed = window.confirm(
        `Confirming that you are requesting to book the following rooms: ${selectedRooms.map(
          (room) => `${room.roomId} ${room.name}`
        )}  starting at ${formatDate(
          bookingTimeEvent.startStr
        )} and ending at ${formatDate(bookingTimeEvent.endStr)}`
      );
      if (isConfirmed) handleSetDate(bookingTimeEvent);
    }
  };

  useEffect(() => {
    const view = selectedRooms.length > 1 ? 'timeGridDay' : 'timeGridDay';
    allRooms.map((room) => {
      const calendarApi = room.calendarRef.current.getApi();
      calendarApi.changeView(view);
    });
  }),
    [selectedRooms];

  const handleChange = (selectedDate: Date) => {
    allRooms.forEach((room) => {
      room.calendarRef.current.getApi().gotoDate(selectedDate);
    });
  };

  return (
    <div className="mt-5 flex flex-col justify-center">
      <div className="flex justify-center items-center space-x-4 ">
        <div>
          <div className="">Select date</div>
          <CalendarDatePicker handleChange={handleChange} />
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="flex ">
            <input
              id="default-checkbox"
              type="checkbox"
              value=""
              className="pt-4 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              onChange={(e) => setEnrolledThesis(!enrolledThisis)}
            />
            <label
              htmlFor="default-checkbox"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Enrolled in thesis
            </label>
          </div>
        </div>
        <div className="flex flex-col items-center ">
          <button
            key="calendarNextButton"
            disabled={!bookingTimeEvent}
            onClick={(e) => {
              validateEvents(e);
            }}
            className={`px-4 py-2 text-white rounded-md focus:outline-none ${
              bookingTimeEvent
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-300 pointer-events-none'
            }`}
          >
            Next
          </button>
        </div>
      </div>
      <div className="flex justify-center">
        {allRooms.map((room, i) => (
          <RoomCalendar
            room={room}
            selectedRooms={selectedRooms}
            allRooms={allRooms}
            bookingTimeEvent={bookingTimeEvent}
            setBookingTimeEvent={setBookingTimeEvent}
            enrolledThisis={enrolledThisis || faculty}
            isOverlap={isOverlap}
          />
        ))}
      </div>
    </div>
  );
};
