import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalContext } from "../../context/GlobalContext";
import validatePasswordFn from "../../util/validatePasswordFn";
import InputError from "../../components/InputError";

const ResetPassword = () => {
  const { state, dispatch } = useGlobalContext();

  const params = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(
    {
      token: params.token ?? "",
      email: localStorage.getItem("reset_password_email") ?? "",
      password: "",
      password_confirmation: "",
    }
  );
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const validatePassword = (password) => {
    const validationErrors = validatePasswordFn(password);
    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage(null);

    const validationErrors = {};
    if (!formData.email) validationErrors.email = ["Email is required."];
    if (!formData.token) validationErrors.token = ["Token is required."];
    if (!formData.password) validationErrors.password = ["Password is required."];
    else {
      const passwordErrors = validatePassword(formData.password);
      if (passwordErrors.length) validationErrors.password = passwordErrors;
    }
    if (formData.password !== formData.password_confirmation) {
      validationErrors.password_confirmation = ["The password field confirmation does not match."];
    }

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);


    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/reset-password`, formData);
      // console.log(response.data);
      if (response.data.status === "error") {
        
        setErrors({ ...response.data.errors });
        
      } else if (response.data.status === "success") {
        
        localStorage.removeItem("reset_password_email");
        setSuccessMessage("Password reset successfully. You will be redirected soon.");
        dispatch({ type: "SET_FLASH_MSG", payload: { ...state.flashMsg, error: 'Password reset successfully' } });
        navigate('/login');
        
      }
    } catch (error) {
      console.log(error);
      setErrors({ form: ["An error occurred. Please try again."] });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Reset Password
      </h2>

      <InputError errors={errors?.form} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>

          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
            className={`my-input ${errors?.email ? "border-red-500" : "border-gray-300"}`}
            required
          />

          <InputError errors={errors?.email} />

        </div>

        <div>
          <label
            htmlFor="token"
            className="block text-sm font-medium text-gray-700"
          >
            Token
          </label>

          <input
            type="text"
            id="token"
            name="token"
            value={formData.token}
            onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
            className={`my-input ${errors?.token ? "border-red-500" : "border-gray-300"}`}
            required
          />

          <InputError errors={errors?.token} />

        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>

          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
              className={`my-input ${errors?.password ? "border-red-500" : "border-gray-300"}`}
              required
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              {passwordVisible ? "Hide" : "Show"}
            </button>
          </div>

          <InputError errors={errors?.password} />

        </div>

        <div>
          <label
            htmlFor="password_confirmation"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>

          <input
            type={passwordVisible ? "text" : "password"}
            id="password_confirmation"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
            className={`my-input ${errors?.password_confirmation ? "border-red-500" : "border-gray-300"}`}
            required
          />

          <InputError errors={errors?.password_confirmation} />

        </div>

        <button
          type="submit"
          disabled={isSubmitting || !!successMessage}
          className={`primary-button`}
        >
          {isSubmitting ? "Processing..." : "Reset Password"}
        </button>
      </form>
      {successMessage && (
        <p className="mt-4 text-sm text-green-600 text-center">
          {successMessage}
        </p>
      )}
    </div>
  );
};

export default ResetPassword;