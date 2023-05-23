// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import * as useLocalStorage from "./hooks/useLocalStorage";
import { dummyUserData } from "./utils/test-utils";
import { server } from "./mocks/server.js";

const useLocalStorageOriginalImplementation = useLocalStorage.default;

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

beforeEach(() => {
  useLocalStorage.default = jest.fn(() => [dummyUserData, jest.fn()]);
});

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => {
  useLocalStorage.default = useLocalStorageOriginalImplementation;
  server.close();
});

const errorLog = console.error;
console.error = (error) => {
  if (
    !error.includes("for a non-boolean attribute") &&
    !error.includes("validateDOMNesting") &&
    !error.includes("Not implemented: HTMLFormElement.prototype.submit")
  )
    errorLog(error);
};
