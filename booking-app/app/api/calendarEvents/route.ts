import { NextRequest, NextResponse } from "next/server";
import { getCalendarClient } from "@/lib/googleClient";
import { updateEventPrefix } from "@/components/src/server/calendars";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const calendarId = searchParams.get("calendarId");

  if (!calendarId) {
    return NextResponse.json({ error: "Invalid calendarId" }, { status: 400 });
  }

  try {
    const events = await getCalendarEvents(calendarId);
    console.log("aaaaa events", events);
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

export async function POST(request: NextRequest) {
  const calendar = getCalendarClient();
  const { calendarId, title, description, startTime, endTime, roomEmails } =
    await request.json();
  console.log(calendarId, title, description, startTime, endTime, roomEmails);
  debugger;

  if (
    !calendarId ||
    !title ||
    !description ||
    !startTime ||
    !endTime ||
    !roomEmails
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const event = await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: title,
        description,
        start: {
          dateTime: new Date(startTime).toISOString(),
        },
        end: {
          dateTime: new Date(endTime).toISOString(),
        },
        attendees: roomEmails.map((email: string) => ({ email })),
        colorId: "8", // Gray
      },
    });

    return NextResponse.json(
      { calendarEventId: event.data.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding event to calendar:", error);
    return NextResponse.json(
      { error: "Failed to add event to calendar" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const { calendarEventId, newPrefix, bookingContents } = await req.json();

  if (!calendarEventId || !newPrefix) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    await updateEventPrefix(calendarEventId, newPrefix, bookingContents);
    return NextResponse.json(
      { message: "Event updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}
