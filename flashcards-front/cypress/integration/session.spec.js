describe("session", () => {
  it("a user should be able to notify her answer to the sessions flashcards and see her session's score", () => {
    cy.fixture("flashcards.json").then(flashcardsByPartition => {
      cy.server({
        delay: 100
      });

      cy.task("seedTestBox", {
        partitions: flashcardsByPartition,
        sessionDay: 2
      });

      cy.route(
        `${Cypress.env(
          "API_ROOT_URL"
        )}/submit-answer?boxId=test&flashcardId=1&right=1`
      ).as("submitRightAnswerFlashcard1");

      cy.route(
        `${Cypress.env(
          "API_ROOT_URL"
        )}/submit-answer?boxId=test&flashcardId=2&right=1`
      ).as("submitRightAnswerFlashcard2");

      cy.route(
        `${Cypress.env(
          "API_ROOT_URL"
        )}/submit-answer?boxId=test&flashcardId=3&right=0`
      ).as("submitWrongAnswerFlashcard3");

      cy.visit("/");

      cy.findByText(/start session/i).click();

      // the score is initially 0
      cy.findByText(/score: 0/i);

      // the first flashcard question is shown
      cy.findByText(flashcardsByPartition[0][0].question);

      // the user wants to see the answer
      cy.findByText(/show answer/i).click();
      cy.findByText(flashcardsByPartition[0][0].answer);

      // the user gave the right answer
      cy.findByText(/i was right/i).click();
      cy.wait("@submitRightAnswerFlashcard1");

      // the score is now 1
      cy.findByText(/score: 1/i);

      // the second flashcard question is shown
      cy.findByText(flashcardsByPartition[0][1].question);

      // the user wants to see the answer
      cy.findByText(/show answer/i).click();
      cy.findByText(flashcardsByPartition[0][1].answer);

      // the user gave the right answer
      cy.findByText(/i was right/i).click();
      cy.wait("@submitRightAnswerFlashcard2");

      // the score is now 2
      cy.findByText(/score: 2/i);

      // the last flashcard question is shown
      cy.findByText(flashcardsByPartition[1][0].question);

      // the user wants to see the answer
      cy.findByText(/show answer/i).click();

      cy.findByText(flashcardsByPartition[1][0].answer);

      // the user gave the wrong answer
      cy.findByText(/i was wrong/i).click();
      cy.wait("@submitWrongAnswerFlashcard3");

      // the score is still 2 and the session is over
      cy.findByText(/session over/i);
      cy.findByText(/score: 2/i);
      cy.findByText(/back to flashcard list/i).click();

      // the user is back on the partitions list
      cy.findAllByText(/partition/i);

      // the third flashcard was not answered correctly and should be back in partition 1
      cy.findByText(new RegExp(`partition 1`, "i"))
        .parent()
        .within(() => {
          cy.findByText(flashcardsByPartition[1][0].question);
        });

      // the first and second flashcard was answered correctly and thus should now be in partition 2
      cy.findByText(new RegExp(`partition 2`, "i"))
        .parent()
        .within(() => {
          cy.findByText(flashcardsByPartition[0][0].question);
          cy.findByText(flashcardsByPartition[0][1].question);
        });
    });
  });
});
