describe("View the flashcard list", () => {
  it("shows all the flashcards in each partition", () => {
    cy.server({
      delay: 100
    });
    cy.fixture("flashcards.json")
      .as("flashcardsJSON")
      .then(flashcardsByPartition => {
        cy.route(
          "GET",
          `${Cypress.env("API_ROOT_URL")}/flashcards?boxId=test`,
          "@flashcardsJSON"
        ).as("getFlashcards");
        cy.visit("/");
        cy.wait(["@getFlashcards"]);
        cy.wrap(flashcardsByPartition).each((flashcards, partitionIndex) => {
          cy.findByText(new RegExp(`partition ${partitionIndex + 1}`, "i"))
            .parent()
            .within(() => {
              cy.wrap(flashcards).each(({ question }) => {
                cy.findByText(question);
              });
            });
        });
      });
  });
});
