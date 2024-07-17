import { NextRequest, NextResponse } from "next/server";
import { getRoomCalendarId } from "@/components/src/server/calendars";
import {
  Booking,
  BookingFormDetails,
  BookingStatusLabel,
} from "@/components/src/types";
import { saveDataToFirestore } from "@/lib/firebase/firebase";
import { INSTANT_APPROVAL_ROOMS, TableNames } from "@/components/src/policy";
import { Timestamp } from "@firebase/firestore";
import {
  approvalUrl,
  approveInstantBooking,
  getBookingToolDeployUrl,
  rejectUrl,
} from "@/components/src/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  const { email, selectedRooms, bookingCalendarInfo, data } =
    await request.json();
  const department = data.department;
  const [room, ...otherRooms] = selectedRooms;
  const selectedRoomIds = selectedRooms.map((r) => r.roomId);
  const otherRoomIds = otherRooms
    .map(async (r) => await getRoomCalendarId(r))
    .filter((x) => x != null) as string[];

  let calendarId = await getRoomCalendarId(room);
  if (calendarId == null) {
    console.error("ROOM CALENDAR ID NOT FOUND");
    return;
  }

  const res = await fetch("/api/calendarEvents", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      calendarId: calendarId,
      title: `[${BookingStatusLabel.REQUESTED}] ${selectedRoomIds.join(
        ", "
      )} ${department} ${data.title}`,
      description:
        "Your reservation is not yet confirmed. The coordinator will review and finalize your reservation within a few days.",
      startTime: bookingCalendarInfo.startStr,
      endTime: bookingCalendarInfo.endStr,
      roomEmails: otherRoomIds,
    }),
  });
  const calendarEventId = (await res.json()).calendarEventId;

  saveDataToFirestore(TableNames.BOOKING, {
    calendarEventId: calendarEventId,
    roomId: selectedRoomIds.join(", "),
    email: email,
    startDate: bookingCalendarInfo.startStr,
    endDate: bookingCalendarInfo.endStr,
    ...data,
  });
  saveDataToFirestore(TableNames.BOOKING_STATUS, {
    calendarEventId: calendarEventId,
    email: email,
    requestedAt: Timestamp.now(),
  });

  const response = await axios.get("/api/liaisons", {});
  const liaisonUsers = response.data;
  const firstApprovers = liaisonUsers
    .filter((liaison) => liaison.department === department)
    .map((liaison) => liaison.email);

  const sendApprovalEmail = (
    recipients: string[],
    contents: BookingFormDetails
  ) => {
    recipients.forEach(async (recipient) => {
      const formData = {
        templateName: "approval_email",
        contents: contents,
        targetEmail: "rh3555@nyu.edu",
        status: BookingStatusLabel.REQUESTED,
        eventTitle: contents.title,
        bodyMessage: "",
      };
      const res = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    });
  };

  const isAutoApproval = (
    selectedRoomIds: string[],
    data: Booking,
    bookingCalendarInfo
  ) => {
    const startDate = Timestamp.fromDate(
      new Date(bookingCalendarInfo?.startStr)
    );

    const endDate = Timestamp.fromDate(new Date(bookingCalendarInfo?.endStr));
    const duration = endDate.toMillis() - startDate.toMillis();
    // If the selected rooms are all instant approval rooms and the user does not need catering, and hire security, and room setup, then it is auto-approval.
    console.log("duration", duration);
    console.log("selectedRoomIds", selectedRoomIds);
    console.log("data", data);
    return (
      duration <= 3.6e6 * 4 && // <= 4 hours
      selectedRoomIds.every((r) => INSTANT_APPROVAL_ROOMS.includes(r)) &&
      data["catering"] === "no" &&
      data["hireSecurity"] === "no" &&
      data["mediaServices"].length === 0 &&
      data["roomSetup"] === "no"
    );
  };
  console.log(
    "isAutoApproval",
    isAutoApproval(selectedRoomIds, data, bookingCalendarInfo)
  );

  if (isAutoApproval(selectedRoomIds, data, bookingCalendarInfo)) {
    approveInstantBooking(calendarEventId);
  } else {
    const userEventInputs: BookingFormDetails = {
      calendarEventId,
      roomId: selectedRoomIds,
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
    sendApprovalEmail(firstApprovers, userEventInputs);
  }
}
