import { approveBooking, reject } from "./admin";

import { DevBranch } from "../types";

export const scriptUrl = () => {
  const url = "";
  return url;
};

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
  const url = "";
  return `${url}?action=approve&page=admin&calendarEventId=${calendarEventId}`;
};

export const rejectUrl = (calendarEventId: string) => {
  const url = "";
  return `${url}?action=reject&page=admin&calendarEventId=${calendarEventId}`;
};

export const getActiveUserEmail = () => {
  const user = Session.getActiveUser();
  // user.getUsername() isn't a function
  // console.log('userName', user.getUsername());
  return user.getEmail();
};
