import CarsList from "../CarsList";
import { render, screen, dummyCarData } from "../../utils/test-utils";
import { axiosInstance } from "../../api/carsAPI";

const getSpy = jest.spyOn(axiosInstance, "get");

describe("CarsList tests", () => {
  beforeEach(() => {
    getSpy.mockResolvedValue(dummyCarData);
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
