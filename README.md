# Testing Workshop

Here we have an application that applies some of the patterns we might encounter in our day to day. Authentication (a simplified version of it), data fetching, data mutations, routing and more.

In this application we can do the following:

1. Create cars (`AddCars.js`)
2. View cars (`CarsList.js`)
3. Delete cars (`CarsList.js`)
4. Login/Register (`Login.js` and `Register.js`)
5. Toggle Theme (`Header.js`)

## Getting started

Clone this repository (or fork it), check in to the branch `feat/start_here`, and install all dependencies by running:

```
npm i
# or
yarn
```

To run the app, run the development server:

```
npm start
# or
yarn start

```

Open [http://localhost:3000](http://localhost:3000/) in your browser to see the page. On your first time using the app, you need to create an account using a username and an email. These are just dummy things to have the functionality in the app.

You should now be able to use the application. Let’s get ready to start testing it.

## Exercise 1

Let us start with the most classic test to reproduce with the React Testing Library. The render one. For this scenario, we will be using our `LandingPage.js`.

Look at how that component renders in your browser. From it, do the following:

1. Identify all the elements that exist on the page
2. Create a test file for that component
3. Leveraging rendering, queries, and a jest DOM assertion validate that all the elements are rendered on the page.

<details>

<summary> See solution </summary>

<p>

```jsx
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
```

</p>

</details>

## Exercise 2

Now let’s turn our attention to our Cars List (`CarsList.js`). Make sure you add some cars first to see how the page works. If you don’t want to search for car data, you can use the helpers’ array in `CarsList.js`

In this exercise, we will be focusing _only on the rendering and data fetching_. This means no mutations right now.

### Part 1

Before we proceed, and considering the previous paragraph, let's identify some things we can test on this app and make a list.

<details>

<summary> See list </summary>

<p>

1. should render a loading spinner while loading data
2. should render a list of cars when there is data
3. should show no cars message when there is no data

</p>

</details>

### Part 2

Let us start by implementing the first test scenario.

<details>

<summary> See solution </summary>

<p>

```jsx
it("should show loading spinner", async () => {
  render(<CarsList />);
  const loadingSpinner = await screen.findByRole("progressbar");
  expect(loadingSpinner).toBeInTheDocument();
});
```

</p>

</details>

Now, let us do the same for the second scenario.

Just one thing to be aware of: we need our API to return the same data so we can resort to Jest to do this. Here is how:

```jsx
import { dummyCarData } from "../../utils/test-utils";
import { axiosInstance } from "../../api/carsAPI";

const getSpy = jest.spyOn(axiosInstance, "get");

// inside Describe block
beforeEach(() => {
  getSpy.mockResolvedValue(dummyCarData);
});
```

Now we can implement that second test:

<details>

<summary> See solution 1 </summary>

<p>

```jsx
it("should show data", async () => {
  render(<CarsList />);
  const carCard = await screen.findByTestId("CarCard");
  const carImage = screen.getByRole("img", {
    name: /audi guinea/i,
  });
  expect(carCard).toBeInTheDocument();
  expect(carImage).toBeInTheDocument();
});
```

</p>

</details>

<details>

<summary> See solution 2 </summary>

<p>

```jsx
it("should show data", async () => {
  render(<CarsList />);
  const carHeaderText = await screen.findByText(
    `${dummyCarData.data.thisisacarid.brand} ${dummyCarData.data.thisisacarid.model}`
  );
  const carInfo = screen.getByText(
    `${dummyCarData.data.thisisacarid.segment} ${dummyCarData.data.thisisacarid.fuel}`
  );
  const carImage = screen.getByRole("img", {
    name: `${dummyCarData.data.thisisacarid.brand} ${dummyCarData.data.thisisacarid.model}`,
  });
  const carPrice = screen.getByText(dummyCarData.data.thisisacarid.price);

  expect(carHeaderText).toBeInTheDocument();
  expect(carInfo).toBeInTheDocument();
  expect(carPrice).toBeInTheDocument();
  expect(carImage).toBeInTheDocument();
});
```

</p>

</details>

<details>

<summary> See solution 3 </summary>

<p>

```jsx
it("should show data", async () => {
  render(<CarsList />);
  await waitForElementToBeRemoved(() => screen.queryByRole("progressbar"));

  const carImage = screen.getByRole("img", {
    name: /audi guinea/i,
  });
  expect(carImage).toBeInTheDocument();
});
```

</p>

</details>

Now we need to check the last scenario.

<details>

<summary> See solution </summary>

<p>

```jsx
it("should show no cars warning when no data", async () => {
  getSpy.mockResolvedValue({});

  render(<CarsList />);
  const noCarsMessage = await screen.findByText("No cars to display...");
  expect(noCarsMessage).toBeInTheDocument();
});
```

</p>

</details>

## Exercise 3

Let’s keep our attention on the Cars List (`CarsList.js`). Now we want to start thinking about mutations. On this page, we have some mutations on the Delete Car functionality.

### Part 1

Identify all the tests to implement on the `CarsList.js` tests regarding the Delete functionality.

<details>

<summary> See list </summary>

<p>

1. should delete a car successfully
2. should fail to delete a car

</p>

</details>

### Part 2

Let us implement these scenarios.

Note: we will also need to mock our delete functionality.

<details>

<summary> See solution </summary>

<p>

```jsx
const deleteSpy = jest.spyOn(axiosInstance, "delete");

//inside describe block
beforeEach(() => {
		...
    deleteSpy.mockResolvedValue({});
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
```

</p>

</details>

### Part 3

Now we can turn our attention to our Add Cars functionality (`AddCars.js`).

Let us start by identifying all the testing scenarios here:

<details>

<summary> See list </summary>

<p>

1. should render all the elements
2. should not allow submitting an empty form
3. should not allow submitting a form with a negative number
4. should create a car successfully
5. should navigate to the cars list after submitting a form
6. should show an error when failing to submit a form

</p>

</details>

### Part 4

Now you have all the information you need to implement these tests. You need to be aware of something first. To mock the navigate function you can do the following:

```jsx
import { useNavigate } from "react-router-dom";
const navigateMockFn = jest.fn();
beforeEach(() => {
  useNavigate.mockImplementation(() => navigateMockFn);
});
```

<details>

<summary> See solution </summary>

<p>

```jsx
describe("AddCars tests", () => {
  beforeEach(() => {
    useNavigate.mockImplementation(() => navigateMockFn);
    postSpy.mockResolvedValue({ data: dummyCarCreateData });
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
      name: /segment/i,
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
      name: dummyCarCreateData.segment,
    });
    userEvent.click(selectOption);
    userEvent.type(model, dummyCarCreateData.model);
    userEvent.type(brand, dummyCarCreateData.brand);
    userEvent.type(fuel, dummyCarCreateData.fuel);
    userEvent.clear(price);
    userEvent.type(price, "-1");
    userEvent.type(photo, dummyCarCreateData.photo);

    userEvent.click(addButton);

    const errorMessage = await screen.findByText(
      /the price needs to be greater than 0/i
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("should add a car", async () => {
    render(<AddCars />);
    const segment = screen.getByRole("button", {
      name: /segment/i,
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
      name: dummyCarCreateData.segment,
    });
    userEvent.click(selectOption);
    userEvent.type(model, dummyCarCreateData.model);
    userEvent.type(brand, dummyCarCreateData.brand);
    userEvent.type(fuel, dummyCarCreateData.fuel);
    userEvent.clear(price);
    userEvent.type(price, dummyCarCreateData.price);
    userEvent.type(photo, dummyCarCreateData.photo);

    userEvent.click(addButton);

    await waitFor(() => expect(postSpy).toHaveBeenCalled());
    expect(postSpy).toHaveBeenCalledWith(
      `/cars/${dummyUserData.username}`,
      dummyCarCreateData
    );
    const successMessage = await screen.findByText(/car was created/i);
    expect(successMessage).toBeInTheDocument();
  });

  it("should navigate to cars list after submit", async () => {
    render(<AddCars />);
    const segment = screen.getByRole("button", {
      name: /segment/i,
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
      name: dummyCarCreateData.segment,
    });
    userEvent.click(selectOption);
    userEvent.type(model, dummyCarCreateData.model);
    userEvent.type(brand, dummyCarCreateData.brand);
    userEvent.type(fuel, dummyCarCreateData.fuel);
    userEvent.clear(price);
    userEvent.type(price, dummyCarCreateData.price);
    userEvent.type(photo, dummyCarCreateData.photo);

    userEvent.click(addButton);

    await waitFor(() => expect(navigateMockFn).toHaveBeenCalledWith("/cars"));
  });

  it("should show error on fail submit", async () => {
    postSpy.mockRejectedValue(new Error("something went wrong"));

    render(<AddCars />);
    const segment = screen.getByRole("button", {
      name: /segment/i,
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
      name: dummyCarCreateData.segment,
    });
    userEvent.click(selectOption);
    userEvent.type(model, dummyCarCreateData.model);
    userEvent.type(brand, dummyCarCreateData.brand);
    userEvent.type(fuel, dummyCarCreateData.fuel);
    userEvent.clear(price);
    userEvent.type(price, dummyCarCreateData.price);
    userEvent.type(photo, dummyCarCreateData.photo);

    userEvent.click(addButton);

    const errorMessage = await screen.findByText(
      /something went wrong when creating a car/i
    );
    expect(errorMessage).toBeInTheDocument();
  });
});
```

</p>

</details>

## Exercise 4

Let us now see our Login page (`Login.js`)

### Part 1

Let us start by identifying all the scenarios we can test here.

<details>

<summary> See list </summary>

<p>

1. should render the elements
2. should log in
3. should call navigate on logged user

</p>

</details>

### Part 2

You guessed it. Let us implement your scenarios from above.

Note: to be able to simulate an authenticated user, we need to interact with our mocked useLocalStorage hook. Here is how:

```jsx
import * as useLocalStorage from "../../hooks/useLocalStorage";
const setLocalStorage = jest.fn();
useLocalStorage.default = jest.fn(() => ["danieljcafonso", setLocalStorage]);
```

Now you can implement your tests.

<details>

<summary> See solution </summary>

<p>

```jsx
const navigateMockFn = jest.fn();

const postSpy = jest.spyOn(axiosInstance, "post");

const setLocalStorage = jest.fn();

describe("Login tests", () => {
  beforeEach(() => {
    useLocalStorage.default = jest.fn(() => [null, setLocalStorage]);
    useNavigate.mockImplementation(() => navigateMockFn);
    postSpy.mockResolvedValue({ data: [dummyUserData] });
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
```

</p>

</details>

### Part 3 and Part 4 (Extra credit)

Repeat the same process for the Register form (`Register.js`)

Thought: Tests help notice that patterns are similar, so we could probably turn those UIs into one file and change them depending on props or state.

## Exercise 5 (Extra credit)

The Header (`Header.js`) is a constant between all pages and is responsible for dealing with some authentication scenarios, changing routes, and changing themes.

### Part 1

Identify all the testing scenarios for this file.

<details>

<summary> See list </summary>

<p>

1. should render all the elements
2. should render a logout button when authenticated
3. should logout on logout button click
4. should redirect to login page when not authenticated
5. should not redirect to login page when authenticated
6. should not redirect to login page when not authenticated but you are on login page already
7. should not redirect to login page when not authenticated but you are on the register page
8. should change route on nav item click
9. should have an interactable secondary menu
10. should show dark mode icon when in dark mode
11. should show light mode icon when in light mode

</p>

</details>

### Part 2

Let us now implement them.

<details>

<summary> See solution </summary>

<p>

```jsx
const navigateMockFn = jest.fn();

const setLocalStorage = jest.fn();

describe("Header tests", () => {
  beforeEach(() => {
    useLocalStorage.default = jest.fn(() => [null, setLocalStorage]);
    useNavigate.mockImplementation(() => navigateMockFn);
    useLocation.mockImplementation(() => ({ pathname: "/" }));
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
```

</p>

</details>

## Exercise 6

Note: we need to update our test-utils dummy objects to the following ones:

```jsx
export const dummyUserData = { username: "daniel", email: "daniel@admin.com" };

export const dummyCarList = {
  thisisacarid: {
    brand: "Audi",
    model: "Guinea",
    segment: "Van",
    price: 12000,
    fuel: "Diesel",
    photo:
      "https://as2.ftcdn.net/v2/jpg/00/16/14/89/1000_F_16148967_YvRk9vkq8eyVda5pDAeTRCvciG87ucqJ.jpg",
  },
};

export const dummyCarCreateData = {
  brand: "Audi",
  model: "Guinea",
  segment: "Van",
  price: "12000",
  fuel: "Diesel",
  photo:
    "https://as2.ftcdn.net/v2/jpg/00/16/14/89/1000_F_16148967_YvRk9vkq8eyVda5pDAeTRCvciG87ucqJ.jpg",
};
```

To add MSW to your application, run the following;

```jsx
npm install msw --save-dev
# or
yarn add msw --dev
```

## Create the handlers for the routes defined in the API file.

<details>

<summary> See solution </summary>

<p>

```jsx
export const handlers = [
  // Handles a POST /login request
  rest.post("*/carslogin*", (req, res, ctx) => {
    return res(ctx.json([dummyUserData]));
  }),
  rest.post("*/carsuser*", (req, res, ctx) => {
    return res(ctx.json(dummyUserData));
  }),
  rest.post("*/cars*", (req, res, ctx) => {
    return res(ctx.json(dummyCarCreateData));
  }),
  rest.get("*/cars*", (req, res, ctx) => {
    return res(ctx.json(dummyCarList));
  }),
  rest.delete("*/cars*", (req, res, ctx) => {
    return res(ctx.json({}));
  }),
];
```

</p>

</details>

### Create the server file

<details>

<summary> See solution </summary>

<p>

```jsx
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
```

</p>

</details>

### Start listening to the server

<details>

<summary> See solution </summary>

<p>

```jsx
beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
```

</p>

</details>

### Remove all spies

Go through all tests and delete every spy you added previously. You can leverage MSW to add a custom scenario in the cases you need it by doing the following:

```jsx
import { rest } from "msw";
import { server } from "../../mocks/server";
server.use(rest.get("*", (req, res, ctx) => res(ctx.status(200))));
```
