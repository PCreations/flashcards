@loggedIn
Feature: Notifying the answer given for the flashcard currently reviewed

  As Pierre, the player
  I want to notify if my answer was wrong or right after seeing the answer of the flashcard I was reviewing
  So I can see my new score and review the next flashcard

  Background: The box "Capitals of the World" for the current player exists
    Given a box named "Capitals of the World" containing the following flashcards:
      | partition | question                                | answer     |
      | 1         | What's the capital of France ?          | Paris      |
      | 1         | What's the capital of Italy ?           | Roma       |
      | 2         | What's the capital of the Netherlands ? | Amsterdam  |
      | 2         | What's the capital of Norway ?          | Oslo       |
      | 2         | What's the capital of Croatia ?         | Zagreb     |
      | 3         | What's the capital of Finland ?         | Helsinki   |
      | 4         | What's the capital of Sweden ?          | Stockholm  |
      | 4         | What's the capital of Hungary ?         | Budapest   |
      | 5         | What's the capital of Luxembourg ?      | Luxembourg |
      | 6         | What's the capital of Spain ?           | Madrid     |
      | 6         | What's the capital of Denmark ?         | Copenhagen |
      | 7         | What's the capital of Russia ?          | Moscow     |

  Scenario: The player notifies a good answer for a card from the second partition
    Given a box named "Capitals of the World" containing the following flashcards:
      | partition | question                                | answer     |
      | 1         | What's the capital of France ?          | Paris      |
      | 1         | What's the capital of Italy ?           | Roma       |
      | 2         | What's the capital of the Netherlands ? | Amsterdam  |
      | 2         | What's the capital of Norway ?          | Oslo       |
      | 2         | What's the capital of Croatia ?         | Zagreb     |
      | 3         | What's the capital of Finland ?         | Helsinki   |
      | 4         | What's the capital of Sweden ?          | Stockholm  |
      | 4         | What's the capital of Hungary ?         | Budapest   |
      | 5         | What's the capital of Luxembourg ?      | Luxembourg |
      | 6         | What's the capital of Spain ?           | Madrid     |
      | 6         | What's the capital of Denmark ?         | Copenhagen |
      | 7         | What's the capital of Russia ?          | Moscow     |
    And the flashcards to review for the current session of the box "Capitals of the World" are taken from partitions "2,1"
    And the flashcard question to review for the box "Capitals of the World" is "What's the capital of the Netherlands ?"
    And the current score for the box "Capitals of the World" is 0
    When the player notifies a good answer for the current reviewed flashcard for the box "Capitals of the World"
    Then the current score for the box "Capitals of the World" should be 1
    And the currently reviewed flashcard for the box "Capitals of the World" should now be at the end of the partition 3
    And the flashcard question to review for the box "Capitals of the World" should be "What's the capital of Norway ?"

  Scenario: The player notifies a wrong answer for a card from the second partition
    Given a box named "Capitals of the World" containing the following flashcards:
      | partition | question                                | answer     |
      | 1         | What's the capital of France ?          | Paris      |
      | 1         | What's the capital of Italy ?           | Roma       |
      | 2         | What's the capital of the Netherlands ? | Amsterdam  |
      | 2         | What's the capital of Norway ?          | Oslo       |
      | 2         | What's the capital of Croatia ?         | Zagreb     |
      | 3         | What's the capital of Finland ?         | Helsinki   |
      | 4         | What's the capital of Sweden ?          | Stockholm  |
      | 4         | What's the capital of Hungary ?         | Budapest   |
      | 5         | What's the capital of Luxembourg ?      | Luxembourg |
      | 6         | What's the capital of Spain ?           | Madrid     |
      | 6         | What's the capital of Denmark ?         | Copenhagen |
      | 7         | What's the capital of Russia ?          | Moscow     |
    And the flashcards to review for the current session of the box "Capitals of the World" are taken from partitions "2,1"
    And the flashcard question to review for the box "Capitals of the World" is "What's the capital of the Netherlands ?"
    And the current score for the box "Capitals of the World" is 0
    When the player notifies a wrong answer for the current reviewed flashcard for the box "Capitals of the World"
    Then the current score for the box "Capitals of the World" should be 0
    And the currently reviewed flashcard for the box "Capitals of the World" should now be at the end of the partition 1
    And the flashcard question to review for the box "Capitals of the World" should be "What's the capital of Norway ?"

  Scenario: The player notifies a good answer for a card from the seventh partition
    Given a box named "Capitals of the World" containing the following flashcards:
      | partition | question                                | answer     |
      | 1         | What's the capital of France ?          | Paris      |
      | 1         | What's the capital of Italy ?           | Roma       |
      | 2         | What's the capital of the Netherlands ? | Amsterdam  |
      | 2         | What's the capital of Norway ?          | Oslo       |
      | 2         | What's the capital of Croatia ?         | Zagreb     |
      | 3         | What's the capital of Finland ?         | Helsinki   |
      | 4         | What's the capital of Sweden ?          | Stockholm  |
      | 4         | What's the capital of Hungary ?         | Budapest   |
      | 5         | What's the capital of Luxembourg ?      | Luxembourg |
      | 6         | What's the capital of Spain ?           | Madrid     |
      | 6         | What's the capital of Denmark ?         | Copenhagen |
      | 7         | What's the capital of Russia ?          | Moscow     |
    And the flashcards to review for the current session of the box "Capitals of the World" are taken from partitions "7,1"
    And the flashcard question to review for the box "Capitals of the World" is "What's the capital of Russia ?"
    When the player notifies a good answer for the current reviewed flashcard for the box "Capitals of the World"
    Then the currently reviewed flashcard for the box "Capitals of the World" should now be archived
    And the flashcard question to review for the box "Capitals of the World" should be "What's the capital of France ?"