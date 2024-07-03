import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getRandomWords } from "../services/api.service";

const EasyTest = ({ onEndTest }) => {
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    try {
      const words = await getRandomWords();
      let randomWord;
      do {
        randomWord = words[Math.floor(Math.random() * words.length)];
      } while (randomWord.word === question?.word);

      setQuestion(randomWord);
      const options = getOptions(randomWord.translation, words);
      setOptions(options);
    } catch (error) {
      setError("Failed to fetch questions. Please try again.");
      setQuestion(null);
      setOptions([]);
    }
  };

  const getOptions = (correctTranslation, words) => {
    const options = [correctTranslation];
    while (options.length < 5) {
      const randomWord =
        words[Math.floor(Math.random() * words.length)].translation;
      if (!options.includes(randomWord)) {
        options.push(randomWord);
      }
    }
    return options.sort(() => Math.random() - 0.5);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setFeedback(option === question.translation ? "correct" : "incorrect");
    setTimeout(() => {
      setFeedback("");
      setSelectedOption("");
      fetchQuestion();
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      {error && <p className="text-red-500">{error}</p>}
      {question ? (
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            {question.word}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionSelect(option)}
                className={`py-2 px-4 border rounded transition duration-300 ${
                  selectedOption === option
                    ? feedback === "correct"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                    : "hover:bg-primary hover:text-white"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p>No words available for testing.</p>
      )}
      <button
        onClick={onEndTest}
        className="mt-4 py-2 px-4 bg-primary text-white rounded shadow"
      >
        End Test
      </button>
    </div>
  );
};

EasyTest.propTypes = {
  onEndTest: PropTypes.func.isRequired,
};

export default EasyTest;
