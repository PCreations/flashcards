const { getSessionDaysToIncludeForSession } = require('../getSessionDaysToIncludeForSession');
const { getIndexOfPartitionsToPickForSessionDay } = require('../getIndexOfPartitionsToPickForSessionDay');
const { uniq } = require('../../arrayUtils/uniq');
const { sort } = require('../../arrayUtils/sort');

const getPartitionsForTodaySession = ({
  partitions,
  todayDate,
  firstStartedSessionDate,
  lastCompletedSessionDate,
}) => {
  const sessionDays = getSessionDaysToIncludeForSession({
    todayDate,
    firstStartedSessionDate,
    lastCompletedSessionDate,
  }); /*?*/
  const partitionsForToday = sessionDays
    .map(getIndexOfPartitionsToPickForSessionDay)
    .reduce((flattenedValue, current) => [...flattenedValue, ...current], [])
    .map(partitionIndex => partitions[partitionIndex]); /*?*/
  return uniq(sort(partitionsForToday)); /*?*/
};

describe('getPartitionsForTodaySession', () => {
  const partitions = [['partition1'], ['partition2'], ['partition3'], ['partition4'], ['partition5']];
  test('no session ever started', () => {
    expect(
      getPartitionsForTodaySession({
        partitions,
        todayDate: new Date('2019-10-01T00:00:00'),
      }),
    ).toEqual([partitions[0]]);
  });
  test('the first session ever played was started today, and we are still today', () => {
    const todayDate = new Date('2019-10-01T00:00:00');
    expect(
      getPartitionsForTodaySession({
        partitions,
        todayDate,
        firstStartedSessionDate: todayDate,
      }),
    ).toEqual([partitions[0]]);
  });
  test('the first session has been played, and we are the day after', () => {
    expect(
      getPartitionsForTodaySession({
        partitions,
        todayDate: new Date('2019-10-02T00:00:00'),
        firstStartedSessionDate: new Date('2019-10-01T00:00:00'),
        lastCompletedSessionDate: new Date('2019-10-01T00:00:00'),
      }),
    ).toEqual([partitions[0], partitions[1]]);
  });
  test('the first session has been played, we are two day after, and we have missed the session day before', () => {
    expect(
      getPartitionsForTodaySession({
        partitions,
        todayDate: new Date('2019-10-03T00:00:00'),
        firstStartedSessionDate: new Date('2019-10-01T00:00:00'),
        lastCompletedSessionDate: new Date('2019-10-01T00:00:00'),
      }),
    ).toEqual([partitions[0], partitions[1], partitions[2]]);
  });
  test("the first session has been played, we are two days after, but we haven't missed the previous session", () => {
    expect(
      getPartitionsForTodaySession({
        partitions,
        todayDate: new Date('2019-10-03T00:00:00'),
        firstStartedSessionDate: new Date('2019-10-01T00:00:00'),
        lastCompletedSessionDate: new Date('2019-10-02T00:00:00'),
      }),
    ).toEqual([partitions[0], partitions[2]]);
  });
  test('the first session has been played, we are 8 day after, we have missed the 3 previous session', () => {
    expect(
      getPartitionsForTodaySession({
        partitions,
        todayDate: new Date('2019-10-08T00:00:00'),
        firstStartedSessionDate: new Date('2019-10-01T00:00:00'),
        lastCompletedSessionDate: new Date('2019-10-04T00:00:00'),
      }),
    ).toEqual([partitions[0], partitions[1], partitions[2], partitions[4]]);
  });
});
