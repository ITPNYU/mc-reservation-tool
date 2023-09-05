import React, { useState, useEffect } from 'react';
import FormInput, { Inputs } from './FormInput';

// This is a wrapper for google.script.run that lets us use promises.
import { serverFunctions } from '../../utils/serverFunctions';
import { DateSelectArg } from '@fullcalendar/core';
import { RoomUsage } from './RoomUsage';
import { Header } from './Header';
import { MultipleCalendars } from './MultipleCalendars';
export type RoomSetting = {
  roomId: string;
  name: string;
  capacity: string;
  calendarId: string;
  calendarRef?: any;
};

export type Purpose = 'multipleRoom' | 'motionCapture';

const FIRST_APPROVER = 'rh3555@nyu.edu';
const ROOM_SHEET_NAME = 'rooms';

const BOOKING_SHEET_NAME = 'bookings';
const SAFTY_TRAINING_SHEET_NAME = 'safety_training_users';
const INSTANT_APPROVAL_ROOMS = ['221', '222', '223', '224'];

const SheetEditor = () => {
  const getActiveUserEmail = () => {
    serverFunctions.getActiveUserEmail().then((response) => {
      console.log('userEmail response', response);
      setUserEmail(response);
    });
  };
  const [apiKey, setApiKey] = useState();
  const [userEmail, setUserEmail] = useState();
  const [bookInfo, setBookInfo] = useState<DateSelectArg>();
  const [isSafetyTrained, setIsSafetyTrained] = useState(false);

  const [selectedRoom, setSelectedRoom] = useState([]);
  const [roomSettings, setRoomSettings] = useState([]);
  const [mappingRoomSettings, setMappingRoomSettings] = useState([]);
  const [section, setSection] = useState('roomUsage');
  const [selectedPurpose, setSelectedPurpose] =
    useState<Purpose>('multipleRoom');
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
    'chartfieldInformation',
    'hireSecurity',
  ];

  useEffect(() => {
    getActiveUserEmail();
  }, []);
  useEffect(() => {
    getSafetyTrainingStudents();
  }, [userEmail]);

  // google api key for calendar

  useEffect(() => {
    fetchApiKey();
  }, []);

  const fetchApiKey = async () => {
    const googleApiKey = await serverFunctions.getGoogleCalendarApiKey();
    setApiKey(googleApiKey);
  };

  // rooms

  useEffect(() => {
    fetchRoomSettings();
  }, []);

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

  function findByRoomId(array, id) {
    return array.find((room) => room.roomId === id);
  }

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
    };
  };

  // safety training users
  const getSafetyTrainingStudents = () => {
    const students = serverFunctions
      .getSheetRows(SAFTY_TRAINING_SHEET_NAME)
      .then((rows) => {
        const emails = rows.reduce(
          (accumulator, value) => accumulator.concat(value),
          []
        );
        const trained = emails.includes(userEmail);
        setIsSafetyTrained(trained);
      });
  };

  const registerEvent = (data) => {
    const email = userEmail || data.missingEmail;
    selectedRoom.map(async (room) => {
      // Add the event to the calendar.
      const roomCalendarId = findByRoomId(
        mappingRoomSettings,
        room.roomId
      )?.calendarId;
      const calendarEventId = await serverFunctions.addEventToCalendar(
        roomCalendarId,
        `[REQUESTED] Room request from ${userEmail}`,
        'Your reservation is not yet confirmed. The coordinator will review and finalize your reservation within a few days.',
        bookInfo.startStr,
        bookInfo.endStr,
        email
      );
      // Record the event to the spread sheet.
      const contents = order.map(function (key) {
        return data[key];
      });
      serverFunctions.appendRow(BOOKING_SHEET_NAME, [
        calendarEventId,
        room.roomId,
        email,
        bookInfo.startStr,
        bookInfo.endStr,
        ...contents,
      ]);
      serverFunctions.request(calendarEventId, email).then(() => {
        // Rooms 221 to 224 don't need approval
        if (INSTANT_APPROVAL_ROOMS.includes(room.roomId)) {
          serverFunctions.approveInstantBooking(calendarEventId);
        } else {
          const getApprovalUrl = serverFunctions.approvalUrl(calendarEventId);
          const getRejectedUrl = serverFunctions.rejectUrl(calendarEventId);
          Promise.all([getApprovalUrl, getRejectedUrl]).then((values) => {
            const userEventInputs = {
              calendarEventId: calendarEventId,
              roomId: room.roomId,
              email: email,
              startDate: bookInfo?.startStr,
              endDate: bookInfo?.endStr,
              approvalUrl: values[0],
              rejectedUrl: values[1],
              ...data,
            };
            sendApprovalEmail(FIRST_APPROVER, userEventInputs);
          });
        }
      });
      alert(
        "Your request has been sent.\n Please check the calendar to verify that your submitted event has been registered.\n If you don't see the event, please contact us."
      );
      setSection('roomUsage');
    });
  };
  const handleSubmit = async (data) => {
    if (!bookInfo) return;
    if (!userEmail && data.missingEmail) {
      setUserEmail(data.missingEmail);
    }
    registerEvent(data);
  };

  const sendApprovalEmail = (recipient, contents) => {
    var subject = 'Approval Request';

    //serverFunctions.sendTextEmail(recipient, subject, body);
    serverFunctions.sendHTMLEmail(
      'approval_email',
      contents,
      recipient,
      subject
    );
  };

  const handleSetSelectedPurpose = (purpose) => {
    setSelectedPurpose(purpose);
    setSection('selectRoom');
  };

  const handleSetDate = (info, rooms) => {
    setBookInfo(info);
    setSelectedRoom(rooms);
    if (userEmail && !isSafetyTrained) {
      alert('You have to take safty training before booking!');
      return;
    }
    setSection('form');
  };

  const UserSection = () => {
    if (section === 'roomUsage') {
      return (
        <div className="my-10">
          <RoomUsage
            handleSetSelectedPurpose={handleSetSelectedPurpose}
            selectedPurpose={selectedPurpose}
          />
        </div>
      );
    } else if (section === 'form') {
      return (
        <div>
          <FormInput
            hasEmail={userEmail ? true : false}
            roomNumber={selectedRoom.map((room) => room.roomId)}
            handleParentSubmit={handleSubmit}
          />
        </div>
      );
    } else if (section === 'selectRoom') {
      return (
        <div>
          <MultipleCalendars
            key="calendars"
            apiKey={apiKey}
            allRooms={mappingRoomSettings}
            handleSetDate={handleSetDate}
            selectedPurpose={selectedPurpose}
          />
        </div>
      );
    }
  };
  return (
    <div className="m-10">
      <Header isSafetyTrained={isSafetyTrained} userEmail={userEmail} />
      {UserSection()}
    </div>
  );
};
export default SheetEditor;
