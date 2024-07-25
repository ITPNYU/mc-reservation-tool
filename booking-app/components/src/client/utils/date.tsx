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

export const formatDateTable = (d: string) => {
  const date = new Date(d);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);

  return `${month}/${day}/${year}`;
};

export const formatTimeTable = (d: string) => {
  const date = new Date(d);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  // Convert 24-hour format to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${hours}:${minutes}`;
};

export const formatTimeAmPm = (d: string) => {
  return new Date(d).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

export const toFirebaseTimestampFromString = (date: string) => {
  return Timestamp.fromDate(new Date(date));
};
