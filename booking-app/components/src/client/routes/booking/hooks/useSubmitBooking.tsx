"use client";
import {
  Booking,
  BookingFormDetails,
  BookingStatusLabel,
  Inputs,
  RoomSetting,
} from "../../../../types";
import { INSTANT_APPROVAL_ROOMS, TableNames } from "../../../../policy";
import { useContext, useMemo, useState } from "react";

import { BookingContext } from "../bookingProvider";
import { DatabaseContext } from "../../components/Provider";
import { saveDataToFirestore } from "@/lib/firebase/firebase";
import { useRouter } from "next/navigation";
import { Timestamp } from "@firebase/firestore";
import {
  approveInstantBooking,
  sendBookingDetailEmail,
} from "@/components/src/server";

export default function useSubmitBooking(): [
  (x: Inputs) => Promise<void>,
  boolean,
] {
  const router = useRouter();
  const { liaisonUsers, userEmail, reloadBookings, reloadBookingStatuses } =
    useContext(DatabaseContext);
  const { bookingCalendarInfo, department, role, selectedRooms } =
    useContext(BookingContext);
  console.log("bookingCalendarInfo", bookingCalendarInfo);

  const [loading, setLoading] = useState(false);

  const firstApprovers = useMemo(
    () =>
      liaisonUsers
        .filter((liaison) => liaison.department === department)
        .map((liaison) => liaison.email),
    [liaisonUsers, department]
  );
  console.log("firstApprovers", firstApprovers);

  if (!department || !role) {
    console.error("Missing info for submitting booking");
    return [
      (_) =>
        new Promise((resolve, reject) =>
          reject("Missing info for submitting booking")
        ),
      false,
    ];
  }

  const roomCalendarId = (room: RoomSetting) => {
    console.log("ENVIRONMENT:", process.env.CALENDAR_ENV);
    return room.calendarId;
  };

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

  const registerEvent = async (data) => {
    setLoading(true);
    const email = userEmail || data.missingEmail;
    const [room, ...otherRooms] = selectedRooms;
    const selectedRoomIds = selectedRooms.map((r) => r.roomId);
    const otherRoomIds = otherRooms
      .map((r) => roomCalendarId(r))
      .filter((x) => x != null) as string[];

    if (
      bookingCalendarInfo == null ||
      bookingCalendarInfo.startStr == null ||
      bookingCalendarInfo.endStr == null
    ) {
      return;
    }

    let calendarId = roomCalendarId(room);
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

    // Record the event to the spread sheet.
    const contents = order.map(function (key) {
      return { [key]: data[key] };
    });

    console.log("contents", contents);
    saveDataToFirestore(TableNames.BOOKING, {
      calendarEventId: calendarEventId,
      roomId: selectedRoomIds.join(", "),
      email: email,
      startDate: bookingCalendarInfo.startStr,
      endDate: bookingCalendarInfo.endStr,
      ...contents,
    });
    saveDataToFirestore(TableNames.BOOKING_STATUS, {
      calendarEventId: calendarEventId,
      email: email,
      requestedAt: Timestamp.now(),
    });

    const isAutoApproval = (
      selectedRoomIds: string[],
      data: Booking,
      bookingCalendarInfo
    ) => {
      const startDate = new Date(bookingCalendarInfo?.startStr);
      const endDate = new Date(bookingCalendarInfo?.endStr);
      const duration = endDate.getTime() - startDate.getTime();
      // If the selected rooms are all instant approval rooms and the user does not need catering, and hire security, and room setup, then it is auto-approval.
      return (
        duration <= 3.6e6 * 4 && // <= 4 hours
        selectedRoomIds.every((r) => INSTANT_APPROVAL_ROOMS.includes(r)) &&
        data["catering"] === "no" &&
        data["hireSecurity"] === "no" &&
        data["mediaServices"].length === 0 &&
        data["roomSetup"] === "no"
      );
    };

    if (isAutoApproval(selectedRoomIds, data, bookingCalendarInfo)) {
      approveInstantBooking(calendarEventId);
    } else {
      //TODO Fix this
      const getApprovalUrl = "http://localhost:3000/approval";
      const getRejectedUrl = "http://localhost:3000/reject";
      const getBookingToolUrl = "http://localhost:3000";
      Promise.all([getApprovalUrl, getRejectedUrl, getBookingToolUrl]).then(
        (values) => {
          const userEventInputs: BookingFormDetails = {
            calendarEventId,
            roomId: selectedRoomIds,
            email,
            startDate: bookingCalendarInfo?.startStr,
            endDate: bookingCalendarInfo?.endStr,
            approvalUrl: values[0],
            rejectedUrl: values[1],
            bookingToolUrl: values[2],
            headerMessage: "This is a request email for first approval.",
            ...data,
          };
          sendApprovalEmail(firstApprovers, userEventInputs);
        }
      );
    }

    alert("Your request has been sent.");
    router.push("/");

    const headerMessage =
      "Your reservation is not yet confirmed. The coordinator will review and finalize your reservation within a few days.";
    sendBookingDetailEmail(
      calendarEventId,
      email,
      headerMessage,
      BookingStatusLabel.REQUESTED
    );

    setLoading(false);
    reloadBookings();
    reloadBookingStatuses();
  };

  return [registerEvent, loading];
}

const order: (keyof Inputs)[] = [
  "firstName",
  "lastName",
  "secondaryName",
  "nNumber",
  "netId",
  "phoneNumber",
  "department",
  "role",
  "sponsorFirstName",
  "sponsorLastName",
  "sponsorEmail",
  "title",
  "description",
  "reservationType",
  "expectedAttendance",
  "attendeeAffiliation",
  "roomSetup",
  "setupDetails",
  "mediaServices",
  "mediaServicesDetails",
  "catering",
  "cateringService",
  "hireSecurity",
  "chartFieldForCatering",
  "chartFieldForSecurity",
  "chartFieldForRoomSetup",
];
