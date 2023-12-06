/** @type {import('ts-jest').JestConfigWithTsJest} */

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist', 'src/app/app.ts', 'src/index.ts'],
  resolver: 'jest-ts-webcompat-resolver',
};
