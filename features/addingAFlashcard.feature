Feature: Adding a flashcard in a box

  As a player
  I want to add a flashcard to a box
  So I can review it later

  Scenario: Adding a flashcard in a new box
    Given the current player id is player42
    And the current player has no box named Capitals of the World
    When the current player wants to add a flashcard in the box Capitals of the World:
      | question | answer |
      | France   | Paris  |
    Then the current player's box Capitals of the World should contain in its first partition the flashcards:
      | question | answer |
      | France   | Paris  |

  Scenario: Adding a flashcard in an already existing box with a not empty first partition
    Given the current player id is player42
    And the current player has box named Capitals of the World containing flashcards:
      | partition | question  | answer   |
      | 1         | England   | London   |
      | 1         | Australia | Canberra |
    When the current player wants to add a flashcard in the box Capitals of the World:
      | question | answer |
      | France   | Paris  |
    Then the current player's box Capitals of the World should contain in its first partition the flashcards:
      | question  | answer   |
      | England   | London   |
      | Australia | Canberra |
      | France    | Paris    |

  Scenario: Adding a flashcard with the same question than an other flashcard already in the box
    Given the current player id is player42
    And the current player has box named Capitals of the World containing flashcards:
      | partition | question  | answer   |
      | 1         | England   | London   |
      | 1         | Australia | Canberra |
      | 2         | Belgium   | Brussels |
      | 3         | France    | Paris    |
      | 4         | Germany   | Berlin   |
    When the current player wants to add a flashcard in the box Capitals of the World:
      | question | answer |
      | France   | Paris  |
    Then the current player's box Capitals of the World should contain in its first partition the flashcards:
      | question  | answer   |
      | England   | London   |
      | Australia | Canberra |
    And an error should be returned to inform the player this flashcard is already in the box