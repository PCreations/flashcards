import { BoxRepository } from '../domain/box/boxRepository';
import { Flashcard } from '../domain/box/flashcard';

export const SessionDeckQuery = ({ boxRepository }: { boxRepository: BoxRepository }) => ({
  async execute({
    boxName,
    playerId,
  }: {
    boxName: string;
    playerId: string;
  }): Promise<Flashcard['question'][]> {
    const box = await boxRepository.getBoxByName({ boxName, playerId });

    return box.sessionFlashcards.map(sessionFlashcard => sessionFlashcard.flashcard.question).toArray();
  },
});
