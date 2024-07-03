import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, vi, beforeEach, expect } from "vitest";
import EasyTest from "../src/components/EasyTest";
import { getRandomWords } from "../src/services/api.service";

vi.mock("../src/services/api.service");

describe("EasyTest component suite tests", () => {
  const mockOnEndTest = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    getRandomWords.mockResolvedValue([
      { word: "testword1", translation: "translation1" },
      { word: "testword2", translation: "translation2" },
      { word: "testword3", translation: "translation3" },
      { word: "testword4", translation: "translation4" },
      { word: "testword5", translation: "translation5" },
    ]);
  });

  test("should fetch and display a question and options", async () => {
    render(<EasyTest onEndTest={mockOnEndTest} />);

    await waitFor(() => {
      const wordElement = screen.getByRole("heading", { level: 2 });
      expect(wordElement).toBeInTheDocument();
    });

    const optionElements = screen.getAllByRole("button", {
      name: /translation/i,
    });
    expect(optionElements).toHaveLength(5);
  });

  test("should display feedback and fetch a new question on option select", async () => {
    render(<EasyTest onEndTest={mockOnEndTest} />);

    let wordElement = await screen.findByRole("heading", { level: 2 });
    const initialWord = wordElement.textContent;

    const optionElements = screen.getAllByRole("button", {
      name: /translation/i,
    });
    fireEvent.click(optionElements[0]);

    await waitFor(() => {
      wordElement = screen.getByRole("heading", { level: 2 });
      expect(wordElement.textContent).not.toBe(initialWord);
    });
  });

  test("should display error message when fetching questions fails", async () => {
    getRandomWords.mockRejectedValue(new Error("Failed to fetch questions"));

    render(<EasyTest onEndTest={mockOnEndTest} />);

    await waitFor(() => {
      expect(
        screen.getByText(/Failed to fetch questions/i)
      ).toBeInTheDocument();
    });
  });

  test("should call onEndTest when End Test button is clicked", () => {
    render(<EasyTest onEndTest={mockOnEndTest} />);

    fireEvent.click(screen.getByText(/End Test/i));

    expect(mockOnEndTest).toHaveBeenCalled();
  });
});
