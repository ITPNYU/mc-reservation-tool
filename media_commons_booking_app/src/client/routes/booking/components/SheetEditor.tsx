import FormInput, { Inputs } from './FormInput';
import React, { useEffect, useState } from 'react';

import { BAN_SHEET_NAME } from '../../admin/components/Ban';
import { DateSelectArg } from '@fullcalendar/core';
import { Header } from './Header';
import { InitialModal } from './InitialModal';
import { Loading } from '../../../utils/Loading';
import { MultipleCalendars } from './MultipleCalendars';
import { RoleModal } from './RoleModal';
// This is a wrapper for google.script.run that lets us use promises.
import { serverFunctions } from '../../../utils/serverFunctions';

export type RoomSetting = {
  roomId: string;
  name: string;
  capacity: string;
  calendarId: string;
  calendarIdProd: string;
  calendarRef?: any;
};

export type LiaisonType = {
  email: string;
  department: string;
  completedAt: string;
};

export type Role = 'Student' | 'Resident/Fellow' | 'Faculty' | 'Admin/Staff';

export type Purpose = 'multipleRoom' | 'motionCapture';

export const LIAISON_SHEET_NAME = 'liaisons';

const SAFETY_TRAINING_REQUIRED_ROOM = [
  '103',
  '220',
  '221',
  '222',
  '223',
  '224',
  '230',
];
const FIRST_APPROVER = ['rh3555@nyu.edu', 'nnp278@nyu.edu'];
const ROOM_SHEET_NAME = 'rooms';
const BASE_URL =
  'https://script.google.com/a/macros/itp.nyu.edu/s/AKfycbwvWl7X9w62iz0QLWOY1F1zTT-cLv9EfzPi77Adkxxwqb_ZG4vQayi3EkT7zz9jekE8/exec';

const BOOKING_SHEET_NAME = 'bookings';
const SAFTY_TRAINING_SHEET_NAME = 'safety_training_users';
const INSTANT_APPROVAL_ROOMS = ['220', '221', '222', '223', '224', '233'];

const SheetEditor = () => {
  console.log('DEPLOY MODE ENVIRONMENT:', process.env.CALENDAR_ENV);

  const roomCalendarId = (room) => {
    const roomById = findByRoomId(mappingRoomSettings, room.roomId);
    if (roomById) {
      console.log('ENVIRONMENT:', process.env.CALENDAR_ENV);
      if (process.env.CALENDAR_ENV === 'production') {
        return roomById.calendarIdProd;
      } else {
        return roomById.calendarId;
      }
    }
  };

  const getActiveUserEmail = () => {
    serverFunctions.getActiveUserEmail().then((response) => {
      console.log('userEmail response', response);
      setUserEmail(response);
    });
  };
  const [showModal, setShowModal] = useState(true);
  const [roleModal, setRoleModal] = useState(false);
  const [userEmail, setUserEmail] = useState<string | undefined>();
  const [bookInfo, setBookInfo] = useState<DateSelectArg>();
  const [isSafetyTrained, setIsSafetyTrained] = useState(false);
  const [isBanned, setIsBanned] = useState(false);

  const [selectedRoom, setSelectedRoom] = useState([]);
  const [roomSettings, setRoomSettings] = useState([]);
  const [mappingRoomSettings, setMappingRoomSettings] = useState([]);
  const [section, setSection] = useState('selectRoom');
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [enrolledThesis, setEnrolledThesis] = useState(false);
  const canBookFullTime = enrolledThesis || role !== 'Student';

  const [mappingLiaisonUsers, setMappingLiaisonUsers] = useState([]);

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
    getActiveUserEmail();
    fetchRoomSettings();
    fetchLiaisonUsers();
  }, []);
  useEffect(() => {
    getSafetyTrainingStudents();
    getBannedStudents();
  }, [userEmail]);

  const fetchLiaisonUsers = async () => {
    serverFunctions.fetchRows(LIAISON_SHEET_NAME).then((liaisonUsers) => {
      const mappingLiaisons = liaisonUsers
        .map((liaison, index) => {
          if (index !== 0) {
            return mappingLiaisonRows(liaison);
          }
        })
        .filter((liaison) => liaison !== undefined);
      setMappingLiaisonUsers(mappingLiaisons);
    });
  };

  const mappingLiaisonRows = (values: string[]): LiaisonType => {
    return {
      email: values[0],
      department: values[1],
      completedAt: values[2],
    };
  };

  useEffect(() => {
    const mappings = roomSettings
      .map((roomSetting, index) => {
        if (index !== 0) {
          return mappingRoomSettingRows(roomSetting);
        }
      })
      .filter((roomSetting) => roomSetting !== undefined);
    setMappingRoomSettings(mappings);
  }, [roomSettings]);

  useEffect(() => {
    if (mappingRoomSettingRows.length > 0) {
      console.log('mappingRoomSettings', mappingRoomSettings);
      setLoading(false);
    }
  }, [mappingRoomSettings]);

  const findByRoomId = (array, id) => {
    return array.find((room) => room.roomId === id);
  };

  const fetchRoomSettings = async () => {
    serverFunctions.fetchRows(ROOM_SHEET_NAME).then((rows) => {
      setRoomSettings(rows);
    });
  };

  const mappingRoomSettingRows = (values: string[]): RoomSetting => {
    return {
      roomId: values[0],
      name: values[1],
      capacity: values[2],
      calendarId: values[3],
      calendarIdProd: values[4],
    };
  };

  // safety training users
  const getSafetyTrainingStudents = async () => {
    if (!isSafetyTrained) {
      const newSafetyTrainingRows = await serverFunctions.getSheetRows(
        SAFTY_TRAINING_SHEET_NAME
      );
      const newSafetyTrainedEmails = newSafetyTrainingRows.map((row) => row[0]);
      let trained = newSafetyTrainedEmails.includes(userEmail);
      if (!trained) {
        const oldSafetyTrainingRows =
          await serverFunctions.getOldSafetyTrainingEmails();
        const oldSafetyTrainedEmails = oldSafetyTrainingRows.map(
          (row) => row[0]
        );
        trained = oldSafetyTrainedEmails.includes(userEmail);
      }
      setIsSafetyTrained(trained);
    }
  };

  const getBannedStudents = () => {
    const students = serverFunctions
      .getSheetRows(BAN_SHEET_NAME)
      .then((rows) => {
        const emails = rows.reduce(
          (accumulator, value) => accumulator.concat(value),
          []
        );
        const banned = emails.includes(userEmail);
        setIsBanned(banned);
      });
  };

  const firstApproverEmailsByDepartment = (
    liaisons: LiaisonType[],
    targetDepartment: string
  ) => {
    return liaisons
      .filter((liaison) => liaison.department === targetDepartment)
      .map((liaison) => liaison.email);
  };

  const registerEvent = async (data) => {
    const email = userEmail || data.missingEmail;
    const [room, ...otherRooms] = selectedRoom;
    const selectedRoomIds = selectedRoom.map((r) => r.roomId);
    const otherRoomIds = otherRooms.map((r) => roomCalendarId(r));

    const firstApprovers = firstApproverEmailsByDepartment(
      mappingLiaisonUsers,
      department
    );

    // Add the event to the calendar.
    const calendarEventId = await serverFunctions.addEventToCalendar(
      roomCalendarId(room),
      `[REQUESTED] ${selectedRoomIds} ${department} - ${data.firstName} ${data.lastName} (${data.netId})`,
      'Your reservation is not yet confirmed. The coordinator will review and finalize your reservation within a few days.',
      bookInfo.startStr,
      bookInfo.endStr,
      otherRoomIds
    );
    // Record the event to the spread sheet.
    const contents = order.map(function (key) {
      return data[key];
    });
    serverFunctions.appendRow(BOOKING_SHEET_NAME, [
      calendarEventId,
      selectedRoomIds,
      email,
      bookInfo.startStr,
      bookInfo.endStr,
      ...contents,
    ]);
    serverFunctions.request(calendarEventId, email).then(() => {
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
    });
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
      subject
    );
  };

  const handleSetDate = (info, rooms) => {
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
            allRooms={mappingRoomSettings}
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
