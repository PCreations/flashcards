import { setInitialFixture } from '../testUtils/setInitialFixture';
import { BoxRepository } from '../../adapters/inMemory/boxRepository';
import { AuthenticationGateway } from '../../adapters/inMemory/authenticationGateway';
import { CurrentQuestionScreenQuery } from '../currentQuestionScreenQuery';

test('CurrentQuestionScreenQuery', async () => {
  const boxRepository = BoxRepository();
  const authenticationGateway = AuthenticationGateway();
  await setInitialFixture(boxRepository, authenticationGateway);
  const currentQuestionScreenQuery = CurrentQuestionScreenQuery({ boxRepository, authenticationGateway });
  const currentQuestionScreen = await currentQuestionScreenQuery({ boxName: 'box1' });
  expect(currentQuestionScreen).toEqual({
    boxName: 'box1',
    sessionScore: 2,
    currentFlashcardQuestion: '2#q3',
    totalFlashcardsToReview: 8,
  });
});
