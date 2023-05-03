import AddCars from "../AddCars";
import * as useLocalStorage from "../../hooks/useLocalStorage";
import {
  render,
  screen,
  waitFor,
  dummyCar,
  dummyUserData,
} from "../../utils/test-utils";
import { useNavigate } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { server } from "../../mocks/server";

const navigateMockFn = jest.fn();
const useLocalStorageOriginalImplementation = useLocalStorage.default;

describe("AddCars tests", () => {
  beforeEach(() => {
    useLocalStorage.default = jest.fn(() => [dummyUserData, jest.fn()]);
    useNavigate.mockImplementation(() => navigateMockFn);
  });
  afterAll(() => {
    useLocalStorage.default = useLocalStorageOriginalImplementation;
  });

  it("should render", () => {
    render(<AddCars />);
    const segment = screen.getByTestId(/segment/i);
    const model = screen.getByRole("textbox", {
      name: /model/i,
    });
    const brand = screen.getByRole("textbox", {
      name: /brand/i,
    });
    const fuel = screen.getByRole("textbox", {
      name: /fuel/i,
    });
    const price = screen.getByRole("spinbutton", {
      name: /price/i,
    });
    const photo = screen.getByRole("textbox", {
      name: /photo url/i,
    });
    const addButton = screen.getByRole("button", {
      name: /add car/i,
    });

    expect(segment).toBeInTheDocument();
    expect(model).toBeInTheDocument();
    expect(brand).toBeInTheDocument();
    expect(fuel).toBeInTheDocument();
    expect(price).toBeInTheDocument();
    expect(photo).toBeInTheDocument();
    expect(addButton).toBeInTheDocument();
  });

  it("shouldnt allow to submit an empty form", async () => {
    render(<AddCars />);
    const addButton = screen.getByRole("button", {
      name: /add car/i,
    });
    userEvent.click(addButton);

    const errorMessage = await screen.findByText(/please fill in all data/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it("shouldnt allow to submit a negative number", async () => {
    render(<AddCars />);
    const segment = screen.getByRole("button", {
      name: /​/i,
    });
    const model = screen.getByRole("textbox", {
      name: /model/i,
    });
    const brand = screen.getByRole("textbox", {
      name: /brand/i,
    });
    const fuel = screen.getByRole("textbox", {
      name: /fuel/i,
    });
    const price = screen.getByRole("spinbutton", {
      name: /price/i,
    });
    const photo = screen.getByRole("textbox", {
      name: /photo url/i,
    });
    const addButton = screen.getByRole("button", {
      name: /add car/i,
    });

    userEvent.click(segment);
    const selectOption = screen.getByRole("option", {
      name: dummyCar.segment,
    });
    userEvent.click(selectOption);
    userEvent.type(model, dummyCar.model);
    userEvent.type(brand, dummyCar.brand);
    userEvent.type(fuel, dummyCar.fuel);
    userEvent.clear(price);
    userEvent.type(price, "-1");
    userEvent.type(photo, dummyCar.photo);

    userEvent.click(addButton);

    const errorMessage = await screen.findByText(
      /the price needs to be greater than 0/i
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("should add a car", async () => {
    render(<AddCars />);
    const segment = screen.getByRole("button", {
      name: /​/i,
    });
    const model = screen.getByRole("textbox", {
      name: /model/i,
    });
    const brand = screen.getByRole("textbox", {
      name: /brand/i,
    });
    const fuel = screen.getByRole("textbox", {
      name: /fuel/i,
    });
    const price = screen.getByRole("spinbutton", {
      name: /price/i,
    });
    const photo = screen.getByRole("textbox", {
      name: /photo url/i,
    });
    const addButton = screen.getByRole("button", {
      name: /add car/i,
    });

    userEvent.click(segment);
    const selectOption = screen.getByRole("option", {
      name: dummyCar.segment,
    });
    userEvent.click(selectOption);
    userEvent.type(model, dummyCar.model);
    userEvent.type(brand, dummyCar.brand);
    userEvent.type(fuel, dummyCar.fuel);
    userEvent.clear(price);
    userEvent.type(price, dummyCar.price);
    userEvent.type(photo, dummyCar.photo);

    userEvent.click(addButton);

    const successMessage = await screen.findByText(/car was created/i);
    expect(successMessage).toBeInTheDocument();
  });

  it("should navigate to cars list after submit", async () => {
    render(<AddCars />);
    const segment = screen.getByRole("button", {
      name: /​/i,
    });
    const model = screen.getByRole("textbox", {
      name: /model/i,
    });
    const brand = screen.getByRole("textbox", {
      name: /brand/i,
    });
    const fuel = screen.getByRole("textbox", {
      name: /fuel/i,
    });
    const price = screen.getByRole("spinbutton", {
      name: /price/i,
    });
    const photo = screen.getByRole("textbox", {
      name: /photo url/i,
    });
    const addButton = screen.getByRole("button", {
      name: /add car/i,
    });

    userEvent.click(segment);
    const selectOption = screen.getByRole("option", {
      name: dummyCar.segment,
    });
    userEvent.click(selectOption);
    userEvent.type(model, dummyCar.model);
    userEvent.type(brand, dummyCar.brand);
    userEvent.type(fuel, dummyCar.fuel);
    userEvent.clear(price);
    userEvent.type(price, dummyCar.price);
    userEvent.type(photo, dummyCar.photo);

    userEvent.click(addButton);

    await waitFor(() => expect(navigateMockFn).toHaveBeenCalledWith("/cars"));
  });

  it("should show error on fail submit", async () => {
    server.use(rest.post("*", (req, res, ctx) => res(ctx.status(403))));

    render(<AddCars />);
    const segment = screen.getByRole("button", {
      name: /​/i,
    });
    const model = screen.getByRole("textbox", {
      name: /model/i,
    });
    const brand = screen.getByRole("textbox", {
      name: /brand/i,
    });
    const fuel = screen.getByRole("textbox", {
      name: /fuel/i,
    });
    const price = screen.getByRole("spinbutton", {
      name: /price/i,
    });
    const photo = screen.getByRole("textbox", {
      name: /photo url/i,
    });
    const addButton = screen.getByRole("button", {
      name: /add car/i,
    });

    userEvent.click(segment);
    const selectOption = screen.getByRole("option", {
      name: dummyCar.segment,
    });
    userEvent.click(selectOption);
    userEvent.type(model, dummyCar.model);
    userEvent.type(brand, dummyCar.brand);
    userEvent.type(fuel, dummyCar.fuel);
    userEvent.clear(price);
    userEvent.type(price, dummyCar.price);
    userEvent.type(photo, dummyCar.photo);

    userEvent.click(addButton);

    const errorMessage = await screen.findByText(
      /something went wrong when creating a car/i
    );
    expect(errorMessage).toBeInTheDocument();
  });
});
