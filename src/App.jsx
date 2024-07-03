import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import ChangePasswordForm from "./components/ChangePasswordForm";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import WordPage from "./pages/WordPage";
import MyWords from "./pages/MyWords";
import TestMe from "./pages/TestMe";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [words, setWords] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <div className="flex-grow container mx-auto p-4 overflow-y-auto">
          <Routes>
            <Route
              path="/signup"
              element={<SignupForm setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route
              path="/login"
              element={<LoginForm setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route path="/change-password" element={<ChangePasswordForm />} />
            <Route path="/" element={<Home />} />
            <Route
              path="/word/:word"
              element={<WordPage setWords={setWords} />}
            />
            <Route
              path="/my-words"
              element={<MyWords words={words} setWords={setWords} />}
            />
            <Route path="/test-me" element={<TestMe />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
