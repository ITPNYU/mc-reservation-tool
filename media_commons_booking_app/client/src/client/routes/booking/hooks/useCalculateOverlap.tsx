import { useCallback, useContext } from 'react';

import { BookingContext } from '../bookingProvider';

export default function useCalculateOverlap() {
  const { bookingCalendarInfo, existingCalendarEvents, selectedRooms } =
    useContext(BookingContext);

  const isOverlapping = useCallback(() => {
    if (bookingCalendarInfo == null) return false;
    const selectedRoomIds = selectedRooms.map((x) => x.roomId);
    return existingCalendarEvents
      .map((event) => {
        if (!selectedRoomIds.includes(event.resourceId)) return false;
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        return (
          (eventStart >= bookingCalendarInfo.start &&
            eventStart < bookingCalendarInfo.end) ||
          (eventEnd > bookingCalendarInfo.start &&
            eventEnd <= bookingCalendarInfo.end) ||
          (eventStart <= bookingCalendarInfo.start &&
            eventEnd >= bookingCalendarInfo.end)
        );
      })
      .some((x) => x);
  }, [bookingCalendarInfo, existingCalendarEvents, selectedRooms]);

  return isOverlapping();
}
