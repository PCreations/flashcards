import { getPartitionsNumbers } from '../getPartitionsNumbers';

test.each`
  lastCompletedSession | session | partitions
  ${0}                 | ${1}    | ${[2, 1]}
  ${0}                 | ${2}    | ${[3, 2, 1]}
  ${23}                | ${34}   | ${[6, 5, 4, 3, 2, 1]}
  ${55}                | ${58}   | ${[7, 3, 2, 1]}
  ${60}                | ${2}    | ${[4, 3, 2, 1]}
`(
  'given last completed session is $lastCompletedSession and session is $session partitions numbers should be $partitions',
  ({ lastCompletedSession, session, partitions }) => {
    expect(getPartitionsNumbers({ lastCompletedSession, session })).toEqual(partitions);
  },
);
