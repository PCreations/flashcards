describe("Adding a flashcard", () => {
  it("should add a flashcard with the given question and answer in the first partition", () => {
    cy.fixture("flashcards.json").then(flashcardsByPartitions => {
      cy.task("seedTestBox", { partitions: flashcardsByPartitions });
      cy.login();
      cy.visit("/");

      cy.findByText(/^add a flashcard$/i).click();
      cy.findByPlaceholderText(/question/).type(
        "What planet was once considered the nith planet of our solar system ?"
      );
      cy.findByPlaceholderText(/answer/).type("Pluto");
      cy.findByText(/^add$/i).click();

      cy.findByText(/partition 1/i)
        .parent()
        .within(() => {
          cy.findByText(
            "What planet was once considered the nith planet of our solar system ?"
          );
        });
    });
  });
});
