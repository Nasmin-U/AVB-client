import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types"; 
import { getWordDetails, saveWord } from "../services/api.service";
import Modal from "../components/Modal";
import Button from "../components/Button";
import { AiOutlinePlus } from "react-icons/ai";
import "./css/WordPage.css";

const WordPage = ({ setWords }) => {
  const { word } = useParams();
  const [wordData, setWordData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWordData = async () => {
      try {
        const data = await getWordDetails(word);
        setWordData(data);
      } catch (error) {
        setErrorMessage("An error occurred while fetching word details.");
      }
    };
    fetchWordData();
  }, [word]);

  const handleAddToMyWords = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setIsModalOpen(true);
      return;
    }

    try {
      const savedWord = await saveWord({
        word: wordData.word,
        translation: wordData.translation,
      });
      setSuccessMessage("Word added to your saved words!");
      setErrorMessage("");
      
 setTimeout(() => setSuccessMessage(""), 3000);

    
      setWords((prevWords) => [...prevWords, savedWord]);
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage("An error occurred while saving the word.");
       setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  if (errorMessage) {
    return <p className="error-message">{errorMessage}</p>;
  }

  if (!wordData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="word-page-container max-w-4xl mx-auto p-6 bg-lightWhite rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-4">{wordData.word}</h1>
        <button
          onClick={handleAddToMyWords}
          className="flex items-center text-white bg-primary hover:bg-darkPurple font-bold py-2 px-4 rounded"
        >
          <AiOutlinePlus className="mr-2" /> Add to My Words
        </button>
      </div>
      <p className="text-xl mb-2">Translation: {wordData.translation}</p>
      <p className="text-xl mb-2">Pronunciation: {wordData.pronunciation}</p>
      <audio controls className="mb-4">
        <source src={wordData.audioFile} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <p className="text-xl mb-4">Root: {wordData.root || "N/A"}</p>
      <div
        className="mb-4"
        dangerouslySetInnerHTML={{ __html: wordData.definitionHTML }}
      />
      <a
        href={`https://en.wiktionary.org/wiki/${wordData.translation}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline mb-4 inline-block"
      >
        Wiktionary Link
      </a>
      {successMessage && (
        <p className="text-green-600 mt-4">{successMessage}</p>
      )}
      {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
     
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <p>You need to be logged in to save words. Please log in or sign up.</p>
        
        <Button
          onClick={() =>
            navigate(`/login?redirect=${encodeURIComponent(`/word/${word}`)}`)
          }
        >
          Login
        </Button>
        
        <Button
          onClick={() =>
            navigate(`/signup?redirect=${encodeURIComponent(`/word/${word}`)}`)
          }
        >
          Sign Up
        </Button>
      </Modal>
    </div>
  );
};

WordPage.propTypes = {
  setWords: PropTypes.func.isRequired,
};

export default WordPage;
