const { uniq, orderBy, identity, flatMap, flow } = require('lodash/fp');
const { leitnerSchedule } = require('./leitnerSchedule');
const { sessionRange } = require('./sessionRange');

const getPartitionsNumbers = ({ lastCompletedSession, session }) =>
  flow(
    sessionRange,
    flatMap(leitnerSchedule),
    orderBy(identity, 'desc'),
    uniq,
  )({ lastCompletedSession, session });

module.exports = {
  getPartitionsNumbers,
};
