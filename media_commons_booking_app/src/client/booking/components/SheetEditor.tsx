import React, { useState, useEffect } from 'react';
import FormInput, { Inputs } from './FormInput';

// This is a wrapper for google.script.run that lets us use promises.
import { serverFunctions } from '../../utils/serverFunctions';
import { set } from 'react-hook-form';
import { DateSelectArg } from '@fullcalendar/core';
import { Calendars } from './Calendars';
import { RoomUsage } from './RoomUsage';
import { SelectSingleRoom } from './SelectSingleROom';
import { SelectMotionCapture } from './SelectMotionCapture';
import { Header } from './Header';
import { MultipleCalendars } from './MultipleCalendars';
export type RoomSetting = {
  roomId: string;
  name: string;
  capacity: string;
  calendarId: string;
  calendarRef?: any;
};

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
  const [section, setSection] = useState('multpleRoom');
  const [selectedPurpose, setSelectedPurpose] = useState('');
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

  const handleSubmit = async (data) => {
    console.log('selectedRoom', selectedRoom);
    if (!bookInfo) return;
    selectedRoom.map(async (room) => {
      const roomCalendarId = findByRoomId(
        mappingRoomSettings,
        room
      )?.calendarId;
      const calendarEventId = await serverFunctions.addEventToCalendar(
        roomCalendarId,
        `[REQUESTED] Room request from ${userEmail}`,
        'Your reservation is not yet confirmed. The coordinator will review and finalize your reservation within a few days.',
        bookInfo.startStr,
        bookInfo.endStr,
        userEmail
      );
      const contents = order.map(function (key) {
        return data[key];
      });
      serverFunctions.appendRow(BOOKING_SHEET_NAME, [
        calendarEventId,
        room,
        userEmail,
        bookInfo.startStr,
        bookInfo.endStr,
        ...contents,
      ]);
      serverFunctions.request(calendarEventId, userEmail).then(() => {
        if (INSTANT_APPROVAL_ROOMS.includes(room)) {
          serverFunctions.approveInstantBooking(calendarEventId);
        } else {
          const getApprovalUrl = serverFunctions.approvalUrl(calendarEventId);
          const getRejectedUrl = serverFunctions.rejectUrl(calendarEventId);
          Promise.all([getApprovalUrl, getRejectedUrl]).then((values) => {
            const userEventInputs = {
              calendarEventId: calendarEventId,
              roomId: room,
              email: userEmail,
              startDate: bookInfo?.startStr,
              endDate: bookInfo?.endStr,
              approvalUrl: values[0],
              rejectedUrl: values[1],
              ...data,
            };
            sendApprovalEmail(FIRST_APPROVER, userEventInputs);
            alert('Your request has been submitted.');
            setSection('roomUsage');
          });
        }
      });
    });
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
    console.log('e', purpose);
    setSelectedPurpose(purpose);
    if (purpose === '') return;
    if (purpose === 'singleRoom') {
      setSection('room');
    } else if (purpose === 'motionCapture') {
      setSection('motionCapture');
    } else if (purpose === 'multipleRoom') {
      setSection('multipleRoom');
    }
  };
  const handleSetRoom = (room) => {
    if (room.length !== 0) {
      setSelectedRoom(room);
      setSection('calendar');
    }
  };
  const handleSetDate = (info) => {
    console.log('handleSetDate!');
    setSection('form');
    setBookInfo(info);
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
    } else if (section === 'room') {
      return (
        <div>
          <SelectSingleRoom
            mappingRoomSettings={mappingRoomSettings}
            handleSetRoom={handleSetRoom}
          />
        </div>
      );
    } else if (section === 'motionCapture') {
      return (
        <SelectMotionCapture
          selectedRoom={selectedRoom}
          handleSetRoom={handleSetRoom}
        />
      );
    } else if (section === 'form') {
      return (
        <div>
          <button onClick={() => setSection('multipleRoom')}>
            Back to Calendar
          </button>

          <FormInput
            roomNumber={selectedRoom}
            handleParentSubmit={handleSubmit}
          />
        </div>
      );
    } else if (section === 'calendar') {
      return (
        <div>
          <Calendars
            key="calendars"
            handleSetDate={handleSetDate}
            apiKey={apiKey}
            allRooms={mappingRoomSettings}
            selectedRooms={selectedRoom.map((roomId) => {
              return findByRoomId(mappingRoomSettings, roomId);
            })}
          />
        </div>
      );
    } else if (section === 'multipleRoom') {
      return (
        <div>
          <MultipleCalendars
            bookInfo={bookInfo}
            key="calendars"
            apiKey={apiKey}
            allRooms={mappingRoomSettings}
            setBookInfo={setBookInfo}
            handleSetDate={handleSetDate}
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
