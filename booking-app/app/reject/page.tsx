"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { reject } from "@/components/src/server/admin";

const RejectPageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const paramCalendarEventId = searchParams.get("calendarEventId");
  const [loading, setLoading] = useState(false);
  const [declined, setRejected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReject = async () => {
    if (paramCalendarEventId) {
      setLoading(true);
      setError(null);
      try {
        await reject(paramCalendarEventId);
        setRejected(true);
      } catch (err) {
        setError("Failed to reject booking.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <h1>Booking Rejection</h1>
      {paramCalendarEventId ? (
        <div>
          <p>Event ID: {paramCalendarEventId}</p>
          <button
            className={
              "px-4 py-2 text-white rounded-md focus:outline-none bg-blue-600 hover:bg-blue-700"
            }
            onClick={() => handleReject()}
            disabled={loading || declined}
          >
            {loading
              ? "Rejecting..."
              : declined
                ? "Rejected"
                : "Reject Booking"}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      ) : (
        <p>No calendar event ID provided.</p>
      )}
    </div>
  );
};

const RejectPage: React.FC = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <RejectPageContent />
  </Suspense>
);

export default RejectPage;
