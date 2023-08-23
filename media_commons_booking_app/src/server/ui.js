import { approveBooking } from './admin';

const REDIRECT_URI =
  'https://script.google.com/macros/d/1ITR1lqORogMlvmr_QZtjOrfX_qQadgdGqhEl7ickqaNFXHGd_ZS8R3vf/usercallback';

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

export function getOAuthService() {
  return OAuth2.createService('UserService')
    .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
    .setTokenUrl('https://accounts.google.com/o/oauth2/token')
    .setClientId(CLIENT_ID)
    .setClientSecret(CLIENT_SECRET)
    .setCallbackFunction('authCallback')
    .setCache(CacheService.getUserCache())
    .setScope('https://www.googleapis.com/auth/userinfo.email');
}

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
    // データを取得
    //var value = '; ' + document.cookie;
    //var parts = value.split('; ' + name + '=');
    //const cookieUserEmail =
    //  parts.length == 2 ? parts.pop().split(';').shift() : null;
    //console.log('cookieUserEmail', cookieUserEmail);
    //const service = getOAuthService();
    //if (!cookieUserEmail) {
    //  var authorizationUrl = service.getAuthorizationUrl();
    //  var template = HtmlService.createTemplate(
    //    '<a href="<?= authorizationUrl ?>" target="_blank">Authorize</a>'
    //  );
    //  template.authorizationUrl = authorizationUrl;
    //  return template.evaluate();
    //} else {
    //  return HtmlService.createHtmlOutputFromFile('booking');
    //}
  }
};

export const CLIENT_ID =
  '508094483021-2fqm83mftdqmfcjvp90idk2scdpas5hl.apps.googleusercontent.com';
export const CLIENT_SECRET = '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';

export function authCallback(request) {
  var service = getOAuthService();
  var authorized = service.handleCallback(request);
  if (authorized) {
    var url = 'https://www.googleapis.com/oauth2/v2/userinfo';
    var response = UrlFetchApp.fetch(url, {
      headers: {
        Authorization: 'Bearer ' + service.getAccessToken(),
      },
    });
    var result = JSON.parse(response.getContentText());
    const userEmail = result.email;
    // クッキーの設定
    var expireDate = new Date();
    expireDate.setHours(expireDate.getHours() + 1000); // 1時間後に有効期限が切れる
    var output = HtmlService.createHtmlOutput('<p>Cookie has been set!</p>');

    output.appendCookie('userEmail', userEmail, expireDate);
    //var date = new Date();
    //date.setDate(date.getDate() + 1); // 1日後に有効期限を設定
    //output.append(
    //  '<script>document.cookie = "userId=12345; expires=' +
    //    date.toUTCString() +
    //    '; path=/";</script>'
    //);

    return HtmlService.createHtmlOutputFromFile('booking');
  } else {
    return HtmlService.createHtmlOutput('failue');
  }
}
