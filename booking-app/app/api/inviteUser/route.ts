import { NextRequest, NextResponse } from "next/server";
import { getCalendarClient } from "@/lib/googleClient";
import { inviteUserToCalendarEvent } from "@/components/src/server/calendars";

export async function POST(request: NextRequest) {
  const { id, guestEmail } = await request.json();
  try {
    inviteUserToCalendarEvent(id, guestEmail);
    return NextResponse.json({ calendarEventId: id }, { status: 200 });
  } catch (error) {
    console.error("Error adding event to calendar:", error);
    return NextResponse.json(
      { error: "Failed to add event to calendar" },
      { status: 500 }
    );
  }
}
