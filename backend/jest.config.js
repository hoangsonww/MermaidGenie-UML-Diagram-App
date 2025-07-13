// jest.config.js
module.exports = {
  // Use ts-jest as a preset so it knows how to handle TS
  preset: "ts-jest",
  testEnvironment: "node",

  // Look for tests in /tests and match *.spec.js
  roots: ["<rootDir>/tests"],
  testMatch: ["**/*.spec.js"],

  // Transform any .ts/.tsx modules through ts-jest
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },

  // Resolve .ts imports in JS tests
  moduleFileExtensions: ["ts", "js", "json", "node"],

  // Optional: if you use absolute imports (e.g. "@/controllers"), map them here
  // moduleNameMapper: {
  //   '^@/(.*)$': '<rootDir>/src/$1',
  // },
};
