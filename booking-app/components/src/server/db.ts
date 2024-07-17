import { fetchAllDataFromCollection } from "@/lib/firebase/firebase";
import { TableNames } from "../policy";
import { where } from "@firebase/firestore";

export const fetchAllFutureDataFromCollection = async <T>(
  collectionName: TableNames
): Promise<T[]> => {
  const now = new Date().toISOString();
  const futureQueryConstraints = [where("startDate", ">", now)];
  return fetchAllDataFromCollection<T>(collectionName, futureQueryConstraints);
};

export const getActiveBookingsFutureDates = () => {
  const rows = fetchAllDataFromCollection(TableNames.BOOKING);
};

export const getOldSafetyTrainingEmails = () => {
  //TODO: implement this
  return [];
  //const activeSpreadSheet = SpreadsheetApp.openById(
  //  OLD_SAFETY_TRAINING_SHEET_ID
  //);
  //const activeSheet = activeSpreadSheet.getSheetByName(
  //  OLD_SAFETY_TRAINING_SHEET_NAME
  //);
  //var lastRow = activeSheet.getLastRow();

  //// get all row3(email) data
  //var range = activeSheet.getRange(1, 5, lastRow);
  //var values = range.getValues();

  //const secondSpreadSheet = SpreadsheetApp.openById(
  //  SECOND_OLD_SAFETY_TRAINING_SHEET_ID
  //);
  //const secondSheet = secondSpreadSheet
  //  .getSheets()
  //  .find(
  //    (sheet) => sheet.getSheetId() === SECOND_OLD_SAFETY_TRAINING_SHEET_GID
  //  );
  //const secondLastRow = secondSheet.getLastRow();
  //const secondRange = secondSheet.getRange(1, 2, secondLastRow);
  //const secondValues = secondRange.getValues();

  //const combinedValues = [...values, ...secondValues];
  //return combinedValues;
};
