import { Booking, BookingStatus } from '../types';

import { formatDate } from '../client/utils/date';

function genFakeBookingRow(
  calendarEventId: string,
  email: string,
  fakeData?: any
): Booking {
  const today = new Date();
  return {
    calendarEventId,
    roomId: '224',
    email,
    startDate: formatDate(today),
    endDate: formatDate(new Date().setDate(today.getDate() + 1)),
    firstName: 'Grace',
    lastName: 'Hopper',
    secondaryName: '',
    nNumber: 'N12345678',
    netId: 'gh123',
    phoneNumber: '555-123-4567',
    department: 'IDM',
    role: 'Student',
    sponsorFirstName: 'Noah',
    sponsorLastName: 'Pivnick',
    sponsorEmail: 'nnp278@nyu.edu',
    title: '[Test] My Event',
    description: 'This is a fake booking for testing',
    reservationType: 'Workshop',
    expectedAttendance: '1',
    attendeeAffiliation: 'NYU Members',
    roomSetup: 'no',
    setupDetails: '',
    mediaServices: '',
    mediaServicesDetails: '',
    catering: 'no',
    cateringService: '',
    hireSecurity: 'no',
    chartFieldForCatering: '',
    chartFieldForSecurity: '',
    chartFieldForRoomSetup: '',
    devBranch: 'development',
    ...fakeData,
  };
}

function genFakeBookingStatusRow(
  calendarEventId: string,
  email: string,
  fakeData?: any
): BookingStatus {
  return {
    calendarEventId,
    email,
    requestedAt: formatDate(new Date()),
    firstApprovedAt: '',
    secondApprovedAt: '',
    rejectedAt: '',
    canceledAt: '',
    checkedInAt: '',
    noShowedAt: '',
    ...fakeData,
  };
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function addFakeBookingData(
  n: number,
  fakeData: any,
  fakeBookingStatusData: any
) {
  let calendarEventId;
  const email = 'media-commons-devs@itp.nyu.edu';
  const bookingRows = [];
  const bookingStatusRows = [];

  for (let i = 0; i < n; i++) {
    calendarEventId = generateUUID();
    bookingRows.push(genFakeBookingRow(calendarEventId, email, fakeData));
    bookingStatusRows.push(
      genFakeBookingStatusRow(calendarEventId, email, fakeBookingStatusData)
    );
  }

  return { bookingRows, bookingStatusRows };
}
