import dateFormat from 'dateformat';

const getDateString = (givenTimestamp) => {
  givenTimestamp = new Date(givenTimestamp);
  const currentTimestamp = new Date().getTime();

  const daysDiff =
    (currentTimestamp - givenTimestamp.getTime()) / (24 * 60 * 60 * 1000);
  let dateString = null;

  if (daysDiff <= 1)
    dateString =
      givenTimestamp.getDay() - currentTimestamp.getDay() === 0
        ? 'today'
        : 'yesterday';
  else if (daysDiff <= 2)
    dateString =
      givenTimestamp.getDay() - currentTimestamp.getDay() === 1
        ? 'yesterday'
        : dateFormat(givenTimestamp, 'dddd');
  else if (daysDiff <= 7)
    dateString =
      givenTimestamp.getDay() - currentTimestamp.getDay() <= 7
        ? dateFormat(givenTimestamp, 'dddd')
        : dateFormat(givenTimestamp, 'mm/dd/yyyy');
  else dateString = dateFormat(givenTimestamp, 'mm/dd/yyyy');

  return dateString;
};

export default getDateString;
