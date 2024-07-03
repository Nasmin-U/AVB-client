import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, test, vi, beforeEach, expect } from "vitest";
import { signUpUser } from "../src/services/api.service";
import "@testing-library/jest-dom";
import SignupForm from "../src/components/SignupForm";

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

describe("SignupForm suite tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should render the signup form", () => {
    render(<SignupForm setIsLoggedIn={mockSetIsLoggedIn} />, {
      wrapper: MemoryRouter,
    });

    expect(screen.getByText("Sign Up Here!")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your password")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Confirm your password")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign Up/i })
    ).toBeInTheDocument();
  });

  test("should display validation errors", async () => {
    render(<SignupForm setIsLoggedIn={mockSetIsLoggedIn} />, {
      wrapper: MemoryRouter,
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    await waitFor(() => {
      expect(screen.getByText("Email is required.")).toBeInTheDocument();
      expect(screen.getByText("Password is required.")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "Password1!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm your password"), {
      target: { value: "Password2!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
    });
  });

  test("should allow users to sign up with correct credentials", async () => {
    signUpUser.mockResolvedValueOnce({ token: "test-token" });

    render(<SignupForm setIsLoggedIn={mockSetIsLoggedIn} />, {
      wrapper: MemoryRouter,
    });

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "Password1!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm your password"), {
      target: { value: "Password1!" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));
    });

    await waitFor(() => {
      expect(
        screen.getByText("Signup successful! Redirecting to login...")
      ).toBeInTheDocument();
    });

    await new Promise((resolve) => setTimeout(resolve, 2100));
    expect(mockNavigate).toHaveBeenCalledWith("/login?redirect=%2F");
  });

  test("should display error when signup fails", async () => {
    const errorMessage = "Signup failed";
    signUpUser.mockRejectedValueOnce(new Error(errorMessage));

    render(<SignupForm setIsLoggedIn={mockSetIsLoggedIn} />, {
      wrapper: MemoryRouter,
    });

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "Password1!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm your password"), {
      target: { value: "Password1!" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
