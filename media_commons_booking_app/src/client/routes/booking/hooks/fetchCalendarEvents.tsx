import { CalendarEvent, RoomSetting } from '../../../../types';
import { useEffect, useState } from 'react';

import { CALENDAR_HIDE_STATUS } from '../../../../policy';
import { serverFunctions } from '../../../utils/serverFunctions';

export default function fetchCalendarEvents(rooms: RoomSetting[]) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    console.log(
      'Fetching calendar events from:',
      process.env.CALENDAR_ENV,
      'calendars'
    );
    rooms.forEach((room) => {
      fetchCalendarEvents(room).then((events) => {
        setEvents((prev) => [...prev, ...events]);
      });
    });
  }, []);

  const fetchCalendarEvents = async (room: RoomSetting) => {
    const calendarId =
      process.env.CALENDAR_ENV === 'production'
        ? room.calendarIdProd
        : room.calendarIdDev;
    const rows = await serverFunctions.getCalendarEvents(calendarId);
    const rowsWithResourceIds = rows.map((row) => ({
      ...row,
      id: room.roomId,
      resourceId: room.roomId,
    }));
    const filteredEvents = rowsWithResourceIds.filter((row) => {
      return !CALENDAR_HIDE_STATUS.some((status) => row.title.includes(status));
    });
    return filteredEvents;
  };

  return events;
}
