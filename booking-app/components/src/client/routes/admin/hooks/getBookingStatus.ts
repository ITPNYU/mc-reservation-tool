import { Booking, BookingStatus, BookingStatusLabel } from "../../../../types";

export default function getBookingStatus(
  booking: Booking,
  bookingStatuses: BookingStatus[],
): BookingStatusLabel {
  const bookingStatusLabel = () => {
    const bookingStatusMatch = bookingStatuses.filter(
      (row) => row.calendarEventId === booking.calendarEventId,
    )[0];

    if (bookingStatusMatch === undefined) return BookingStatusLabel.UNKNOWN;

    const timeStringtoDate = (time: string) =>
      time.length > 0 ? new Date(time) : new Date(0);

    const checkedInTimestamp = timeStringtoDate(
      bookingStatusMatch.checkedInAt.toString(),
    );
    const noShowTimestamp = timeStringtoDate(
      bookingStatusMatch.noShowedAt.toString(),
    );
    const canceledTimestamp = timeStringtoDate(
      bookingStatusMatch.canceledAt.toString(),
    );

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

    if (bookingStatusMatch.rejectedAt !== null) {
      return BookingStatusLabel.REJECTED;
    } else if (bookingStatusMatch.secondApprovedAt !== null) {
      return BookingStatusLabel.APPROVED;
    } else if (bookingStatusMatch.firstApprovedAt !== null) {
      return BookingStatusLabel.PRE_APPROVED;
    } else if (bookingStatusMatch.requestedAt !== null) {
      return BookingStatusLabel.REQUESTED;
    } else {
      return BookingStatusLabel.UNKNOWN;
    }
  };

  return bookingStatusLabel();
}
