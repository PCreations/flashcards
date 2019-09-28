const { createStep } = require('../createStep');

module.exports = {
  ...createStep('today is ((?:\\d{4})-(?:\\d{2})-(?:\\d{2}))', ({ setTodayDate }) => todayDate =>
    setTodayDate(todayDate),
  ),
};
