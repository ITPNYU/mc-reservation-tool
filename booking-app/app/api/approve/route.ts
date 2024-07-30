import { approveBooking } from "@/components/src/server/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { calendarId } = await request.json();
  console.log(calendarId);

  if (!calendarId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  try {
    const event = await approveBooking(calendarId);

    return NextResponse.json(
      { result: "success", calendarEventId: calendarId },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to approve" }, { status: 500 });
  }
}
