import range from 'lodash/range';
import { MAX_SESSION_NUMBER, SessionNumber } from '../sessionNumber';
import { dateToSession } from './dateToSession';

export const sessionRange = ({
  dateOfFirstSession,
  sessionDate,
  lastStartedSessionDate,
}: {
  dateOfFirstSession: Date;
  sessionDate: Date;
  lastStartedSessionDate?: Date;
}): SessionNumber[] => {
  if (dateOfFirstSession === sessionDate) return [dateToSession(dateOfFirstSession, sessionDate)];
  const currentSessionNumber = dateToSession(dateOfFirstSession, sessionDate);
  if (!lastStartedSessionDate) {
    return range(1, currentSessionNumber + 1) as SessionNumber[];
  }
  const lastStartedSessionNumber = dateToSession(dateOfFirstSession, lastStartedSessionDate);
  if (lastStartedSessionNumber === currentSessionNumber) {
    return [currentSessionNumber];
  }
  return lastStartedSessionNumber > currentSessionNumber
    ? (range(lastStartedSessionNumber + 1, MAX_SESSION_NUMBER + 1).concat(
      range(1, currentSessionNumber + 1),
    ) as SessionNumber[])
    : (range(lastStartedSessionNumber + 1, currentSessionNumber + 1) as SessionNumber[]);
};
