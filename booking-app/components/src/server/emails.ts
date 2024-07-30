import {
  Booking,
  BookingFormDetails,
  BookingStatusLabel,
  DevBranch,
} from "../types";

import { getApprovalCcEmail } from "../policy";

const getCcEmail = (status: BookingStatusLabel): string => {
  if (status !== BookingStatusLabel.APPROVED) {
    return "";
  }
  return getApprovalCcEmail(process.env.BRANCH_NAME);
};

const getEmailBranchTag = () => {
  switch (process.env.BRANCH_NAME as DevBranch) {
    case "development":
      return "[DEV] ";
    case "staging":
      return "[STAGING] ";
    default:
      return "";
  }
};
