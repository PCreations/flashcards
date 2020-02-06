describe("helloWorld", () => {
  it("display hello world from the server", () => {
    cy.visit("/");
    cy.login();
    cy.findByText("pcriulan+cypress@gmail.com");
    cy.findByText("Hello World from Firebase!");
  });
});
