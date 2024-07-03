import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, test, vi, beforeEach, expect } from "vitest";
import { searchWord } from "../src/services/api.service";
import "@testing-library/jest-dom";
import Home from "../src/pages/Home";

vi.mock("../src/services/api.service");

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Home page suite tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should render the Home page", () => {
    render(<Home />, {
      wrapper: MemoryRouter,
    });

    expect(screen.getByText("Arabic Vocabulary Builder")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search for a word in Arabic or English...")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Search/i })).toBeInTheDocument();
  });

  test("should display error message when word is not found", async () => {
    searchWord.mockResolvedValueOnce(null);

    render(<Home />, {
      wrapper: MemoryRouter,
    });

    fireEvent.change(
      screen.getByPlaceholderText("Search for a word in Arabic or English..."),
      {
        target: { value: "invalidword" },
      }
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Search/i }));
    });

    await waitFor(() => {
      expect(
        screen.getByText("Word not found in the database.")
      ).toBeInTheDocument();
    });
  });

  test("should navigate to word page when word is found", async () => {
    searchWord.mockResolvedValueOnce({ word: "testword" });

    render(<Home />, {
      wrapper: MemoryRouter,
    });

    fireEvent.change(
      screen.getByPlaceholderText("Search for a word in Arabic or English..."),
      {
        target: { value: "testword" },
      }
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Search/i }));
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/word/testword");
    });
  });

  test("should display error message on search error", async () => {
    searchWord.mockRejectedValueOnce(new Error("Error searching word"));

    render(<Home />, {
      wrapper: MemoryRouter,
    });

    fireEvent.change(
      screen.getByPlaceholderText("Search for a word in Arabic or English..."),
      {
        target: { value: "testword" },
      }
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Search/i }));
    });

    await waitFor(() => {
      expect(
        screen.getByText("An error occurred while searching for the word.")
      ).toBeInTheDocument();
    });
  });

  test("should show and hide Arabic keyboard on input focus and blur", async () => {
    render(<Home />, {
      wrapper: MemoryRouter,
    });

    const input = screen.getByPlaceholderText(
      "Search for a word in Arabic or English..."
    );

    fireEvent.focus(input);
    expect(screen.getByText("ا")).toBeInTheDocument();

    fireEvent.blur(input);
    await waitFor(() => {
      expect(screen.queryByText("ا")).not.toBeInTheDocument();
    });
  });

  test("should add Arabic letter to search term on key press", () => {
    render(<Home />, {
      wrapper: MemoryRouter,
    });

    const input = screen.getByPlaceholderText(
      "Search for a word in Arabic or English..."
    );
    fireEvent.focus(input);

    const letterButton = screen.getByText("ا");
    fireEvent.mouseDown(letterButton);

    expect(input.value).toBe("ا");
  });

  test("should delete last character from search term on delete key press", () => {
    render(<Home />, {
      wrapper: MemoryRouter,
    });

    const input = screen.getByPlaceholderText(
      "Search for a word in Arabic or English..."
    );
    fireEvent.focus(input);

    fireEvent.change(input, { target: { value: "ا" } });
    const deleteButton = screen.getByText("⌫");
    fireEvent.mouseDown(deleteButton);

    expect(input.value).toBe("");
  });
});
