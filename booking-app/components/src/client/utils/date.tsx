import { Timestamp } from "@firebase/firestore";
import { format } from "date-fns";
export const formatDate = (oldDate: any) => {
  console.log("oldDate", oldDate);
  if (!oldDate) return "";
  let date;
  if (oldDate instanceof Date) {
    console.log("date");
    date = oldDate;
  } else if (oldDate instanceof Timestamp) {
    console.log("timestamp");
    date = oldDate.toDate();
  } else {
    console.log("else");
    date = new Date(oldDate);
  }
  console.log("date", date);
  return format(date, "yyyy-MM-dd hh:mm a");
};

export const toFirebaseTimestampFromString = (date: string) => {
  return Timestamp.fromDate(new Date(date));
};
