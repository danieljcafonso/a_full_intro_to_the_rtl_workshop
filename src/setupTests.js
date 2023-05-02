// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// TODO: review this
const errorLog = console.error;
console.error = (error) => {
  if (
    !error.includes("for a non-boolean attribute") &&
    !error.includes("validateDOMNesting")
  )
    errorLog(error);
};
