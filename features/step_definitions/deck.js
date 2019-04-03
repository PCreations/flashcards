const expect = require('expect');
const { Then } = require('cucumber');
const { getDependencies } = require('../getDependencies');
const testDataViews = require('../../tests/helpers/dataViews');

Then(
  /^the selected deck for the box "([\w\W]*)" should contain flashcards from partitions ([1-7]+(?:,[1-7])*)/,
  async function(boxName, comaSeparatedPartitions) {
    const { boxRepository, authenticationGateway } = getDependencies(this);
    const playerId = authenticationGateway.getCurrentPlayer().id;
    const partitions = comaSeparatedPartitions.split(',');
    const sessionDeck = await boxRepository.getCurrentSessionDeckForBox({
      playerId,
      boxName,
    });
    const box = await boxRepository.getBoxByName({ boxName, playerId });
    expect(
      testDataViews.flashcardsInPartitions({
        box,
        partitions,
      }),
    ).toEqual(sessionDeck);
  },
);
