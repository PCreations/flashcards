import dayjs from 'dayjs';
import { sessionRange } from '../sessionRange';

test('sessions range', () => {
  const dateOfFirstSession = dayjs('2019-04-01').toDate();
  expect(sessionRange({ dateOfFirstSession, sessionDate: dateOfFirstSession })).toEqual([1]);
  expect(sessionRange({ dateOfFirstSession, sessionDate: dayjs('2019-04-03').toDate() })).toEqual([1, 2, 3]);
  expect(sessionRange({ dateOfFirstSession, sessionDate: dayjs('2019-06-07').toDate() })).toEqual([
    1,
    2,
    3,
    4,
  ]);
  expect(
    sessionRange({
      dateOfFirstSession,
      sessionDate: dayjs('2019-04-05').toDate(),
      lastStartedSessionDate: dayjs('2019-04-04').toDate(),
    }),
  ).toEqual([5]);
  expect(
    sessionRange({
      dateOfFirstSession,
      lastStartedSessionDate: dayjs('2019-04-30').toDate(),
      sessionDate: dayjs('2019-05-04').toDate(),
    }),
  ).toEqual([31, 32, 33, 34]);
  expect(
    sessionRange({
      dateOfFirstSession,
      lastStartedSessionDate: dayjs('2019-05-30').toDate(),
      sessionDate: dayjs('2019-06-06').toDate(),
    }),
  ).toEqual([61, 62, 63, 64, 1, 2, 3]);
});
