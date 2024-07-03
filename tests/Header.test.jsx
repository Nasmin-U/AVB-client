import { render, screen, fireEvent} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, test, vi, beforeEach, expect } from "vitest";
import Header from "../src/components/Header";

const mockSetIsLoggedIn = vi.fn();

describe("Header suite tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should render the Header with links", () => {
    render(
      <MemoryRouter>
        <Header isLoggedIn={false} setIsLoggedIn={mockSetIsLoggedIn} />
      </MemoryRouter>
    );

    expect(screen.getByText("Arabic Vocabulary Builder")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Test Me")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Signup")).toBeInTheDocument();
  });

  test("should render the Header with links when logged in", () => {
    render(
      <MemoryRouter>
        <Header isLoggedIn={true} setIsLoggedIn={mockSetIsLoggedIn} />
      </MemoryRouter>
    );

    expect(screen.getByText("Arabic Vocabulary Builder")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Test Me")).toBeInTheDocument();
    expect(screen.getByText("My Words")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test("should call setIsLoggedIn and navigate on logout", () => {
    render(
      <MemoryRouter>
        <Header isLoggedIn={true} setIsLoggedIn={mockSetIsLoggedIn} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Logout"));

    expect(mockSetIsLoggedIn).toHaveBeenCalledWith(false);

  });

});
