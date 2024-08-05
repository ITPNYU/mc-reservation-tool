"use client";

import React, { Suspense, useState } from "react";

import { Button } from "@mui/material";
import { reject } from "@/components/src/server/admin";
import { useSearchParams } from "next/navigation";

const RejectPageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const paramCalendarEventId = searchParams.get("calendarEventId");
  const [loading, setLoading] = useState(false);
  const [rejected, setRejected] = useState(false);
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
    <div style={{ padding: 24 }}>
      <h1>Booking Rejection</h1>
      {paramCalendarEventId ? (
        <div>
          <p>Event ID: {paramCalendarEventId}</p>
          <Button
            onClick={() => handleReject()}
            disabled={loading || rejected}
            variant="contained"
          >
            {loading
              ? "Rejecting..."
              : rejected
                ? "Rejected"
                : "Reject Booking"}
          </Button>
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
