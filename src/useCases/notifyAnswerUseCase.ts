import { notifyGoodAnswer, notifyWrongAnswer } from '../domain/box/box';
import { BoxRepository } from '../domain/box/boxRepository';
import { AuthenticationGateway } from '../domain/player/authenticationGateway';

export const NotifyAnswerUseCase = ({
  boxRepository,
  authenticationGateway,
}: {
  boxRepository: BoxRepository;
  authenticationGateway: AuthenticationGateway;
}) => ({
  async handle({ boxName, didCorrectlyAnswer }: { boxName: string; didCorrectlyAnswer: Boolean }) {
    const box = await boxRepository.getBoxByName({
      boxName,
      playerId: authenticationGateway.getCurrentPlayer().id,
    });
    return boxRepository.save(didCorrectlyAnswer ? notifyGoodAnswer(box) : notifyWrongAnswer(box));
  },
});

export type NotifyAnswerUseCase = ReturnType<typeof NotifyAnswerUseCase>;
