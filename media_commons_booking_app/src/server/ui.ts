import { approveBooking, reject } from './admin';

export const scriptURL = () => {
  const url = ScriptApp.getService().getUrl();
  return url;
};

export const approvalUrl = (calendarEventId: string) => {
  const url = ScriptApp.getService().getUrl();
  return `${url}?action=approve&page=admin&calendarEventId=${calendarEventId}`;
};

export const rejectUrl = (calendarEventId: string) => {
  const url = ScriptApp.getService().getUrl();
  return `${url}?action=reject&page=admin&calendarEventId=${calendarEventId}`;
};

export const getActiveUserName = (email: string) => {
  var accountId = email.split('@')[0];
  console.log('accountId', accountId);
  // const api = 'https://www.googleapis.com/oauth2/v2/userinfo';
  // var api =
  //   'https://people.googleapis.com/v1/people:get?personFields=names&resourceName=people/' +
  //   encodeURIComponent('email:' + email);
  // var options = {
  //   method: 'GET',
  //   headers: {
  //     Authorization: 'Bearer ' + ScriptApp.getOAuthToken(),
  //   },
  // };
  // var response = UrlFetchApp.fetch(api, options);
  const people = People.People.get('people/' + accountId, {
    personFields: 'names,emailAddresses,nicknames,photos',
  });

  // var userInfo = JSON.parse(response.getContentText());
  return people;
};

export const getActiveUserEmail = () => {
  const user = Session.getActiveUser();
  // user.getUsername() isn't a function
  // console.log('userName', user.getUsername());
  return user.getEmail();
};

// client calls by sending a HTTP GET request to the web app's URL
export const doGet = (e) => {
  console.log('DO GET', JSON.stringify(e));
  var action = e.parameter['action'];
  var calendarEventId = e.parameter['calendarEventId'];

  if (action === 'approve') {
    approveBooking(calendarEventId);
    return HtmlService.createHtmlOutputFromFile('approval');
  } else if (action === 'reject') {
    reject(calendarEventId);
    return HtmlService.createHtmlOutputFromFile('reject');
  }

  return HtmlService.createHtmlOutputFromFile('index');
};
