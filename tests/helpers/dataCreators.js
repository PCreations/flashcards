const { Box } = require('../../src/domain/box/box');
const { Flashcard } = require('../../src/domain/box/flashcard');
const { Player } = require('../../src/domain/player/player');

/**
 *
 * @param {Box} box
 * @param {[{id: string, question: string, answer: string}]} flashcards
 * @param {number} partitionIndex
 * @returns {Box}
 */
const addFlashcardsInPartition = (box, flashcards, partitionIndex) =>
  flashcards.reduce(
    (theBox, { id, question, answer }) =>
      theBox
        .addFlashcard(
          Flashcard.ofQuestion(question)
            .withAnswer(answer)
            .withId(id),
        )
        .inPartition(partitionIndex + 1),
    box,
  );

/**
 *
 * @param {Object} params
 * @param {string} params.boxName
 * @param {string} params.ownedByPlayerWithId
 * @param {number} params.nextSession
 * @param {[[{id: string, question: string, answer: string}]]} params.partitions
 * @returns {Box}
 */
const createBox = ({
  boxName,
  ownedByPlayerWithId,
  nextSession = 1,
  lastCompletedSession = 0,
  partitions = [[]],
} = {}) =>
  partitions.reduce(
    addFlashcardsInPartition,
    Box.named(boxName)
      .ownedBy(Player.ofId(ownedByPlayerWithId))
      .whereTheNextSessionToBePlayedIs(nextSession)
      .withLastCompletedSessionBeing(lastCompletedSession),
  );

const createFlashcardsFromGherkinDatatable = flashcardsDatatable =>
  flashcardsDatatable.hashes().map(({ id, answer, question }) =>
    Flashcard.ofQuestion(question)
      .withAnswer(answer)
      .withId(id),
  );

module.exports = {
  createBox,
  createFlashcardsFromGherkinDatatable,
};
