const { expect } = require("chai");
const MockAdapter = require("axios-mock-adapter");
const api = require("../lib/api.ts").default;

describe("Frontend login API", () => {
  let mock;

  before(() => {
    mock = new MockAdapter(api);
  });
  after(() => {
    mock.restore();
  });

  it("resolves with a token on HTTP 200", async () => {
    mock.onPost("/api/auth/login").reply(200, { token: "abc123" });
    const response = await api.post("/api/auth/login", {
      email: "user@example.com",
      password: "hunter2",
    });
    expect(response.data).to.have.property("token", "abc123");
  });

  it("throws an error for HTTP 400", async () => {
    mock
      .onPost("/api/auth/login")
      .reply(400, { message: "Invalid credentials" });
    let err;
    try {
      await api.post("/api/auth/login", {
        email: "bad@example.com",
        password: "wrong",
      });
    } catch (e) {
      err = e;
    }
    expect(err).to.exist;
    expect(err.response.status).to.equal(400);
    expect(err.response.data).to.deep.equal({ message: "Invalid credentials" });
  });
});
