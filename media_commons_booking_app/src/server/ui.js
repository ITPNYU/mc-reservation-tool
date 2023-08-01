export const onOpen = () => {
  const menu = SpreadsheetApp.getUi()
    .createMenu('My Sample React Project') // edit me!
    .addItem('Sheet Editor', 'openDialog')
    .addItem('Sheet Editor (Bootstrap)', 'openDialogBootstrap')
    .addItem('Sheet Editor (MUI)', 'openDialogMUI')
    .addItem('Sheet Editor (Tailwind CSS)', 'openDialogTailwindCSS')
    .addItem('About me', 'openAboutSidebar');

  menu.addToUi();
};

export const scriptURL = () => {
  const url = ScriptApp.getService().getUrl();
  console.log(url);
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
  console.log('action', action);

  if (action === 'approve') {
    firstApprove(calendarId);
    return HtmlService.createHtmlOutputFromFile('approval');
  } else if (action === 'reject') {
    reject(calendarId);
    return HtmlService.createHtmlOutputFromFile('reject');
  }

  if (page === 'admin') {
    return HtmlService.createHtmlOutputFromFile('admin-page');
  } else {
    return HtmlService.createHtmlOutputFromFile('dialog-demo-tailwindcss');
  }
};

export const openDialog = () => {
  const html = HtmlService.createHtmlOutputFromFile('dialog-demo')
    .setWidth(600)
    .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, 'Sheet Editor');
};

export const openDialogBootstrap = () => {
  const html = HtmlService.createHtmlOutputFromFile('dialog-demo-bootstrap')
    .setWidth(600)
    .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, 'Sheet Editor (Bootstrap)');
};

export const openDialogMUI = () => {
  const html = HtmlService.createHtmlOutputFromFile('dialog-demo-mui')
    .setWidth(600)
    .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, 'Sheet Editor (MUI)');
};

export const openDialogTailwindCSS = () => {
  const html = HtmlService.createHtmlOutputFromFile('dialog-demo-tailwindcss')
    .setWidth(600)
    .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, 'Sheet Editor (Tailwind CSS)');
};

export const openAboutSidebar = () => {
  const html = HtmlService.createHtmlOutputFromFile('sidebar-about-page');
  SpreadsheetApp.getUi().showSidebar(html);
};
