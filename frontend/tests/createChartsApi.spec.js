const { expect } = require("chai");
const MockAdapter = require("axios-mock-adapter");
const api = require("../lib/api.ts").default;

describe("Create Chart API", () => {
  let mock;
  const fakeToken = "jwt_456";

  before(() => {
    mock = new MockAdapter(api);
  });

  after(() => {
    mock.restore();
  });

  it("throws when the server returns an error (e.g. 500)", async () => {
    const payload = {
      title: "Broken Chart",
      prompt: "This will fail",
      isPublic: false,
    };

    mock.onPost("/api/charts", payload).reply(500, { message: "Server error" });

    let err;
    try {
      await api.post("/api/charts", payload, {
        headers: { Authorization: `Bearer ${fakeToken}` },
      });
    } catch (e) {
      err = e;
    }

    expect(err).to.exist;
    expect(err.response).to.have.property("status", 500);
    expect(err.response.data).to.deep.equal({ message: "Server error" });
  });
});
