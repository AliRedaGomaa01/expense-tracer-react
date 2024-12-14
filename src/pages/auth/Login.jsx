import axios from "axios";
import React, { useState } from "react";
import { useGlobalContext } from "../../context/GlobalContext";
import { useNavigate } from "react-router-dom";
import InputError from "../../components/InputError";

const Login = () => {
  const { state, dispatch } = useGlobalContext();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const errors = {};
    if (!formData.email) errors.email = ["Email is required"];
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = ["Invalid email address"];
    if (!formData.password) errors.password = ["Password is required"];
    return errors;
  };

  const fillTestData = (e) => {
    if (e.target.checked) {
      setFormData({ email: "test@aly-h.com", password: "Test123$$" });
    } else {
      setFormData({ email: "", password: "" });
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    axios.post(`${process.env.REACT_APP_API_URL}/login`, formData)
      .then((response) => {
        if (response.data.status === "error") {
          setErrors({ ...response?.data?.errors });
          setIsSubmitting(false);
          return;
        } else if (response.data.status === "success") {
          localStorage.setItem("auth", JSON.stringify(response.data.data));
          dispatch({ type: "SET_STATE", payload: { state, auth: response.data.data } });
          dispatch({ type: "SET_FLASH_MSG", payload: { ...state.flashMsg, success: 'Logged in successfully' } });
          navigate('/');
        }
      }).catch((error) => {
        console.log(error);
        setErrors({ form: ["An error occurred. Please try again."] });
      });
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
        Login to Your Account
      </h2>

      <InputError errors={errors?.form} />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>

          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className={`my-input ${errors?.email ? "border-red-500" : "border-gray-300"}`}
            placeholder="Enter your email"
            required
          />

          <InputError errors={errors?.email} />

        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className={`my-input ${errors?.password ? "border-red-500" : "border-gray-300"}`}
              placeholder="Enter your password"
              required

            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 px-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <InputError errors={errors?.password} />

        </div>

        {/* Test Only Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isForTest"
            id="isForTest"
            onChange={fillTestData}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label htmlFor="isForTest" className="ml-2 block text-sm text-gray-700 max-w-[250px]">
            For Test Only ? <small className="text-xs text-red-500 font-bold flex flex-wrap" > ( * It’s recommended to register to avoid unexpected data issues caused by other testers sharing the same test account. * ) </small>
          </label>
        </div>

        <div className="text-gray-800 cursor-pointer underline" onClick={() => navigate('/forgot-password')}>
          Forgot the password ?
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`primary-button`}
        >
          {isSubmitting ? "Submitting..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
