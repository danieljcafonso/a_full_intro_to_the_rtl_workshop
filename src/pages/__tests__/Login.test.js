import Login from "../Login";
import { render, screen, waitFor, dummyUserData } from "../../utils/test-utils";
import * as useLocalStorage from "../../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import userEvent from "@testing-library/user-event";

const navigateMockFn = jest.fn();

const setLocalStorage = jest.fn();

describe("Login tests", () => {
  beforeEach(() => {
    useLocalStorage.default = jest.fn(() => [null, setLocalStorage]);
    useNavigate.mockImplementation(() => navigateMockFn);
  });

  it("should render", () => {
    render(<Login />);
    const usernameInput = screen.getByRole("textbox", {
      name: /username/i,
    });
    const emailInput = screen.getByRole("textbox", {
      name: /email/i,
    });
    const loginButton = screen.getByRole("button", {
      name: /login/i,
    });
    const createAccountLink = screen.getByRole("link", {
      name: /create an account/i,
    });

    expect(usernameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
    expect(createAccountLink).toBeInTheDocument();
  });

  it("should login", async () => {
    render(<Login />);
    const usernameInput = screen.getByRole("textbox", {
      name: /username/i,
    });
    const emailInput = screen.getByRole("textbox", {
      name: /email/i,
    });
    const loginButton = screen.getByRole("button", {
      name: /login/i,
    });
    userEvent.type(usernameInput, dummyUserData.username);
    userEvent.type(emailInput, dummyUserData.email);
    userEvent.click(loginButton);

    await waitFor(() =>
      expect(setLocalStorage).toHaveBeenCalledWith(dummyUserData)
    );
  });

  it("should call navigate on logged user", async () => {
    useLocalStorage.default = jest.fn(() => [
      "danieljcafonso",
      setLocalStorage,
    ]);

    render(<Login />);

    await waitFor(() => expect(navigateMockFn).toHaveBeenCalledWith("/"));
  });
});
