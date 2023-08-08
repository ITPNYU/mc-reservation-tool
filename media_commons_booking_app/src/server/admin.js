export const ACTIVE_SHEET_ID = '1VZ-DY6o0GM5DL-v9AKkpCbF0w-xm-_T-vVUSPZph06Q';
export const BOOKING_SHEET_NAME = 'bookings';
export const BOOKING_STATUS_SHEET_NAME = 'bookingStatus';
const SECOND_APPROVER_EMAIL = 'rh3555@nyu.edu';

const current = new Date();

export const bookingContents = (id) => {
  const rowIndex = fetchRows_(BOOKING_SHEET_NAME).findIndex(
    (row) => row[0] === id
  );
  console.log('rowIndex', rowIndex);
  const targetRowIndex = rowIndex + 1;
  if (rowIndex === -1) throw 'Invalid conversation ID: ' + id;
  const sheet =
    SpreadsheetApp.openById(ACTIVE_SHEET_ID).getSheetByName(BOOKING_SHEET_NAME);
  const range = sheet.getRange(targetRowIndex, 1, 1, sheet.getLastColumn());
  const values = range.getValues()[0];
  console.log('values', values);

  return {
    calendarEventId: id,
    roomId: values[2],
    email: values[3],
    startDate: values[4],
    endDate: values[5],
    firstName: values[6],
    lastName: values[7],
    secondaryName: values[8],
    nNumber: values[9],
    netId: values[10],
    phoneNumber: values[11],
    department: values[12],
    role: values[13],
    sponsorFirstName: values[14],
    sponsorLastName: values[15],
    sponsorEmail: values[16],
    reservationTitle: values[17],
    reservationDescription: values[18],
    expectedAttendance: values[19],
    attendeeAffiliation: values[20],
    roomSetup: values[21],
    setupDetails: values[22],
    mediaServices: values[23],
    mediaServicesDetails: values[24],
    catering: values[25],
    cateringService: values[26],
    chartfieldInformation: values[27],
    hireSecurity: values[28],
    approvalUrl: approvalUrl(id),
    rejectedUrl: rejectUrl(id),
  };
};

export const approveInstantBooking = (id) => {
  const rowIndex = fetchRows_(BOOKING_STATUS_SHEET_NAME).findIndex(
    (row) => row[0] === id
  );
  console.log('rowIndex', rowIndex);
  if (rowIndex === -1) throw 'Invalid conversation ID: ' + id;
  SpreadsheetApp.openById(ACTIVE_SHEET_ID)
    .getSheetByName(BOOKING_STATUS_SHEET_NAME)
    .getRange(rowIndex + 1, 4)
    .setValue(current);

  SpreadsheetApp.openById(ACTIVE_SHEET_ID)
    .getSheetByName(BOOKING_STATUS_SHEET_NAME)
    .getRange(rowIndex + 1, 5)
    .setValue(current);
  updateEventPrefix(id, 'APPROVED');
};

export const approveBooking = (id) => {
  const rowIndex = fetchRows_(BOOKING_STATUS_SHEET_NAME).findIndex(
    (row) => row[0] === id
  );
  console.log('rowIndex', rowIndex);
  if (rowIndex === -1) throw 'Invalid conversation ID: ' + id;
  const firstApproveDate = SpreadsheetApp.openById(ACTIVE_SHEET_ID)
    .getSheetByName(BOOKING_STATUS_SHEET_NAME)
    .getRange(rowIndex + 1, 4);
  console.log('firstApproveDate', firstApproveDate.getValue());

  //TODO: check email address
  if (firstApproveDate.getValue() !== '') {
    // second approve
    SpreadsheetApp.openById(ACTIVE_SHEET_ID)
      .getSheetByName(BOOKING_STATUS_SHEET_NAME)
      .getRange(rowIndex + 1, 5)
      .setValue(current);
    //TODO: send email to user
    updateEventPrefix(id, 'APPROVED');
  } else {
    // first approve
    SpreadsheetApp.openById(ACTIVE_SHEET_ID)
      .getSheetByName(BOOKING_STATUS_SHEET_NAME)
      .getRange(rowIndex + 1, 4)
      .setValue(current);
    //TODO: send email to user
    updateEventPrefix(id, 'PRE-APPROVED');
    const subject = 'Second Approval Request';
    const contents = bookingContents(id);
    const recipient = SECOND_APPROVER_EMAIL;
    sendHTMLEmail('approval_email', contents, recipient, subject);
  }
};

export const updateEventPrefix = (id, newPrefix) => {
  const event = CalendarApp.getEventById(id);
  const prefix = /(?<=\[).+?(?=\])/g;
  event.setTitle(event.getTitle().replace(prefix, newPrefix));
};

export const reject = (id) => {
  const rowIndex = fetchRows_(BOOKING_STATUS_SHEET_NAME).findIndex(
    (row) => row[0] === id
  );
  console.log('rowIndex', rowIndex);
  if (rowIndex === -1) throw 'Invalid conversation ID: ' + id;
  SpreadsheetApp.openById(ACTIVE_SHEET_ID)
    .getSheetByName(BOOKING_STATUS_SHEET_NAME)
    .getRange(rowIndex + 1, 6)
    .setValue(current);
  //TODO: send email to user
  updateEventPrefix(id, 'REJECTED');
};

export const cancel = (id) => {
  const rowIndex = fetchRows_(BOOKING_STATUS_SHEET_NAME).findIndex(
    (row) => row[0] === id
  );
  console.log('rowIndex', rowIndex);
  if (rowIndex === -1) throw 'Invalid conversation ID: ' + id;
  SpreadsheetApp.openById(ACTIVE_SHEET_ID)
    .getSheetByName(BOOKING_STATUS_SHEET_NAME)
    .getRange(rowIndex + 1, 7)
    .setValue(current);
  updateEventPrefix(id, 'CANCELLED');
};

export const checkin = (id) => {
  const rowIndex = fetchRows_(BOOKING_STATUS_SHEET_NAME).findIndex(
    (row) => row[0] === id
  );
  console.log('rowIndex', rowIndex);
  if (rowIndex === -1) throw 'Invalid conversation ID: ' + id;
  SpreadsheetApp.openById(ACTIVE_SHEET_ID)
    .getSheetByName(BOOKING_STATUS_SHEET_NAME)
    .getRange(rowIndex + 1, 8)
    .setValue(current);
  updateEventPrefix(id, 'CHECKED IN');
};
