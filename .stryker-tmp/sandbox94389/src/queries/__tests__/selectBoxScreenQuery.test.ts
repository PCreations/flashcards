import { setInitialFixture } from '../testUtils/setInitialFixture';
import { BoxRepository } from '../../adapters/inMemory/boxRepository';
import { AuthenticationGateway } from '../../adapters/inMemory/authenticationGateway';
import { SelectBoxScreenQuery } from '../selectBoxScreenQuery';

test('SelectBoxScreenQuery', async () => {
  const boxRepository = BoxRepository();
  const authenticationGateway = AuthenticationGateway();
  await setInitialFixture(boxRepository, authenticationGateway);
  const selectBoxScreenQuery = SelectBoxScreenQuery({ boxRepository, authenticationGateway });
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
