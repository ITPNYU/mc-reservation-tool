// lib/serverFunctions.ts
type ServerFunctionNames =
  | "addEventToCalendar"
  | "confirmEvent"
  | "getCalendarEvents"
  | "appendRowActive"
  | "fetchById"
  | "getAllActiveSheetRows"
  | "getActiveBookingsFutureDates"
  | "getOldSafetyTrainingEmails"
  | "getBookingToolDeployUrl"
  | "scriptUrl"
  | "approvalUrl"
  | "rejectUrl"
  | "doGet"
  | "getActiveUserEmail"
  | "sendHTMLEmail"
  | "sendTextEmail"
  | "approveBooking"
  | "reject"
  | "cancel"
  | "checkin"
  | "noShow"
  | "approveInstantBooking"
  | "removeFromListByValue"
  | "sendBookingDetailEmail";

type ServerFunctions = {
  [key in ServerFunctionNames]: (...args: any[]) => Promise<{ result: string }>;
};

const callServerFunction = async (
  functionName: ServerFunctionNames,
  parameters: any[]
) => {
  const response = await fetch("/api/mockFunctions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ functionName, parameters }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data;
};

export const serverFunctions: ServerFunctions = {} as ServerFunctions;

[
  "addEventToCalendar",
  "confirmEvent",
  "getCalendarEvents",
  "appendRowActive",
  "fetchById",
  "getAllActiveSheetRows",
  "getActiveBookingsFutureDates",
  "getOldSafetyTrainingEmails",
  "getBookingToolDeployUrl",
  "scriptUrl",
  "approvalUrl",
  "rejectUrl",
  "doGet",
  "getActiveUserEmail",
  "sendHTMLEmail",
  "sendTextEmail",
  "approveBooking",
  "reject",
  "cancel",
  "checkin",
  "noShow",
  "approveInstantBooking",
  "removeFromListByValue",
  "sendBookingDetailEmail",
].forEach((functionName) => {
  serverFunctions[functionName as ServerFunctionNames] = (
    ...parameters: any[]
  ) => {
    return callServerFunction(functionName as ServerFunctionNames, parameters);
  };
});
