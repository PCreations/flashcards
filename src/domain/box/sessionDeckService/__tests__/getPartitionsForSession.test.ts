import dayjs from 'dayjs';
import { getPartitionsForSession } from '../getPartitionsForSession';

test.each`
  sessionDate            | lastStartedSessionDate | partitions
  ${dayjs('2019-04-01')} | ${undefined}           | ${[2, 1]}
  ${dayjs('2019-04-01')} | ${dayjs('2019-04-01')} | ${[2, 1]}
  ${dayjs('2019-04-02')} | ${dayjs('2019-04-01')} | ${[3, 1]}
  ${dayjs('2019-04-03')} | ${undefined}           | ${[3, 2, 1]}
  ${dayjs('2019-05-04')} | ${dayjs('2019-04-23')} | ${[6, 5, 4, 3, 2, 1]}
  ${dayjs('2019-05-28')} | ${dayjs('2019-05-25')} | ${[7, 3, 2, 1]}
  ${dayjs('2019-06-06')} | ${dayjs('2019-05-30')} | ${[4, 3, 2, 1]}
`(
  'given startDate is 2019-04-01 and last completed session is $lastCompletedSession and session is $session partitions numbers should be $partitions',
  ({ sessionDate, lastStartedSessionDate, partitions }) => {
    expect(
      getPartitionsForSession({
        dateOfFirstSession: dayjs('2019-04-01').toDate(),
        lastStartedSessionDate,
        sessionDate,
      }),
    ).toEqual(partitions);
  },
);
