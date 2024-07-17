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
import { useRouter } from "next/navigation";

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

  const registerEvent = async (data) => {
    setLoading(true);
    const email = userEmail || data.missingEmail;
    if (
      bookingCalendarInfo == null ||
      bookingCalendarInfo.startStr == null ||
      bookingCalendarInfo.endStr == null
    ) {
      return;
    }

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        selectedRooms: selectedRooms,
        bookingCalendarInfo: bookingCalendarInfo,
        liaisonUsers:
        data: data,
      }),
    }).then((res) => {
      alert("Your request has been sent.");
      router.push("/")
      setLoading(false);
      reloadBookings();
      reloadBookingStatuses();
    });
  };

  return [registerEvent, loading];
}
