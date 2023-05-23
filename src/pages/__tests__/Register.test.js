import Register from "../Register";
import { render, screen, waitFor, dummyUserData } from "../../utils/test-utils";
import * as useLocalStorage from "../../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import userEvent from "@testing-library/user-event";

const navigateMockFn = jest.fn();

const setLocalStorage = jest.fn();

describe("Register tests", () => {
  beforeEach(() => {
    useLocalStorage.default = jest.fn(() => [null, setLocalStorage]);
    useNavigate.mockImplementation(() => navigateMockFn);
  });

  it("should render", () => {
    render(<Register />);
    const usernameInput = screen.getByRole("textbox", {
      name: /username/i,
    });
    const emailInput = screen.getByRole("textbox", {
      name: /email/i,
    });
    const registerButton = screen.getByRole("button", {
      name: /register/i,
    });
    const createAccountLink = screen.getByRole("link", {
      name: /i have an account/i,
    });

    expect(usernameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(registerButton).toBeInTheDocument();
    expect(createAccountLink).toBeInTheDocument();
  });

  it("should register", async () => {
    render(<Register />);
    const usernameInput = screen.getByRole("textbox", {
      name: /username/i,
    });
    const emailInput = screen.getByRole("textbox", {
      name: /email/i,
    });
    const registerButton = screen.getByRole("button", {
      name: /register/i,
    });
    userEvent.type(usernameInput, dummyUserData.username);
    userEvent.type(emailInput, dummyUserData.email);
    userEvent.click(registerButton);

    await waitFor(() =>
      expect(setLocalStorage).toHaveBeenCalledWith(dummyUserData)
    );
  });

  it("should call navigate on logged user", async () => {
    useLocalStorage.default = jest.fn(() => [
      "danieljcafonso",
      setLocalStorage,
    ]);

    render(<Register />);

    await waitFor(() => expect(navigateMockFn).toHaveBeenCalledWith("/"));
  });
});
