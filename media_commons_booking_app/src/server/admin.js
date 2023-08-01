const ACTIVE_SHEET_ID = '1VZ-DY6o0GM5DL-v9AKkpCbF0w-xm-_T-vVUSPZph06Q';
const BOOKING_STATUS_SHEET_NAME = 'booking_status';
const SECOND_APPROVER_EMAIL = 'rh3555@nyu.edu';

const current = new Date();

export const request = (id, email) => {
  const row = [id, email, new Date()];
  SpreadsheetApp.openById(ACTIVE_SHEET_ID)
    .getSheetByName(BOOKING_STATUS_SHEET_NAME)
    .appendRow(row);
};

export const bookingContents = (id) => {
  const rowIndex = fetchRows_(BOOKING_STATUS_SHEET_NAME).findIndex(
    (row) => row[0] === id
  );
  console.log('rowIndex', rowIndex);
  const targetRowIndex = rowIndex + 1;
  if (rowIndex === -1) throw 'Invalid conversation ID: ' + id;
  const sheet = SpreadsheetApp.openById(ACTIVE_SHEET_ID).getSheetByName(
    BOOKING_STATUS_SHEET_NAME
  );

  return {
    calendarEventId: id,
    email: sheet.getRange(targetRowIndex, 2).getValue(),
    startDate: sheet.getRange(targetRowIndex, 3).getValue(),
    endDate: sheet.getRange(targetRowIndex, 4).getValue(),
    approvalUrl: approvalUrl(id),
    rejectedUrl: rejectUrl(id),
  };
};

export const firstApprove = (id) => {
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
  const rowIndex = fetchRows_(ACTIVE_SHEET_ID).findIndex(
    (row) => row[0] === id
  );
  if (rowIndex === -1) throw 'Invalid conversation ID: ' + id;
  SpreadsheetApp.openById(ACTIVE_SHEET_ID)
    .getSheetByName(BOOKING_STATUS_SHEET_NAME)
    .getRange(rowIndex + 1, 7)
    .setValue(current);
};

export const checkin = (id) => {
  const rowIndex = fetchRows_(ACTIVE_SHEET_ID).findIndex(
    (row) => row[0] === id
  );
  if (rowIndex === -1) throw 'Invalid conversation ID: ' + id;
  SpreadsheetApp.openById(ACTIVE_SHEET_ID)
    .getSheetByName(BOOKING_STATUS_SHEET_NAME)
    .getRange(rowIndex + 1, 8)
    .setValue(current);
};
