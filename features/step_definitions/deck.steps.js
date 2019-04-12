const expect = require('expect');
const { Then } = require('cucumber');
const { getDependencies } = require('../getDependencies');
const testDataViews = require('../../tests/helpers/dataViews');

Then(
  /^the session deck for the box "([\w\W]*)" should contain flashcards from partitions ([1-7]+(?:,[1-7])*)/,
  async function(boxName, comaSeparatedPartitions) {
    const { boxRepository, authenticationGateway } = getDependencies(this);
    const playerId = authenticationGateway.getCurrentPlayer().id;
    const partitions = comaSeparatedPartitions.split(',');
    const box = await boxRepository.getBoxByName({
      playerId,
      boxName,
    });
    const flashcardsInPartitions = testDataViews.flashcardsInPartitions({
      box,
      partitions,
    });
    const flashcardsInDeck = testDataViews.flashcardsInDeck({
      deck: box.sessionDeck,
    });

    expect(flashcardsInPartitions.length).toBeGreaterThan(0);
    expect(flashcardsInDeck.length).toBeGreaterThan(0);
    expect(
      testDataViews.flashcardsInPartitions({
        box,
        partitions,
      }),
    ).toEqual(
      testDataViews.flashcardsInDeck({
        deck: box.sessionDeck,
      }),
    );
  },
);
