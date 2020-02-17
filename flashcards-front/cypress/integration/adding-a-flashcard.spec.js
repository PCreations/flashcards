describe("Adding a flashcard", () => {
  it("should add a flashcard with the given question and answer in the first partition", () => {
    cy.server({
      delay: 100
    });
    cy.fixture("flashcards.json").as("flashcardsJSON");
    cy.route(
      "GET",
      `${Cypress.env("API_ROOT_URL")}/flashcards?boxId=test`,
      "@flashcardsJSON"
    ).as("getFlashcards");

    cy.fixture("flashcards.json")
      .as("flashcardsJSON")
      .then(flashcardsByPartition => {
        cy.route({
          method: "POST",
          url: `${Cypress.env("API_ROOT_URL")}/flaschards`,
          onRequest(req) {
            const { flashcard } = req.body;
            flashcardsByPartition[0] = flashcardsByPartition[0].concat({
              id: "9",
              ...flashcard
            });
          },
          onResponse() {
            return flashcardsByPartition;
          }
        }).as("postFlashcard");
      });

    cy.login();
    cy.visit("/");
    cy.wait(["@getFlashcards"]);

    cy.findByText(/^add a flashcard$/i).click();
    cy.findByPlaceholderText(/question/).type(
      "What is the hottest planet of our solar system ?"
    );
    cy.findByPlaceholderText(/answer/).type("Venus");
    cy.findByText(/^add$/i).click();
    cy.wait(["@postFlashcard"]);

    cy.findByText(/partition 1/i)
      .parent()
      .within(() => {
        cy.findByText("What is the hottest planet of our solar system ?");
      });
  });
});
