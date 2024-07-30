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
