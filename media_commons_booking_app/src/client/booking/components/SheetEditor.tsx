import React, { useState, useEffect } from 'react';
import FormInput, { Inputs } from './FormInput';

// This is a wrapper for google.script.run that lets us use promises.
import { serverFunctions } from '../../utils/serverFunctions';
import { set } from 'react-hook-form';
import { DateSelectArg } from '@fullcalendar/core';
import { Calendars } from './Calendars';
type RoomSetting = {
  roomId: string;
  name: string;
  capacity: string;
  calendarId: string;
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
  const [enrolledThisis, setEnrolledThesis] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState([]);
  const [roomSettings, setRoomSettings] = useState([]);
  const [mappingRoomSettings, setMappingRoomSettings] = useState([]);
  const [section, setSection] = useState('roomUsage');
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
    if (!bookInfo) return;
    rooms.map(async (room) => {
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

  const UserSection = () => {
    if (section === 'roomUsage') {
      return (
        <div className="my-10">
          <label
            htmlFor="roomUsage"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Select Room Purpose
          </label>
          <select
            id="usage"
            onChange={(e) => setSelectedPurpose(e.target.value)}
            className="mr-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="" selected>
              Select Room Purpose
            </option>
            <option key="single" value="singleRoom">
              Booking single room
            </option>
            <option key="motion" value="motionCapture">
              Booking motion capture
            </option>
          </select>
          <button
            key="1"
            value={'roomUsageButton'}
            disabled={!selectedPurpose}
            onClick={(e) => {
              e.stopPropagation();
              if (selectedPurpose === '') return;
              if (selectedPurpose === 'singleRoom') {
                setSection('room');
              } else if (selectedPurpose === 'motionCapture') {
                setSection('motionCapture');
              }
            }}
            className={`px-4 py-2 text-white rounded-md focus:outline-none ${
              selectedPurpose
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-300 pointer-events-none'
            }`}
          >
            Next
          </button>
        </div>
      );
    } else if (section === 'room') {
      return (
        <div>
          <label
            htmlFor="room"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Select Room
          </label>
          <select
            id="room"
            onChange={(e) => {
              e.stopPropagation();
              setSelectedRoom([e.target.value]);
            }}
            className="mr-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="" selected>
              Select Room
            </option>
            {mappingRoomSettings.map((roomSetting, index) => {
              return (
                <option
                  key={roomSetting.roomId}
                  value={`${roomSetting.roomId}`}
                >{`${roomSetting.roomId} ${roomSetting.name}`}</option>
              );
            })}
          </select>
          <button
            key="2"
            value={'roomButton'}
            disabled={!selectedRoom}
            onClick={(e) => {
              e.stopPropagation();
              if (selectedRoom.length !== 0) {
                setSection('calendar');
                setRooms(selectedRoom);
              }
            }}
            className={`px-4 py-2 text-white rounded-md focus:outline-none ${
              selectedRoom
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-300 pointer-events-none'
            }`}
          >
            Choose Date
          </button>
        </div>
      );
    } else if (section === 'motionCapture') {
      return (
        <div>
          <label
            htmlFor="room"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Select Room
          </label>
          <select
            id="motionCaptureRoom"
            onChange={(e) => {
              e.stopPropagation();
              setSelectedRoom(e.target.value.split(','));
            }}
            className="mr-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="" selected>
              Select Room
            </option>
            <option value="221,222">Motion capture1(221-222)</option>
            <option value="223">Motion capture2(223)</option>
            <option value="224">Motion capture3(224)</option>
          </select>
          <button
            key="3"
            value={'roomButton'}
            disabled={!selectedRoom}
            onClick={(e) => {
              e.stopPropagation();
              if (selectedRoom.length === 0) {
                alert('Please select a room');
              }
              setRooms(selectedRoom);
              setSection('calendar');
            }}
            className={`px-4 py-2 text-white rounded-md focus:outline-none ${
              selectedRoom
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-300 pointer-events-none'
            }`}
          >
            Choose Date
          </button>
        </div>
      );
    } else if (section === 'form') {
      return (
        <div>
          <button onClick={() => setSection('calendar')}>
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
          <div className="flex items-center my-4">
            <input
              id="default-checkbox"
              type="checkbox"
              value=""
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              onChange={(e) => setEnrolledThesis(!enrolledThisis)}
            />
            <label
              htmlFor="default-checkbox"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Enrolled in thesis
            </label>
          </div>

          <div className="flex flex-col items-center ">
            <button
              key="1"
              value={'roomUsageButton'}
              disabled={!bookInfo}
              onClick={(e) => {
                e.stopPropagation();
                if (isSafetyTrained === false) {
                  alert(' You have to take safty training before booking!');
                  return;
                }
                setSection('form');
              }}
              className={`my-10 px-4 py-2 text-white rounded-md focus:outline-none ${
                bookInfo
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-300 pointer-events-none'
              }`}
            >
              Next
            </button>
            <Calendars
              enrolledThisis={enrolledThisis}
              setBookInfo={setBookInfo}
              apiKey={apiKey}
              rooms={selectedRoom.map((roomId) => {
                return findByRoomId(mappingRoomSettings, roomId);
              })}
            />
            <button
              key="1"
              value={'roomUsageButton'}
              disabled={!bookInfo}
              onClick={(e) => {
                e.stopPropagation();
                if (isSafetyTrained === false) {
                  alert(' You have to take safty training before booking!');
                  return;
                }
                setSection('form');
              }}
              className={`my-10 px-4 py-2 text-white rounded-md focus:outline-none ${
                bookInfo
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-300 pointer-events-none'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      );
    }
  };
  return (
    <div className="m-10">
      <div>
        <h2 className="text-4xl font-extrabold dark:text-white">
          370🅙 Shared Spaces Reservation Form
        </h2>
        <p className="my-4 text-lg text-gray-500">
          <a
            href="https://docs.google.com/document/d/1vAajz6XRV0EUXaMrLivP_yDq_LyY43BvxOqlH-oNacc/edit"
            target="_blank"
            className="font-medium text-blue-600 underline dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 hover:no-underline"
          >
            Please read our Policy for using the 370 Jay Street Shared Spaces
          </a>
        </p>
        <p className="my-4 text-lg text-gray-500">
          Booking requests must be made through this form. Verbal requests,
          email requests, and requests directly from students are not allowed.
          Booking requests for students must include sign-off by a sponsoring or
          supervising faculty member who accepts responsibility for their use.
          <br />
          <br />
          <b>Booking Confirmation:</b> You will receive an email response from
          the 370J Operations team and a calendar invite once your request has
          been reviewed and processed. Please allow a minimum of 3 days for your
          request to be approved. If you do not hear back about your request
          within 48 hours, you can contact Jhanele Green ({' '}
          <a
            href="mailto:jg5626@nyu.edu"
            className="font-medium text-blue-600 underline dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 hover:no-underline"
          >
            jg5626@nyu.edu
          </a>
          ) to follow up. A request does not guarantee a booking.
          <br />
          <br />
          <b>Cancellation Policy:</b> To cancel reservations please email
          Jhanele Green(
          <a
            href="mailto:jg5626@nyu.edu"
            className="font-medium text-blue-600 underline dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 hover:no-underline"
          >
            jg5626@nyu.edu
          </a>
          ) at least 24 hours before the date of the event. Failure to cancel
          may result in restricted use of event spaces.
        </p>
        <p className="mt-10">Email: {userEmail}</p>
        <p>
          Did you take safty training:
          <span>{isSafetyTrained ? 'Yes' : 'No'}</span>
          {!isSafetyTrained && (
            <span className="text-red-500 text-bold  ">
              You have to take safty training before booking!
            </span>
          )}
        </p>
      </div>
      {UserSection()}
    </div>
  );
};

export default SheetEditor;
