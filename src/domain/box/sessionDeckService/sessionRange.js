const { range } = require('lodash');

const FIRST_SESSION_NUMBER = 1;
const MAX_SESSION_NUMBER = 64;

const sessionRange = ({ lastCompletedSession, session }) =>
  session > lastCompletedSession
    ? range(lastCompletedSession + 1, session + 1)
    : sessionRange({ lastCompletedSession, session: MAX_SESSION_NUMBER }).concat(
        range(FIRST_SESSION_NUMBER, session + 1),
      );

module.exports = {
  sessionRange,
};
