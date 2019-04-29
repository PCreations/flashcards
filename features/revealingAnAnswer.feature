@loggedIn
Feature: Revealing the answer of the flashcard currently reviewed

  As Pierre, the player
  I want to reveal the answer of the flashcard I'm reviewing
  So I can see If I knew the answer or not

  Scenario: The player reveals the answer for the flashcard he is reviewing
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
    When the player reveals the answer of the current reviewed flashcard for the box "Capitals of the World"
    Then the answer of the current reviewed flashcard for the box "Capitals of the World" should be "Amsterdam"