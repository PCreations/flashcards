import flatMap from 'lodash/flatMap';
import { BoxRepository } from '../domain/box/boxRepository';
import { Flashcard } from '../domain/box/flashcard';

export const SessionDeckQuery = ({ boxRepository }: { boxRepository: BoxRepository }) => ({
  async execute({ boxName, playerId }: { boxName: string; playerId: string }): Promise<Flashcard[]> {
    const box = await boxRepository.getBoxByName({ boxName, playerId });

    return flatMap(box.sessionsPartitions.map(partitionNumber => box.partitions[partitionNumber]));
  },
});
