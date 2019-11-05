const { daysBetweenTwoDates } = require('../dateUtils/daysBetweenTwoDates');

const MAX_SESSION_DAY = 5;

const convertDateToSessionDay = ({ startedAtDate, dateToConvert } = {}) => {
  if (!dateToConvert) {
    throw new Error('No date to convert was given');
  }
  return (daysBetweenTwoDates(dateToConvert, startedAtDate) % MAX_SESSION_DAY) + 1;
};

module.exports = {
  convertDateToSessionDay,
};
