describe("View the flashcard list", () => {
  it("shows all the flashcards in each partition", () => {
    cy.fixture("flashcards.json").then(flashcardsByPartition => {
      cy.visit("/");
      cy.task("seedTestBox", { partitions: flashcardsByPartition });
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
