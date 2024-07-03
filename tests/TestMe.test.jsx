import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, vi, beforeEach, expect } from "vitest";
import TestMe from "../src/pages/TestMe";
import EasyMode from "../src/components/EasyTest";
import HardMode from "../src/components/HardTest";

vi.mock("../src/components/EasyTest", () => ({
  __esModule: true,
  default: vi.fn(({ onEndTest }) => (
    <div>
      Easy Mode Component
      <button onClick={onEndTest}>End Test</button>
    </div>
  )),
}));

vi.mock("../src/components/HardTest", () => ({
  __esModule: true,
  default: vi.fn(({ onEndTest }) => (
    <div>
      Hard Mode Component
      <button onClick={onEndTest}>End Test</button>
    </div>
  )),
}));

describe("TestMe component suite tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should render mode selection options", () => {
    render(<TestMe />);

    const heading = screen.getByText(/Select The Test Difficulty/i);
    const easyOption = screen.getByText(/Easy/i);
    const hardOption = screen.getByText(/Hard/i);

    expect(heading).toBeInTheDocument();
    expect(easyOption).toBeInTheDocument();
    expect(hardOption).toBeInTheDocument();
  });

  test("should switch to Easy mode on Easy option click", () => {
    render(<TestMe />);

    fireEvent.click(screen.getByText(/Easy/i));

    expect(EasyMode).toHaveBeenCalled();
    expect(screen.getByText(/Easy Mode Component/i)).toBeInTheDocument();
  });

  test("should switch to Hard mode on Hard option click", () => {
    render(<TestMe />);

    fireEvent.click(screen.getByText(/Hard/i));

    expect(HardMode).toHaveBeenCalled();
    expect(screen.getByText(/Hard Mode Component/i)).toBeInTheDocument();
  });

  test("should return to mode selection after ending test in Easy mode", () => {
    render(<TestMe />);

    fireEvent.click(screen.getByText(/Easy/i));
    fireEvent.click(screen.getByText(/End Test/i));

    expect(screen.getByText(/Select The Test Difficulty/i)).toBeInTheDocument();
  });

  test("should return to mode selection after ending test in Hard mode", () => {
    render(<TestMe />);

    fireEvent.click(screen.getByText(/Hard/i));
    fireEvent.click(screen.getByText(/End Test/i));

    expect(screen.getByText(/Select The Test Difficulty/i)).toBeInTheDocument();
  });
});
