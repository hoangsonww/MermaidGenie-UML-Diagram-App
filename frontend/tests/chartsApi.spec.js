const { expect } = require("chai");
const MockAdapter = require("axios-mock-adapter");
const api = require("../lib/api.ts").default;

describe("Charts API", () => {
  let mock;
  const fakeToken = "fake_jwt_token";

  before(() => {
    mock = new MockAdapter(api);
  });

  after(() => {
    mock.restore();
  });

  it("fetches charts successfully when authenticated", async () => {
    const charts = [
      { _id: "1", title: "Flow", isPublic: true },
      { _id: "2", title: "Sequence", isPublic: false },
    ];

    // mock GET /api/charts with header check
    mock
      .onGet("/api/charts", undefined, {
        Authorization: `Bearer ${fakeToken}`,
      })
      .reply(200, charts);

    const response = await api.get("/api/charts", {
      headers: { Authorization: `Bearer ${fakeToken}` },
    });

    expect(response).to.have.property("data").that.deep.equals(charts);
  });

  it("throws when the server returns an error (e.g. 401)", async () => {
    mock.onGet("/api/charts").reply(401, { message: "Unauthorized" });

    let err;
    try {
      await api.get("/api/charts", {
        headers: { Authorization: `Bearer invalid` },
      });
    } catch (e) {
      err = e;
    }

    expect(err).to.exist;
    expect(err.response).to.have.property("status", 401);
    expect(err.response.data).to.deep.equal({ message: "Unauthorized" });
  });

  it("throws if no token is provided", async () => {
    mock.onGet("/api/charts").reply(400, { message: "Token missing" });

    let err;
    try {
      await api.get("/api/charts");
    } catch (e) {
      err = e;
    }

    expect(err).to.exist;
    expect(err.response.status).to.equal(400);
    expect(err.response.data).to.deep.equal({ message: "Token missing" });
  });
});
