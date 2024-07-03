import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { searchWord } from "../services/api.service";
import Button from "../components/Button";
import ArabicKeyboard from "../components/ArabicKeyboard";
import "./css/Home.css";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const handleSearch = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const wordData = await searchWord(searchTerm);
      setLoading(false);
      if (wordData) {
        navigate(`/word/${searchTerm}`);
      } else {
        setErrorMessage("Word not found in the database.");
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage("An error occurred while searching for the word.");
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setErrorMessage("");
  };

  const handleArabicKeyPress = (letter) => {
    if (letter === "delete") {
      setSearchTerm((prev) => prev.slice(0, -1));
    } else {
      setSearchTerm((prev) => prev + letter);
    }
  };

  const handleFocus = () => {
    setShowKeyboard(true);
  };

  const handleBlur = (e) => {
    if (
      !e.relatedTarget ||
      (!e.relatedTarget.classList.contains("arabic-key") &&
        !e.relatedTarget.classList.contains("search-button"))
    ) {
      setShowKeyboard(false);
    }
  };

  return (
    <div className="home-container sm: pt-20 pb-20">
      <h1 className="title">Arabic Vocabulary Builder</h1>
      <div className="search-bar-container">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Search for a word in Arabic or English..."
          className="search-bar"
        />
        <Button
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleSearch}
          className="search-button"
          disabled={loading}
        >
          {loading ? (
            <div className="loading-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          ) : (
            "Search"
          )}
        </Button>
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {showKeyboard && <ArabicKeyboard onKeyPress={handleArabicKeyPress} />}
    </div>
  );
};

export default Home;
