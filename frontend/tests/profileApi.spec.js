const { expect } = require("chai");
const MockAdapter = require("axios-mock-adapter");
const api = require("../lib/api.ts").default;

describe("Profile API", () => {
  let mock;
  const fakeToken = "tok_123";
  const payload = {
    name: "Alice",
    bio: "Hello world",
    avatarUrl: "https://example.com/avatar.png",
  };
  const headers = { Authorization: `Bearer ${fakeToken}` };

  before(() => {
    mock = new MockAdapter(api);
  });

  after(() => {
    mock.restore();
  });

  it("sends a PUT to /api/auth/me with the right payload and headers", async () => {
    // Match only URL + body
    mock
      .onPut("/api/auth/me", payload)
      .reply(200, { ...payload, email: "alice@example.com" });

    const response = await api.put("/api/auth/me", payload, { headers });
    expect(response.data).to.include(payload);
    expect(response.data.email).to.equal("alice@example.com");
  });

  it("throws when the server returns an error", async () => {
    // Match only URL + body for error
    mock
      .onPut("/api/auth/me", payload)
      .reply(500, { message: "Unexpected server error" });

    let caught;
    try {
      await api.put("/api/auth/me", payload, { headers });
    } catch (err) {
      caught = err;
    }

    expect(caught).to.exist;
    expect(caught.response.status).to.equal(500);
    expect(caught.response.data).to.deep.equal({
      message: "Unexpected server error",
    });
  });
});
