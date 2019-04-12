@loggedIn
Feature: Starting a session for a specific box

  As Pierre, the player
  I want to start a session for a specific box
  So I can review the selected flashcards

  Rule: deck of flashcards should be picked from the selected box, by following the Leitner schedule
  Rule: if a player missed one or many sessions, the deck must contain flashcards from missed sessions in addition to flashcards scheduled for today's session

  Scenario Outline: The current player starts the session <sessionNumber> for his box "Capitals of the World"
    Given a box named "Capitals of the World" containing the following flashcards:
      | partition | id  | question                                | answer     |
      | 1         | aaa | What's the capital of France ?          | Paris      |
      | 1         | bbb | What's the capital of Italy ?           | Roma       |
      | 2         | ccc | What's the capital of the Netherlands ? | Amsterdam  |
      | 2         | ddd | What's the capital of Norway ?          | Oslo       |
      | 2         | eee | What's the capital of Croatia ?         | Zagreb     |
      | 3         | fff | What's the capital of Finland ?         | Helsinki   |
      | 4         | ggg | What's the capital of Sweden ?          | Stockholm  |
      | 4         | hhh | What's the capital of Hungary ?         | Budapest   |
      | 5         | iii | What's the capital of Luxembourg ?      | Luxembourg |
      | 6         | jjj | What's the capital of Spain ?           | Madrid     |
      | 6         | kkk | What's the capital of Denmark ?         | Copenhagen |
      | 7         | lll | What's the capital of Russia ?          | Moscow     |
    And the next session of the box "Capitals of the World" is <sessionNumber>
    When the current player starts the session for the box "Capitals of the World"
    Then the session deck for the box "Capitals of the World" should contain flashcards from partitions <partitions>

    Examples:
      | sessionNumber | partitions |
      | 1             | 2,1        |
      | 2             | 3,1        |
      | 3             | 2,1        |
      | 4             | 4,1        |
      | 5             | 2,1        |
      | 6             | 3,1        |
      | 7             | 2,1        |
      | 8             | 1          |
      | 9             | 2,1        |
      | 10            | 3,1        |
      | 11            | 2,1        |
      | 12            | 5,1        |
      | 13            | 4,2,1      |
      | 14            | 3,1        |
      | 15            | 2,1        |
      | 16            | 1          |
      | 17            | 2,1        |
      | 18            | 3,1        |
      | 19            | 2,1        |
      | 20            | 4,1        |
      | 21            | 2,1        |
      | 22            | 3,1        |
      | 23            | 2,1        |
      | 24            | 6,1        |
      | 25            | 2,1        |
      | 26            | 3,1        |
      | 27            | 2,1        |
      | 28            | 5,1        |
      | 29            | 4,2,1      |
      | 30            | 3,1        |
      | 31            | 2,1        |
      | 32            | 1          |
      | 33            | 2,1        |
      | 34            | 3,1        |
      | 35            | 2,1        |
      | 36            | 4,1        |
      | 37            | 2,1        |
      | 38            | 3,1        |
      | 39            | 2,1        |
      | 40            | 1          |
      | 41            | 2,1        |
      | 42            | 3,1        |
      | 43            | 2,1        |
      | 44            | 5,1        |
      | 45            | 4,2,1      |
      | 46            | 3,1        |
      | 47            | 2,1        |
      | 48            | 1          |
      | 49            | 2,1        |
      | 50            | 3,1        |
      | 51            | 2,1        |
      | 52            | 4,1        |
      | 53            | 2,1        |
      | 54            | 3,1        |
      | 55            | 2,1        |
      | 56            | 7,1        |
      | 57            | 2,1        |
      | 58            | 3,1        |
      | 59            | 6,2,1      |
      | 60            | 5,1        |
      | 61            | 4,2,1      |
      | 62            | 3,1        |
      | 63            | 2,1        |
      | 64            | 1          |

  Scenario Outline: The current player starts session <nextSessionNumber> and his last completed session was <lastCompletedSession>
    Given a box named "Capitals of the World" containing the following flashcards:
      | partition | id  | question                                | answer     |
      | 1         | aaa | What's the capital of France ?          | Paris      |
      | 1         | bbb | What's the capital of Italy ?           | Roma       |
      | 2         | ccc | What's the capital of the Netherlands ? | Amsterdam  |
      | 2         | ddd | What's the capital of Norway ?          | Oslo       |
      | 2         | eee | What's the capital of Croatia ?         | Zagreb     |
      | 3         | fff | What's the capital of Finland ?         | Helsinki   |
      | 4         | ggg | What's the capital of Sweden ?          | Stockholm  |
      | 4         | hhh | What's the capital of Hungary ?         | Budapest   |
      | 5         | hhh | What's the capital of Luxembourg ?      | Luxembourg |
      | 6         | iii | What's the capital of Spain ?           | Madrid     |
      | 6         | jjj | What's the capital of Denmark ?         | Copenhagen |
      | 7         | kkk | What's the capital of Russia ?          | Moscow     |
    And the next session of the box "Capitals of the World" is <nextSessionNumber>
    And the current player last completed session was <lastCompletedSession> for the box "Capitals of the World"
    When the current player starts the session for the box "Capitals of the World"
    Then the session deck for the box "Capitals of the World" should contain flashcards from partitions <partitions>

    Examples:
      | nextSessionNumber | lastCompletedSession | partitions  |
      | 1                 | 0                    | 2,1         |
      | 2                 | 0                    | 3,2,1       |
      | 34                | 24                   | 6,5,4,3,2,1 |
      | 58                | 55                   | 7,3,2,1     |