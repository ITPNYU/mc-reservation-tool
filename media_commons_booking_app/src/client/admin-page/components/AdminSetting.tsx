import React, { useState, useEffect } from 'react';

// This is a wrapper for google.script.run that lets us use promises.
import { serverFunctions } from '../../utils/serverFunctions';
const BOOKING_SHEET_NAME = 'bookings';

type AdminSetting = {
  calendarEventId: string;
  email: string;
  requestedAt: string;
  firstApprovedAt: string;
  secondApprovedAt: string;
  rejectedAt: string;
  canceledAt: string;
  checkedInAt: string;
};
export const AdminSetting = () => {
  const [bookings, setBookings] = useState([]);
  const [mappingBookings, setMappingBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);
  useEffect(() => {
    const mappings = bookings
      .map((booking, index) => {
        if (index !== 0) {
        }
      })
      .filter((booking) => booking !== undefined);
    //TODO: filter out bookings that are not in the future
    setMappingBookings(mappings);
  }, [bookings]);

  const fetchBookings = async () => {
    serverFunctions.fetchRows(BOOKING_SHEET_NAME).then((rows) => {
      console.log('booking rows', rows);
      setBookings(rows);
    });
  };

  const mappingBookingStatusRow = (values: string[]) => {
    return {
      calendarEventId: values[0],
      email: values[1],
      requestedAt: values[2],
      firstApprovedAt: values[3],
      secondApprovedAt: values[4],
      rejectedAt: values[5],
      canceledAt: values[6],
      checkedInAt: values[7],
    };
  };
  return <div className="m-10"></div>;
};
