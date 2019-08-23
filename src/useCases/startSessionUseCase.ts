import { startSession } from '../domain/box/box';
import { GetCurrentPlayerId } from '../domain/player/authentication';
import { GetBoxByNameAndPlayerId, SaveBox } from '../domain/box/repository';

export type StartSessionUseCase = (
  getCurrentPlayerId: GetCurrentPlayerId,
) => (
  getBoxByNameAndPlayerId: GetBoxByNameAndPlayerId,
) => (saveBox: SaveBox) => ({ boxName, today }: { boxName: string; today: Date }) => Promise<boolean>;

export const StartSessionUseCase: StartSessionUseCase = getCurrentPlayerId => getBoxByNameAndPlayerId => saveBox => async ({
  boxName,
  today,
}) => {
  const box = await getBoxByNameAndPlayerId({
    boxName,
    playerId: getCurrentPlayerId(),
  });

  const boxToSave = startSession(today)(box);
  return saveBox(boxToSave);
};
