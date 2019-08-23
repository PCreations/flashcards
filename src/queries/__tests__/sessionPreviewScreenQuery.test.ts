import { setInitialFixture } from '../testUtils/setInitialFixture';
import { createAdapters as createBoxAdapters } from '../../adapters/inMemory/box';
import { createAdapters as createPlayerAdapters } from '../../adapters/inMemory/player';
import { sessionPreviewScreenQuery as createSessionPreviewScreenQuery } from '../sessionPreviewScreenQuery';

test('SessionPreviewScreenQuery', async () => {
  const { saveBox, getBoxByNameAndPlayerId } = createBoxAdapters();
  const { authenticate, getCurrentPlayerId } = createPlayerAdapters();
  await setInitialFixture(saveBox, authenticate);
  const sessionPreviewScreenQuery = createSessionPreviewScreenQuery(getBoxByNameAndPlayerId)(
    getCurrentPlayerId,
  );
  const sessionPreviewScreen = await sessionPreviewScreenQuery({ boxName: 'box1' });
  expect(sessionPreviewScreen).toEqual({
    boxName: 'box1',
    totalFlashcards: 40,
    archivedFlashcards: 5,
    numberOfFlashcardsToReviewRoday: 7,
  });
});
