import PropTypes from "prop-types";

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
    <div className="flex flex-wrap justify-center mt-2">
      {arabicLetters.map((letter) => (
        <button
          key={letter}
          onMouseDown={(e) => {
            e.preventDefault();
            onKeyPress(letter);
          }}
          className="p-3 m-1 text-lg sm:p-4 sm:m-2 sm:text-xl border border-primary rounded bg-lightWhite text-darkPurple hover:bg-primary hover:text-lightWhite transition-colors duration-300"
        >
          {letter}
        </button>
      ))}
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          onKeyPress("delete");
        }}
        className="p-3 m-1 text-lg sm:p-4 sm:m-2 sm:text-xl border border-primary rounded bg-lightWhite text-darkPurple hover:bg-primary hover:text-lightWhite transition-colors duration-300"
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
