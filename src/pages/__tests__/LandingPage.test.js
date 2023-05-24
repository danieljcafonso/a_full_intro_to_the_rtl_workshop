import { render } from "../../utils/test-utils";
import LandingPage from "../LandingPage";

describe("LandingPage tests", () => {
  it("should render page", () => {
    const { getByText, getByRole, getByAltText } = render(<LandingPage />);

    const landingPageText = getByText(
      "A Full Intro to the React Testing Library"
    );
    const landingPageButton = getByRole("button", {
      name: "Here is a button to query",
    });
    const landingPageImageTL = getByAltText("octopus");
    const landingPageImageRTL = getByAltText("goat");

    expect(landingPageText).toBeInTheDocument();
    expect(landingPageButton).toBeInTheDocument();
    expect(landingPageImageTL).toBeInTheDocument();
    expect(landingPageImageRTL).toBeInTheDocument();
  });
});
