import { format } from "date-fns";

export const formatDate = (oldDate) => {
  const date = oldDate?.toDate();
  if (!date) return "";
  return format(date, "yyyy-MM-dd hh:mm a");
};
