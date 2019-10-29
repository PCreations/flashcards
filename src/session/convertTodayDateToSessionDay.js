const { daysBetweenTwoDates } = require('../dateUtils/daysBetweenTwoDates');

const MAX_SESSION_DAY = 5;

const convertTodayDateToSessionDay = ({ startedAtDate, todayDate } = {}) => {
  return (daysBetweenTwoDates(todayDate, startedAtDate) % MAX_SESSION_DAY) + 1;
};

module.exports = {
  convertTodayDateToSessionDay,
};
