import { Bookings } from '../admin/components/Bookings';
import React from 'react';

export default function MyBookingsPage() {
  return (
    <div className="m-10">
      <Bookings isUserView={true} />
    </div>
  );
}
