import { Box, Typography } from '@mui/material';
import { CalendarApi, DateSelectArg, EventClickArg } from '@fullcalendar/core';
import { CalendarEvent, RoomSetting } from '../../../../types';
import React, { useContext, useEffect, useRef, useState } from 'react';

import { BookingContext } from '../bookingProvider';
import CalendarEventBlock from './CalendarEventBlock';
import FullCalendar from '@fullcalendar/react';
import fetchCalendarEvents from '../hooks/fetchCalendarEvents';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import { styled } from '@mui/system';

interface Props {
  allRooms: RoomSetting[];
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

  '.fc-event:focus::after': {
    background: 'none',
  },
});

const Empty = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 500,
  color: theme.palette.custom.gray3,
}));

const TITLE_TAG = 'Click to Delete';

export default function CalendarVerticalResource({
  allRooms,
  rooms,
  dateView,
}: Props) {
  const [newEvents, setNewEvents] = useState<CalendarEvent[]>([]);
  const { bookingCalendarInfo, existingEvents, setBookingCalendarInfo } =
    useContext(BookingContext);
  const ref = useRef(null);

  // update calendar day view based on mini calendar date picker
  useEffect(() => {
    if (ref.current == null || ref.current.getApi() == null) {
      return;
    }
    const api: CalendarApi = ref.current.getApi();
    api.gotoDate(dateView);
  }, [dateView]);

  useEffect(() => {
    if (bookingCalendarInfo == null) {
      setNewEvents([]);
      return;
    }

    const newRoomEvents = rooms.map((room) => ({
      start: bookingCalendarInfo.startStr,
      end: bookingCalendarInfo.endStr,
      id: Date.now().toString(),
      resourceId: room.roomId,
      title: TITLE_TAG,
    }));
    setNewEvents(newRoomEvents);
  }, [bookingCalendarInfo, rooms]);

  const resources = rooms.map((room) => ({
    id: room.roomId,
    title: `${room.roomId} ${room.name}`,
  }));

  const handleEventSelect = (selectInfo: DateSelectArg) => {
    setBookingCalendarInfo(selectInfo);
  };

  const handleEventClick = (info: EventClickArg) => {
    if (info.event.title.includes(TITLE_TAG)) {
      setBookingCalendarInfo(null);
    }
  };

  if (rooms.length === 0) {
    return (
      <Empty>
        <Typography>
          Select spaces to view their availability and choose a time slot
        </Typography>
      </Empty>
    );
  }

  return (
    <FullCalendarWrapper>
      <FullCalendar
        initialDate={dateView}
        initialView="resourceTimeGridDay"
        plugins={[
          resourceTimeGridPlugin,
          googleCalendarPlugin,
          interactionPlugin,
        ]}
        selectable={true}
        selectOverlap={false}
        select={handleEventSelect}
        schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
        resources={resources}
        events={[...existingEvents, ...newEvents]}
        eventContent={CalendarEventBlock}
        eventClick={function (info) {
          info.jsEvent.preventDefault();
          handleEventClick(info);
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
