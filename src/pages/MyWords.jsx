import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { getSavedWords, deleteWord } from "../services/api.service";
import { FiTrash2 } from "react-icons/fi";

const MyWords = ({ words, setWords }) => {
  const [selectedWords, setSelectedWords] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const data = await getSavedWords();
        setWords(data);
      } catch (error) {
        setErrorMessage("An error occurred while fetching saved words.");
      }
    };
    fetchWords();
  }, [setWords]);

  const handleSelectWord = (word) => {
    setSelectedWords((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };

  const handleDeleteWords = async () => {
    try {
      await Promise.all(selectedWords.map((word) => deleteWord(word.word)));
      setWords((prev) => prev.filter((word) => !selectedWords.includes(word)));
      setSelectedWords([]);
    } catch (error) {
      setErrorMessage("An error occurred while deleting words.");
    }
  };

  return (
    <div className="my-words-container p-4 md:p-10">
      <h1 className="text-4xl font-bold mb-6 text-center text-primary">
        My Words
      </h1>
      {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDeleteWords}
          disabled={selectedWords.length === 0}
          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 disabled:opacity-50"
          aria-label="delete"
        >
          <FiTrash2 className="h-6 w-6" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-primary text-white">
            <tr>
              <th className="w-1/3 px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                <span className="hidden sm:inline">Arabic Word</span>
                <span className="inline sm:hidden">Word</span>
              </th>
              <th className="w-1/3 px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider hidden sm:table-cell">
                English Meaning
              </th>
              <th className="w-1/6 px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Test Score
              </th>
              <th className="w-1/12 px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Select
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {words && words.length > 0 ? (
              words.map((word) => (
                <tr key={word.id || word.word}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <Link
                        to={`/word/${word.word}`}
                        className="text-primary hover:underline text-lg"
                      >
                        {word.translation}
                      </Link>
                      <span className="text-gray-500 text-sm sm:hidden">
                        {word.word}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    {word.word}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {word.testScores && word.testScores.length > 0
                      ? word.testScores[0].score
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedWords.includes(word)}
                      onChange={() => handleSelectWord(word)}
                      className="form-checkbox h-5 w-5 text-primary"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No words saved yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

MyWords.propTypes = {
  words: PropTypes.array.isRequired,
  setWords: PropTypes.func.isRequired,
};

export default MyWords;
