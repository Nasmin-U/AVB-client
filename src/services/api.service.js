import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const backendApi = axios.create({ baseURL: API_URL });

backendApi.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signUpUser = async (data) => {
  try {
    const res = await backendApi.post("/users/signup", data);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error during sign-up");
  }
};

export const loginUser = async (data) => {
  try {
    const res = await backendApi.post("/users/login", data);
    const token = res.data.token;
    sessionStorage.setItem("token", token);
    return { token };
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error during login");
  }
};

export const changePassword = async (data) => {
  try {
    const res = await backendApi.post("/users/change-password", data);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error changing password");
  }
};

export const searchWord = async (word) => {
  try {
    const res = await backendApi.get(`/words/search?word=${word}`);
    return res.data;
  } catch (error) {
    if (error.response.status === 404) {
      return null;
    }
    throw new Error(error.response?.data?.message || "Error searching word");
  }
};

export const getWordDetails = async (word) => {
  try {
    const res = await backendApi.get(`/words/search?word=${word}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching word details");
  }
};

export const saveWord = async (wordData) => {
  try {
    const res = await backendApi.post("/words/save", wordData);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error saving word");
  }
};

export const deleteWord = async (word) => {
  try {
    const res = await backendApi.delete(`/words/delete/${word}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error deleting word");
  }
};

export const getSavedWords = async () => {
  try {
    const res = await backendApi.get("/words/my-words");
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching saved words"
    );
  }
};

export const getRandomWords = async (count = 5) => {
  try {
    const res = await backendApi.get(`/words/random-words?count=${count}`);
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching random words"
    );
  }
};

export const saveTestScore = async (word, isCorrect) => {
  try {
    const res = await backendApi.post(`/words/test/${word}`, {
      score: isCorrect ? 1 : 0,
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error saving test score");
  }
};