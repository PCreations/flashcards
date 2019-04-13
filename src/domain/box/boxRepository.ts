import { Box } from './box';

export const BoxRepository = ({
  save,
  getBoxByName,
}: {
  save: (box: Box) => Promise<boolean>;
  getBoxByName: ({ boxName, playerId }: { boxName: string; playerId: string }) => Promise<Box>;
}) =>
  Object.freeze({
    save,
    getBoxByName,
  });

export type BoxRepository = ReturnType<typeof BoxRepository>;
