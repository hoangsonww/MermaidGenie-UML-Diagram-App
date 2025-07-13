const {
  createChart,
  listCharts,
  getChart,
  regenerateChart,
  updateChart,
} = require("../src/controllers/chartController");

describe("Chart Controller handlers", () => {
  test("createChart is defined", () => {
    expect(typeof createChart).toBe("function");
  });

  test("listCharts is defined", () => {
    expect(typeof listCharts).toBe("function");
  });

  test("getChart is defined", () => {
    expect(typeof getChart).toBe("function");
  });

  test("regenerateChart is defined", () => {
    expect(typeof regenerateChart).toBe("function");
  });

  test("updateChart is defined", () => {
    expect(typeof updateChart).toBe("function");
  });
});
