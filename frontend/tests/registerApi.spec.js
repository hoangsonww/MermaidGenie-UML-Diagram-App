const { expect } = require("chai");
const MockAdapter = require("axios-mock-adapter");
const api = require("../lib/api.ts").default;

describe("Register API", () => {
  let mock;

  before(() => {
    mock = new MockAdapter(api);
  });

  after(() => {
    mock.restore();
  });

  it("posts to /api/auth/register and returns a token on success", async () => {
    const payload = {
      name: "Charlie",
      email: "charlie@example.com",
      password: "secret123",
      bio: "I draw diagrams.",
      avatarUrl: "https://example.com/charlie.png",
    };

    mock.onPost("/api/auth/register", payload).reply(201, { token: "tok_xyz" });

    const res = await api.post("/api/auth/register", payload);
    expect(res).to.have.property("status", 201);
    expect(res.data).to.have.property("token", "tok_xyz");
  });

  it("handles 400 if email already in use", async () => {
    const payload = {
      name: "Dana",
      email: "dana@example.com",
      password: "password",
      bio: "",
      avatarUrl: "",
    };

    mock
      .onPost("/api/auth/register", payload)
      .reply(400, { message: "Email already in use" });

    let err;
    try {
      await api.post("/api/auth/register", payload);
    } catch (e) {
      err = e;
    }

    expect(err).to.exist;
    expect(err.response).to.have.property("status", 400);
    expect(err.response.data).to.deep.equal({
      message: "Email already in use",
    });
  });
});
