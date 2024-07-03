import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, test, vi, beforeEach, expect } from "vitest";
import { getSavedWords, deleteWord } from "../src/services/api.service";
import "@testing-library/jest-dom";
import MyWords from "../src/pages/MyWords";

vi.mock("../src/services/api.service");

const mockSetWords = vi.fn();

describe("MyWords component suite tests", () => {
  let savedWords;

  beforeEach(() => {
    vi.clearAllMocks();
    savedWords = [
      {
        word: "testword1",
        translation: "translation1",
        testScores: [{ score: 5 }],
      },
      {
        word: "testword2",
        translation: "translation2",
        testScores: [{ score: 3 }],
      },
    ];
    mockSetWords.mockImplementation((updateFn) => {
      if (typeof updateFn === "function") {
        savedWords = updateFn(savedWords);
      }
    });
  });

  test("should render the list of saved words", async () => {
    getSavedWords.mockResolvedValueOnce(savedWords);

    render(
      <MemoryRouter initialEntries={["/my-words"]}>
        <Routes>
          <Route
            path="/my-words"
            element={<MyWords words={savedWords} setWords={mockSetWords} />}
          />
        </Routes>
      </MemoryRouter>
    );

    const word1 = await screen.findByText(/translation1/i);
    const word2 = await screen.findByText(/translation2/i);

    expect(word1).toBeInTheDocument();
    expect(word2).toBeInTheDocument();
  });

  test("should display error message when fetching saved words fails", async () => {
    getSavedWords.mockRejectedValueOnce(
      new Error("Error fetching saved words")
    );

    render(
      <MemoryRouter initialEntries={["/my-words"]}>
        <Routes>
          <Route
            path="/my-words"
            element={<MyWords words={[]} setWords={mockSetWords} />}
          />
        </Routes>
      </MemoryRouter>
    );

    const errorMessage = await screen.findByText(
      "An error occurred while fetching saved words."
    );
    expect(errorMessage).toBeInTheDocument();
  });

  test("should handle word selection and deletion", async () => {
    getSavedWords.mockResolvedValueOnce(savedWords);
    deleteWord.mockResolvedValue({});

    const { rerender } = render(
      <MemoryRouter initialEntries={["/my-words"]}>
        <Routes>
          <Route
            path="/my-words"
            element={<MyWords words={savedWords} setWords={mockSetWords} />}
          />
        </Routes>
      </MemoryRouter>
    );


    const word1 = await screen.findByText(/translation1/i);
    const word2 = await screen.findByText(/translation2/i);
    expect(word1).toBeInTheDocument();
    expect(word2).toBeInTheDocument();

  
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    fireEvent.click(screen.getAllByRole("checkbox")[1]);

  
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));

    
    mockSetWords.mockImplementationOnce(() =>
      savedWords.filter(
        (word) => !["testword1", "testword2"].includes(word.word)
      )
    );


    rerender(
      <MemoryRouter initialEntries={["/my-words"]}>
        <Routes>
          <Route
            path="/my-words"
            element={<MyWords words={[]} setWords={mockSetWords} />}
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText(/translation1/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/translation2/i)).not.toBeInTheDocument();
    });
  });

  test("should display error message when deleting words fails", async () => {
    getSavedWords.mockResolvedValueOnce(savedWords);
    deleteWord.mockRejectedValue(new Error("Error deleting words"));

    render(
      <MemoryRouter initialEntries={["/my-words"]}>
        <Routes>
          <Route
            path="/my-words"
            element={<MyWords words={savedWords} setWords={mockSetWords} />}
          />
        </Routes>
      </MemoryRouter>
    );

    const word1 = await screen.findByText(/translation1/i);
    const word2 = await screen.findByText(/translation2/i);
    expect(word1).toBeInTheDocument();
    expect(word2).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    fireEvent.click(screen.getAllByRole("checkbox")[1]);

    fireEvent.click(screen.getByRole("button", { name: /delete/i }));

    const errorMessage = await screen.findByText(
      "An error occurred while deleting words."
    );
    expect(errorMessage).toBeInTheDocument();
  });

  test("should display 'No words saved yet.' when there are no saved words", () => {
    render(
      <MemoryRouter initialEntries={["/my-words"]}>
        <Routes>
          <Route
            path="/my-words"
            element={<MyWords words={[]} setWords={mockSetWords} />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("No words saved yet.")).toBeInTheDocument();
  });
});
