import { useContext, useEffect, useState } from 'react';

import { BookingContext } from '../bookingProvider';
import { INSTANT_APPROVAL_ROOMS } from '../../../../policy';

export default function useCheckAutoApproval() {
  const { bookingCalendarInfo, selectedRooms, formData } =
    useContext(BookingContext);

  const [isAutoApproval, setIsAutoApproval] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const throwError = (msg: string) => {
    setIsAutoApproval(false);
    setErrorMessage(msg);
  };

  useEffect(() => {
    // EVENT DURATION > 4 HOURS
    if (bookingCalendarInfo != null) {
      const startDate = bookingCalendarInfo.start;
      const endDate = bookingCalendarInfo.end;
      const duration = endDate.getTime() - startDate.getTime();
      if (duration > 3.6e6 * 4) {
        throwError('Event duration exceeds 4 hours');
        return;
      }
    }

    // ROOMS REQUIRE APPROVAL
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

    // ROOM SETUP
    if (formData?.roomSetup === 'yes') {
      throwError(
        'Requesting additional room setup for an event will require approval'
      );
      return;
    }

    // HAS MEDIA SERVICES
    if (formData?.mediaServices?.length > 0) {
      throwError(
        'Requesting media services for an event will require approval'
      );
      return;
    }

    // HAS CATERING
    if (formData?.catering === 'yes') {
      throwError('Providing catering for an event will require approval');
      return;
    }

    // HAS SECURITY
    if (formData?.hireSecurity === 'yes') {
      throwError('Hiring security for an event will require approval');
      return;
    }

    setIsAutoApproval(true);
    setErrorMessage(null);
  }, [
    // WARNING WARNING make sure to update this dep list if relying on new props
    bookingCalendarInfo,
    selectedRooms,
    formData?.catering,
    formData?.hireSecurity,
    formData?.mediaServices,
    formData?.roomSetup,
  ]);

  return { isAutoApproval, errorMessage };
}
