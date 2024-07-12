import { google } from "googleapis";

const apiKey = process.env.GOOGLE_API_KEY;

const getCalendarClient = () => {
  return google.calendar({ version: "v3", auth: oauth2Client });
};

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const getGmailClient = async () => {
  const { token } = await oauth2Client.getAccessToken();
  oauth2Client.setCredentials({ access_token: token });
  return google.gmail({ version: "v1", auth: oauth2Client });
};

export { oauth2Client, getGmailClient, getCalendarClient };
