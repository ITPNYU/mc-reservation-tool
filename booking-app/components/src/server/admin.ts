import {
  ActiveSheetBookingStatusColumns,
  TableNames,
  getSecondApproverEmail,
} from "../policy";
import { BookingStatus, BookingStatusLabel } from "../types";
import { approvalUrl, getBookingToolDeployUrl, rejectUrl } from "./ui";

import { Timestamp } from "@firebase/firestore";
import { fetchSingleDoc, updateDataInFirestore } from "@/lib/firebase/firebase";

export const bookingContents = (id: string) => {
  return fetchSingleDoc(TableNames.BOOKING, id)
    .then((bookingObj) => {
      const updatedBookingObj = Object.assign({}, bookingObj, {
        headerMessage: "This is a request email for final approval.",
        approvalUrl: approvalUrl(id),
        bookingToolUrl: getBookingToolDeployUrl(),
        rejectUrl: rejectUrl(id),
      });
      return updatedBookingObj;
    })
    .catch((error) => {
      console.error("Error fetching booking contents:", error);
      throw error;
    });
};

const firstApprove = (id: string) => {
  updateDataInFirestore(TableNames.BOOKING_STATUS, id, {
    firestApprovedAt: Timestamp.now(),
  });
};

const secondApprove = (id: string) => {
  updateDataInFirestore(TableNames.BOOKING_STATUS, id, {
    secondApprovedAt: Timestamp.now(),
  });
};

export const approveInstantBooking = (id: string) => {
  firstApprove(id);
  secondApprove(id);
  approveEvent(id);
};

// both first approve and second approve flows hit here
export const approveBooking = async (id: string) => {
  const bookingStatus = await fetchSingleDoc<BookingStatus>(
    TableNames.BOOKING_STATUS,
    id
  );
  const firstApproveDateRange =
    bookingStatus && bookingStatus.firstApprovedAt
      ? bookingStatus.firstApprovedAt.toDate()
      : null;

  console.log("first approve date", firstApproveDateRange);

  // if already first approved, then this is a second approve
  if (firstApproveDateRange !== null) {
    secondApprove(id);
    approveEvent(id);
  } else {
    firstApprove(id);

    const response = await fetch("/api/fetchFutureData", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        calendarEventId: id,
        newPrefix: BookingStatusLabel.PRE_APPROVED,
      }),
    });

    const contents = bookingContents(id);
    const emailContents = {
      headerMessage: "This is a request email for final approval.",
      ...contents,
    };
    const recipient = getSecondApproverEmail(process.env.BRANCH_NAME);
    const formData = {
      templateName: "approval_email",
      contents: emailContents,
      targetEmail: recipient,
      status: BookingStatusLabel.PRE_APPROVED,
      eventTitle: contents.title,
      bodyMessage: "",
    };
    const res = await fetch("/api/sendEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    console.log(res.json());
  }
};

export const sendConfirmationEmail = (
  calendarEventId: string,
  status: BookingStatusLabel,
  headerMessage: string
) => {
  const email = getSecondApproverEmail(process.env.BRANCH_NAME);
  sendBookingDetailEmail(calendarEventId, email, headerMessage, status);
};

export const sendBookingDetailEmail = async (
  calendarEventId: string,
  email: string,
  headerMessage: string,
  status: BookingStatusLabel
) => {
  const contents = bookingContents(calendarEventId);
  contents.headerMessage = headerMessage;
  const formData = {
    templateName: "booking_detail",
    contents: contents,
    targetEmail: email,
    status: status,
    eventTitle: contents.title,
    bodyMessage: "",
  };
  const res = await fetch("/api/sendEmail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  console.log(res.json());
};

export const approveEvent = async (id: string) => {
  const doc = await fetchSingleDoc(TableNames.BOOKING_STATUS, id);
  const guestEmail = doc ? doc.email : null;

  // for user
  const headerMessage =
    "Your reservation request for Media Commons is approved.";
  console.log("sending booking detail email...");
  sendBookingDetailEmail(
    id,
    guestEmail,
    headerMessage,
    BookingStatusLabel.APPROVED
  );
  // for second approver
  sendConfirmationEmail(
    id,
    BookingStatusLabel.APPROVED,
    `This is a confirmation email.`
  );
  const contents = await bookingContents(id);
  const response = await fetch("/api/fetchFutureData", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      calendarEventId: id,
      newPrefix: BookingStatusLabel.APPROVED,
      bookingContents: contents,
    }),
  });
  const formData = {
    guestEmail: guestEmail,
    id: id,
  };
  const res = await fetch("/api/sendEmail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  console.log(res.json());
};

export const reject = async (id: string) => {
  updateDataInFirestore(TableNames.BOOKING_STATUS, id, {
    [ActiveSheetBookingStatusColumns.REJECTED_DATE]: Timestamp.now(),
  });

  const doc = await fetchSingleDoc(TableNames.BOOKING_STATUS, id);
  const guestEmail = doc ? doc.email : null;
  const headerMessage =
    "Your reservation request for Media Commons has been rejected. For detailed reasons regarding this decision, please contact us at mediacommons.reservations@nyu.edu.";
  sendBookingDetailEmail(
    id,
    guestEmail,
    headerMessage,
    BookingStatusLabel.REJECTED
  );
  const response = await fetch("/api/fetchFutureData", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      calendarEventId: id,
      newPrefix: BookingStatusLabel.REJECTED,
    }),
  });
};

export const cancel = async (id: string) => {
  updateDataInFirestore(TableNames.BOOKING_STATUS, id, {
    [ActiveSheetBookingStatusColumns.CANCELLED_DATE]: Timestamp.now(),
  });
  const doc = await fetchSingleDoc(TableNames.BOOKING_STATUS, id);
  const guestEmail = doc ? doc.email : null;
  const headerMessage =
    "Your reservation request for Media Commons has been cancelled. For detailed reasons regarding this decision, please contact us at mediacommons.reservations@nyu.edu.";
  sendBookingDetailEmail(
    id,
    guestEmail,
    headerMessage,
    BookingStatusLabel.CANCELED
  );
  sendConfirmationEmail(
    id,
    BookingStatusLabel.CANCELED,
    `This is a cancelation email.`
  );
  const response = await fetch("/api/fetchFutureData", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      calendarEventId: id,
      newPrefix: BookingStatusLabel.CANCELED,
    }),
  });
};

export const checkin = async (id: string) => {
  updateDataInFirestore(TableNames.BOOKING_STATUS, id, {
    [ActiveSheetBookingStatusColumns.CHECKED_IN_DATE]: Timestamp.now(),
  });
  const doc = await fetchSingleDoc(TableNames.BOOKING_STATUS, id);
  const guestEmail = doc ? doc.email : null;

  const headerMessage =
    "Your reservation request for Media Commons has been checked in. Thank you for choosing Media Commons.";
  sendBookingDetailEmail(
    id,
    guestEmail,
    headerMessage,
    BookingStatusLabel.CHECKED_IN
  );
  const response = await fetch("/api/fetchFutureData", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      calendarEventId: id,
      newPrefix: BookingStatusLabel.CHECKED_IN,
    }),
  });
};

export const noShow = async (id: string) => {
  updateDataInFirestore(TableNames.BOOKING_STATUS, id, {
    [ActiveSheetBookingStatusColumns.NO_SHOWED_DATE]: Timestamp.now(),
  });
  const doc = await fetchSingleDoc(TableNames.BOOKING_STATUS, id);
  const guestEmail = doc ? doc.email : null;

  const headerMessage =
    "You did not check-in for your Media Commons Reservation and have been marked as a no-show.";
  sendBookingDetailEmail(
    id,
    guestEmail,
    headerMessage,
    BookingStatusLabel.NO_SHOW
  );
  sendConfirmationEmail(
    id,
    BookingStatusLabel.NO_SHOW,
    `This is a no show email.`
  );
  const response = await fetch("/api/fetchFutureData", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      calendarEventId: id,
      newPrefix: BookingStatusLabel.NO_SHOW,
    }),
  });
};
