import dateFormat from 'dateformat';

const getDateString = (givenTimestamp, viewChat) => {
  givenTimestamp = new Date(givenTimestamp);
  const currentTimestamp = new Date();

  const daysDiff =
    (currentTimestamp.getTime() - givenTimestamp.getTime()) /
    (24 * 60 * 60 * 1000);

  if (daysDiff <= 1)
    return currentTimestamp.getDay() - givenTimestamp.getDay() === 0
      ? viewChat
        ? 'Today'
        : dateFormat(givenTimestamp, 'h:MM TT')
      : 'Yesterday';
  else if (daysDiff <= 2)
    return currentTimestamp.getDay() - givenTimestamp.getDay() === 1
      ? 'Yesterday'
      : dateFormat(givenTimestamp, 'dddd');
  else if (daysDiff <= 7)
    return currentTimestamp.getDay() - givenTimestamp.getDay() !== 0
      ? dateFormat(givenTimestamp, 'dddd')
      : dateFormat(givenTimestamp, 'dd/mm/yyyy');
  else return dateFormat(givenTimestamp, 'dd/mm/yyyy');
};

export { getDateString };
