import React, { useState, useEffect } from 'react';

// This is a wrapper for google.script.run that lets us use promises.
import { serverFunctions } from '../../utils/serverFunctions';
import { firstApprove } from '../../../server';

const CALENDAR_ID = 'rh3555@nyu.edu';
const FIRST_APPROVER = 'rh3555@nyu.edu';
const SECOND_APPROVER = 'rh3555@nyu.edu';

const SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1VZ-DY6o0GM5DL-v9AKkpCbF0w-xm-_T-vVUSPZph06Q/edit#gid=1210315332';

const ACTIVE_SHEET_ID = '1VZ-DY6o0GM5DL-v9AKkpCbF0w-xm-_T-vVUSPZph06Q';
const BOOKING_SHEET_NAME = 'bookings';
const BOOKING_STATES_SHEET_NAME = 'booking_states';
const SAFTY_TRAINING_SHEET_NAME = 'safety_training_users';

const Admin = () => {
  const [bookings, setBookings] = useState([]);
  const [bookingStatuses, setBookingStatuses] = useState([]);

  const fetchBookings = async () => {
    serverFunctions.fetchRows(BOOKING_SHEET_NAME).then((rows) => {
      console.log('bookings', rows);
      setBookings(rows);
    });
  };

  const mappingBookingRows = (rows) => {
    return {
      calendarEventId: rows[0],
      email: rows[1],
      startDate: rows[2],
      endDate: rows[3],
      firstName: rows[4],
      lastName: rows[5],
      nNumber: rows[6],
      netId: rows[7],
      phoneNumber: rows[8],
    };
  };
  const fetchBookingStatuses = async () => {
    serverFunctions.fetchRows(BOOKING_STATES_SHEET_NAME).then((rows) => {
      console.log('status', rows);
      setBookingStatuses(rows);
    });
  };
  useEffect(() => {
    fetchBookings();
    //fetchBookingStatuses();
  }, []);

  return (
    <div className="m-10">
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="p-4">
                <div class="flex items-center">
                  <input
                    id="checkbox-all-search"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </th>
              <th scope="col" class="px-6 py-3">
                Name
              </th>
              <th scope="col" class="px-6 py-3">
                Start date
              </th>
              <th scope="col" class="px-6 py-3">
                End date
              </th>
              <th scope="col" class="px-6 py-3">
                Status
              </th>
              <th scope="col" class="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              [
                'Riho Hagi',
                'rh3555@nyu.edu',
                '2023 07-21 11:00',
                '2023 07-21 12:00',
              ],
              [
                'Riho Hagi',
                'rh3555@nyu.edu',
                '2023 07-21 11:00',
                '2023 07-21 12:00',
              ],
              [
                'Riho Hagi',
                'rh3555@nyu.edu',
                '2023 07-21 11:00',
                '2023 07-21 12:00',
              ],
              [
                'Riho Hagi',
                'rh3555@nyu.edu',
                '2023 07-21 11:00',
                '2023 07-21 12:00',
              ],
              [
                'Riho Hagi',
                'rh3555@nyu.edu',
                '2023 07-21 11:00',
                '2023 07-21 12:00',
              ],
              [
                'Riho Hagi',
                'rh3555@nyu.edu',
                '2023 07-21 11:00',
                '2023 07-21 12:00',
              ],
              [
                'Riho Hagi',
                'rh3555@nyu.edu',
                '2023 07-21 11:00',
                '2023 07-21 12:00',
              ],
            ].map((booking) => (
              <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th
                  scope="row"
                  class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <div class="pl-3">
                    <div class="text-base font-semibold">{booking[0]}</div>
                    <div class="font-normal text-gray-500">{booking[1]}</div>
                  </div>
                </th>
                <td class="px-6 py-4">{booking[2]}</td>
                <td class="px-6 py-4">{booking[3]}</td>
                <td class="px-6 py-4">Pre-approved</td>
                <td class="px-6 py-4">
                  <button
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-2"
                    onClick={() => serverFunctions.firstApprove()}
                  >
                    Approve
                  </button>
                  <button
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-2"
                    onClick={() => serverFunctions.cancel()}
                  >
                    Cancel
                  </button>
                  <button
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-2"
                    onClick={() => serverFunctions.reject()}
                  >
                    Reject
                  </button>
                  <button
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    onClick={() => serverFunctions.checkin()}
                  >
                    Check In
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
