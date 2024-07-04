import { Booking, CalendarEvent, RoomSetting } from '../../../../types';
import { CALENDAR_HIDE_STATUS, STORAGE_KEY_BOOKING } from '../../../../policy';
import { useEffect, useState } from 'react';

import getBookingStatus from '../../admin/hooks/getBookingStatus';
import { serverFunctions } from '../../../utils/serverFunctions';

export default function fetchCalendarEvents(allRooms: RoomSetting[]) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    console.log(
      'Fetching calendar events from:',
      process.env.CALENDAR_ENV,
      'calendars'
    );

    const fakeEvents = getFakeEvents();

    Promise.all(allRooms.map(fetchRoomCalendarEvents)).then((results) =>
      setEvents(
        [...fakeEvents, ...results.flat()].filter(
          (event) =>
            !CALENDAR_HIDE_STATUS.some((status) => event.title.includes(status))
        )
      )
    );
  }, [allRooms]);

  const fetchRoomCalendarEvents = async (room: RoomSetting) => {
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
    return rowsWithResourceIds;
    // const filteredEvents = rowsWithResourceIds.filter((row) => {
    //   return !CALENDAR_HIDE_STATUS.some((status) => row.title.includes(status));
    // });
    // return filteredEvents;
  };

  const getFakeEvents: () => CalendarEvent[] = () => {
    const existingFakeData = localStorage.getItem(STORAGE_KEY_BOOKING);
    if (existingFakeData != null && process.env.BRANCH_NAME === 'development') {
      const json = JSON.parse(existingFakeData);
      return json.bookingRows.map((booking: Booking) => ({
        title: `[${getBookingStatus(booking, json.bookingStatusRows)}] ${
          booking.title
        }`,
        start: booking.startDate,
        end: booking.endDate,
        id: booking.roomId,
        resourceId: booking.roomId,
      }));
    }
    return [];
  };

  return events;
}
