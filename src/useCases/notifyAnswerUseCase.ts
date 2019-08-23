import { notifyGoodAnswer, notifyWrongAnswer } from '../domain/box/box';
import { GetCurrentPlayerId } from '../domain/player/authentication';
import { GetBoxByNameAndPlayerId, SaveBox } from '../domain/box/repository';

export type NotifyAnswerUseCase = (
  getCurrentPlayerId: GetCurrentPlayerId,
) => (
  getBoxByNameAndPlayerId: GetBoxByNameAndPlayerId,
) => (
  saveBox: SaveBox,
) => ({ boxName, didCorrectlyAnswer }: { boxName: string; didCorrectlyAnswer: boolean }) => Promise<boolean>;

export const notifyAnswerUseCase: NotifyAnswerUseCase = getCurrentPlayerId => getBoxByNameAndPlayerId => saveBox => async ({
  boxName,
  didCorrectlyAnswer,
}) => {
  const box = await getBoxByNameAndPlayerId({
    boxName,
    playerId: getCurrentPlayerId(),
  });
  const boxToSave = didCorrectlyAnswer ? notifyGoodAnswer(box) : notifyWrongAnswer(box);
  return saveBox(boxToSave);
};
