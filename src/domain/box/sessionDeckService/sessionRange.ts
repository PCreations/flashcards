import { range } from 'lodash';
import { MAX_SESSION_NUMBER, MIN_SESSION_NUMBER, SessionNumber } from '../sessionNumber';

export const sessionRange = ({
  lastCompletedSession,
  session,
}: {
  lastCompletedSession: SessionNumber;
  session: SessionNumber;
}): SessionNumber[] =>
  session > lastCompletedSession
    ? range(lastCompletedSession + 1, session + 1)
    : [
        ...sessionRange({ lastCompletedSession, session: MAX_SESSION_NUMBER }),
        ...(range(MIN_SESSION_NUMBER, session + 1) as any),
      ];
