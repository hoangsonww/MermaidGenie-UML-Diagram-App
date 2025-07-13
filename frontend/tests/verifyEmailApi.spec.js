const { expect } = require("chai");
const MockAdapter = require("axios-mock-adapter");
const api = require("../lib/api.ts").default;

describe("Verify Email API", () => {
  let mock;

  before(() => {
    mock = new MockAdapter(api);
  });

  after(() => {
    mock.restore();
  });

  it("returns exists=true when server says email is registered", async () => {
    const email = "user@example.com";
    mock
      .onPost("/api/auth/verify-email", { email })
      .reply(200, { exists: true });

    const response = await api.post("/api/auth/verify-email", { email });
    expect(response).to.have.property("data");
    expect(response.data).to.deep.equal({ exists: true });
  });

  it("returns exists=false when server says email is not found", async () => {
    const email = "missing@example.com";
    mock
      .onPost("/api/auth/verify-email", { email })
      .reply(200, { exists: false });

    const res = await api.post("/api/auth/verify-email", { email });
    expect(res.data).to.deep.equal({ exists: false });
  });

  it("throws on HTTP 400 if no email provided", async () => {
    mock
      .onPost("/api/auth/verify-email")
      .reply(400, { message: "Email is required" });

    let err;
    try {
      await api.post("/api/auth/verify-email", {});
    } catch (e) {
      err = e;
    }

    expect(err).to.exist;
    expect(err.response.status).to.equal(400);
    expect(err.response.data).to.deep.equal({ message: "Email is required" });
  });
});
