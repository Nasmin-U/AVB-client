import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ChangePasswordForm from "../src/components/ChangePasswordForm";
import { describe, test, vi, beforeEach, expect } from "vitest";
import { changePassword } from "../src/services/api.service";
import "@testing-library/jest-dom";

vi.mock("../src/services/api.service");

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("ChangePasswordForm suite tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should render the change password form", () => {
    render(<ChangePasswordForm />, { wrapper: MemoryRouter });

    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your old password")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your new password")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Confirm your new password")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Change Password/i })
    ).toBeInTheDocument();
  });

  test("should display validation errors", async () => {
    render(<ChangePasswordForm />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByRole("button", { name: /Change Password/i }));

    await waitFor(() => {
      expect(screen.getByText("Email is required.")).toBeInTheDocument();
      expect(screen.getByText("Old password is required.")).toBeInTheDocument();
      expect(screen.getByText("New password is required.")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your old password"), {
      target: { value: "OldPassword1!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your new password"), {
      target: { value: "NewPassword1!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm your new password"), {
      target: { value: "DifferentPassword1!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Change Password/i }));

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
    });
  });

  test("should allow users to change password with correct credentials", async () => {
    changePassword.mockResolvedValueOnce({ success: true });

    render(<ChangePasswordForm />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your old password"), {
      target: { value: "OldPassword1!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your new password"), {
      target: { value: "NewPassword1!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm your new password"), {
      target: { value: "NewPassword1!" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Change Password/i }));
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          "Password changed successfully! Redirecting to login..."
        )
      ).toBeInTheDocument();
    });

    await new Promise((resolve) => setTimeout(resolve, 2100));
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("should display error when changing password fails", async () => {
    const errorMessage = "Password change failed";
    changePassword.mockRejectedValueOnce(new Error(errorMessage));

    render(<ChangePasswordForm />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your old password"), {
      target: { value: "OldPassword1!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your new password"), {
      target: { value: "NewPassword1!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm your new password"), {
      target: { value: "NewPassword1!" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Change Password/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
