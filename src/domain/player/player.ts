const PlayerFactory = (data: { id?: string } = {}) => ({
  ofId(anId: string) {
    return PlayerFactory({ id: anId });
  },
  ...data,
});

export type Player = ReturnType<typeof PlayerFactory>;

export const Player = PlayerFactory();
