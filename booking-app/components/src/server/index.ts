import { getActiveBookingsFutureDates } from "./db";
import { approvalUrl, getBookingToolDeployUrl, rejectUrl } from "./ui";
import {
  approveBooking,
  approveInstantBooking,
  cancel,
  checkin,
  noShow,
  reject,
  sendBookingDetailEmail,
} from "./admin";

// Public functions must be exported as named exports
// Interface bewteen server <> client
export {
  // sheets
  getActiveBookingsFutureDates,

  // ui
  getBookingToolDeployUrl,
  approvalUrl,
  rejectUrl,

  // admin
  approveBooking,
  reject,
  cancel,
  checkin,
  noShow,
  approveInstantBooking,
  sendBookingDetailEmail,
};
