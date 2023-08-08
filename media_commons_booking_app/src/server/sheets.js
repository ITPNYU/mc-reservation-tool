const getSheets = () => SpreadsheetApp.getActive().getSheets();

const getActiveSheetName = () => SpreadsheetApp.getActive().getSheetName();

const ACTIVE_SHEET_ID = '1VZ-DY6o0GM5DL-v9AKkpCbF0w-xm-_T-vVUSPZph06Q';

export const fetchRows_ = (sheetName) => {
  return SpreadsheetApp.openById(ACTIVE_SHEET_ID)
    .getSheetByName(sheetName)
    .getDataRange()
    .getValues();
};
export const fetchRows = (sheetName) => {
  console.log(sheetName);
  const values = SpreadsheetApp.openById(ACTIVE_SHEET_ID)
    .getSheetByName(sheetName)
    .getDataRange()
    .getValues();
  console.log('values', values);
  return (values || []).map((row) => row.map((cell) => `${cell}`));
};

function fetchById(sheetName, id) {
  const row = fetchRows_(sheetName).find((row) => row[0] === id);
  if (!row) throw 'Invalid conversation ID: ' + id;
  const messages = fetchRows_(sheetName)
    .filter((row) => row[0] === id)
    .flatMap((row) => {
      const dataObj = {};
      headValues.forEach((head, cnt) => {
        dataObj[head] = row[cnt];
      });
      return dataObj;
    });
  return messages;
}

export const getSheetRows = (sheetName) => {
  const activeSpreadSheet = SpreadsheetApp.openById(ACTIVE_SHEET_ID);
  const activeSheet = activeSpreadSheet.getSheetByName(sheetName);
  console.log(activeSheet);

  const range = activeSheet.getDataRange();
  const values = range.getValues();
  console.log('values', values);
  return values;
};

export const getEvents = async (id, startCalendarDate, endCalendarDate) => {
  const calendar = CalendarApp.getCalendarById(id);
  const startDate = new Date(startCalendarDate);
  const endDate = new Date(endCalendarDate);

  const events = await calendar.getEvents(startDate, endDate);
  const formatEvents = events.map((event) => ({
    title: event.getTitle(),
    startTime: event.getStartTime(),
    endTime: event.getEndTime(),
  }));
  console.log('formatEvents: ', formatEvents);
  return formatEvents;
};

export const addEventToCalendar = (
  id,
  title,
  description,
  startTime,
  endTime,
  guestEmail
) => {
  const calendar = CalendarApp.getCalendarById(id);
  const event = calendar.createEvent(
    title,
    new Date(startTime),
    new Date(endTime),
    {
      description: description,
      guests: guestEmail,
    }
  );
  console.log('event', event);
  event.setColor(CalendarApp.EventColor.GRAY);
  console.log('event', event);
  console.log('event.id', event.getId());
  return event.getId();
};

export const approvedByFirstPerson = () => {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rng = ss.getActiveCell();
  const flag = rng.getValue();
  console.log('rng', rng);
  if (rng.getColumn() == 1 && flag == true) {
    sendEmail(
      'rh3555@nyu.edu',
      'Second Approval',
      'Please approve the request'
    );
  }
};

export const approvedBySecondPerson = () => {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rng = ss.getActiveCell();
  const flag = rng.getValue();
  if (rng.getColumn() == 2 && flag == true) {
    console.log('rng', rng);
    sendEmail('rh3555@nyu.edu', 'Approved!', 'Please approve the request');
  }
};

export const confirmEvent = (id) => {
  const event = CalendarApp.getEventById(id);
  event.setTitle(event.getTitle().replace('[HOLD]', '[CONFIRMED]'));
  event.setColor(CalendarApp.EventColor.GREEN);
};

export const sendTextEmail = (targetEmail, title, body) => {
  GmailApp.sendEmail(targetEmail, title, body);
};

export const sendHTMLEmail = (
  templateName,
  contents,
  targetEmail,
  title,
  body
) => {
  console.log('contents', contents);
  var htmlTemplate = HtmlService.createTemplateFromFile(templateName);
  for (var key in contents) {
    htmlTemplate[key] = contents[key] || '';
  }
  var htmlBody = htmlTemplate.evaluate().getContent();
  var options = {
    htmlBody: htmlBody,
  };
  GmailApp.sendEmail(targetEmail, title, body, options);
};

export const appendRow = (sheetName, row) => {
  SpreadsheetApp.openById(ACTIVE_SHEET_ID)
    .getSheetByName(sheetName)
    .appendRow(row);
};

export const setActiveSpreadSheet = (id, sheetName) => {
  const activeSpreadSheet = SpreadsheetApp.openById(id);
  console.log(activeSpreadSheet.getSheetName());
  const activeSheet = activeSpreadSheet.getSheetByName(sheetName);
  return activeSheet;
};
