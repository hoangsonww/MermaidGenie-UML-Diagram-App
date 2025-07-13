const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  verifyEmail,
  resetPassword,
} = require("../src/controllers/authController");

describe("Auth Controller handlers", () => {
  test("register is defined", () => {
    expect(typeof register).toBe("function");
  });

  test("login is defined", () => {
    expect(typeof login).toBe("function");
  });

  test("getProfile is defined", () => {
    expect(typeof getProfile).toBe("function");
  });

  test("updateProfile is defined", () => {
    expect(typeof updateProfile).toBe("function");
  });

  test("changePassword is defined", () => {
    expect(typeof changePassword).toBe("function");
  });

  test("verifyEmail is defined", () => {
    expect(typeof verifyEmail).toBe("function");
  });

  test("resetPassword is defined", () => {
    expect(typeof resetPassword).toBe("function");
  });
});
