import React, { useEffect, useRef, useState } from 'react';

import { Box } from '@mui/material';
import { CalendarApi } from '@fullcalendar/core';
import CalendarEvent from './CalendarEvent';
import FullCalendar from '@fullcalendar/react';
import { RoomSetting } from '../../../../types';
import fetchCalendarEvents from '../hooks/fetchCalendarEvents';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import { styled } from '@mui/system';

interface Props {
  rooms: RoomSetting[];
  dateView: Date;
}

const FullCalendarWrapper = styled(Box)({
  marginTop: 12,

  '.fc-col-header-cell-cushion': {
    fontSize: 'small',
    lineHeight: 'normal',
  },

  '.fc-v-event': {
    border: 'none',
    textDecoration: 'none',
    backgroundColor: 'unset',
    boxShadow: 'unset',
  },
  'a:hover': {
    border: 'none',
    textDecoration: 'none !important',
  },
});

export default function CalendarVerticalResource({ rooms, dateView }: Props) {
  const events = fetchCalendarEvents(rooms);
  const ref = useRef(null);

  // update calendar day view based on mini calendar date picker
  useEffect(() => {
    if (ref.current == null || ref.current.getApi() == null) {
      return;
    }
    const api: CalendarApi = ref.current.getApi();
    api.gotoDate(dateView);
  }, [dateView]);

  const resources = rooms.map((room) => ({
    id: room.roomId,
    title: `${room.roomId} ${room.name}`,
  }));

  return (
    <FullCalendarWrapper>
      <FullCalendar
        initialDate={dateView}
        initialView="resourceTimeGridDay"
        plugins={[resourceTimeGridPlugin, googleCalendarPlugin]}
        schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
        resources={resources}
        events={events}
        eventContent={CalendarEvent}
        eventClick={function (info) {
          info.jsEvent.preventDefault();
          // handleEventClick(info);
        }}
        headerToolbar={false}
        slotMinTime="09:00:00"
        slotMaxTime="21:00:00"
        allDaySlot={false}
        aspectRatio={1.5}
        expandRows={true}
        stickyHeaderDates={true}
        ref={ref}
      />
    </FullCalendarWrapper>
  );
}
