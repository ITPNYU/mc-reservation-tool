"use client";
import { useEffect } from "react";
import { approveBooking } from "@/components/src/server";
import { useSearchParams } from "next/navigation";

const ApprovePage: React.FC = () => {
  const searchParams = useSearchParams();
  const paramCalendarEventId = searchParams.get("calendarEventId");
  useEffect(() => {
    if (paramCalendarEventId) {
      approveBooking(paramCalendarEventId);
    }
  }, [paramCalendarEventId]);

  return (
    <div>
      <h1>Booking Approval</h1>
      {paramCalendarEventId ? (
        <p>Approving booking for event ID: {paramCalendarEventId}</p>
      ) : (
        <p>No calendar event ID provided.</p>
      )}
    </div>
  );
};

export default ApprovePage;
