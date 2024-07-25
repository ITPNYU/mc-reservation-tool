import { Timestamp } from "@firebase/firestore";

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
  title: string;
  description: string;
  bookingType: string;
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
export type AdminUser = {
  email: string;
  createdAt: Timestamp;
};

export type Ban = {
  email: string;
  bannedAt: Timestamp;
};

export type Booking = Inputs & {
  id?: string;
  calendarEventId: string;
  email: string;
  startDate: any;
  endDate: any;
  resourceId: number;
};

export type BookingFormDetails = Booking & {
  approvedUrl: string;
  bookingAppUrl: string;
  declinedUrl: string;
  headerMessage?: string;
};

export type BookingStatus = {
  calendarEventId: string;
  email: string;
  requestedAt: Timestamp;
  firstApprovedAt: Timestamp;
  finalApprovedAt: Timestamp;
  declinedAt: Timestamp;
  canceledAt: Timestamp;
  checkedInAt: Timestamp;
  noShowedAt: Timestamp;
};

export enum BookingStatusLabel {
  APPROVED = "APPROVED",
  CANCELED = "CANCELED",
  CHECKED_IN = "CHECKED-IN",
  NO_SHOW = "NO-SHOW",
  PRE_APPROVED = "PRE-APPROVED",
  DECLINED = "DECLINED",
  REQUESTED = "REQUESTED",
  UNKNOWN = "UNKNOWN",
}

export type CalendarEvent = {
  title: string;
  start: string;
  end: string;
};

export enum Department {
  ALT = "ALT",
  GAMES = "Game Center",
  IDM = "IDM",
  ITP = "ITP/IMA",
  MARL = "MARL",
  MUSIC_TECH = "Music Tech",
  RECORDED_MUSIC = "Recorded Music",
}

export type DevBranch = "development" | "staging" | "production" | "";

export type LiaisonType = {
  email: string;
  department: string;
  createdAt: Timestamp;
};

export type PaUser = {
  email: string;
  createdAt: Timestamp;
};

export enum PagePermission {
  ADMIN,
  BOOKING,
  PA,
}

export type ReservationType = {
  bookingType: string;
  createdAt: Timestamp;
};

export enum Role {
  STUDENT = "Student",
  RESIDENT_FELLOW = "Resident/Fellow",
  FACULTY = "Faculty",
  ADMIN_STAFF = "Admin/Staff",
}

export type ResourceSetting = {
  resourceId: string;
  name: string;
  capacity: number;
  calendarId?: any;
  calendarRef?: any;
};

export type SafetyTraining = {
  email: string;
  createdAt: Timestamp;
};

export type Settings = {
  bookingTypes: ReservationType[];
};
