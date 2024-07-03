import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signUpUser } from "../services/api.service";
import PropTypes from "prop-types";
import InputField from "./InputField";
import Button from "./Button";

const SignupForm = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
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
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
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
        await signUpUser(formData);
        setErrors({});
        setSuccessMessage("Signup successful! Redirecting to login...");
        setIsLoggedIn(true);
        const redirect =
          new URLSearchParams(location.search).get("redirect") || "/";
        setTimeout(() => {
          navigate(`/login?redirect=${encodeURIComponent(redirect)}`);
        }, 2000);
      } catch (error) {
        setSuccessMessage("");
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
        <h2 className="text-2xl font-semibold mb-4">Sign Up Here!</h2>
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
        <InputField
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="Confirm your password"
        />
        <Button type="submit" className="w-full mt-4" onClick={() => {}}>
          Sign Up
        </Button>
        {errors.form && (
          <p className="mt-2 text-sm text-red-600">{errors.form}</p>
        )}
        {successMessage && (
          <p className="mt-2 text-sm text-green-600">{successMessage}</p>
        )}
      </form>
    </div>
  );
};
SignupForm.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired,
};
export default SignupForm;
