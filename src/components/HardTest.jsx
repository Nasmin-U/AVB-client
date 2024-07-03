import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getRandomWords } from "../services/api.service";
import ArabicKeyboard from "../components/ArabicKeyboard";

const HardTest = ({ onEndTest }) => {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
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
    } catch (error) {
      setError("Failed to fetch questions. Please try again.");
      setQuestion(null);
    }
  };

  const handleAnswerSubmit = () => {
    const isCorrect =
      answer === question.translation || answer === question.word;
    setFeedback(isCorrect ? "correct" : "incorrect");
    setTimeout(() => {
      setFeedback("");
      setAnswer("");
      fetchQuestion();
    }, 1000);
  };

  const handleKeyPress = (key) => {
    if (key === "delete") {
      setAnswer(answer.slice(0, -1));
    } else {
      setAnswer(answer + key);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      {error && <p className="text-red-500">{error}</p>}
      {question ? (
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">{question.word}</h2>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full py-2 px-4 border rounded mb-4"
          />
          <ArabicKeyboard onKeyPress={handleKeyPress} />
          <button
            onClick={handleAnswerSubmit}
            className={`mt-4 py-2 px-4 border rounded w-full ${
              feedback === "correct"
                ? "bg-green-500 text-white"
                : feedback === "incorrect"
                ? "bg-red-500 text-white"
                : ""
            }`}
            data-testid="submit-button"
            data-feedback={feedback}
          >
            Submit
          </button>
        </div>
      ) : (
        <p>Loading...</p>
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

HardTest.propTypes = {
  onEndTest: PropTypes.func.isRequired,
};

export default HardTest;
