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
