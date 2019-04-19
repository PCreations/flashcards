import dayjs from 'dayjs';
import range from 'lodash/range';
import { MAX_SESSION_NUMBER, SessionNumber } from '../sessionNumber';

const dateToSession = (dateOfFirstSession: Date, currentDate: Date): SessionNumber => {
  const daysDiff = dayjs(currentDate).diff(dayjs(dateOfFirstSession), 'day') + 1;
  return daysDiff % MAX_SESSION_NUMBER === 0
    ? MAX_SESSION_NUMBER
    : ((daysDiff % MAX_SESSION_NUMBER) as SessionNumber);
};

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
