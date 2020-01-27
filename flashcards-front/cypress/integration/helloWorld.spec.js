describe("helloWorld", () => {
  it("display hello world from the server", () => {
    cy.visit("/");
    cy.login({ email: "pcriulan+cypress@gmail.com", password: "cypress" });
    cy.findByText("pcriulan+cypress@gmail.com");
    cy.findByText(/hello world/i);
  });
});
