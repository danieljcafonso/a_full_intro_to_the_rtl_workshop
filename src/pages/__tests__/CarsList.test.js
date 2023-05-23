import CarsList from "../CarsList";
import { render, screen, within } from "../../utils/test-utils";
import userEvent from "@testing-library/user-event";
import * as useLocalStorage from "../../hooks/useLocalStorage";
import { axiosInstance } from "../../api/carsAPI";

const getSpy = jest.spyOn(axiosInstance, "get");

const dummyCarData = {
  data: {
    thisisacarid: {
      brand: "Audi",
      model: "Guinea",
      segment: "Van",
      price: 12000,
      fuel: "Diesel",
      photo:
        "https://as2.ftcdn.net/v2/jpg/00/16/14/89/1000_F_16148967_YvRk9vkq8eyVda5pDAeTRCvciG87ucqJ.jpg",
    },
  },
};

const useLocalStorageOriginalImplementation = useLocalStorage.default;
const dummyUserData = { username: "daniel", email: "daniel@admin.com" };

describe("CarsList tests", () => {
  beforeEach(() => {
    useLocalStorage.default = jest.fn(() => [dummyUserData, jest.fn()]);
    getSpy.mockResolvedValue(dummyCarData);
  });

  afterAll(() => {
    useLocalStorage.default = useLocalStorageOriginalImplementation;
  });

  it("should show loading spinner", async () => {
    render(<CarsList />);
    const loadingSpinner = await screen.findByRole("progressbar");
    expect(loadingSpinner).toBeInTheDocument();
  });

  it("should show data", async () => {
    render(<CarsList />);
    const carCard = await screen.findByTestId("CarCard");
    const carImage = screen.getByRole("img", {
      name: /audi guinea/i,
    });
    expect(carCard).toBeInTheDocument();
    expect(carImage).toBeInTheDocument();
  });

  it("should show no cars warning when no data", async () => {
    getSpy.mockResolvedValue({});

    render(<CarsList />);
    const noCarsMessage = await screen.findByText("No cars to display...");
    expect(noCarsMessage).toBeInTheDocument();
  });
});
