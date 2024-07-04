import { useContext, useEffect, useState } from 'react';

import { BookingContext } from '../bookingProvider';
import { INSTANT_APPROVAL_ROOMS } from '../../../../policy';

export default function useCheckAutoApproval() {
  const { bookingCalendarInfo, selectedRooms } = useContext(BookingContext);

  const [isAutoApproval, setIsAutoApproval] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const throwError = (msg: string) => {
    setIsAutoApproval(false);
    setErrorMessage(msg);
  };

  useEffect(() => {
    if (bookingCalendarInfo != null) {
      const startDate = bookingCalendarInfo.start;
      const endDate = bookingCalendarInfo.end;
      const duration = endDate.getTime() - startDate.getTime();
      if (duration > 3.6e6 * 4) {
        throwError('Event duration exceeds 4 hours');
        return;
      }
    }

    if (
      !selectedRooms.every((room) =>
        INSTANT_APPROVAL_ROOMS.includes(room.roomId)
      )
    ) {
      throwError(
        'At least one of the requested rooms is not eligible for auto approval'
      );
      return;
    }

    setIsAutoApproval(true);
    setErrorMessage(null);
  }, [bookingCalendarInfo, selectedRooms]);

  return { isAutoApproval, errorMessage };
  // const isAutoApproval = (
  //   selectedRoomIds: string[],
  //   data: Booking,
  //   bookingCalendarInfo
  // ) => {
  //   const startDate = new Date(bookingCalendarInfo?.startStr);
  //   const endDate = new Date(bookingCalendarInfo?.endStr);
  //   const duration = endDate.getTime() - startDate.getTime();
  //   // If the selected rooms are all instant approval rooms and the user does not need catering, and hire security, and room setup, then it is auto-approval.
  //   return (
  //     duration <= 3.6e6 * 4 && // <= 4 hours
  //     selectedRoomIds.every((r) => INSTANT_APPROVAL_ROOMS.includes(r)) &&
  //     data['catering'] === 'no' &&
  //     data['hireSecurity'] === 'no' &&
  //     data['mediaServices'].length === 0 &&
  //     data['roomSetup'] === 'no'
  //   );
  // };
}
