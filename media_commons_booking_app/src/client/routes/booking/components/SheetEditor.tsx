import {
  INSTANT_APPROVAL_ROOMS,
  SAFETY_TRAINING_REQUIRED_ROOM,
  TableNames,
} from '../../../../policy';
import { Inputs, RoomSetting } from '../../../../types';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { DatabaseContext } from '../../../components/provider';
import { DateSelectArg } from '@fullcalendar/core';
import FormInput from './FormInput';
import { Header } from './Header';
import { InitialModal } from './InitialModal';
import { MultipleCalendars } from './MultipleCalendars';
import { RoleModal } from './RoleModal';
// This is a wrapper for google.script.run that lets us use promises.
import { serverFunctions } from '../../../utils/serverFunctions';

// const BASE_URL =
//   'https://script.google.com/a/macros/itp.nyu.edu/s/AKfycbwvWl7X9w62iz0QLWOY1F1zTT-cLv9EfzPi77Adkxxwqb_ZG4vQayi3EkT7zz9jekE8/exec';

const SheetEditor = () => {
  const {
    bannedUsers,
    liaisonUsers,
    safetyTrainedUsers,
    setUserEmail,
    userEmail,
  } = useContext(DatabaseContext);
  const [roomSettings, setRoomSettings] = useState<RoomSetting[]>([]);

  const isBanned = useMemo<boolean>(() => {
    if (!userEmail) return false;
    return bannedUsers
      .map((bannedUser) => bannedUser.email)
      .includes(userEmail);
  }, [userEmail, bannedUsers]);
  const [isSafetyTrained, setIsSafetyTrained] = useState<boolean>(false);

  const [showModal, setShowModal] = useState(true);
  const [roleModal, setRoleModal] = useState(false);
  const [bookInfo, setBookInfo] = useState<DateSelectArg>();

  const [selectedRoom, setSelectedRoom] = useState<RoomSetting[]>([]);
  const [section, setSection] = useState('selectRoom');
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [enrolledThesis, setEnrolledThesis] = useState(false);
  const canBookFullTime = enrolledThesis || role !== 'Student';

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

  useEffect(() => {
    console.log('DEPLOY MODE ENVIRONMENT:', process.env.CALENDAR_ENV);
    fetchRoomSettings();
  }, []);

  useEffect(() => {
    getSafetyTrainingStudents();
  }, [userEmail, safetyTrainedUsers]);

  const fetchRoomSettings = async () => {
    const mappedRooms = await serverFunctions
      .getAllActiveSheetRows(TableNames.ROOMS)
      .then((rooms) =>
        rooms.map((roomRow) => ({
          roomId: roomRow[0],
          name: roomRow[1],
          capacity: roomRow[2],
          calendarId: roomRow[3],
          calendarIdProd: roomRow[4],
        }))
      );
    setRoomSettings(mappedRooms);
    setLoading(mappedRooms.length === 0);
  };

  // safety training users
  const getSafetyTrainingStudents = useCallback(async () => {
    if (!isSafetyTrained) {
      if (!userEmail) return;
      let isTrained = safetyTrainedUsers
        .map((user) => user.email)
        .includes(userEmail);
      // if not on active list, check old list
      if (!isTrained) {
        isTrained = await serverFunctions
          .getOldSafetyTrainingEmails()
          .then((rows) => rows.map((row) => row[0]).includes(userEmail));
      }
      setIsSafetyTrained(isTrained);
    }
  }, [userEmail, safetyTrainedUsers]);

  const firstApproverEmailsByDepartment = (targetDepartment: string) => {
    return liaisonUsers
      .filter((liaison) => liaison.department === targetDepartment)
      .map((liaison) => liaison.email);
  };

  const roomCalendarId = (room: RoomSetting) => {
    console.log('ENVIRONMENT:', process.env.CALENDAR_ENV);
    if (process.env.CALENDAR_ENV === 'production') {
      return room.calendarIdProd;
    } else {
      return room.calendarId;
    }
  };

  const registerEvent = async (data) => {
    const email = userEmail || data.missingEmail;
    const [room, ...otherRooms] = selectedRoom;
    const selectedRoomIds = selectedRoom.map((r) => r.roomId);
    const otherRoomIds = otherRooms
      .map((r) => roomCalendarId(r))
      .filter((x) => x != null) as string[];

    console.log(selectedRoom, room, otherRooms);

    const firstApprovers = firstApproverEmailsByDepartment(department);

    if (
      bookInfo == null ||
      bookInfo.startStr == null ||
      bookInfo.endStr == null
    ) {
      return;
    }

    console.log('adding to calendar');

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
      bookInfo.startStr,
      bookInfo.endStr,
      otherRoomIds
    );

    console.log('added to calendar');

    // Record the event to the spread sheet.
    const contents = order.map(function (key) {
      return data[key];
    });

    console.log('adding to booking table');
    serverFunctions.appendRowActive(TableNames.BOOKING, [
      calendarEventId,
      selectedRoomIds.join(', '),
      email,
      bookInfo.startStr,
      bookInfo.endStr,
      ...contents,
    ]);

    console.log('added to booking table');
    console.log('adding to booking status table');

    await serverFunctions.appendRowActive(TableNames.BOOKING_STATUS, [
      calendarEventId,
      email,
      new Date().toString(),
    ]);

    console.log('added to booking status table');

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
          startDate: bookInfo?.startStr,
          endDate: bookInfo?.endStr,
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
    setSection('selectRoom');
  };

  const handleSubmit = async (data) => {
    setLoading(true);
    if (!bookInfo) return;
    if (!userEmail && data.missingEmail) {
      setUserEmail(data.missingEmail);
    }
    registerEvent(data);
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

  const handleSetDate = (info, rooms) => {
    console.log('handle set date', info, rooms, selectedRoom);
    setBookInfo(info);
    setSelectedRoom(rooms);
    const requiresSafetyTraining = rooms.some((room) =>
      SAFETY_TRAINING_REQUIRED_ROOM.includes(room.roomId)
    );
    if (userEmail && !isSafetyTrained && requiresSafetyTraining) {
      alert('You have to take safety training before booking!');
      return;
    }
    if (userEmail && isBanned) {
      alert('You are banned');
      return;
    }
    setSection('form');
  };

  const UserSection = () => {
    if (section === 'form') {
      return (
        <div className="px-60">
          <button
            key="backToCalendar"
            disabled={!bookInfo}
            onClick={() => {
              setSection('selectRoom');
            }}
            className={`px-4 py-2 text-white rounded-md focus:outline-none ${
              bookInfo
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-300 pointer-events-none'
            }`}
          >
            Back to Calendar
          </button>
          <FormInput
            userEmail={userEmail}
            handleParentSubmit={handleSubmit}
            selectedRoom={selectedRoom}
            role={role}
            department={department}
          />
        </div>
      );
    } else if (section === 'selectRoom') {
      return (
        <div>
          Select room and view calendar
          <MultipleCalendars
            key="calendars"
            allRooms={roomSettings}
            handleSetDate={handleSetDate}
            canBookFullTime={canBookFullTime}
          />
        </div>
      );
    }
  };

  const handleModalClick = () => {
    setShowModal(false);
    setRoleModal(true);
  };
  const handleRoleModalClick = (role, department, enrolledThesis) => {
    setRole(role);
    setDepartment(department);
    setEnrolledThesis(enrolledThesis);
    setRoleModal(false);
  };
  return (
    <div className="dark:bg-gray-800">
      {showModal && <InitialModal handleClick={handleModalClick} />}
      {roleModal && <RoleModal handleClick={handleRoleModalClick} />}
      {!showModal && (
        <>
          <div className="flex flex-col justify-items-end items-end">
            <Header
              isBanned={isBanned}
              isSafetyTrained={isSafetyTrained}
              userEmail={userEmail}
            />
          </div>
          {UserSection()}
        </>
      )}
    </div>
  );
};
export default SheetEditor;
