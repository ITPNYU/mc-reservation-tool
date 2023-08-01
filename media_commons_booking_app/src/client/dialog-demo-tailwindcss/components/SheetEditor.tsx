import React, { useState, useEffect } from 'react';
import FormInput, { Inputs } from './FormInput';
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timeGrid'; // a plugin!
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import dayGridPlugin from '@fullcalendar/daygrid';

// This is a wrapper for google.script.run that lets us use promises.
import { serverFunctions } from '../../utils/serverFunctions';
import { set } from 'react-hook-form';
import { DateSelectArg } from '@fullcalendar/core';

//const CALENDAR_ID =
('c_96d0951fc59bf720396cb997a62564ef6f1f9d45ec5db6cded4a4bb95bfae02b@group.calendar.google.com');
//const GOOGLE_CALENDAR_API_KEY = "AIzaSyAW6XcuDNSsJE_hkRJYHbZsWXgDc-Io-wg"
const CALENDAR_ID = 'rh3555@nyu.edu';
const GOOGLE_CALENDAR_API_KEY = 'AIzaSyDdFBW-MHSbBCHg-6TLBgJUmp1hacx7Vr8';
const FIRST_APPROVER = 'rh3555@nyu.edu';
const APPROVER_EMAILS = [
  'ss12430@nyu.edu',
  'nopivnick@nyu.edu',
  'rh3555@nyu.edu',
];

const BOOKING_SHEET_NAME = 'bookings';
const BOOKING_STATUS_SHEET_NAME = 'booking_status';
const SAFTY_TRAINING_SHEET_NAME = 'safety_training_users';

const SheetEditor = () => {
  const getActiveUserEmail = () => {
    serverFunctions
      .getActiveUserEmail()
      .then((response) => setUserEmail(response));
  };
  const [names, setNames] = useState([]);
  const [userEmail, setUserEmail] = useState();
  const [bookInfo, setBookInfo] = useState<DateSelectArg>();
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [isSafetyTrained, setIsSafetyTrained] = useState(false);
  const [calendarId, setCalendarId] = useState('');
  const [enrolledThisis, setEnrolledThesis] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [section, setSection] = useState('roomUsage');
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
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
    'hireSecurity',
  ];

  useEffect(() => {
    // call the function
    //getCalendarEvents();
    // make sure to catch any error
    getActiveUserEmail();
  }, []);
  useEffect(() => {
    getSafetyTrainingStudents();
  }, [userEmail]);

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
    const calendarEventId = await serverFunctions.addEventToCalendar(
      CALENDAR_ID,
      `[REQUESTED] Room request from ${userEmail}`,
      'Your reservation is not yet confirmed. The coordinator will review and finalize your reservation within a few days.',
      bookInfo.startStr,
      bookInfo.endStr,
      userEmail
    );
    const getApprovalUrl = serverFunctions.approvalUrl(calendarEventId);
    const getRejectedUrl = serverFunctions.rejectUrl(calendarEventId);
    Promise.all([getApprovalUrl, getRejectedUrl]).then((values) => {
      const contents = order.map(function (key) {
        return data[key];
      });
      const userEventInputs = {
        calendarEventId: calendarEventId,
        email: userEmail,
        startDate: bookInfo?.startStr,
        endDate: bookInfo?.endStr,
        approvalUrl: values[0],
        rejectedUrl: values[1],
        ...data,
      };
      serverFunctions.appendRow(BOOKING_SHEET_NAME, [
        calendarEventId,
        userEmail,
        bookInfo.startStr,
        bookInfo.endStr,
        ...contents,
      ]);
      serverFunctions.request(calendarEventId, userEmail);

      sendApprovalEmail(FIRST_APPROVER, userEventInputs);

      //alert('Your request has been submitted.');
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
  console.log('section', section);
  console.log('selectedRoom', selectedRoom);

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
            <option value="singleRoom">Booking single room</option>
            <option value="motionCapture">Booking motion capture</option>
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
              setSelectedRoom(e.target.value);
            }}
            className="mr-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="" selected>
              Select Room
            </option>
            <option value="103">103 The Garage</option>
            <option value="202">202 Lecture Hall</option>
            <option value="220">Conference Room</option>
            <option value="221">221 Ballroom</option>
            <option value="222">222 Ballroom</option>
            <option value="223">223 Ballroom</option>
            <option value="224">224 Ballroom</option>
            <option value="230">Audio Lab</option>
            <option value="233">Co-Lab</option>
            <option value="1201">Seminar Room</option>
          </select>
          <button
            key="2"
            value={'roomButton'}
            disabled={!selectedRoom}
            onClick={(e) => {
              e.stopPropagation();
              if (selectedRoom !== '') {
                setSection('calendar');
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
              setSelectedRoom(e.target.value);
            }}
            className="mr-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="" selected>
              Select Room
            </option>
            <option value="motionCapture1">Motion capture1(221-222)</option>
            <option value="motionCapture2">Motion capture2(223)</option>
            <option value="motionCapture3">Motion capture3(224)</option>
          </select>
          <button
            key="3"
            value={'roomButton'}
            disabled={!selectedRoom}
            onClick={(e) => {
              e.stopPropagation();
              if (selectedRoom !== '') {
                setSection('calendar');
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
    } else if (section === 'form') {
      return (
        <div>
          <button onClick={() => setSection('calendar')}>
            Back to Calendar
          </button>
          <FormInput handleParentSubmit={handleSubmit} />
        </div>
      );
    } else if (section === 'calendar') {
      return (
        <div>
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

          <div>
            <div className="mt-5">
              <div>
                <FullCalendar
                  selectable={true}
                  plugins={[
                    interactionPlugin,
                    timeGridPlugin,
                    googleCalendarPlugin,
                    dayGridPlugin,
                  ]}
                  headerToolbar={{
                    left: 'prev,next',
                    center: 'title',
                    right: 'dayGridYear,timeGridWeek,timeGridDay',
                  }}
                  themeSystem="bootstrap5"
                  googleCalendarApiKey={GOOGLE_CALENDAR_API_KEY}
                  events={{ googleCalendarId: CALENDAR_ID }}
                  eventDidMount={function (info) {
                    // Change the background color of the event depending on its title
                    if (info.event.title.includes('REQUESTED')) {
                      info.el.style.backgroundColor = '#d60000';
                    } else if (info.event.title.includes('PRE-APPROVED')) {
                      info.el.style.backgroundColor = '#f6c026';
                    } else if (info.event.title.includes('APPROVED')) {
                      info.el.style.backgroundColor = '#33b679';
                    } else if (info.event.title.includes('CONFIRMED')) {
                      info.el.style.backgroundColor = '#0b8043';
                    } else if (info.event.title.includes('REJECTED')) {
                      info.el.style.display = 'none';
                    } else if (info.event.title.includes('CANCELLED')) {
                      info.el.style.display = 'none';
                    }
                  }}
                  eventOverlap={false}
                  initialView="dayGridYear"
                  businessHours={{
                    startTime: '08:00', // a start time (10am in this example)
                    endTime: '20:00', // an end time (6pm in this example)
                  }}
                  navLinks={true}
                  select={function (info) {
                    //TODO: Check buisiness hour
                    if (!isSafetyTrained) {
                      alert("You haven't taken safety training yet!");
                    } else {
                      setSection('form');

                      setBookInfo(info);
                    }
                  }}
                  selectAllow={function (e) {
                    if (enrolledThisis) {
                      return true;
                    } else {
                      if (
                        e.end.getTime() / 1000 - e.start.getTime() / 1000 <=
                        60 * 60 * 4
                      ) {
                        return true;
                      }
                    }
                  }}
                />
              </div>
            </div>
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
      </div>
      {UserSection()}
    </div>
  );
};

export default SheetEditor;
