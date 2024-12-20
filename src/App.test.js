import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

// Mock fetch response
const mockData = [
  {
    "s.no": 0,
    "amt.pledged": 15823,
    "percentage.funded": 186,
  },
  {
    "s.no": 1,
    "amt.pledged": 6859,
    "percentage.funded": 8,
  },
  {
    "s.no": 2,
    "amt.pledged": 17906,
    "percentage.funded": 102,
  },
  {
    "s.no": 3,
    "amt.pledged": 67081,
    "percentage.funded": 191,
  },
  {
    "s.no": 4,
    "amt.pledged": 32772,
    "percentage.funded": 34,
  },
  {
    "s.no": 5,
    "amt.pledged": 2065,
    "percentage.funded": 114,
  },
];

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockData),
    })
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("TableWithPagination Component", () => {
  test("renders header and footer", async () => {
    render(<App />);

    // Check if header is rendered
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText(/Click here github repo/i)).toBeInTheDocument();

    // Check if footer is rendered
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByText(/React assignment/i)).toBeInTheDocument();
  });

  test("displays loader while data is being fetched", () => {
    render(<App />);
    expect(
      screen.getByText(/Loading data, please wait.../i)
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveAttribute("aria-busy", "true");
  });

  test("renders table with correct data after fetching", async () => {
    render(<App />);

    // Wait for the loader to disappear
    await waitFor(() =>
      expect(
        screen.queryByText(/Loading data, please wait.../i)
      ).not.toBeInTheDocument()
    );

    // Check if table is rendered with correct data
    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(6); // 1 header row + 5 data rows
    expect(screen.getByText(/186%/i)).toBeInTheDocument(); // Percentage Funded
    expect(screen.getByText(/\$15,823/i)).toBeInTheDocument(); // Amount Pledged
  });

  test("renders pagination and handles navigation", async () => {
    render(<App />);

    // Wait for data to load
    await waitFor(() =>
      expect(
        screen.queryByText(/Loading data, please wait.../i)
      ).not.toBeInTheDocument()
    );

    // Check initial state
    expect(screen.getByText(/Page 1 of 2/i)).toBeInTheDocument();

    // Click "Next" button
    fireEvent.click(screen.getByRole("button", { name: /Next Page/i }));
    expect(screen.getByText(/Page 2 of 2/i)).toBeInTheDocument();

    // Click "Previous" button
    fireEvent.click(screen.getByRole("button", { name: /Previous Page/i }));
    expect(screen.getByText(/Page 1 of 2/i)).toBeInTheDocument();
  });

  test('disables "Previous" button on the first page', async () => {
    render(<App />);

    // Wait for data to load
    await waitFor(() =>
      expect(
        screen.queryByText(/Loading data, please wait.../i)
      ).not.toBeInTheDocument()
    );

    // Check that "Previous" button is disabled
    const previousButton = screen.getByRole("button", {
      name: /Previous Page/i,
    });
    expect(previousButton).toBeDisabled();
  });

  test('disables "Next" button on the last page', async () => {
    render(<App />);

    // Wait for data to load
    await waitFor(() =>
      expect(
        screen.queryByText(/Loading data, please wait.../i)
      ).not.toBeInTheDocument()
    );

    // Navigate to the last page
    fireEvent.click(screen.getByRole("button", { name: /Next Page/i }));

    // Check that "Next" button is disabled
    const nextButton = screen.getByRole("button", { name: /Next Page/i });
    expect(nextButton).toBeDisabled();
  });
});
