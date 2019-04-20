import { BoxRepository } from '../domain/box/boxRepository';
import { Flashcard } from '../domain/box/flashcard';

export const CurrentFlashcardQuestionQuery = ({ boxRepository }: { boxRepository: BoxRepository }) => ({
  async execute({
    boxName,
    playerId,
  }: {
    boxName: string;
    playerId: string;
  }): Promise<Flashcard['question']> {
    const box = await boxRepository.getBoxByName({ boxName, playerId });

    return box.partitions[box.sessionsPartitions[0]][0].question;
  },
});