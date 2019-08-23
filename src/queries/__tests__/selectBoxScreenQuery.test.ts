import { setInitialFixture } from '../testUtils/setInitialFixture';
import { createAdapters as createBoxAdapters } from '../../adapters/inMemory/box';
import { createAdapters as createPlayerAdapters } from '../../adapters/inMemory/player';
import { selectBoxScreenQuery as createSelectBoxScreenQuery } from '../selectBoxScreenQuery';

test('SelectBoxScreenQuery', async () => {
  const { saveBox, getAllBoxesOwnedBy } = createBoxAdapters();
  const { authenticate, getCurrentPlayerId } = createPlayerAdapters();
  await setInitialFixture(saveBox, authenticate);
  const selectBoxScreenQuery = createSelectBoxScreenQuery(getAllBoxesOwnedBy)(getCurrentPlayerId);
  const selectBoxScreen = await selectBoxScreenQuery();
  expect(selectBoxScreen).toEqual([
    {
      boxName: 'box1',
      totalFlashcards: 40,
      archivedFlashcards: 5,
    },
    {
      boxName: 'box2',
      totalFlashcards: 25,
      archivedFlashcards: 3,
    },
  ]);
});
