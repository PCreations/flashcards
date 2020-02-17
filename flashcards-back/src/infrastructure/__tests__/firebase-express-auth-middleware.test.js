const request = require("supertest");
const express = require("express");
const {
  createFirebaseExpressAuthMiddleware
} = require("../firebase-express-auth-middleware");

describe.skip("firebaseExpressAuthMiddleware", () => {
  it("should verify the id token from the authorization token", async () => {
    const app = express();
    const verifyIdToken = jest
      .fn()
      .mockResolvedValueOnce("some validated token");
    const firebaseAuth = {
      verifyIdToken
    };
    const firebaseExpressAuthMiddleware = createFirebaseExpressAuthMiddleware(
      firebaseAuth
    );
    app.use(firebaseExpressAuthMiddleware);
    app.get("/", (_, res) => res.json({ test: "ok" }));
    const response = await request(app)
      .get("/")
      .set("authorization", "some valid client token");

    expect(verifyIdToken).toHaveBeenCalledWith("some valid client token");
    expect(response.statusCode).toBe(200);
  });
  it("should send 403 status if token is not verified", async () => {
    const app = express();
    const verifyIdToken = jest.fn().mockRejectedValueOnce("invalid token");
    const firebaseAuth = {
      verifyIdToken
    };
    const firebaseExpressAuthMiddleware = createFirebaseExpressAuthMiddleware(
      firebaseAuth
    );
    app.use(firebaseExpressAuthMiddleware);

    const response = await request(app)
      .get("/")
      .set("authorization", "some invalid client token");

    expect(verifyIdToken).toHaveBeenCalledWith("some invalid client token");
    expect(response.statusCode).toBe(403);
  });
});
