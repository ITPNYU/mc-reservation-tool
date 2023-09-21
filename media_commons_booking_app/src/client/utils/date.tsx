export const formatDate = (oldDate) => {
  const oldDateObject = new Date(oldDate);

  const year = oldDateObject.getFullYear();
  const month = String(oldDateObject.getMonth() + 1).padStart(2, '0');
  const date = String(oldDateObject.getDate()).padStart(2, '0');
  const hours = String(oldDateObject.getHours()).padStart(2, '0');
  const minutes = String(oldDateObject.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${date} ${hours}:${minutes}`;
};
