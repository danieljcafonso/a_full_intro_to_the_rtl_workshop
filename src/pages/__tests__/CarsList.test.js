import { axiosInstance } from "../../api/carsAPI";
import CarsList from "../CarsList";
import { render, screen } from "../../utils/test-utils";

const getSpy = jest.spyOn(axiosInstance, "get");
const dummyCarData = {
  data: [
    {
      brand: "Audi",
      model: "Guinea",
      segment: "Van",
      price: 12000,
      fuel: "Diesel",
      photo:
        "https://as2.ftcdn.net/v2/jpg/00/16/14/89/1000_F_16148967_YvRk9vkq8eyVda5pDAeTRCvciG87ucqJ.jpg",
    },
  ],
};

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
});
