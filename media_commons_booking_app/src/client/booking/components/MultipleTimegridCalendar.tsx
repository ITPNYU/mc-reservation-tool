import React, { useState, useEffect, useRef } from 'react';
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timeGrid'; // a plugin!
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import dayGridPlugin from '@fullcalendar/daygrid';

export const MultipleTimegridCalendar = ({
  ref,
  room,
  apiKey,
  enrolledThisis,
  handleDateSelect,
}) => {
  const [currentRef, setCurrentRef] = useState(null);
  useEffect(() => {
    ref ? setCurrentRef(ref) : setCurrentRef(React.createRef());
  }, []);
  const handleSelectDate = (selectInfo) => {
    let calendarApi = currentRef.current.getApi();
    calendarApi.addEvent({
      id: Date.now(), // Generate a unique ID for the event
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      title: 'Reserve',
      groupId: selectInfo.startStr,
    });
    handleDateSelect(room, selectInfo);
  };
  const handleEventClick = (info) => {
    const targetGroupId = info.event.groupId;
    const isConfirmed = window.confirm('Do you want to delete this event?');

    if (isConfirmed) {
      let calendarApi = currentRef.current.getApi();
      const events = calendarApi.getEvents();
      events.map((event) => {
        if (event.groupId === targetGroupId) {
          event.remove();
        }
      });
      return;
    }
  };
  return (
    <div key={room.roomId} className={`mx-1 h-[1000px] w-[200px]`}>
      <h3 className="text-center">
        {room.roomId} {room.name}
      </h3>
      <FullCalendar
        ref={currentRef}
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
          center: '',
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
        initialView={'timeGridDay'}
        businessHours={{
          startTime: '08:00', // a start time (10am in this example)
          endTime: '20:00', // an end time (6pm in this example)
        }}
        //@ts-ignore
        eventAllow={function (dropInfo, draggedEvent) {
          return draggedEvent.title.includes('Reserve') ? true : false;
        }}
        navLinks={true}
        select={function (info) {
          handleSelectDate(info);
        }}
        eventClick={function (info) {
          handleEventClick(info);
        }}
        selectAllow={function (e) {
          if (enrolledThisis) {
            return true;
          } else {
            if (
              e.end.getTime() / 1000 - e.start.getTime() / 1000 <=
              60 * 60 * 4
            ) {
              return true;
            }
          }
        }}
      />
    </div>
  );
};
