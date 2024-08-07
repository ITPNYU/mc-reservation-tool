import { BookingFormDetails, BookingStatusLabel } from "@/components/src/types";
import { INSTANT_APPROVAL_ROOMS, TableNames } from "@/components/src/policy";
import { NextRequest, NextResponse } from "next/server";
import {
  approvalUrl,
  getBookingToolDeployUrl,
  rejectUrl,
} from "@/components/src/server/ui";
import {
  getRoomCalendarId,
  insertEvent,
} from "@/components/src/server/calendars";

import { Timestamp } from "@firebase/firestore";
import { approveInstantBooking } from "@/components/src/server/admin";
import { firstApproverEmails } from "@/components/src/server/db";
import { saveDataToFirestore } from "@/lib/firebase/firebase";
import { sendHTMLEmail } from "@/app/lib/sendHTMLEmail";
import {
  formatDate,
  toFirebaseTimestampFromString,
} from "@/components/src/client/utils/date";

export async function POST(request: NextRequest) {
  const { email, selectedRooms, bookingCalendarInfo, data, isAutoApproval } =
    await request.json();
  console.log("data", data);
  const { department } = data;
  const [room, ...otherRooms] = selectedRooms;
  const selectedRoomIds = selectedRooms.map(
    (r: { roomId: number }) => r.roomId,
  );
  const otherRoomIds = otherRooms.map(
    (r: { calendarId: string }) => r.calendarId,
  );

  const calendarId = await getRoomCalendarId(room.roomId);
  const shouldAutoApprove = isAutoApproval === true;
  if (calendarId == null) {
    return NextResponse.json(
      { result: "error", message: "ROOM CALENDAR ID NOT FOUND" },
      { status: 500 },
    );
  }

  const event = await insertEvent({
    calendarId,
    title: `[${BookingStatusLabel.REQUESTED}] ${selectedRoomIds.join(", ")} ${department} ${data.title}`,
    description:
      "Your reservation is not yet confirmed. The coordinator will review and finalize your reservation within a few days.",
    startTime: bookingCalendarInfo.startStr,
    endTime: bookingCalendarInfo.endStr,
    roomEmails: otherRoomIds,
  });
  const calendarEventId = event.id;

  await saveDataToFirestore(TableNames.BOOKING, {
    calendarEventId,
    roomId: selectedRoomIds.join(", "),
    email,
    startDate: toFirebaseTimestampFromString(bookingCalendarInfo.startStr),
    endDate: toFirebaseTimestampFromString(bookingCalendarInfo.endStr),
    ...data,
  });
  await saveDataToFirestore(TableNames.BOOKING_STATUS, {
    calendarEventId,
    email,
    requestedAt: Timestamp.now(),
  });

  const firstApprovers = await firstApproverEmails(department);
  const sendApprovalEmail = async (
    recipients: string[],
    contents: BookingFormDetails,
  ) => {
    const emailPromises = recipients.map(recipient =>
      sendHTMLEmail({
        templateName: "approval_email",
        contents: {
          ...contents,
          roomId: contents.roomId.toString(),
          startDate: formatDate(contents.startDate),
          endDate: formatDate(contents.endDate),
        },
        targetEmail: recipient,
        status: BookingStatusLabel.REQUESTED,
        eventTitle: contents.title,
        body: "",
      }),
    );
    await Promise.all(emailPromises);
  };

  if (calendarEventId && shouldAutoApprove) {
    approveInstantBooking(calendarEventId);
  } else {
    const userEventInputs: BookingFormDetails = {
      calendarEventId,
      roomId: selectedRoomIds.join(", "),
      email,
      startDate: bookingCalendarInfo?.startStr,
      endDate: bookingCalendarInfo?.endStr,
      approvalUrl,
      rejectUrl,
      bookingToolUrl: getBookingToolDeployUrl(),
      headerMessage: "This is a request email for first approval.",
      ...data,
    };
    console.log("userEventInputs", userEventInputs);
    await sendApprovalEmail(firstApprovers, userEventInputs);
  }
  return NextResponse.json(
    { result: "success", calendarEventId: calendarId },
    { status: 200 },
  );
}
