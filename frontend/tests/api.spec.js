const { expect } = require("chai");
const api = require("../lib/api.ts").default;

describe("API client", () => {
  it("exposes get and post methods", () => {
    expect(api).to.have.property("get").that.is.a("function");
    expect(api).to.have.property("post").that.is.a("function");
  });
});
