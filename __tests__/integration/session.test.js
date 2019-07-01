const request = require("supertest");
const app = require("../../src/app");

const { User } = require("../../src/app/models");

describe("Authentication", () => {
  it("should be able to authentication with valid credentials", async () => {
    const user = await User.create({
      name: "Thiago",
      email: "thiagomoraisrj@gmail.com",
      password_hash: "123123"
    });

    const response = await request(app)
      .post("/sessions")
      .send({ email: "thiagomoraisrj@gmail.com", password: "123123" });

    expect(response.status).toBe(200);
  });
});
