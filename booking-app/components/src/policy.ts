// @ts-ignore
import { BookingStatusLabel, DevBranch } from "./types";

/** ACTIVE master Google Sheet  */
export const ACTIVE_SHEET_ID = "1MnWbn6bvNyMiawddtYYx0tRW4NMgvugl0I8zBO3sy68";

export enum TableNames {
  ADMINS = "usersAdmin",
  BANNED = "usersBanned",
  BOOKING = "bookings",
  BOOKING_STATUS = "bookingStatuses",
  LIAISONS = "usersLiaison",
  PAS = "usersPa",
  BOOKING_TYPES = "bookingTypes",
  RESOURCES = "resources",
  SAFETY_TRAINING = "usersSafetyTraining",
}

export function getLiaisonTableName() {
  switch (process.env.BRANCH_NAME as DevBranch) {
    case "development":
      return TableNames.LIAISONS;
    case "staging":
      return TableNames.LIAISONS;
    default:
      return TableNames.LIAISONS;
  }
}
export enum ActiveSheetBookingStatusColumns {
  CALENDAR_ID = 0,
  EMAIL = 1,
  REQUESTED_DATE = 2,
  FIRST_APPROVED_DATE = 3,
  SECOND_APPROVED_DATE = 4,
  REJECTED_DATE = 5,
  CANCELLED_DATE = 6,
  CHECKED_IN_DATE = 7,
  NO_SHOWED_DATE = 8,
}

/** Old safety training Google Sheet */
export const OLD_SAFETY_TRAINING_SHEET_ID =
  "1Debe5qF-2qXJhqP0AMy5etEvwAPd3mNFiTswytsbKxQ";
/** Old safety training sheet within OLD_SAFETY_TRAINING_SHEET_ID */
export const OLD_SAFETY_TRAINING_SHEET_NAME = "Sheet1";
export const SECOND_OLD_SAFETY_TRAINING_SHEET_ID =
  "1TZYBrX5X6TXM07V3OMTOnVWF8qRmWnTzh27zacrQHh0";
export const SECOND_OLD_SAFETY_TRAINING_SHEET_GID = 293202487;

/** ******** CONTACTS *********** */

// TODO configure this via admin UI
export const getSecondApproverEmail = (branchName: string) =>
  branchName === "production" ? "jg5626@nyu.edu" : "rh3555@nyu.edu";
//    : "media-commons-devs@itp.nyu.edu"; // Jhanele

export const getApprovalCcEmail = (branchName: string) =>
  branchName === "production" ? "ss12430@nyu.edu" : "rh3555@nyu.edu";
//    : "media-commons-devs@itp.nyu.edu"; // Samantha

/** ******** ROOMS *********** */

export type Purpose = "multipleRoom" | "motionCapture";

export const SAFETY_TRAINING_REQUIRED_ROOM = [
  "103",
  "220",
  "221",
  "222",
  "223",
  "224",
  "230",
];

export const INSTANT_APPROVAL_ROOMS = [221, 222, 223, 224, 233];

export const HIDING_STATUS = [
  BookingStatusLabel.NO_SHOW,
  BookingStatusLabel.CANCELED,
  BookingStatusLabel.DECLINED,
];
