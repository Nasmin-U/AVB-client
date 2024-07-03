import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { describe, test, vi, beforeEach, expect } from "vitest";
import HardTest from "../src/components/HardTest";
import { getRandomWords } from "../src/services/api.service";
import ArabicKeyboard from "../src/components/ArabicKeyboard";

vi.mock("../src/services/api.service");
vi.mock("../src/components/ArabicKeyboard");

describe("HardTest component suite tests", () => {
  const mockOnEndTest = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    getRandomWords.mockResolvedValue([
      { word: "testword1", translation: "translation1" },
      { word: "testword2", translation: "translation2" },
      { word: "testword3", translation: "translation3" },
    ]);

    ArabicKeyboard.mockImplementation(({ onKeyPress }) => (
      <div>
        <button onClick={() => onKeyPress("ت")}>ت</button>
        <button onClick={() => onKeyPress("delete")}>⌫</button>
      </div>
    ));
  });

  test("should fetch and display a question", async () => {
    await act(async () => {
      render(<HardTest onEndTest={mockOnEndTest} />);
    });

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    });
  });

  test("should update answer on input change", async () => {
    await act(async () => {
      render(<HardTest onEndTest={mockOnEndTest} />);
    });

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    });

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "translation1" } });
    expect(input.value).toBe("translation1");
  });

  test("should fetch a new question on answer submission", async () => {
    await act(async () => {
      render(<HardTest onEndTest={mockOnEndTest} />);
    });

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    });

    const initialQuestion = screen.getByRole("heading", {
      level: 2,
    }).textContent;

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "translation1" } });
    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      const newQuestion = screen.getByRole("heading", { level: 2 }).textContent;
      expect(newQuestion).not.toBe(initialQuestion);
    });
  });

  test("should handle keyboard input correctly", async () => {
    await act(async () => {
      render(<HardTest onEndTest={mockOnEndTest} />);
    });

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/ت/i));
    const input = screen.getByRole("textbox");
    expect(input.value).toBe("ت");

    fireEvent.click(screen.getByText(/⌫/i));
    expect(input.value).toBe("");
  });

  test("should display error message when fetching questions fails", async () => {
    getRandomWords.mockRejectedValue(new Error("Failed to fetch questions"));

    await act(async () => {
      render(<HardTest onEndTest={mockOnEndTest} />);
    });

    await waitFor(() => {
      expect(
        screen.getByText(/Failed to fetch questions/i)
      ).toBeInTheDocument();
    });
  });

  test("should call onEndTest when End Test button is clicked", async () => {
    await act(async () => {
      render(<HardTest onEndTest={mockOnEndTest} />);
    });

    fireEvent.click(screen.getByText(/End Test/i));

    expect(mockOnEndTest).toHaveBeenCalled();
  });
});
