import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ToggleBtn from "./ToggleBtn";
import "./css/Header.css";

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
    <nav className="navbar">
      <div className="navbar-container ">
        <Link to="/" className="navbar-brand flex">
          <img src="/logo.svg" alt="logo" className="max-w-7 mr-2" />
          Arabic Vocabulary Builder
        </Link>
        <div className="flex items-center">
          <div className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
            <Link to="/" className="navbar-link" onClick={toggleMenu}>
              Home
            </Link>
            {isLoggedIn && (
              <Link to="/my-words" className="navbar-link" onClick={toggleMenu}>
                My Words
              </Link>
            )}
            <Link to="/test-me" className="navbar-link" onClick={toggleMenu}>
              Test Me
            </Link>
            {isLoggedIn ? (
              <button onClick={handleLogout} className="navbar-button">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="navbar-link" onClick={toggleMenu}>
                  Login
                </Link>
                <Link to="/signup" className="navbar-link" onClick={toggleMenu}>
                  Signup
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center">
            <div
              className="hamburger"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <div className={`line ${isMenuOpen ? "open" : ""}`}></div>
              <div className={`line ${isMenuOpen ? "open" : ""}`}></div>
              <div className={`line ${isMenuOpen ? "open" : ""}`}></div>
            </div>
            <ToggleBtn className="toggle-btn" />
          </div>
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
