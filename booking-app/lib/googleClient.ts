import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const refreshAccessTokenIfNeeded = async () => {
  console.log(
    "oauth2Client.credentials.expiry_date < Date.now()",
    oauth2Client.credentials.expiry_date < Date.now()
  );
  console.log("oauth2Client", oauth2Client);
  if (
    !oauth2Client.credentials.access_token ||
    oauth2Client.credentials.expiry_date < Date.now()
  ) {
    try {
      const { token } = await oauth2Client.getAccessToken();
      oauth2Client.setCredentials({ access_token: token });
    } catch (error) {
      console.error("Error refreshing access token:", error);
      throw error;
    }
  }
};

const getCalendarClient = async () => {
  await refreshAccessTokenIfNeeded();
  return google.calendar({ version: "v3", auth: oauth2Client });
};

const getGmailClient = async () => {
  await refreshAccessTokenIfNeeded();
  return google.gmail({ version: "v1", auth: oauth2Client });
};

export { oauth2Client, getGmailClient, getCalendarClient };
