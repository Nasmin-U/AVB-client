import { useState } from "react";
import OptionCard from "../components/OptionCard";
import EasyMode from "../components/EasyTest";
import HardMode from "../components/HardTest";

const TestMe = () => {
  const [mode, setMode] = useState(null);

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
  };

  const handleEndTest = () => {
    setMode(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 backdrop-blur-md rounded-lg  bg-opacity-60 shadow-md">
      <h1 className="text-4xl font-bold mb-6 text-center text-primary">
        Select The Test Difficulty
      </h1>
      {!mode ? (
        <div className="mode-selection flex flex-col md:flex-row gap-4">
          <OptionCard title="Easy" onClick={() => handleModeSelect("easy")} />
          <OptionCard title="Hard" onClick={() => handleModeSelect("hard")} />
        </div>
      ) : (
        <>
          {mode === "easy" && <EasyMode onEndTest={handleEndTest} />}
          {mode === "hard" && <HardMode onEndTest={handleEndTest} />}
        </>
      )}
    </div>
  );
};

export default TestMe;
