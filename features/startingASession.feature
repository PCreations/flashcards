@loggedIn
Feature: Starting a session for a specific box

  As Pierre, the player
  I want to start a session for a specific box
  So I can review the selected flashcards

  Rule: deck of flashcards should be picked from the selected box, by following the Leitner schedule
  Rule: if a player missed one or many sessions, the deck must contain flashcards from missed sessions in addition to flashcards scheduled for today's session

  Background: Box "Capitals of world" exists with some flashcards
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

  Scenario: The current player has never played the box "Capitals of the World"
    Given today is 2019-04-01
    When the current player starts the session for the box "Capitals of the World"
    Then the session deck for the box "Capitals of the World" should contain flashcards from partitions 2,1

  Scenario: The current player wants to play twice the same day the box "Capitals of the World" that he has already played before
    Given today is 2019-04-02
    And the current player has started the box "Capitals of the World" at 2019-04-01
    And the current player last played session for the box "Capitals of the World" was at 2019-04-01
    When the current player starts the session for the box "Capitals of the World"
    When the current player starts the session for the box "Capitals of the World"
    Then the session deck for the box "Capitals of the World" should contain flashcards from partitions 3,1

  Scenario Outline: The current player starts a session the <todaySessionDate> and hasn't missed the previous session for his box "Capitals of the World" started on 2019-04-01
    Given today is <todaySessionDate>
    And the current player has started the box "Capitals of the World" at 2019-04-01
    And the current player last played session for the box "Capitals of the World" was at <lastPlayedAt>
    When the current player starts the session for the box "Capitals of the World"
    Then the session deck for the box "Capitals of the World" should contain flashcards from partitions <partitions>

    Examples:
      | lastPlayedAt | todaySessionDate | partitions |
      | 2019-04-01   | 2019-04-02       | 3,1        |
      | 2019-04-02   | 2019-04-03       | 2,1        |
      | 2019-04-03   | 2019-04-04       | 4,1        |
      | 2019-04-04   | 2019-04-05       | 2,1        |
      | 2019-04-05   | 2019-04-06       | 3,1        |
      | 2019-04-06   | 2019-04-07       | 2,1        |
      | 2019-04-07   | 2019-04-08       | 1          |
      | 2019-04-08   | 2019-04-09       | 2,1        |
      | 2019-04-09   | 2019-04-10       | 3,1        |
      | 2019-04-10   | 2019-04-11       | 2,1        |
      | 2019-04-11   | 2019-04-12       | 5,1        |
      | 2019-04-12   | 2019-04-13       | 4,2,1      |
      | 2019-04-13   | 2019-04-14       | 3,1        |
      | 2019-04-14   | 2019-04-15       | 2,1        |
      | 2019-04-15   | 2019-04-16       | 1          |
      | 2019-04-16   | 2019-04-17       | 2,1        |
      | 2019-04-17   | 2019-04-18       | 3,1        |
      | 2019-04-18   | 2019-04-19       | 2,1        |
      | 2019-04-19   | 2019-04-20       | 4,1        |
      | 2019-04-20   | 2019-04-21       | 2,1        |
      | 2019-04-21   | 2019-04-22       | 3,1        |
      | 2019-04-22   | 2019-04-23       | 2,1        |
      | 2019-04-23   | 2019-04-24       | 6,1        |
      | 2019-04-24   | 2019-04-25       | 2,1        |
      | 2019-04-25   | 2019-04-26       | 3,1        |
      | 2019-04-26   | 2019-04-27       | 2,1        |
      | 2019-04-27   | 2019-04-28       | 5,1        |
      | 2019-04-28   | 2019-04-29       | 4,2,1      |
      | 2019-04-29   | 2019-04-30       | 3,1        |
      | 2019-04-30   | 2019-05-01       | 2,1        |
      | 2019-05-01   | 2019-05-02       | 1          |
      | 2019-05-02   | 2019-05-03       | 2,1        |
      | 2019-05-03   | 2019-05-04       | 3,1        |
      | 2019-05-04   | 2019-05-05       | 2,1        |
      | 2019-05-05   | 2019-05-06       | 4,1        |
      | 2019-05-06   | 2019-05-07       | 2,1        |
      | 2019-05-07   | 2019-05-08       | 3,1        |
      | 2019-05-08   | 2019-05-09       | 2,1        |
      | 2019-05-09   | 2019-05-10       | 1          |
      | 2019-05-10   | 2019-05-11       | 2,1        |
      | 2019-05-11   | 2019-05-12       | 3,1        |
      | 2019-05-12   | 2019-05-13       | 2,1        |
      | 2019-05-13   | 2019-05-14       | 5,1        |
      | 2019-05-14   | 2019-05-15       | 4,2,1      |
      | 2019-05-15   | 2019-05-16       | 3,1        |
      | 2019-05-16   | 2019-05-17       | 2,1        |
      | 2019-05-17   | 2019-05-18       | 1          |
      | 2019-05-18   | 2019-05-19       | 2,1        |
      | 2019-05-19   | 2019-05-20       | 3,1        |
      | 2019-05-20   | 2019-05-21       | 2,1        |
      | 2019-05-21   | 2019-05-22       | 4,1        |
      | 2019-05-22   | 2019-05-23       | 2,1        |
      | 2019-05-23   | 2019-05-24       | 3,1        |
      | 2019-05-24   | 2019-05-25       | 2,1        |
      | 2019-05-25   | 2019-05-26       | 7,1        |
      | 2019-05-26   | 2019-05-27       | 2,1        |
      | 2019-05-27   | 2019-05-28       | 3,1        |
      | 2019-05-28   | 2019-05-29       | 6,2,1      |
      | 2019-05-29   | 2019-05-30       | 5,1        |
      | 2019-05-30   | 2019-05-31       | 4,2,1      |
      | 2019-05-31   | 2019-06-01       | 3,1        |
      | 2019-06-01   | 2019-06-02       | 2,1        |
      | 2019-06-02   | 2019-06-03       | 1          |

  Scenario Outline: The current player starts a session the <todaySessionDate> while the last session was played at <lastPlayedAt> for his box "Capitals of the World" started on 2019-04-01
    Given today is <todaySessionDate>
    And the current player has started the box "Capitals of the World" at 2019-04-01
    And the current player last played session for the box "Capitals of the World" was at <lastPlayedAt>
    When the current player starts the session for the box "Capitals of the World"
    Then the session deck for the box "Capitals of the World" should contain flashcards from partitions <partitions>

    Examples:
      | lastPlayedAt | todaySessionDate | partitions  |
      | 2019-04-23   | 2019-05-04       | 6,5,4,3,2,1 |
      | 2019-05-25   | 2019-05-28       | 7,3,2,1     |
      | 2019-06-06   | 2019-06-07       | 4,1         |
      | 2019-05-28   | 2019-06-07       | 6,5,4,3,2,1 |