Feature: Starting a session

  As a player
  I want to start a session for a specific box
  So I can review the flashcards in it

  Scenario: Starting the first session for a given box
    Given the current player id is player42
    And the current player has a box named Capitals of the World containing flashcards:
      | partition | question  | answer    |
      | 1         | England   | London    |
      | 1         | Australia | Canberra  |
      | 2         | Belgium   | Brussels  |
      | 3         | France    | Paris     |
      | 4         | Germany   | Berlin    |
      | 5         | Island    | Reykjavik |
    And the current player has never played the box Capitals of the World before
    When the current player starts a session for the box Capitals of the World
    Then the flashcards to review should be
      | question  | answer   |
      | England   | London   |
      | Australia | Canberra |