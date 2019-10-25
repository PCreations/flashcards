const getSessionDaysToIncludeForSession = () => [1];

describe('getSessionDaysToIncludeForSession', () => {
  test('no session ever played : day 1', () => {
    expect(getSessionDaysToIncludeForSession()).toEqual([1]);
  });
});
