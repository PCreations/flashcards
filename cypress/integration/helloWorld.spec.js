describe("helloWorld", () => {
  it("display hello world from the server", () => {
    cy.visit("/");
    cy.findByText(/hello world/i);
  });
});
