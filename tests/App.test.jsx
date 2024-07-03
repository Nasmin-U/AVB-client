import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, vi, expect , beforeEach} from "vitest";
import App from "../src/App";
import SignupForm from "../src/components/SignupForm";
import LoginForm from "../src/components/LoginForm";
import ChangePasswordForm from "../src/components/ChangePasswordForm";
import Home from "../src/pages/Home";
import WordPage from "../src/pages/WordPage";
import MyWords from "../src/pages/MyWords";
import TestMe from "../src/pages/TestMe";

vi.mock("../src/components/SignupForm");
vi.mock("../src/components/LoginForm");
vi.mock("../src/components/ChangePasswordForm");
vi.mock("../src/pages/Home");
vi.mock("../src/pages/WordPage");
vi.mock("../src/pages/MyWords");
vi.mock("../src/pages/TestMe");

describe("App component tests", () => {
  beforeEach(() => {
    SignupForm.mockImplementation(() => <div>SignupForm</div>);
    LoginForm.mockImplementation(() => <div>LoginForm</div>);
    ChangePasswordForm.mockImplementation(() => <div>ChangePasswordForm</div>);
    Home.mockImplementation(() => <div data-testid="home-page">Home</div>);
    WordPage.mockImplementation(() => <div>WordPage</div>);
    MyWords.mockImplementation(() => <div>MyWords</div>);
    TestMe.mockImplementation(() => <div>TestMe</div>);
  });

  test("should render Home page by default", async () => {
    window.history.pushState({}, "Home", "/");
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId("home-page")).toBeInTheDocument();
    });
  });

  test("should navigate to SignupForm on /signup route", async () => {
    window.history.pushState({}, "Signup", "/signup");
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("SignupForm")).toBeInTheDocument();
    });
  });

  test("should navigate to LoginForm on /login route", async () => {
    window.history.pushState({}, "Login", "/login");
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("LoginForm")).toBeInTheDocument();
    });
  });

  test("should navigate to ChangePasswordForm on /change-password route", async () => {
    window.history.pushState({}, "ChangePassword", "/change-password");
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("ChangePasswordForm")).toBeInTheDocument();
    });
  });

  test("should navigate to WordPage on /word/:word route", async () => {
    window.history.pushState({}, "WordPage", "/word/testword");
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("WordPage")).toBeInTheDocument();
    });
  });

  test("should navigate to MyWords on /my-words route", async () => {
    window.history.pushState({}, "MyWords", "/my-words");
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("MyWords")).toBeInTheDocument();
    });
  });

  test("should navigate to TestMe on /test-me route", async () => {
    window.history.pushState({}, "TestMe", "/test-me");
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("TestMe")).toBeInTheDocument();
    });
  });
});
