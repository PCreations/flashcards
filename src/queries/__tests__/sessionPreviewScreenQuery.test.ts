import { setInitialFixture } from '../testUtils/setInitialFixture';
import { BoxRepository } from '../../adapters/inMemory/boxRepository';
import { AuthenticationGateway } from '../../adapters/inMemory/authenticationGateway';
import { SessionPreviewScreenQuery } from '../sessionPreviewScreenQuery';

test('SessionPreviewScreenQuery', async () => {
  const boxRepository = BoxRepository();
  const authenticationGateway = AuthenticationGateway();
  await setInitialFixture(boxRepository, authenticationGateway);
  const sessionPreviewScreenQuery = SessionPreviewScreenQuery({ boxRepository, authenticationGateway });
  const sessionPreviewScreen = await sessionPreviewScreenQuery({ boxName: 'box1' });
  expect(sessionPreviewScreen).toEqual({
    boxName: 'box1',
    totalFlashcards: 40,
    archivedFlashcards: 5,
    numberOfFlashcardsToReviewRoday: 7,
  });
});
