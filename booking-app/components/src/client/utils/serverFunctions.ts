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
  return [{ name: "hoge" }];
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
