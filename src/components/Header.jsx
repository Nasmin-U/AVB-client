import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ToggleBtn from "./ToggleBtn";

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      const token = sessionStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    window.addEventListener("storage", handleStorageChange);

    const token = sessionStorage.getItem("token");
    setIsLoggedIn(!!token);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [setIsLoggedIn]);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav
      className="shadow-md p-4 relative z-10"
      style={{ backgroundColor: "var(--primary-color)" }}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold flex items-center">
          <img src="/logo.svg" alt="logo" className="w-8 h-8 mr-2" />
          <span className="hidden sm:inline">Arabic Vocabulary Builder</span>
        </Link>
        <div className="flex items-center">
          <div
            className={`flex-col sm:flex-row ${
              isMenuOpen ? "flex" : "hidden"
            } sm:flex items-center absolute sm:relative top-14 sm:top-0 left-0 w-full sm:w-auto bg-primary sm:bg-transparent p-4 sm:p-0`}
          >
            <Link
              to="/"
              className="text-white px-2 py-1 hover:text-lightGrey"
              onClick={toggleMenu}
            >
              Home
            </Link>
            {isLoggedIn && (
              <Link
                to="/my-words"
                className="text-white px-2 py-1 hover:text-lightGrey"
                onClick={toggleMenu}
              >
                My Words
              </Link>
            )}
            <Link
              to="/test-me"
              className="text-white px-2 py-1 hover:text-lightGrey"
              onClick={toggleMenu}
            >
              Test Me
            </Link>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-white px-2 py-1 hover:text-lightGrey"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white px-2 py-1 hover:text-lightGrey"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-white px-2 py-1 hover:text-lightGrey"
                  onClick={toggleMenu}
                >
                  Signup
                </Link>
              </>
            )}
          </div>
          <div
            className="sm:hidden flex flex-col justify-between items-center h-6 w-6 ml-4 cursor-pointer"
            onClick={toggleMenu}
          >
            <div
              className={`h-0.5 w-full bg-white transition-transform duration-300 ${
                isMenuOpen ? "transform rotate-45 translate-y-2" : ""
              }`}
            ></div>
            <div
              className={`h-0.5 w-full bg-white transition-opacity duration-300 ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            ></div>
            <div
              className={`h-0.5 w-full bg-white transition-transform duration-300 ${
                isMenuOpen ? "transform -rotate-45 -translate-y-2" : ""
              }`}
            ></div>
          </div>
          <ToggleBtn className="ml-4" />
        </div>
      </div>
    </nav>
  );
};

Header.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  setIsLoggedIn: PropTypes.func.isRequired,
};

export default Header;
