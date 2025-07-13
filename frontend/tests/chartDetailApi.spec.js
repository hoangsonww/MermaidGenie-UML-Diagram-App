const { expect } = require("chai");
const MockAdapter = require("axios-mock-adapter");
const api = require("../lib/api.ts").default;

describe("ChartDetail API calls", () => {
  let mock;
  const chartId = "chart123";
  const token = "jwt_token";

  before(() => {
    mock = new MockAdapter(api);
  });
  after(() => {
    mock.restore();
  });

  it("GET /api/charts/:id should fetch a chart", async () => {
    const chart = {
      _id: chartId,
      title: "Test",
      prompt: "p",
      mermaidCode: "code",
      isPublic: false,
    };
    mock
      .onGet(`/api/charts/${chartId}`, undefined, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .reply(200, chart);

    const res = await api.get(`/api/charts/${chartId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.data).to.deep.equal(chart);
  });

  it("should throw on server error", async () => {
    mock
      .onPost(`/api/charts/${chartId}/regenerate`)
      .reply(500, { message: "Oops" });

    let err;
    try {
      await api.post(
        `/api/charts/${chartId}/regenerate`,
        { prompt: "x" },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (e) {
      err = e;
    }
    expect(err).to.exist;
    expect(err.response.status).to.equal(500);
    expect(err.response.data).to.deep.equal({ message: "Oops" });
  });
});
