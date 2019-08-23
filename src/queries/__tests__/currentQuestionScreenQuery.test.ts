import { setInitialFixture } from '../testUtils/setInitialFixture';
import { createAdapters as createBoxAdapters } from '../../adapters/inMemory/box';
import { createAdapters as createPlayerAdapters } from '../../adapters/inMemory/player';
import { currentQuestionScreenQuery as createCurrentQuestionScreenQuery } from '../currentQuestionScreenQuery';

test('currentQuestionScreenQuery', async () => {
  const { saveBox, getBoxByNameAndPlayerId } = createBoxAdapters();
  const { authenticate, getCurrentPlayerId } = createPlayerAdapters();
  await setInitialFixture(saveBox, authenticate);
  const currentQuestionScreenQuery = createCurrentQuestionScreenQuery(getBoxByNameAndPlayerId)(
    getCurrentPlayerId,
  );
  const currentQuestionScreen = await currentQuestionScreenQuery({ boxName: 'box1' });
  expect(currentQuestionScreen).toEqual({
    boxName: 'box1',
    sessionScore: 2,
    currentFlashcardQuestion: '2#q3',
    totalFlashcardsToReview: 8,
  });
});
