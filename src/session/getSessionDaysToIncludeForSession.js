const { convertDateToSessionDay } = require('./convertDateToSessionDay');
const { windowedRangeFive } = require('../mathUtils/windowedRangeFive');

const getSessionDaysToIncludeForSession = ({
  todayDate,
  lastCompletedSessionDate,
  firstStartedSessionDate,
} = {}) => {
  if (typeof lastCompletedSessionDate === 'undefined' && typeof firstStartedSessionDate === 'undefined') {
    return [1];
  }
  const currentSessionDay = convertDateToSessionDay({
    startedAtDate: firstStartedSessionDate,
    dateToConvert: todayDate,
  });

  if (typeof lastCompletedSessionDate === 'undefined') {
    return windowedRangeFive(1, currentSessionDay);
  }

  const lastPlayedSessionDay = convertDateToSessionDay({
    startedAtDate: firstStartedSessionDate,
    dateToConvert: lastCompletedSessionDate,
  });

  const [_, ...range] = windowedRangeFive(lastPlayedSessionDay, currentSessionDay);
  return range;
};

module.exports = {
  getSessionDaysToIncludeForSession,
};
