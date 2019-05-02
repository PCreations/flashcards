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

    const boxToSave = startSession(today)(box);
    return boxRepository.save(boxToSave);
  },
});

export type StartSessionUseCase = ReturnType<typeof StartSessionUseCase>;
