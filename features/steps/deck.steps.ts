import flatMap from 'lodash/flatMap';
import expect from 'expect';
import { Then } from 'cucumber';
import { SessionDeckQuery } from '../../src/queries/sessionDeck';
import { PartitionNumber } from '../../src/domain/box/partitions';

Then(
  /^the session deck for the box "([\w\W]*)" should contain flashcards from partitions ([1-7]+(?:,[1-7])*)/,
  async function(boxName, comaSeparatedPartitions) {
    const { boxRepository, authenticationGateway } = this.dependencies;
    const sessionDeckQuery = SessionDeckQuery({ boxRepository });
    const playerId = authenticationGateway.getCurrentPlayer().id;
    const partitions: PartitionNumber[] = comaSeparatedPartitions
      .split(',')
      .map((stringNumber: string) => parseInt(stringNumber, 10));
    const box = await boxRepository.getBoxByName({
      playerId,
      boxName,
    });
    const expectedFlashcardsInPartitions = flatMap(
      partitions,
      partitionNumber => box.partitions[partitionNumber],
    );
    const theFlashcardsInDeck = await sessionDeckQuery.execute({ boxName, playerId });
    expect(expectedFlashcardsInPartitions.length).toBeGreaterThan(0);
    expect(theFlashcardsInDeck.length).toBeGreaterThan(0);
    expect(theFlashcardsInDeck).toEqual(expectedFlashcardsInPartitions);
  },
);
