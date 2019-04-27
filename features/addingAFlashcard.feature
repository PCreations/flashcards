@loggedIn
Feature: Adding a flashcard to a box

  As Pierre, the player
  I want to add a flashcard in a specific box
  So that I can later review the knowldege associated with this flashcard

  Rule: Flashcard is added to the first partition of the box, at the end of the stack

  Scenario: The box exists and its first partition is not empty
    Given a box named "Capitals of the World" containing the following flashcards:
      | partition | question                         | answer   |
      | 1         | What is the capital of France ?  | Paris    |
      | 1         | What is the capital of Belgium ? | Brussels |
    When the current player adds the following flashcard in his box named "Capitals of the World":
      | question                           | answer   |
      | What is the capital of Australia ? | Canberra |
    Then the flashcards in the first partition of his box named "Capitals of the World" should be:
      | question                           | answer   |
      | What is the capital of France ?    | Paris    |
      | What is the capital of Belgium ?   | Brussels |
      | What is the capital of Australia ? | Canberra |

  Scenario: A box with the same name has already been created by an other player
    Given a box named "Capitals of the World" created by player of id "41" already exists with following flashcards in its first partition:
      | question                           | answer   |
      | What is the capital of Germany ?   | Berlin   |
      | What is the capital of Australia ? | Canberra |
    And a box named "Capitals of the World" for the current player does not exist
    When the current player adds the following flashcard in his box named "Capitals of the World":
      | question                        | answer |
      | What is the capital of France ? | Paris  |
    Then the flashcards in the first partition of his box named "Capitals of the World" should be:
      | question                        | answer |
      | What is the capital of France ? | Paris  |
    And the flashcards in the first partition of the box named "Capitals of the World" owned by the player of id "41" should be:
      | question                           | answer   |
      | What is the capital of Germany ?   | Berlin   |
      | What is the capital of Australia ? | Canberra |


  Scenario: The box exists and its first partition is empty
    Given the box named "Capitals of the World" does not contain any flashcard in its first partition
    When the current player adds the following flashcard in his box named "Capitals of the World":
      | question                           | answer   |
      | What is the capital of Australia ? | Canberra |

    Then the flashcards in the first partition of his box named "Capitals of the World" should be:
      | question                           | answer   |
      | What is the capital of Australia ? | Canberra |

  Scenario: The box does not exist yet
    Given the box named "Capitals of the World" does not exist yet
    When the current player adds the following flashcard in his box named "Capitals of the World":
      | question                           | answer   |
      | What is the capital of Australia ? | Canberra |
    Then the flashcards in the first partition of his box named "Capitals of the World" should be:
      | question                           | answer   |
      | What is the capital of Australia ? | Canberra |
