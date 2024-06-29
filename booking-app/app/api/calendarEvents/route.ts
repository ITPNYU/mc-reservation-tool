import { NextRequest, NextResponse } from "next/server";
import { getCalendarClient } from "@/lib/googleClient";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const calendarId = searchParams.get("calendarId");

  if (!calendarId) {
    return NextResponse.json({ error: "Invalid calendarId" }, { status: 400 });
  }

  try {
    const events = await getCalendarEvents(calendarId);
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar events" },
      { status: 500 }
    );
  }
}

const getCalendarEvents = async (calendarId: string) => {
  const calendar = getCalendarClient();
  const now = new Date().toISOString();
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
  const threeMonthsFromNowISOString = threeMonthsFromNow.toISOString();

  const res = await calendar.events.list({
    calendarId: calendarId,
    timeMin: now,
    timeMax: threeMonthsFromNowISOString,
    singleEvents: true,
    orderBy: "startTime",
  });

  const events = res.data.items || [];

  const formattedEvents = events.map((e) => ({
    title: e.summary,
    start: e.start?.dateTime || e.start?.date,
    end: e.end?.dateTime || e.end?.date,
  }));

  return formattedEvents;
};
