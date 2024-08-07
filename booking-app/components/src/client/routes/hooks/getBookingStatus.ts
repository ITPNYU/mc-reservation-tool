import { Booking, BookingStatus, BookingStatusLabel } from "../../../types";

import { Timestamp } from "@firebase/firestore";

export default function getBookingStatus(
  booking: Booking,
  bookingStatuses: BookingStatus[]
): BookingStatusLabel {
  const bookingStatusLabel = () => {
    const bookingStatusMatch = bookingStatuses.filter(
      (row) => row.calendarEventId === booking.calendarEventId
    )[0];

    if (bookingStatusMatch === undefined) return BookingStatusLabel.UNKNOWN;

    const timeStringtoDate = (time: Timestamp) => {
      return time != undefined ? time.toDate() : new Date(0);
    };

    const checkedInTimestamp = timeStringtoDate(bookingStatusMatch.checkedInAt);
    const noShowTimestamp = timeStringtoDate(bookingStatusMatch.noShowedAt);
    const canceledTimestamp = timeStringtoDate(bookingStatusMatch.canceledAt);

    // if any of checkedInAt, noShowedAt, canceledAt have a date, return the most recent
    if (
      checkedInTimestamp.getTime() !== 0 ||
      noShowTimestamp.getTime() !== 0 ||
      canceledTimestamp.getTime() !== 0
    ) {
      let mostRecentTimestamp: Date = checkedInTimestamp;
      let label = BookingStatusLabel.CHECKED_IN;

      if (noShowTimestamp > mostRecentTimestamp) {
        mostRecentTimestamp = noShowTimestamp;
        label = BookingStatusLabel.NO_SHOW;
      }

      if (canceledTimestamp > mostRecentTimestamp) {
        mostRecentTimestamp = canceledTimestamp;
        label = BookingStatusLabel.CANCELED;
      }
      return label;
    }

    if (bookingStatusMatch.rejectedAt != undefined) {
      return BookingStatusLabel.REJECTED;
    } else if (bookingStatusMatch.secondApprovedAt !== undefined) {
      return BookingStatusLabel.APPROVED;
    } else if (bookingStatusMatch.firstApprovedAt !== undefined) {
      return BookingStatusLabel.PRE_APPROVED;
    } else if (bookingStatusMatch.requestedAt != undefined) {
      return BookingStatusLabel.REQUESTED;
    } else if (bookingStatusMatch.walkedInAt != undefined) {
      return BookingStatusLabel.WALK_IN;
    } else {
      return BookingStatusLabel.UNKNOWN;
    }
  };

  return bookingStatusLabel();
}
