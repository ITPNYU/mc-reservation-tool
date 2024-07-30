import { Booking, CalendarEvent, RoomSetting } from "../../../../types";
import { CALENDAR_HIDE_STATUS, STORAGE_KEY_BOOKING } from "../../../../policy";
import { useEffect, useState } from "react";

import getBookingStatus from "../../hooks/getBookingStatus";
import axios from "axios";

export default function fetchCalendarEvents(allRooms: RoomSetting[]) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    //TODO: Fix this after getting title from prodcalendars
    Promise.all(allRooms.map(fetchRoomCalendarEvents)).then((results) =>
      setEvents(
        [...results.flat()].filter(
          (event) =>
            !CALENDAR_HIDE_STATUS.some((status) =>
              event?.title?.includes(status)
            )
        )
      )
    );
  }, [allRooms]);

  const fetchRoomCalendarEvents = async (room: RoomSetting) => {
    const calendarId = room.calendarId;
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/calendarEvents`,
      {
        params: { calendarId: calendarId },
      }
    );
    const filteredEvents = response.data.filter((row: any) => {
      return !CALENDAR_HIDE_STATUS.some((status) =>
        row?.title?.includes(status)
      );
    });
    setEvents(filteredEvents);
    const rowsWithResourceIds = filteredEvents.map((row) => ({
      ...row,
      id: room.roomId + row.start,
      resourceId: room.roomId,
    }));
    return rowsWithResourceIds;
  };

  const getFakeEvents: () => CalendarEvent[] = () => {
    const existingFakeData = localStorage.getItem(STORAGE_KEY_BOOKING);
    if (existingFakeData != null && process.env.BRANCH_NAME === "development") {
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
