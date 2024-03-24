export type AdminUser = {
  email: string;
  createdAt: string;
};

export type Ban = {
  email: string;
  bannedAt: string;
};

export type Booking = Inputs & {
  calendarEventId: string;
  email: string;
  startDate: string;
  endDate: string;
  roomId: string;
};

export type BookingStatus = {
  calendarEventId: string;
  email: string;
  requestedAt: string;
  firstApprovedAt: string;
  secondApprovedAt: string;
  rejectedAt: string;
  canceledAt: string;
  checkedInAt: string;
};

export enum BookingStatusLabel {
  APPROVED = 'Approved',
  CANCELED = 'Canceled',
  CHECKED_IN = 'Checked In',
  PRE_APPROVED = 'Pre-Approved',
  REJECTED = 'Rejected',
  REQUESTED = 'Requested',
  UNKNOWN = 'Unknown',
}

export type CalendarEvent = {
  title: string;
  start: string;
  end: string;
};

export type Inputs = {
  firstName: string;
  lastName: string;
  secondaryName: string;
  nNumber: string;
  netId: string;
  phoneNumber: string;
  department: string;
  role: string;
  sponsorFirstName: string;
  sponsorLastName: string;
  sponsorEmail: string;
  reservationTitle: string;
  reservationDescription: string;
  attendeeAffiliation: string;
  roomSetup: string;
  setupDetails: string;
  mediaServices: string;
  mediaServicesDetails: string;
  catering: string;
  hireSecurity: string;
  expectedAttendance: string;
  cateringService: string;
  missingEmail?: string;
  chartFieldForCatering: string;
  chartFieldForSecurity: string;
  chartFieldForRoomSetup: string;
};

export type LiaisonType = {
  email: string;
  department: string;
  createdAt: string;
};

export type PaUser = {
  email: string;
  createdAt: string;
};

export enum PagePermission {
  ADMIN,
  BOOKING,
  PA,
}

export type Role = 'Student' | 'Resident/Fellow' | 'Faculty' | 'Admin/Staff';

export type RoomSetting = {
  roomId: string;
  name: string;
  capacity: string;
  calendarId: string;
  calendarIdProd: string;
  calendarRef?: any;
};

export type SafetyTraining = {
  email: string;
  completedAt: string;
};
