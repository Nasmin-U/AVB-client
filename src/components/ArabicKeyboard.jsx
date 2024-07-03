import PropTypes from "prop-types";
import "./css/ArabicKeyboard.css";

const ArabicKeyboard = ({ onKeyPress }) => {
  const arabicLetters = [
    "ا",
    "ب",
    "ت",
    "ث",
    "ج",
    "ح",
    "خ",
    "د",
    "ذ",
    "ر",
    "ز",
    "س",
    "ش",
    "ص",
    "ض",
    "ط",
    "ظ",
    "ع",
    "غ",
    "ف",
    "ق",
    "ك",
    "ل",
    "م",
    "ن",
    "ه",
    "و",
    "ي",
  ];

  return (
    <div className="arabic-keyboard">
      {arabicLetters.map((letter) => (
        <button
          key={letter}
          onMouseDown={(e) => {
            e.preventDefault(); 
            onKeyPress(letter);
          }}
          className="arabic-key"
        >
          {letter}
        </button>
      ))}
      <button
        onMouseDown={(e) => {
          e.preventDefault(); 
          onKeyPress("delete");
        }}
        className="arabic-key delete-key"
      >
        ⌫
      </button>
    </div>
  );
};

ArabicKeyboard.propTypes = {
  onKeyPress: PropTypes.func.isRequired,
};

export default ArabicKeyboard;
