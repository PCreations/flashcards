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
  lastCompletedSessionDate,
}: {
  dateOfFirstSession: Date;
  sessionDate: Date;
  lastCompletedSessionDate?: Date;
}): SessionNumber[] => {
  if (dateOfFirstSession === sessionDate) return [dateToSession(dateOfFirstSession, sessionDate)];
  const currentSessionNumber = dateToSession(dateOfFirstSession, sessionDate);
  if (!lastCompletedSessionDate) {
    return range(1, currentSessionNumber + 1) as SessionNumber[];
  }
  const lastCompletedSessionNumber = dateToSession(dateOfFirstSession, lastCompletedSessionDate);
  return lastCompletedSessionNumber > currentSessionNumber
    ? (range(lastCompletedSessionNumber + 1, MAX_SESSION_NUMBER + 1).concat(
        range(1, currentSessionNumber + 1),
      ) as SessionNumber[])
    : (range(lastCompletedSessionNumber + 1, currentSessionNumber + 1) as SessionNumber[]);
};
