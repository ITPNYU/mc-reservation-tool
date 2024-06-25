import { BookingStatusLabel } from '../../../../types';
import { EventContentArg } from '@fullcalendar/core';
import React from 'react';

export default function CalendarEvent(eventInfo: EventContentArg) {
  const match = eventInfo.event.title.match(/\[(.*?)\]/);
  const title = match ? match[1] : eventInfo.event.title;

  const backgroundColor = () => {
    let backgroundColor = 'rgba(72, 196, 77, 1)';
    // Change the background color of the event depending on its title
    if (eventInfo.event.title.includes(BookingStatusLabel.REQUESTED)) {
      backgroundColor = 'rgba(255, 122, 26, 1)';
    } else if (
      eventInfo.event.title.includes(BookingStatusLabel.PRE_APPROVED)
    ) {
      backgroundColor = 'rgba(223, 26, 255, 1)';
    }
    return backgroundColor;
  };

  return (
    <div
      style={{
        backgroundColor: backgroundColor(),
        border: `2px solid ${backgroundColor()}`,
        borderRadius: '2px',
        outline: 'none',
        height: '100%',
        width: '100%',
        overflowX: 'hidden',
      }}
    >
      <b>{title}</b>
    </div>
  );
}
