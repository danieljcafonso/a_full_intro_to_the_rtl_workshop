import { render, screen, waitFor } from "../../utils/test-utils";
import Header from "../Header";
import * as useLocalStorage from "../../hooks/useLocalStorage";
import { useNavigate, useLocation } from "react-router-dom";
import userEvent from "@testing-library/user-event";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));
const navigateMockFn = jest.fn();

const setLocalStorage = jest.fn();
const useLocalStorageOriginalImplementation = useLocalStorage.default;
const dummyUserData = { username: "daniel", email: "daniel@admin.com" };

describe("Header tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useLocalStorage.default = jest.fn(() => [null, setLocalStorage]);
    useNavigate.mockImplementation(() => navigateMockFn);
    useLocation.mockImplementation(() => ({ pathname: "/" }));
  });
  afterAll(() => {
    useLocalStorage.default = useLocalStorageOriginalImplementation;
    jest.resetAllMocks();
  });

  it("should render", () => {
    render(<Header />);

    const carsList = screen.getByRole("button", {
      name: /my cars/i,
    });
    const addCars = screen.getByRole("button", {
      name: /add cars/i,
    });
    const themeToggle = screen.getByRole("button", {
      name: /change theme/i,
    });

    expect(carsList).toBeInTheDocument();
    expect(addCars).toBeInTheDocument();
    expect(themeToggle).toBeInTheDocument();
  });

  it("should render logout button when authenticated", () => {
    useLocalStorage.default = jest.fn(() => [dummyUserData, setLocalStorage]);

    render(<Header />);
    const logoutButton = screen.getByLabelText(
      `Logout from ${dummyUserData.username}`
    );
    expect(logoutButton).toBeInTheDocument();
  });

  it("should logout on logout click", async () => {
    useLocalStorage.default = jest.fn(() => [dummyUserData, setLocalStorage]);

    render(<Header />);
    const logoutButton = screen.getByLabelText(
      `Logout from ${dummyUserData.username}`
    );

    userEvent.click(logoutButton);
    await waitFor(() => expect(setLocalStorage).toHaveBeenCalledWith(null));
  });

  it("should redirect to login when unauthenticated and on homepage", async () => {
    render(<Header />);
    await waitFor(() => expect(navigateMockFn).toHaveBeenCalledWith("/login"));
  });

  it("shouldnt redirect to login when authenticated", async () => {
    useLocalStorage.default = jest.fn(() => [dummyUserData, setLocalStorage]);
    render(<Header />);
    await waitFor(() =>
      expect(navigateMockFn).not.toHaveBeenCalledWith("/login")
    );
  });

  it("shouldnt redirect to login when unauthenticated and on login page", async () => {
    useLocation.mockImplementation(() => ({ pathname: "/login" }));
    render(<Header />);
    await waitFor(() =>
      expect(navigateMockFn).not.toHaveBeenCalledWith("/login")
    );
  });

  it("shouldnt redirect to login when unauthenticated and on register page", async () => {
    useLocation.mockImplementation(() => ({ pathname: "/register" }));
    render(<Header />);
    await waitFor(() =>
      expect(navigateMockFn).not.toHaveBeenCalledWith("/login")
    );
  });

  it("should navigate to new page on nav item click", () => {
    render(<Header />);

    const carsList = screen.getByRole("button", {
      name: /my cars/i,
    });
    userEvent.click(carsList);
    expect(navigateMockFn).toHaveBeenCalledWith("/cars");
  });

  it("should show and interact with secondary menu", () => {
    render(<Header />);

    const button = screen.getByRole("button", {
      name: /open menu/i,
    });
    userEvent.click(button);
    const carsList = screen.getByRole("menuitem", {
      name: /my cars/i,
    });
    userEvent.click(carsList);
    expect(navigateMockFn).toHaveBeenCalledWith("/cars");
  });

  it("should have dark mode toggled on", () => {
    render(<Header isDarkMode={true} />);
    const darkModeButton = screen.getByTestId("dark_mode");
    expect(darkModeButton).toBeInTheDocument();
  });

  it("should have light mode toggled on", () => {
    render(<Header isDarkMode={false} />);
    const lightModeButton = screen.getByTestId("light_mode");
    expect(lightModeButton).toBeInTheDocument();
  });
});
