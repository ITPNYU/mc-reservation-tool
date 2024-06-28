// pages/api/mockFunctions.ts
import { NextApiRequest, NextApiResponse } from "next";

type ServerFunctions = {
  addEventToCalendar: (params: any) => { result: string };
  confirmEvent: (params: any) => { result: string };
  getCalendarEvents: (params: any) => { result: string };
  appendRowActive: (params: any) => { result: string };
  fetchById: (params: any) => { result: string };
  getAllActiveSheetRows: (params: any) => { result: string };
  getActiveBookingsFutureDates: (params: any) => { result: string };
  getOldSafetyTrainingEmails: (params: any) => { result: string };
  getBookingToolDeployUrl: (params: any) => { result: string };
  scriptUrl: (params: any) => { result: string };
  approvalUrl: (params: any) => { result: string };
  rejectUrl: (params: any) => { result: string };
  doGet: (params: any) => { result: string };
  getActiveUserEmail: (params: any) => { result: string };
  sendHTMLEmail: (params: any) => { result: string };
  sendTextEmail: (params: any) => { result: string };
  approveBooking: (calendarEventId: string) => { result: string };
  reject: (calendarEventId: string) => { result: string };
  cancel: (params: any) => { result: string };
  checkin: (params: any) => { result: string };
  noShow: (params: any) => { result: string };
  approveInstantBooking: (params: any) => { result: string };
  removeFromListByValue: (params: any) => { result: string };
  sendBookingDetailEmail: (params: any) => { result: string };
};

const functions: ServerFunctions = {
  addEventToCalendar: (params: any) => {
    return { result: "Event added to calendar" };
  },
  confirmEvent: (params: any) => {
    return { result: "Event confirmed" };
  },
  getCalendarEvents: (params: any) => {
    return { result: "Fetched calendar events" };
  },
  appendRowActive: (params: any) => {
    return { result: "Row appended" };
  },
  fetchById: (params: any) => {
    return { result: "Fetched by ID" };
  },
  getAllActiveSheetRows: (params: any) => {
    return { result: "Fetched all active sheet rows" };
  },
  getActiveBookingsFutureDates: (params: any) => {
    return { result: "Fetched active bookings future dates" };
  },
  getOldSafetyTrainingEmails: (params: any) => {
    return { result: "Fetched old safety training emails" };
  },
  getBookingToolDeployUrl: (params: any) => {
    return { result: "Fetched booking tool deploy URL" };
  },
  scriptUrl: (params: any) => {
    return { result: "Fetched script URL" };
  },
  approvalUrl: (params: any) => {
    return { result: "Fetched approval URL" };
  },
  rejectUrl: (params: any) => {
    return { result: "Fetched reject URL" };
  },
  doGet: (params: any) => {
    return { result: "Fetched data using doGet" };
  },
  getActiveUserEmail: (params: any) => {
    return { result: "Fetched active user email" };
  },
  sendHTMLEmail: (params: any) => {
    return { result: "HTML email sent" };
  },
  sendTextEmail: (params: any) => {
    return { result: "Text email sent" };
  },
  approveBooking: (calendarEventId: string) => {
    return { result: `Booking with ID ${calendarEventId} approved` };
  },
  reject: (calendarEventId: string) => {
    return { result: `Booking with ID ${calendarEventId} rejected` };
  },
  cancel: (params: any) => {
    return { result: "Booking cancelled" };
  },
  checkin: (params: any) => {
    return { result: "Checked in" };
  },
  noShow: (params: any) => {
    return { result: "No show" };
  },
  approveInstantBooking: (params: any) => {
    return { result: "Instant booking approved" };
  },
  removeFromListByValue: (params: any) => {
    return { result: "Removed from list by value" };
  },
  sendBookingDetailEmail: (params: any) => {
    return { result: "Booking detail email sent" };
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { functionName, parameters } = req.body;

    if (functionName in functions) {
      const result = (functions as any)[functionName](...parameters);
      res.status(200).json(result);
    } else {
      res.status(400).json({ message: "Function not found" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
