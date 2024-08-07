import { Box, Typography } from '@mui/material';
import { CalendarApi, DateSelectArg, EventClickArg } from '@fullcalendar/core';
import { CalendarEvent, RoomSetting } from '../../../../types';
import CalendarEventBlock, { NEW_TITLE_TAG } from './CalendarEventBlock';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';

import { BookingContext } from '../bookingProvider';
import FullCalendar from '@fullcalendar/react';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import { styled } from '@mui/system';

interface Props {
  rooms: RoomSetting[];
  dateView: Date;
}

const FullCalendarWrapper = styled(Box)({
  marginTop: 12,
  '.fc-day-today': {
    background: 'white !important',
  },

  '.fc-col-header-cell-cushion': {
    fontSize: 'small',
    lineHeight: 'normal',
  },

  '.fc-timegrid-col-events': {
    margin: 0,
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

  '.fc-timegrid-event-harness': {
    left: '0% !important',
  },
});

const Empty = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 500,
  color: theme.palette.custom.gray3,
}));

export default function CalendarVerticalResource({ rooms, dateView }: Props) {
  const [newEvents, setNewEvents] = useState<CalendarEvent[]>([]);
  const {
    bookingCalendarInfo,
    existingCalendarEvents,
    setBookingCalendarInfo,
  } = useContext(BookingContext);
  const ref = useRef(null);

  const resources = useMemo(
    () =>
      rooms.map((room) => ({
        id: room.roomId,
        title: `${room.roomId} ${room.name}`,
      })),
    [rooms]
  );

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

    const newRoomEvents = rooms.map((room, index) => ({
      start: bookingCalendarInfo.startStr,
      end: bookingCalendarInfo.endStr,
      id: Date.now().toString(),
      resourceId: room.roomId,
      title: NEW_TITLE_TAG,
      overlap: false,
      url: `${index}:${rooms.length - 1}`, // some hackiness to let us render multiple events visually as one big block
    }));
    setNewEvents(newRoomEvents);
  }, [bookingCalendarInfo, rooms]);

  const handleEventSelect = (selectInfo: DateSelectArg) => {
    setBookingCalendarInfo(selectInfo);
  };

  const handleEventSelecting = (selectInfo: DateSelectArg) => {
    if (ref.current == null || ref.current.getApi() == null) {
      return true;
    }
    const api: CalendarApi = ref.current.getApi();
    api.unselect();
    setBookingCalendarInfo(selectInfo);
    return true;
  };

  const handleEventClick = (info: EventClickArg) => {
    if (info.event.title.includes(NEW_TITLE_TAG)) {
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
        select={handleEventSelect}
        selectAllow={handleEventSelecting}
        schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
        resources={resources}
        events={[...existingCalendarEvents, ...newEvents]}
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
