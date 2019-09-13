Feature: Adding a flashcard in a box

  As a player
  I want to add a flashcard to a box
  So I can review it later

  Scenario: Adding a flashcard in a new box
    Given the current player player42
    And the current player has no box named Capitals of the World
    When the current player wants to add a flashcard in the box Capitals of the World:
      | question | answer |
      | France   | Paris  |
    Then the current player's box Capitals of the World should contain in its first partition the flashcard:
      | question | answer |
      | France   | Paris  |