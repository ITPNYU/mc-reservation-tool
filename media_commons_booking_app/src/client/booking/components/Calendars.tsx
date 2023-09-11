import React, { useState, useEffect, useRef } from 'react';
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timeGrid'; // a plugin!
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarDatePicker } from './CalendarDatePicker';
import { DateSelectArg } from '@fullcalendar/core';
import { RoomSetting } from './SheetEditor';

type CalendarProps = {
  apiKey: string;
  allRooms: any[];
  selectedRooms: RoomSetting[];
  handleSetDate: any;
  refs?: any[];
};

const TITLE_TAG = '[Click to Delete]';

export const Calendars = ({
  apiKey,
  allRooms,
  selectedRooms,
  handleSetDate,
}: CalendarProps) => {
  const [enrolledThisis, setEnrolledThesis] = useState(false);
  const [bookInfo, setBookInfo] = useState<DateSelectArg>();

  const editableEvent = (info) => {
    return info.title.includes(TITLE_TAG);
  };
  const validateEvents = (e) => {
    e.stopPropagation;
    const overlap = isOverlap(bookInfo);
    const past = bookInfo.start < new Date();
    if (past) {
      alert("You can't schedule events in the past");
      return;
    }

    if (overlap) {
      alert('The new event overlaps with an existing event on the same day!');
      return;
    }
    if (bookInfo) {
      const isConfirmed = window.confirm(
        `You are booking the following rooms: ${selectedRooms.map(
          (room) => `${room.roomId} ${room.name}`
        )}
      \nYour reserved time slot: ${bookInfo.startStr} ~ ${bookInfo.endStr}`
      );
      if (isConfirmed) handleSetDate(bookInfo);
    }
  };

  const isOverlap = (info) => {
    return selectedRooms.some((room, i) => {
      const calendarApi = room.calendarRef.current.getApi();

      const allEvents = calendarApi.getEvents();
      return allEvents.some((event) => {
        if (event.title.includes('Reserve')) return false;
        return (
          (event.start >= info.start && event.start < info.end) ||
          (event.end > info.start && event.end <= info.end) ||
          (event.start <= info.start && event.end >= info.end)
        );
      });
    });
  };

  const handleEventClick = (info) => {
    if (!editableEvent(info.event)) return;
    const targetGroupId = info.event.groupId;
    const isConfirmed = window.confirm('Do you want to delete this event?');

    if (isConfirmed) {
      allRooms.map((room) => {
        if (!room.calendarRef.current) return;
        let calendarApi = room.calendarRef.current.getApi();
        const events = calendarApi.getEvents();
        events.map((event) => {
          if (event.groupId === targetGroupId) {
            event.remove();
          }
        });
      });
      setBookInfo(null);
      return;
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
  const handleDateSelect = (selectInfo) => {
    if (bookInfo) {
      alert('You can only book one time slot per reservation');
      return;
    }
    allRooms.map((room) => {
      console.log('handle datae select room', room);
      if (!room.calendarRef.current) return;
      let calendarApi = room.calendarRef.current.getApi();
      calendarApi.addEvent({
        id: Date.now(), // Generate a unique ID for the event
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        title: `${TITLE_TAG} Reserve`,
        groupId: selectInfo.startStr,
      });
    });
    setBookInfo(selectInfo);
  };

  const handleChange = (selectedDate: Date) => {
    allRooms.forEach((room) => {
      room.calendarRef.current.getApi().gotoDate(selectedDate);
    });
  };
  const handleSelectAllow = (selectInfo) => {
    console.log('selectInfo', selectInfo);
    // only enrolledThesis user can book over 4 hours
    if (
      !enrolledThisis &&
      selectInfo.end.getTime() / 1000 - selectInfo.start.getTime() / 1000 >=
        60 * 60 * 4
    ) {
      return false;
    }

    console.log('isOverlap', !isOverlap(selectInfo));
    return !isOverlap(selectInfo);
  };
  return (
    <div className="mt-5 flex flex-col justify-center">
      <div className="flex justify-center items-center space-x-4 my-8">
        <CalendarDatePicker handleChange={handleChange} />
        <input
          id="default-checkbox"
          type="checkbox"
          value=""
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          onChange={(e) => setEnrolledThesis(!enrolledThisis)}
        />
        <label
          htmlFor="default-checkbox"
          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Enrolled in thesis
        </label>
        <div className="flex flex-col items-center ">
          <button
            key="calendarNextButton"
            disabled={!bookInfo}
            onClick={(e) => {
              validateEvents(e);
            }}
            className={`px-4 py-2 text-white rounded-md focus:outline-none ${
              bookInfo
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
          <div
            className={`mx-5 h-[1000px] ${
              selectedRooms.length === 1 && 'w-[1000px]'
            } ${!selectedRooms.includes(room) && 'hidden'}`}
          >
            {selectedRooms.includes(room)}
            {room.roomId} {room.name}
            <FullCalendar
              ref={room.calendarRef}
              height="100%"
              selectable={true}
              plugins={[
                interactionPlugin,
                timeGridPlugin,
                googleCalendarPlugin,
                dayGridPlugin,
              ]}
              headerToolbar={{
                left: '',
                center: 'title',
                right: '',
              }}
              themeSystem="bootstrap5"
              googleCalendarApiKey={apiKey}
              events={{ googleCalendarId: room.calendarId }}
              eventDidMount={function (info) {
                // Change the background color of the event depending on its title
                if (info.event.title.includes('REQUESTED')) {
                  info.el.style.backgroundColor = '#d60000';
                } else if (info.event.title.includes('PRE-APPROVED')) {
                  info.el.style.backgroundColor = '#f6c026';
                } else if (info.event.title.includes('APPROVED')) {
                  info.el.style.backgroundColor = '#33b679';
                } else if (info.event.title.includes('CONFIRMED')) {
                  info.el.style.backgroundColor = '#0b8043';
                } else if (info.event.title.includes('REJECTED')) {
                  info.el.style.display = 'none';
                } else if (info.event.title.includes('CANCELLED')) {
                  info.el.style.display = 'none';
                }
              }}
              editable={true}
              initialView={
                selectedRooms.length > 1 ? 'timeGridDay' : 'timeGridDay'
              }
              navLinks={true}
              select={function (info) {
                handleDateSelect(info);
              }}
              eventClick={function (info) {
                info.jsEvent.preventDefault();
                handleEventClick(info);
              }}
              eventAllow={(dropLocation, draggedEvent) => {
                return editableEvent(draggedEvent);
              }}
              selectAllow={(e) => handleSelectAllow(e)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
