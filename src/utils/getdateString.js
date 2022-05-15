import dateFormat from 'dateformat';

const getDateString = (givenTimestamp) => {
  givenTimestamp = new Date(givenTimestamp);
  const currentTimestamp = new Date().getTime();

  const daysDiff =
    (currentTimestamp - givenTimestamp.getTime()) / (24 * 60 * 60 * 1000);
  let dateString = null;

  if (daysDiff <= 1) dateString = 'today';
  else if (daysDiff <= 2) dateString = 'yesterday';
  else if (daysDiff <= 7) dateString = dateFormat(givenTimestamp, 'dddd');
  else dateString = dateFormat(givenTimestamp, 'mm/dd/yyyy');

  return dateString;
};

export default getDateString;
