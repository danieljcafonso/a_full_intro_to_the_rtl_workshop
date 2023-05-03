import { axiosInstance } from "../../api/carsAPI";
import CarsList from "../CarsList";
import { render, screen, within } from "../../utils/test-utils";
import userEvent from "@testing-library/user-event";

const getSpy = jest.spyOn(axiosInstance, "get");
const deleteSpy = jest.spyOn(axiosInstance, "delete");

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

describe("CarsList tests", () => {
  beforeEach(() => {
    getSpy.mockResolvedValue(dummyCarData);
    deleteSpy.mockResolvedValue({});
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

  it("should delete a car", async () => {
    render(<CarsList />);

    const buttonContainer = await screen.findByTestId("buttonContainer");
    const deleteButton = within(buttonContainer).getByRole("button", {
      name: /delete/i,
    });

    userEvent.click(deleteButton);

    const successMessage = await screen.findByText(/car was deleted/i);
    expect(successMessage).toBeInTheDocument();
  });

  it("should fail to delete a car", async () => {
    deleteSpy.mockRejectedValue(new Error("something went wrong"));

    render(<CarsList />);

    const buttonContainer = await screen.findByTestId("buttonContainer");
    const deleteButton = within(buttonContainer).getByRole("button", {
      name: /delete/i,
    });

    userEvent.click(deleteButton);

    const errorMessage = await screen.findByText(
      /something went wrong when deleting a car/i
    );
    expect(errorMessage).toBeInTheDocument();
  });
});
