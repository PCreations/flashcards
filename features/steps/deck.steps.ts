import expect from 'expect';
import { Then } from 'cucumber';
import { flashcardsInPartitions, flashcardsInDeck } from '../../testsUtils/helpers/dataViews';

Then(
  /^the session deck for the box "([\w\W]*)" should contain flashcards from partitions ([1-7]+(?:,[1-7])*)/,
  async function(boxName, comaSeparatedPartitions) {
    const { boxRepository, authenticationGateway } = this.dependencies;
    const playerId = authenticationGateway.getCurrentPlayer().id;
    const partitions = comaSeparatedPartitions.split(',');
    const box = await boxRepository.getBoxByName({
      playerId,
      boxName,
    });
    const expectedFlashcardsInPartitions = flashcardsInPartitions({
      box,
      partitions,
    });
    const theFlashcardsInDeck = flashcardsInDeck({
      deck: box.sessionDeck,
    });
    expect(expectedFlashcardsInPartitions.length).toBeGreaterThan(0);
    expect(theFlashcardsInDeck.length).toBeGreaterThan(0);
    expect(expectedFlashcardsInPartitions).toEqual(theFlashcardsInDeck);
  },
);
