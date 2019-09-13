const { defineFeature, loadFeature } = require('jest-cucumber');

const feature = loadFeature('./features/addingAFlashcard.feature');

defineFeature(feature, test => {
  test('Adding a flashcard in a new box', ({ given, when, then }) => {
    given('the current player has no box named Capitals of the World', () => {});

    when('the current player ads a flashcard:', table => {});

    then(
      "the current player's box Capitals of the World should contain in its first partition the flashcard:",
      table => {
        throw 'todo';
      },
    );
  });
});
