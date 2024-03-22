import React, { useEffect, useState } from 'react';

import { Booking } from '../../../../types';
import { TableNames } from '../../../../policy';
// This is a wrapper for google.script.run that lets us use promises.
import { serverFunctions } from '../../../utils/serverFunctions';

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
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const bookingRows = await serverFunctions
      .getAllActiveSheetRows(TableNames.BOOKING)
      .then((rows) => rows.map((row) => mappingBookingRows(row)));
    setBookings(bookingRows);
  };

  const mappingBookingRows = (values: string[]): Booking => {
    return {
      calendarEventId: values[0],
      roomId: values[1],
      email: values[2],
      startDate: values[3],
      endDate: values[4],
      firstName: values[5],
      lastName: values[6],
      secondaryName: values[7],
      nNumber: values[8],
      netId: values[9],
      phoneNumber: values[10],
      department: values[11],
      role: values[12],
      sponsorFirstName: values[13],
      sponsorLastName: values[14],
      sponsorEmail: values[15],
      reservationTitle: values[16],
      reservationDescription: values[17],
      expectedAttendance: values[18],
      attendeeAffiliation: values[19],
      roomSetup: values[20],
      setupDetails: values[21],
      mediaServices: values[22],
      mediaServicesDetails: values[23],
      catering: values[24],
      cateringService: values[25],
      hireSecurity: values[26],
      chartFieldForCatering: values[27],
      chartFieldForSecurity: values[28],
      chartFieldForRoomSetup: values[29],
    };
  };

  return <div className="m-10"></div>;
};
