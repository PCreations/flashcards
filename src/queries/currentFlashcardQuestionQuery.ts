import { BoxRepository } from '../domain/box/boxRepository';
import { Flashcard } from '../domain/box/flashcard';
import { SessionFlashcard } from '../domain/box/box';

export const CurrentFlashcardQuestionQuery = ({ boxRepository }: { boxRepository: BoxRepository }) => ({
  async execute({
    boxName,
    playerId,
  }: {
    boxName: string;
    playerId: string;
  }): Promise<Flashcard['question']> {
    const box = await boxRepository.getBoxByName({ boxName, playerId });
    const currentSessionFlashcard: SessionFlashcard = box.sessionFlashcards.first();
    return currentSessionFlashcard.flashcard.question;
  },
});
