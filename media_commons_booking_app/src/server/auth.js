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
