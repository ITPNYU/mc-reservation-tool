import { INSTANT_APPROVAL_ROOMS, TableNames } from '../../../../policy';
import { Inputs, RoomSetting } from '../../../../types';
import { useContext, useMemo, useState } from 'react';

import { BookingContext } from '../bookingProvider';
import { DatabaseContext } from '../../../components/provider';
import { formatDate } from '@fullcalendar/core';
import { serverFunctions } from '../../../utils/serverFunctions';

export default function useSubmitBooking(): [(any) => Promise<void>, boolean] {
  const { liaisonUsers, userEmail, reloadBookings, reloadBookingStatuses } =
    useContext(DatabaseContext);
  const { bookingCalendarInfo, department, role, selectedRooms } =
    useContext(BookingContext);

  const [loading, setLoading] = useState(false);

  const firstApprovers = useMemo(
    () =>
      liaisonUsers
        .filter((liaison) => liaison.department === department)
        .map((liaison) => liaison.email),
    [liaisonUsers, department]
  );

  if (!department || !role) {
    console.error('Missing info for submitting booking');
    return [
      (_) =>
        new Promise((resolve, reject) =>
          reject('Missing info for submitting booking')
        ),
      false,
    ];
  }

  const roomCalendarId = (room: RoomSetting) => {
    console.log('ENVIRONMENT:', process.env.CALENDAR_ENV);
    if (process.env.CALENDAR_ENV === 'production') {
      return room.calendarIdProd;
    } else {
      return room.calendarId;
    }
  };

  const sendApprovalEmail = (recipient, contents) => {
    var subject = 'Approval Request';

    serverFunctions.sendHTMLEmail(
      'approval_email',
      contents,
      recipient,
      subject,
      ''
    );
  };

  const registerEvent = async (data) => {
    setLoading(true);
    const email = userEmail || data.missingEmail;
    const [room, ...otherRooms] = selectedRooms;
    const selectedRoomIds = selectedRooms.map((r) => r.roomId);
    const otherRoomIds = otherRooms
      .map((r) => roomCalendarId(r))
      .filter((x) => x != null) as string[];

    if (
      bookingCalendarInfo == null ||
      bookingCalendarInfo.startStr == null ||
      bookingCalendarInfo.endStr == null
    ) {
      return;
    }

    let calendarId = roomCalendarId(room);
    if (calendarId == null) {
      console.error('ROOM CALENDAR ID NOT FOUND');
      return;
    }

    // Add the event to the calendar.
    const calendarEventId = await serverFunctions.addEventToCalendar(
      calendarId,
      `[REQUESTED] ${selectedRoomIds.join(', ')} ${department} - ${
        data.firstName
      } ${data.lastName} (${data.netId})`,
      'Your reservation is not yet confirmed. The coordinator will review and finalize your reservation within a few days.',
      bookingCalendarInfo.startStr,
      bookingCalendarInfo.endStr,
      otherRoomIds
    );

    // Record the event to the spread sheet.
    const contents = order.map(function (key) {
      return data[key];
    });

    serverFunctions.appendRowActive(TableNames.BOOKING, [
      calendarEventId,
      selectedRoomIds.join(', '),
      email,
      bookingCalendarInfo.startStr,
      bookingCalendarInfo.endStr,
      ...contents,
    ]);

    await serverFunctions.appendRowActive(TableNames.BOOKING_STATUS, [
      calendarEventId,
      email,
      formatDate(new Date()),
    ]);

    // TODO full auto approval logic
    const isAutoApproval = selectedRoomIds.every((r) =>
      INSTANT_APPROVAL_ROOMS.includes(r)
    );

    if (isAutoApproval) {
      serverFunctions.approveInstantBooking(calendarEventId);
    } else {
      const getApprovalUrl = serverFunctions.approvalUrl(calendarEventId);
      const getRejectedUrl = serverFunctions.rejectUrl(calendarEventId);
      Promise.all([getApprovalUrl, getRejectedUrl]).then((values) => {
        const userEventInputs = {
          calendarEventId: calendarEventId,
          roomId: selectedRoomIds,
          email: email,
          startDate: bookingCalendarInfo?.startStr,
          endDate: bookingCalendarInfo?.endStr,
          approvalUrl: values[0],
          rejectedUrl: values[1],
          ...data,
        };
        sendApprovalEmail(firstApprovers, userEventInputs);
      });
    }

    alert('Your request has been sent.');

    serverFunctions.sendTextEmail(
      email,
      'Your Request Sent to Media Commons',
      'Your reservation is not yet confirmed. The coordinator will review and finalize your reservation within a few days.'
    );
    setLoading(false);
    reloadBookings();
    reloadBookingStatuses();
  };

  return [registerEvent, loading];
}

const order: (keyof Inputs)[] = [
  'firstName',
  'lastName',
  'secondaryName',
  'nNumber',
  'netId',
  'phoneNumber',
  'department',
  'role',
  'sponsorFirstName',
  'sponsorLastName',
  'sponsorEmail',
  'reservationTitle',
  'reservationDescription',
  'expectedAttendance',
  'attendeeAffiliation',
  'roomSetup',
  'setupDetails',
  'mediaServices',
  'mediaServicesDetails',
  'catering',
  'cateringService',
  'hireSecurity',
  'chartFieldForCatering',
  'chartFieldForSecurity',
  'chartFieldForRoomSetup',
];
