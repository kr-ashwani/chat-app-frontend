import dateFormat from 'dateformat';

const getDateString = (givenTimestamp, viewChat) => {
  givenTimestamp = new Date(givenTimestamp);
  const currentTimestamp = new Date();

  const daysDiff =
    (currentTimestamp.getTime() - givenTimestamp.getTime()) /
    (24 * 60 * 60 * 1000);
  let dateString = null;

  if (daysDiff <= 1)
    dateString =
      currentTimestamp.getDay() - givenTimestamp.getDay() === 0
        ? viewChat
          ? 'Today'
          : dateFormat(givenTimestamp, 'h:MM TT')
        : 'Yesterday';
  else if (daysDiff <= 2)
    dateString =
      currentTimestamp.getDay() - givenTimestamp.getDay() === 1
        ? 'Yesterday'
        : dateFormat(givenTimestamp, 'dddd');
  else if (daysDiff <= 7)
    dateString =
      currentTimestamp.getDay() - givenTimestamp.getDay() <= 6
        ? dateFormat(givenTimestamp, 'dddd')
        : dateFormat(givenTimestamp, 'mm/dd/yyyy');
  else dateString = dateFormat(givenTimestamp, 'mm/dd/yyyy');

  return dateString;
};

export { getDateString };
