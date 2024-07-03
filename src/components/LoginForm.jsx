import { useState } from "react";
import { useNavigate, useLocation} from "react-router-dom";
import PropTypes from "prop-types";
import { loginUser } from "../services/api.service";
import InputField from "./InputField";
import Button from "./Button";

const LoginForm = ({setIsLoggedIn}) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loginMessage, setLoginMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const newErrors = validate();
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
  } else {
    try {
      await loginUser(formData);
      setErrors({});
      setLoginMessage("Login successful! Redirecting...");
      setIsLoggedIn(true);
      const redirect =
        new URLSearchParams(location.search).get("redirect") || "/";
      setTimeout(() => {
        navigate(redirect);
      }, 2000);
    } catch (error) {
      setLoginMessage("");
      setErrors({ form: error.message });
    }
  }
  };

  return (
    <div className="md:pt-20">
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-semibold mb-4">Login Here!</h2>
        <InputField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="Enter your email"
        />
        <InputField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Enter your password"
        />
        <div>
          <Button type="submit" className="w-full mt-4" onClick={() => {}}>
            Login
          </Button>
          {errors.form && (
            <p className="mt-2 text-sm text-red-600">{errors.form}</p>
          )}
          {loginMessage && (
            <p className="mt-2 text-sm text-green-600">{loginMessage}</p>
          )}
          <Button
            type="button"
            className="w-full mt-4 bg-secondary hover:bg-secondary-dark"
            onClick={() => navigate("/change-password")}
          >
            Change Password
          </Button>
        </div>
      </form>
    </div>
  );
};

LoginForm.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired,
};

export default LoginForm;

