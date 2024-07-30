import { useCallback, useContext, useState } from "react";
import { BookingContext } from "../bookingProvider";
import { DatabaseContext } from "../../components/Provider";
import { useRouter } from "next/navigation";
import { Inputs } from "../../../../types";

export default function useSubmitBooking() {
  const router = useRouter();
  const { liaisonUsers, userEmail, reloadBookings, reloadBookingStatuses } =
    useContext(DatabaseContext);
  const { bookingCalendarInfo, department, role, selectedRooms } =
    useContext(BookingContext);
  const [loading, setLoading] = useState(false);

  const registerEvent = useCallback(
    async (data: Inputs) => {
      if (!department || !role) {
        console.error("Missing info for submitting booking");
        return;
      }

      setLoading(true);
      const email = userEmail || data.missingEmail;
      if (
        !bookingCalendarInfo ||
        !bookingCalendarInfo.startStr ||
        !bookingCalendarInfo.endStr
      ) {
        setLoading(false);
        return;
      }

      try {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings`, {
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
        alert("Your request has been sent.");
        router.push("/");
        reloadBookings();
        reloadBookingStatuses();
      } catch (error) {
        console.error("Error submitting booking:", error);
        alert("An error occurred while submitting your booking.");
      } finally {
        setLoading(false);
      }
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
