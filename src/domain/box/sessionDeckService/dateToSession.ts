import dayjs from 'dayjs';
import { SessionNumber, MAX_SESSION_NUMBER } from '../sessionNumber';

export const dateToSession = (dateOfFirstSession: Date, currentDate: Date): SessionNumber => {
  const daysDiff = dayjs(currentDate).diff(dayjs(dateOfFirstSession), 'day') + 1;
  return daysDiff % MAX_SESSION_NUMBER === 0
    ? MAX_SESSION_NUMBER
    : ((daysDiff % MAX_SESSION_NUMBER) as SessionNumber);
};
