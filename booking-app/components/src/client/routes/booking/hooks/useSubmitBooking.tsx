import { useCallback, useContext } from "react";

import { BookingContext } from "../bookingProvider";
import { DatabaseContext } from "../../components/Provider";
import { Inputs } from "../../../../types";
import { useRouter } from "next/navigation";

export default function useSubmitBooking(isWalkIn: boolean) {
  const router = useRouter();
  const { liaisonUsers, userEmail, reloadBookings, reloadBookingStatuses } =
    useContext(DatabaseContext);
  const {
    bookingCalendarInfo,
    department,
    role,
    selectedRooms,
    setBookingCalendarInfo,
    setSelectedRooms,
    setFormData,
    setHasShownMocapModal,
    setSubmitting,
  } = useContext(BookingContext);

  const registerEvent = useCallback(
    async (data: Inputs) => {
      if (!department || !role) {
        console.error("Missing info for submitting booking");
        return;
      }

      let email: string;
      setSubmitting(true);
      if (isWalkIn && data.netId) {
        email = data.netId + "@nyu.edu";
      } else {
        email = userEmail || data.missingEmail;
      }

      if (
        !bookingCalendarInfo ||
        !bookingCalendarInfo.startStr ||
        !bookingCalendarInfo.endStr
      ) {
        setSubmitting(false);
        return;
      }

      try {
        const endpoint = isWalkIn ? "/api/walkIn" : "/api/bookings";
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            selectedRooms,
            bookingCalendarInfo,
            liaisonUsers,
            data,
          }),
        });

        // clear stored booking data after submit confirmation
        setBookingCalendarInfo(undefined);
        setSelectedRooms([]);
        setFormData(undefined);
        setHasShownMocapModal(false);

        reloadBookings();
        reloadBookingStatuses();
      } catch (error) {
        console.error("Error submitting booking:", error);
        alert("An error occurred while submitting your booking.");
      }

      setSubmitting(false);
    },
    [
      bookingCalendarInfo,
      selectedRooms,
      liaisonUsers,
      userEmail,
      router,
      reloadBookings,
      reloadBookingStatuses,
      department,
      role,
    ]
  );

  return registerEvent;
}
