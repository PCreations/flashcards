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

  Scenario: Starting a session for an already started box
    Given the current player id is player42
    And the current player has a box named Capitals of the World containing flashcards:
      | partition | question  | answer    |
      | 1         | England   | London    |
      | 1         | Australia | Canberra  |
      | 2         | Belgium   | Brussels  |
      | 3         | France    | Paris     |
      | 4         | Germany   | Berlin    |
      | 5         | Island    | Reykjavik |
    And the current player has completed the first session of the box Capitals of the World the 2019-09-15
    And the current player has completed the last session of the box Capitals of the World the 2019-09-16
    And today is 2019-09-17
    When the current player starts a session for the box Capitals of the World
    Then the flashcards to review for the current player's box Capitals of the World should be:
      | question | answer |
      | England  | London |
      | France   | Paris  |

  Scenario: Starting a session for a given box while having missed some previous sessions
    Given the current player id is player42
    And the current player has a box named Capitals of the World containing flashcards:
      | partition | question  | answer    |
      | 1         | England   | London    |
      | 1         | Australia | Canberra  |
      | 2         | Belgium   | Brussels  |
      | 3         | France    | Paris     |
      | 4         | Germany   | Berlin    |
      | 5         | Island    | Reykjavik |
    And the current player has completed the first session of the box Capitals of the World the 2019-09-15
    And the current player has completed the last session of the box Capitals of the World the 2019-09-16
    And today is 2019-09-19
    When the current player starts a session for the box Capitals of the World
    # the flashcards should be taken from today's session + missing sessions
    # player has missed the sessions 3 and 4, and today is the session 5
    # so we need to pick flashcards from partition 1, 3 + 1, 2, 4 + 1, 5
    # => all partitions, order = 1 3 2 4 5
    Then the flashcards to review for the current player's box Capitals of the World should be:
      | question  | answer    |
      | England   | London    |
      | Australia | Canberra  |
      | France    | Paris     |
      | Belgium   | Brussels  |
      | Germany   | Berlin    |
      | Island    | Reykjavik |