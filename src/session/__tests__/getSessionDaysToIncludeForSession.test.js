const { getSessionDaysToIncludeForSession } = require('../getSessionDaysToIncludeForSession');

describe('getSessionDaysToIncludeForSession', () => {
  test('no session ever started', () => {
    expect(
      getSessionDaysToIncludeForSession({
        todayDate: new Date('2019-10-01T00:00:00'),
      }),
    ).toEqual([1]);
  });
  test('the first session ever played was started today, and we are still today', () => {
    const todayDate = new Date('2019-10-01T00:00:00');
    expect(
      getSessionDaysToIncludeForSession({
        todayDate,
        firstStartedSessionDate: todayDate,
      }),
    ).toEqual([1]);
  });
  test('the first session has been played, and we are the day after', () => {
    expect(
      getSessionDaysToIncludeForSession({
        todayDate: new Date('2019-10-02T00:00:00'),
        firstStartedSessionDate: new Date('2019-10-01T00:00:00'),
        lastCompletedSessionDate: new Date('2019-10-01T00:00:00'),
      }),
    ).toEqual([2]);
  });
  test('the first session has been played, we are two day after, and we have missed the session day before', () => {
    expect(
      getSessionDaysToIncludeForSession({
        todayDate: new Date('2019-10-03T00:00:00'),
        firstStartedSessionDate: new Date('2019-10-01T00:00:00'),
        lastCompletedSessionDate: new Date('2019-10-01T00:00:00'),
      }),
    ).toEqual([2, 3]);
  });
  test("the first session has been played, we are two days after, but we haven't missed the previous session", () => {
    expect(
      getSessionDaysToIncludeForSession({
        todayDate: new Date('2019-10-03T00:00:00'),
        firstStartedSessionDate: new Date('2019-10-01T00:00:00'),
        lastCompletedSessionDate: new Date('2019-10-02T00:00:00'),
      }),
    ).toEqual([3]);
  });
  test('the first session has been played, we are 8 day after, we have missed the 3 previous session', () => {
    expect(
      getSessionDaysToIncludeForSession({
        todayDate: new Date('2019-10-08T00:00:00'),
        firstStartedSessionDate: new Date('2019-10-01T00:00:00'),
        lastCompletedSessionDate: new Date('2019-10-04T00:00:00'),
      }),
    ).toEqual([5, 1, 2, 3]);
  });
});
