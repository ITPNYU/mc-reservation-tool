import { approveBooking } from './admin';

export const getCalendarEvents = (calendarId) => {
  console.log(calendarId);
  var calendar = CalendarApp.getCalendarById(calendarId);
  var now = new Date();
  var threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(now.getMonth() + 3);
  var events = calendar.getEvents(now, threeMonthsFromNow);

  const formattedEvents = events.map((e) => {
    return {
      title: e.getTitle(),
      start: e.getStartTime().toISOString(),
      end: e.getEndTime().toISOString(),
    };
  });
  console.log('formattedEvents', formattedEvents[0]);
  return formattedEvents;
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
  } else if (page === 'pa') {
    return HtmlService.createHtmlOutputFromFile('pa-page');
  } else {
    return HtmlService.createHtmlOutputFromFile('booking');
  }
};
