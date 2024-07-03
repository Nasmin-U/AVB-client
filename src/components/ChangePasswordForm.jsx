import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../services/api.service";

import InputField from "./InputField";
import Button from "./Button";

const ChangePasswordForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

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
    if (!formData.oldPassword) {
      newErrors.oldPassword = "Old password is required.";
    }
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required.";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters long.";
    }
    if (formData.newPassword !== formData.confirmPassword) {
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
        await changePassword(formData);
        setErrors({});
        setSuccessMessage(
          "Password changed successfully! Redirecting to login..."
        );
        setTimeout(() => {
          navigate("/login");
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
          label="Old Password"
          type="password"
          name="oldPassword"
          value={formData.oldPassword}
          onChange={handleChange}
          error={errors.oldPassword}
          placeholder="Enter your old password"
        />
        <InputField
          label="New Password"
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          error={errors.newPassword}
          placeholder="Enter your new password"
        />
        <InputField
          label="Confirm New Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="Confirm your new password"
        />
        <Button type="submit" className="w-full mt-4" onClick={() => {}}>
          Change Password
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


export default ChangePasswordForm;
