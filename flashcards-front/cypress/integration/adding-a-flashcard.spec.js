describe("Adding a flashcard", () => {
  it("should add a flashcard with the given question and answer in the first partition", () => {
    cy.login();
    cy.visit("/");
    cy.findByText(/^add a flashcard$/i).click();
    cy.findByPlaceholderText(/question/).type(
      "What is the hottest planet of our solar system ?"
    );
    cy.findByPlaceholderText(/answer/).type("Venus");
    cy.findByText(/^add$/i).click();
    cy.findByText(/partition 1/i).within(() => {
      cy.findByText("What is the hottest planet of our solar system ?");
    });
  });
});
