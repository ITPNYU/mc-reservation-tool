function getOAuthService() {
  return OAuth2.createService('myServiceName')
    .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
    .setTokenUrl('https://accounts.google.com/o/oauth2/token')
    .setClientId('YOUR_CLIENT_ID')
    .setClientSecret('YOUR_CLIENT_SECRET')
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getUserProperties())
    .setScope('https://www.googleapis.com/auth/gmail.readonly'); // 例としてGmailの読み取りのスコープを使用
}

function authCallback(request) {
  const OAuthService = getOAuthService();
  const isAuthorized = OAuthService.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('認証に成功しました！');
  } else {
    return HtmlService.createHtmlOutput('認証に失敗しました。');
  }
}

function redirectToAuth() {
  const OAuthService = getOAuthService();
  if (!OAuthService.hasAccess()) {
    const authorizationUrl = OAuthService.getAuthorizationUrl();
    const template = HtmlService.createTemplate(
      '<a href="<?= authorizationUrl ?>" target="_blank">認証してください</a>'
    );
    template.authorizationUrl = authorizationUrl;
    const page = template.evaluate();
    SpreadsheetApp.getUi().showModalDialog(page, '認証');
  }
}
