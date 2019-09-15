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
    And today is 2019-09-15
    When the current player starts a session for the box Capitals of the World
    Then the flashcards to review for the current player's box Capitals of the World should be:
      | question  | answer   |
      | England   | London   |
      | Australia | Canberra |
    And the current player box's Capitals of the World should be marked as started the 2019-09-15