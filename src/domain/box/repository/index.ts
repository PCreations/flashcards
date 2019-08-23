import { Box } from '../box';

export type GetBoxByNameAndPlayerId = ({
  boxName,
  playerId,
}: {
  boxName: string;
  playerId: string;
}) => Promise<Box>;

export type SaveBox = (box: Box) => Promise<boolean>;

export type GetAllBoxesOwnedBy = (playerId: string) => Promise<Box[]>;
