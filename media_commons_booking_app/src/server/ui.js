import { approveBooking } from './admin';

export const getGoogleCalendarApiKey = () => {
  const apiKey = PropertiesService.getScriptProperties().getProperty(
    'GOOGLE_CALENDAR_API_KEY'
  );
  return apiKey;
};

export const request = (id, email) => {
  const row = [id, email, new Date()];
  SpreadsheetApp.openById(ACTIVE_SHEET_ID)
    .getSheetByName(BOOKING_STATUS_SHEET_NAME)
    .appendRow(row);
};

export const scriptURL = () => {
  const url = ScriptApp.getService().getUrl();
  return url;
};

export const approvalUrl = (id) => {
  const url = ScriptApp.getService().getUrl();
  return `${url}?action=approve&page=admin&calendarId=${id}`;
};
export const rejectUrl = (id) => {
  const url = ScriptApp.getService().getUrl();
  return `${url}?action=reject&page=admin&calendarId=${id}`;
};

export const getActiveUserEmail = () => {
  const user = Session.getActiveUser();
  console.log('userName', user.getUsername());
  return user.getEmail();
};

// client calls by sending a HTTP GET request to the web app's URL
export const doGet = (e) => {
  var page = e.parameter['page'];
  var action = e.parameter['action'];
  var calendarId = e.parameter['calendarId'];

  if (action === 'approve') {
    approveBooking(calendarId);
    return HtmlService.createHtmlOutputFromFile('approval');
  } else if (action === 'reject') {
    reject(calendarId);
    return HtmlService.createHtmlOutputFromFile('reject');
  }
  if (page === 'admin') {
    return HtmlService.createHtmlOutputFromFile('admin-page');
  } else {
    return HtmlService.createHtmlOutputFromFile('booking');
  }
};
