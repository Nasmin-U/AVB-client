import {
  render,
  screen,
  fireEvent,
  waitFor,
  
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, test, vi, beforeEach, expect } from "vitest";
import { getWordDetails, saveWord } from "../src/services/api.service";
import "@testing-library/jest-dom";
import WordPage from "../src/pages/WordPage";


vi.mock("../src/services/api.service");

const mockNavigate = vi.fn();
const mockSetWords = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("WordPage suite tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should render the word details", async () => {
    const wordDetails = {
      word: "testword",
      translation: "translation",
      pronunciation: "pronunciation",
      audioFile: "audio.mp3",
      root: "root",
      definitionHTML: "<p>definition</p>",
    };
    getWordDetails.mockResolvedValueOnce(wordDetails);

    render(
      <MemoryRouter initialEntries={["/word/testword"]}>
        <Routes>
          <Route
            path="/word/:word"
            element={<WordPage setWords={mockSetWords} />}
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("testword")).toBeInTheDocument();
      expect(screen.getByText("Translation: translation")).toBeInTheDocument();
      expect(
        screen.getByText("Pronunciation: pronunciation")
      ).toBeInTheDocument();
      expect(screen.getByText("Root: root")).toBeInTheDocument();
      expect(screen.getByText("definition")).toBeInTheDocument();
      expect(screen.getByText("Wiktionary Link")).toBeInTheDocument();
    });
  });

  test("should display error message when word details fetch fails", async () => {
    getWordDetails.mockRejectedValueOnce(
      new Error("Error fetching word details")
    );

    render(
      <MemoryRouter initialEntries={["/word/testword"]}>
        <Routes>
          <Route
            path="/word/:word"
            element={<WordPage setWords={mockSetWords} />}
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("An error occurred while fetching word details.")
      ).toBeInTheDocument();
    });
  });

  test("should show loading indicator while fetching word details", () => {
    getWordDetails.mockReturnValue(new Promise(() => {}));

    render(
      <MemoryRouter initialEntries={["/word/testword"]}>
        <Routes>
          <Route
            path="/word/:word"
            element={<WordPage setWords={mockSetWords} />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("should add word to saved words when 'Add to My Words' is clicked", async () => {
    sessionStorage.setItem("token", "test-token");
    const wordDetails = {
      word: "testword",
      translation: "translation",
      pronunciation: "pronunciation",
      audioFile: "audio.mp3",
      root: "root",
      definitionHTML: "<p>definition</p>",
    };
    getWordDetails.mockResolvedValueOnce(wordDetails);
    saveWord.mockResolvedValueOnce({
      word: "testword",
      translation: "translation",
    });

    render(
      <MemoryRouter initialEntries={["/word/testword"]}>
        <Routes>
          <Route
            path="/word/:word"
            element={<WordPage setWords={mockSetWords} />}
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("testword")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Add to My Words/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Word added to your saved words!")
      ).toBeInTheDocument();
    });

    expect(mockSetWords).toHaveBeenCalledWith(expect.any(Function));
  });

  test("should display modal when trying to add word without being logged in", async () => {
    sessionStorage.removeItem("token");
    const wordDetails = {
      word: "testword",
      translation: "translation",
      pronunciation: "pronunciation",
      audioFile: "audio.mp3",
      root: "root",
      definitionHTML: "<p>definition</p>",
    };
    getWordDetails.mockResolvedValueOnce(wordDetails);

    render(
      <MemoryRouter initialEntries={["/word/testword"]}>
        <Routes>
          <Route
            path="/word/:word"
            element={<WordPage setWords={mockSetWords} />}
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("testword")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Add to My Words/i }));

    await waitFor(() => {
      expect(
        screen.getByText(
          "You need to be logged in to save words. Please log in or sign up."
        )
      ).toBeInTheDocument();
    });
  });

  test("should navigate to login page when login button in modal is clicked", async () => {
    sessionStorage.removeItem("token");
    const wordDetails = {
      word: "testword",
      translation: "translation",
      pronunciation: "pronunciation",
      audioFile: "audio.mp3",
      root: "root",
      definitionHTML: "<p>definition</p>",
    };
    getWordDetails.mockResolvedValueOnce(wordDetails);

    render(
      <MemoryRouter initialEntries={["/word/testword"]}>
        <Routes>
          <Route
            path="/word/:word"
            element={<WordPage setWords={mockSetWords} />}
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("testword")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Add to My Words/i }));

    await waitFor(() => {
      expect(
        screen.getByText(
          "You need to be logged in to save words. Please log in or sign up."
        )
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    expect(mockNavigate).toHaveBeenCalledWith(
      "/login?redirect=%2Fword%2Ftestword"
    );
  });

  test("should navigate to signup page when signup button in modal is clicked", async () => {
    sessionStorage.removeItem("token");
    const wordDetails = {
      word: "testword",
      translation: "translation",
      pronunciation: "pronunciation",
      audioFile: "audio.mp3",
      root: "root",
      definitionHTML: "<p>definition</p>",
    };
    getWordDetails.mockResolvedValueOnce(wordDetails);

    render(
      <MemoryRouter initialEntries={["/word/testword"]}>
        <Routes>
          <Route
            path="/word/:word"
            element={<WordPage setWords={mockSetWords} />}
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("testword")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Add to My Words/i }));

    await waitFor(() => {
      expect(
        screen.getByText(
          "You need to be logged in to save words. Please log in or sign up."
        )
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    expect(mockNavigate).toHaveBeenCalledWith(
      "/signup?redirect=%2Fword%2Ftestword"
    );
  });
});
