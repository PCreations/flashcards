import { BoxRepository } from '../domain/box/boxRepository';
import { Flashcard } from '../domain/box/flashcard';
import { SessionFlashcard } from '../../src/domain/box/box';

export const CurrentFlashcardAnswerQuery = ({ boxRepository }: { boxRepository: BoxRepository }) => ({
  async execute({ boxName, playerId }: { boxName: string; playerId: string }): Promise<Flashcard['answer']> {
    const box = await boxRepository.getBoxByName({ boxName, playerId });
    const currentlyReviewedSessionFlashcard: SessionFlashcard = box.sessionFlashcards.first();
    return currentlyReviewedSessionFlashcard.flashcard.answer;
  },
});
