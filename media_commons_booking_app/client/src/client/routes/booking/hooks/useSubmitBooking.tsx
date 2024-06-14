import {
  Booking,
  BookingFormDetails,
  BookingStatusLabel,
  Inputs,
  RoomSetting,
} from '../../../../types';
import { INSTANT_APPROVAL_ROOMS, TableNames } from '../../../../policy';
import { useContext, useMemo, useState } from 'react';

import { BookingContext } from '../bookingProvider';
import { DatabaseContext } from '../../components/Provider';
import { serverFunctions } from '../../../utils/serverFunctions';
import useCheckAutoApproval from './useCheckAutoApproval';
import { useNavigate } from 'react-router';

export default function useSubmitBooking(): (x: Inputs) => Promise<void> {
  const { liaisonUsers, userEmail, reloadBookings, reloadBookingStatuses } =
    useContext(DatabaseContext);
  const {
    bookingCalendarInfo,
    department,
    role,
    selectedRooms,
    setSubmitting,
  } = useContext(BookingContext);
  const { isAutoApproval } = useCheckAutoApproval();

  const navigate = useNavigate();

  const firstApprovers = useMemo(
    () =>
      liaisonUsers
        .filter((liaison) => liaison.department === department)
        .map((liaison) => liaison.email),
    [liaisonUsers, department]
  );

  if (!department || !role) {
    console.error('Missing info for submitting booking');
    return;
    (_) =>
      new Promise((resolve, reject) =>
        reject('Missing info for submitting booking')
      );
  }

  const roomCalendarId = (room: RoomSetting) => {
    console.log('ENVIRONMENT:', process.env.CALENDAR_ENV);
    if (process.env.CALENDAR_ENV === 'production') {
      return room.calendarIdProd;
    } else {
      return room.calendarIdDev;
    }
  };

  const sendApprovalEmail = (
    recipients: string[],
    contents: BookingFormDetails
  ) => {
    recipients.forEach((recipient) =>
      serverFunctions.sendHTMLEmail(
        'approval_email',
        contents,
        recipient,
        BookingStatusLabel.REQUESTED,
        contents.title,
        ''
      )
    );
  };

  const submitBooking = async (data: Inputs) => {
    setSubmitting(true);
    // const email = userEmail || data.missingEmail;
    const email = userEmail;

    // TODO not sure why we need to do this
    const [room, ...otherRooms] = selectedRooms;
    const selectedRoomIds = selectedRooms.map((r) => r.roomId).join(', ');
    const otherRoomIds = otherRooms
      .map((r) => roomCalendarId(r))
      .filter((x) => x != null) as string[];

    let calendarId = roomCalendarId(room);
    if (calendarId == null) {
      console.error('ROOM CALENDAR ID NOT FOUND');
      return;
    }

    // Add the event to the calendar.
    const calendarEventId = await serverFunctions.addEventToCalendar(
      calendarId,
      `[${BookingStatusLabel.REQUESTED}] ${selectedRoomIds} ${department} ${data.title}`,
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
      selectedRoomIds,
      email,
      bookingCalendarInfo.startStr,
      bookingCalendarInfo.endStr,
      ...contents,
      process.env.BRANCH_NAME,
    ]);

    await serverFunctions.appendRowActive(TableNames.BOOKING_STATUS, [
      calendarEventId,
      email,
      new Date().toLocaleString(),
    ]);

    if (isAutoApproval) {
      serverFunctions.approveInstantBooking(calendarEventId);
    } else {
      const getApprovalUrl = serverFunctions.approvalUrl(calendarEventId);
      const getRejectedUrl = serverFunctions.rejectUrl(calendarEventId);
      const getBookingToolUrl = serverFunctions.getBookingToolDeployUrl();
      Promise.all([getApprovalUrl, getRejectedUrl, getBookingToolUrl]).then(
        (values) => {
          const userEventInputs: BookingFormDetails = {
            calendarEventId,
            roomId: selectedRoomIds,
            email,
            startDate: bookingCalendarInfo?.startStr,
            endDate: bookingCalendarInfo?.endStr,
            approvalUrl: values[0],
            rejectedUrl: values[1],
            bookingToolUrl: values[2],
            headerMessage: 'This is a request email for first approval.',
            devBranch: process.env.BRANCH_NAME,
            ...data,
          };
          sendApprovalEmail(firstApprovers, userEventInputs);
        }
      );
    }

    const headerMessage =
      'Your reservation is not yet confirmed. The coordinator will review and finalize your reservation within a few days.';
    serverFunctions.sendBookingDetailEmail(
      calendarEventId,
      email,
      headerMessage,
      BookingStatusLabel.REQUESTED
    );

    setSubmitting(false);
    reloadBookings();
    reloadBookingStatuses();
  };

  return submitBooking;
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
  'title',
  'description',
  'reservationType',
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
