import { NextRequest, NextResponse } from "next/server";
import {
  getRoomCalendarId,
  insertEvent,
} from "@/components/src/server/calendars";
import {
  Booking,
  BookingFormDetails,
  BookingStatusLabel,
} from "@/components/src/types";
import { saveDataToFirestore } from "@/lib/firebase/firebase";
import { INSTANT_APPROVAL_ROOMS, TableNames } from "@/components/src/policy";
import { Timestamp } from "@firebase/firestore";
import { firstApproverEmails } from "@/components/src/server/db";
import { sendHTMLEmail } from "@/app/lib/sendHTMLEmail";
import { toFirebaseTimestampFromString } from "@/components/src/client/utils/date";
import { DateSelectArg } from "fullcalendar";
import {
  approvedUrl,
  getBookingToolDeployUrl,
  declinedUrl,
} from "@/components/src/server/ui";
import { approveInstantBooking } from "@/components/src/server/admin";

export async function POST(request: NextRequest) {
  const { email, selectedRooms, bookingCalendarInfo, data } =
    await request.json();
  console.log("email", email);
  console.log("selectedRooms", selectedRooms);
  console.log("bookingCalendarInfo", bookingCalendarInfo);
  console.log("data", data);
  const { department } = data;
  const [room, ...otherRooms] = selectedRooms;
  const selectedRoomIds = selectedRooms.map(
    (r: { resourceId: number }) => r.resourceId,
  );
  const otherRoomIds = otherRooms.map(
    (r: { calendarId: string }) => r.calendarId,
  );

  const calendarId = await getRoomCalendarId(room.resourceId);
  console.log("calendarId", calendarId);
  if (calendarId == null) {
    console.error("ROOM CALENDAR ID NOT FOUND");
    return NextResponse.json(
      { result: "error", message: "ROOM CALENDAR ID NOT FOUND" },
      { status: 500 },
    );
  }

  console.log({
    calendarId,
    title: `[${BookingStatusLabel.REQUESTED}] ${selectedRoomIds.join(", ")} ${department} ${data.title}`,
    description:
      "Your reservation is not yet confirmed. The coordinator will review and finalize your reservation within a few days.",
    startTime: bookingCalendarInfo.startStr,
    endTime: bookingCalendarInfo.endStr,
    roomEmails: otherRoomIds,
  });

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

  console.log({
    calendarEventId,
    resourceId: selectedRoomIds.join(", "),
    email,
    startDate: bookingCalendarInfo.startStr,
    endDate: bookingCalendarInfo.endStr,
    ...data,
  });

  await saveDataToFirestore(TableNames.BOOKING, {
    calendarEventId,
    resourceId: selectedRoomIds.join(", "),
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
          resourceId: contents.resourceId.toString(),
        },
        targetEmail: recipient,
        status: BookingStatusLabel.REQUESTED,
        eventTitle: contents.title,
        body: "",
      }),
    );
    await Promise.all(emailPromises);
  };

  const isAutoApproval = (selectedRoomIds, data, bookingCalendarInfo) => {
    const startDate = toFirebaseTimestampFromString(
      bookingCalendarInfo?.startStr,
    );

    const endDate = toFirebaseTimestampFromString(bookingCalendarInfo?.endStr);
    const duration = endDate.toMillis() - startDate.toMillis();
    return (
      duration <= 3.6e6 * 4 && // <= 4 hours
      selectedRoomIds.every(r => INSTANT_APPROVAL_ROOMS.includes(Number(r))) &&
      data.catering === "no" &&
      data.hireSecurity === "no" &&
      data.mediaServices.length === 0 &&
      data.roomSetup === "no"
    );
  };

  if (
    calendarEventId &&
    isAutoApproval(selectedRoomIds, data, bookingCalendarInfo)
  ) {
    approveInstantBooking(calendarEventId);
  } else {
    const userEventInputs: BookingFormDetails = {
      calendarEventId,
      resourceId: selectedRoomIds.join(", "),
      email,
      startDate: bookingCalendarInfo?.startStr,
      endDate: bookingCalendarInfo?.endStr,
      approvedUrl,
      declinedUrl,
      bookingAppUrl: getBookingToolDeployUrl(),
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
