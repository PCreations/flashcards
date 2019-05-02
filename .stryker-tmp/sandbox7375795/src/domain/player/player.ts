import { Record } from 'immutable';

type PlayerProps = {
  id?: string;
};

export const Player = Record<PlayerProps>({
  id: undefined,
});

export type Player = ReturnType<typeof Player>;
