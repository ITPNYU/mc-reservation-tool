import { google } from "googleapis";

const apiKey = process.env.GOOGLE_API_KEY;

export const getCalendarClient = () => {
  return google.calendar({ version: "v3", auth: apiKey });
};
