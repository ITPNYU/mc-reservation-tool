import {
  ActiveSheetBookingStatusColumns,
  TableNames,
  getSecondApproverEmail,
} from '../policy';
import { approvalUrl, rejectUrl } from './ui';
import {
  fetchById,
  fetchIndexByUniqueValue,
  getActiveSheetValueById,
  removeRowActive,
  updateActiveSheetValueById,
} from './db';
import { inviteUserToCalendarEvent, updateEventPrefix } from './calendars';
import { sendHTMLEmail, sendTextEmail } from './emails';

export const bookingContents = (id: string) => {
  const bookingObj = fetchById(TableNames.BOOKING, id);
  bookingObj.calendarEventId = id;
  bookingObj.approvalUrl = approvalUrl(id);
  bookingObj.rejectedUrl = rejectUrl(id);
  return bookingObj;
};

const firstApprove = (id: string) =>
  updateActiveSheetValueById(
    TableNames.BOOKING_STATUS,
    id,
    ActiveSheetBookingStatusColumns.FIRST_APPROVED_DATE,
    new Date()
  );

const secondApprove = (id: string) =>
  updateActiveSheetValueById(
    TableNames.BOOKING_STATUS,
    id,
    ActiveSheetBookingStatusColumns.SECOND_APPROVED_DATE,
    new Date()
  );

export const approveInstantBooking = (id: string) => {
  firstApprove(id);
  approveEvent(id);
};

// both first approve and second approve flows hit here
export const approveBooking = (id: string) => {
  const firstApproveDateRange = getActiveSheetValueById(
    TableNames.BOOKING_STATUS,
    id,
    ActiveSheetBookingStatusColumns.FIRST_APPROVED_DATE
  );

  console.log('first approve date', firstApproveDateRange);

  // if already first approved, then this is a second approve
  if (firstApproveDateRange !== '') {
    secondApprove(id);
    approveEvent(id);
  } else {
    firstApprove(id);

    //TODO: send email to user
    updateEventPrefix(id, 'PRE-APPROVED');

    const subject = 'Second Approval Request';
    const contents = bookingContents(id);
    const recipient = getSecondApproverEmail(process.env.BRANCH_NAME);
    sendHTMLEmail('approval_email', contents, recipient, subject, '');
  }
};

export const approveEvent = (id: string) => {
  const guestEmail = getActiveSheetValueById(
    TableNames.BOOKING_STATUS,
    id,
    ActiveSheetBookingStatusColumns.EMAIL
  );
  sendTextEmail(
    guestEmail,
    'Media Commons Reservation Approved',
    'Your reservation request for Media Commons is approved.'
  );

  updateEventPrefix(id, 'APPROVED');
  inviteUserToCalendarEvent(id, guestEmail);
};

export const reject = (id: string) => {
  updateActiveSheetValueById(
    TableNames.BOOKING_STATUS,
    id,
    ActiveSheetBookingStatusColumns.REJECTED_DATE,
    new Date()
  );

  const guestEmail = getActiveSheetValueById(
    TableNames.BOOKING_STATUS,
    id,
    ActiveSheetBookingStatusColumns.EMAIL
  );
  sendTextEmail(
    guestEmail,
    'Media Commons Reservation Has Been Rejected',
    'Your reservation request for Media Commons has been rejected. For detailed reasons regarding this decision, please contact us at mediacommons.reservations@nyu.edu.'
  );
  updateEventPrefix(id, 'REJECTED');
};

export const cancel = (id: string) => {
  updateActiveSheetValueById(
    TableNames.BOOKING_STATUS,
    id,
    ActiveSheetBookingStatusColumns.CANCELLED_DATE,
    new Date()
  );
  const guestEmail = getActiveSheetValueById(
    TableNames.BOOKING_STATUS,
    id,
    ActiveSheetBookingStatusColumns.EMAIL
  );
  sendTextEmail(
    guestEmail,
    'Media Commons Reservation Has Been Cancelled',
    'Your reservation request for Media Commons has been cancelled. For detailed reasons regarding this decision, please contact us at mediacommons.reservations@nyu.edu.'
  );
  updateEventPrefix(id, 'CANCELLED');
};

export const checkin = (id: string) => {
  updateActiveSheetValueById(
    TableNames.BOOKING_STATUS,
    id,
    ActiveSheetBookingStatusColumns.CHECKED_IN_DATE,
    new Date()
  );
  const guestEmail = getActiveSheetValueById(
    TableNames.BOOKING_STATUS,
    id,
    ActiveSheetBookingStatusColumns.EMAIL
  );
  sendTextEmail(
    guestEmail,
    'Media Commons Reservation Has Been Checked In',
    'Your reservation request for Media Commons has been checked in. Thank you for choosing Media Commons.'
  );
  updateEventPrefix(id, 'CHECKED IN');
};

// assumes the email is in column 0 but that can be overridden
export const removeFromListByEmail = (
  sheetName: TableNames,
  email: string,
  column: number = 0
) => {
  const rowIndex = fetchIndexByUniqueValue(sheetName, column, email);
  console.log('rowIndex to remove:', rowIndex);
  removeRowActive(sheetName, rowIndex);
};
