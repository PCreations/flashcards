import { startSession } from '../domain/box/box';
import { BoxRepository } from '../domain/box/boxRepository';
import { AuthenticationGateway } from '../domain/player/authenticationGateway';

export const StartSessionUseCase = ({
  boxRepository,
  authenticationGateway,
}: {
  boxRepository: BoxRepository;
  authenticationGateway: AuthenticationGateway;
}) => ({
  async handle({ boxName, today }: { boxName: string; today: Date }) {
    const box = await boxRepository.getBoxByName({
      boxName,
      playerId: authenticationGateway.getCurrentPlayer().id,
    });
    return boxRepository.save(startSession(today)(box));
  },
});

export type StartSessionUseCase = ReturnType<typeof StartSessionUseCase>;
