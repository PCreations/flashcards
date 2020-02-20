describe("session", () => {
  it("a user should be able to notify her answer to the sessions flashcards and see her session's score", () => {
    cy.fixture("sessionFlashcards.json").then(flashcards => {
      cy.server({
        delay: 100
      });
      cy.route(
        `${Cypress.env("API_ROOT_URL")}/session-flashcards?boxId=test`,
        flashcards
      ).as("sessionFlashcards");

      cy.visit("/");

      cy.findByText(/start session/i).click();

      // the score is initially 0
      cy.findByText(/score: 0/i);

      cy.wait("@sessionFlashcards");

      // the first flashcard question is shown
      cy.findByText(flashcards[0].flashcard.question);

      // the user wants to see the answer
      cy.findByText(/show answer/i).click();
      cy.findByText(flashcards[0].flashcard.answer);

      // the user gave the right answer
      cy.findByText(/i was right/i).click();

      // the score is now 1
      cy.findByText(/score: 1/i);

      // the second flashcard question is shown
      cy.findByText(flashcards[1].flashcard.question);

      // the user wants to see the answer
      cy.findByText(/show answer/i).click();
      cy.findByText(flashcards[1].flashcard.answer);

      // the user gave the right answer
      cy.findByText(/i was right/i).click();

      // the score is now 2
      cy.findByText(/score: 2/i);

      // the last flashcard question is shown
      cy.findByText(flashcards[2].flashcard.question);

      // the user wants to see the answer
      cy.findByText(/show answer/i).click();
      cy.findByText(flashcards[2].flashcard.answer);

      // the user gave the wrong answer
      cy.findByText(/i was wrong/i).click();

      // the score is still 2 and the session is over
      cy.findByText(/score: 2/i);
      cy.findByText(/back to flashcard list/i).click();

      // TODO: the first and the second flashcard has now moved to the second partition
    });
  });
});
