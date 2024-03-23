import React, { useContext, useEffect, useState } from 'react';

import { DatabaseContext } from '../../../components/provider';
import { formatDate } from '../../../utils/date';
// This is a wrapper for google.script.run that lets us use promises.
import { serverFunctions } from '../../../utils/serverFunctions';

interface BookingsProps {
  showNnumber: boolean;
}

export const Bookings: React.FC<BookingsProps> = ({ showNnumber = false }) => {
  const { bookings, bookingStatuses, reloadBookings, reloadBookingStatuses } =
    useContext(DatabaseContext);
  const [showModal, setShowModal] = useState(false);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    reloadBookings();
    reloadBookingStatuses();
  }, [reload]);

  const BookingStatusName = (id) => {
    const target = bookingStatuses.filter(
      (item) => item.calendarEventId === id
    )[0];
    if (target === undefined) return 'Unknown';
    if (target.checkedInAt !== '') {
      return 'Checked In';
    } else if (target.canceledAt !== '') {
      return 'Canceled';
    } else if (target.rejectedAt !== '') {
      return 'Rejected';
    } else if (target.secondApprovedAt !== '') {
      return 'Approved';
    } else if (target.firstApprovedAt !== '') {
      return 'Pre Approved';
    } else if (target.requestedAt !== '') {
      return 'Requested';
    } else {
      return 'Unknown';
    }
  };

  return (
    <div className="m-10">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-[2500px] text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-2 py-3">
                Action
              </th>
              <th scope="col" className="px-2 py-3">
                Status
              </th>
              <th scope="col" className="px-2 py-3">
                Room ID
              </th>
              <th scope="col" className="px-2 py-3">
                Name
              </th>
              <th scope="col" className="px-2 py-3">
                Booking Date
              </th>
              <th scope="col" className="px-2 py-3">
                Secondary name
              </th>
              {showNnumber && (
                <th scope="col" className="px-2 py-3">
                  N number
                </th>
              )}
              <th scope="col" className="px-2 py-3">
                Net Id
              </th>
              <th scope="col" className="px-2 py-3">
                Phone number
              </th>
              <th scope="col" className="px-2 py-3">
                Department
              </th>
              <th scope="col" className="px-2 py-3">
                Role
              </th>
              <th scope="col" className="px-2 py-3">
                Sponsor name
              </th>
              <th scope="col" className="px-2 py-3">
                Sponsor email
              </th>
              <th scope="col" className="px-2 py-3">
                Title
              </th>
              <th scope="col" className="px-2 py-3">
                Description
              </th>
              <th scope="col" className="px-2 py-3">
                Expected Attendee
              </th>
              <th scope="col" className="px-2 py-3">
                Attendee Affiliation
              </th>
              <th scope="col" className="px-2 py-3">
                Set up
              </th>
              <th scope="col" className="px-2 py-3">
                Chartfield Information for Room Setup
              </th>
              <th scope="col" className="px-2 py-3">
                Media Service
              </th>
              <th scope="col" className="px-2 py-3">
                Catering
              </th>
              <th scope="col" className="px-2 py-3">
                Catering Service
              </th>
              <th scope="col" className="px-2 py-3">
                Chartfield Information for catering
              </th>
              <th scope="col" className="px-2 py-3">
                Hire security
              </th>
              <th scope="col" className="px-2 py-3">
                Chartfield Information for security
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => {
              const status = BookingStatusName(booking.calendarEventId);
              return (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-2 py-4 w-20">
                    {status === 'Pre Approved' && (
                      <button
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-2"
                        onClick={async () => {
                          await serverFunctions.approveBooking(
                            booking.calendarEventId
                          );
                          setReload(true);
                        }}
                      >
                        Second Approve
                      </button>
                    )}
                    {status === 'Requested' && (
                      <button
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-2"
                        onClick={async () => {
                          await serverFunctions.approveBooking(
                            booking.calendarEventId
                          );
                          setReload(true);
                        }}
                      >
                        First Approve
                      </button>
                    )}
                    <button
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-2"
                      onClick={async () => {
                        await serverFunctions.reject(booking.calendarEventId);
                        setReload(true);
                      }}
                    >
                      Reject
                    </button>
                    <button
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-2"
                      onClick={async () => {
                        await serverFunctions.cancel(booking.calendarEventId);
                        setReload(true);
                      }}
                    >
                      Cancel
                    </button>
                    {status !== 'Checked In' && (
                      <button
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        onClick={async () => {
                          await serverFunctions.checkin(
                            booking.calendarEventId
                          );
                          setReload(true);
                        }}
                      >
                        Check In
                      </button>
                    )}
                  </td>
                  <td className="px-2 py-4 w-24">{status}</td>
                  <td className="px-2 py-4 w-24">{booking.roomId}</td>
                  <td
                    scope="row"
                    className="flex items-center px-2 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <div className="pl-3 w-full">
                      <div className="text-base font-semibold">
                        <button onClick={() => setShowModal(true)}>
                          {booking.firstName} {booking.lastName}
                        </button>
                      </div>
                      <div className="font-normal text-gray-500">
                        {booking.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-4 w-36">
                    <div className=" flex items-center flex-col">
                      <div>{formatDate(booking.startDate)}</div> <div>~</div>
                      <div>{formatDate(booking.endDate)}</div>
                    </div>
                  </td>

                  <td className="px-2 py-4 w-36">{booking.secondaryName}</td>
                  {showNnumber && (
                    <td className="px-2 py-4 w-20">{booking.nNumber}</td>
                  )}
                  <td className="px-2 py-4 w-20">{booking.netId}</td>
                  <td className="px-2 py-4 w-20">{booking.phoneNumber}</td>
                  <td className="px-2 py-4 w-36">{booking.department}</td>
                  <td className="px-2 py-4 w-20">{booking.role}</td>
                  <td className="px-2 py-4 w-24">
                    {booking.sponsorFirstName} {booking.sponsorLastName}
                  </td>
                  <td className="px-2 py-4 w-20">{booking.sponsorEmail}</td>
                  <td className="px-2 py-4 w-52 break-all">
                    {booking.reservationTitle}
                  </td>
                  <td className="px-2 py-4 w-60 break-all">
                    {booking.reservationDescription}
                  </td>
                  <td className="px-2 py-4 w-20">
                    {booking.expectedAttendance}
                  </td>
                  <td className="px-2 py-4 w-20">
                    {booking.attendeeAffiliation}
                  </td>
                  <td className="px-2 py-4 w-24">
                    {booking.roomSetup}
                    {booking.setupDetails && (
                      <>
                        <br />
                        <b>Details</b>
                        <br />
                        {booking.setupDetails}
                      </>
                    )}
                  </td>
                  <td className="px-2 py-4 w-24">
                    {booking.chartFieldForRoomSetup}
                  </td>
                  <td className="px-2 py-4 w-24">
                    {booking.mediaServices}
                    {booking.mediaServicesDetails && (
                      <>
                        <br />
                        <b>Details</b>
                        <br />
                        {booking.mediaServicesDetails}
                      </>
                    )}
                  </td>
                  <td className="px-2 py-4 w-18">{booking.catering}</td>
                  <td className="px-2 py-4 w-18">{booking.cateringService}</td>
                  <td className="px-2 py-4 w-24">
                    {booking.chartFieldForCatering}
                  </td>
                  <td className="px-2 py-4 w-18">{booking.hireSecurity}</td>
                  <td className="px-2 py-4 w-24">
                    {booking.chartFieldForSecurity}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
