const dayjs = require('dayjs');

const daysBetweenTwoDates = (date1, date2) => dayjs(date1).diff(date2, 'day');

module.exports = {
  daysBetweenTwoDates,
};
