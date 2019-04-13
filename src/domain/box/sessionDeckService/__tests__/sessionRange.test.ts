import { sessionRange } from '../sessionRange';

test('sessions range', () => {
  expect(sessionRange({ lastCompletedSession: 0, session: 1 })).toEqual([1]);
  expect(sessionRange({ lastCompletedSession: 1, session: 2 })).toEqual([2]);
  expect(sessionRange({ lastCompletedSession: 5, session: 10 })).toEqual([6, 7, 8, 9, 10]);
  expect(sessionRange({ lastCompletedSession: 60, session: 2 })).toEqual([61, 62, 63, 64, 1, 2]);
});
