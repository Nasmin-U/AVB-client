import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, test, vi, beforeEach, expect } from "vitest";
import { loginUser } from "../src/services/api.service";
import "@testing-library/jest-dom";
import LoginForm from "../src/components/LoginForm";

vi.mock("../src/services/api.service");

const mockNavigate = vi.fn();
const mockSetIsLoggedIn = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("LoginForm suite tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should render the login form", () => {
    render(<LoginForm setIsLoggedIn={mockSetIsLoggedIn} />, {
      wrapper: MemoryRouter,
    });

    expect(screen.getByText("Login Here!")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your password")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Change Password/i })
    ).toBeInTheDocument();
  });

  test("should display validation errors", async () => {
    render(<LoginForm setIsLoggedIn={mockSetIsLoggedIn} />, {
      wrapper: MemoryRouter,
    });

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(screen.getByText("Email is required.")).toBeInTheDocument();
      expect(screen.getByText("Password is required.")).toBeInTheDocument();
    });
  });

  test("should allow users to login with correct credentials", async () => {
    loginUser.mockResolvedValueOnce({ token: "test-token" });

    render(<LoginForm setIsLoggedIn={mockSetIsLoggedIn} />, {
      wrapper: MemoryRouter,
    });

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "Password1!" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Login/i }));
    });

    await waitFor(() => {
      expect(
        screen.getByText("Login successful! Redirecting...")
      ).toBeInTheDocument();
    });

    await new Promise((resolve) => setTimeout(resolve, 2100));

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("should display error when login fails", async () => {
    const errorMessage = "Invalid login details";
    loginUser.mockRejectedValueOnce(new Error(errorMessage));

    render(<LoginForm setIsLoggedIn={mockSetIsLoggedIn} />, {
      wrapper: MemoryRouter,
    });

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "Password1!" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Login/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test("should navigate to change password page when Change Password is clicked", () => {
    render(<LoginForm setIsLoggedIn={mockSetIsLoggedIn} />, {
      wrapper: MemoryRouter,
    });

    fireEvent.click(screen.getByRole("button", { name: /Change Password/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/change-password");
  });
});
