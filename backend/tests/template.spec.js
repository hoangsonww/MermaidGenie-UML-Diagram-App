const {
  listChartTemplates,
  createChartFromTemplate,
} = require("../src/controllers/templateController");

describe("Template Controller handlers", () => {
  test("listChartTemplates is defined", () => {
    expect(typeof listChartTemplates).toBe("function");
  });

  test("createChartFromTemplate is defined", () => {
    expect(typeof createChartFromTemplate).toBe("function");
  });
});
