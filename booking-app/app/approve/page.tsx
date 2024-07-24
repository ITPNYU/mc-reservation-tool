"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { approveBooking } from "@/components/src/server/admin";

const ApprovePageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const paramCalendarEventId = searchParams.get("calendarEventId");
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async () => {
    if (paramCalendarEventId) {
      setLoading(true);
      setError(null);
      try {
        await approveBooking(paramCalendarEventId);
        setApproved(true);
      } catch (err) {
        setError("Failed to approve booking.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <h1>Booking Approval</h1>
      {paramCalendarEventId ? (
        <div>
          <p>Event ID: {paramCalendarEventId}</p>
          <button
            onClick={() => handleApprove()}
            className={
              "px-4 py-2 text-white rounded-md focus:outline-none bg-blue-600 hover:bg-blue-700"
            }
            disabled={loading || approved}
          >
            {loading
              ? "Approving..."
              : approved
                ? "Approved"
                : "Approve Booking"}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      ) : (
        <p>No calendar event ID provided.</p>
      )}
    </div>
  );
};

const ApprovePage: React.FC = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ApprovePageContent />
  </Suspense>
);

export default ApprovePage;
