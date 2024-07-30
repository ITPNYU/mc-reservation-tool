export const formatDate = (oldDate) => {
  const oldDateObject = new Date(oldDate);

  const year = oldDateObject.getFullYear();
  const month = String(oldDateObject.getMonth() + 1).padStart(2, '0');
  const date = String(oldDateObject.getDate()).padStart(2, '0');
  let hours = oldDateObject.getHours();

  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const strHours = String(hours).padStart(2, '0');
  const minutes = String(oldDateObject.getMinutes()).padStart(2, '0');

  return `${month}-${date}-${year} ${strHours}:${minutes} ${ampm}`;
};

export const formatDateTable = (d: string) => {
  const date = new Date(d);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);

  return `${month}/${day}/${year}`;
};

export const formatTimeTable = (d: string) => {
  const date = new Date(d);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');

  // Convert 24-hour format to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${hours}:${minutes}`;
};

export const formatTimeAmPm = (d: string) => {
  return new Date(d).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
};
