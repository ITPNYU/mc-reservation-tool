import { approveBooking, reject } from "./admin";

import { DevBranch } from "../types";

export const getBookingToolDeployUrl = () => {
  switch (process.env.BRANCH_NAME as DevBranch) {
    case "development":
      return "https://sites.google.com/nyu.edu/media-commons-dev/";
    case "staging":
      return "https://sites.google.com/nyu.edu/media-commons-staging/";
    default:
      return "https://sites.google.com/nyu.edu/media-commons-prod/";
  }
};

export const approvalUrl = (calendarEventId: string) => {
  return `${process.env.NEXT_PUBLIC_BASE_URL}/approve?calendarEventId=${calendarEventId}`;
};

export const rejectUrl = (calendarEventId: string) => {
  return `${process.env.NEXT_PUBLIC_BASE_URL}/reject?calendarEventId=${calendarEventId}`;
};
