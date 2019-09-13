Feature: Adding a flashcard in a box

  As a player
  I want to add a flashcard to a box
  So I can review it later

  Scenario: Adding a flashcard in a new box
    Given the current player has no box named Capitals of the World
    When the current player ads a flashcard:
      | question | answer |
      | France   | Paris  |
    Then the current player's box Capitals of the World should contain in its first partition the flashcard:
      | question | answer |
      | France   | Paris  |