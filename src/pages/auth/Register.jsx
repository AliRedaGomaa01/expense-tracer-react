import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useGlobalContext } from "../../context/GlobalContext";
import validatePasswordFn from "../../util/validatePasswordFn";
import InputError from "../../components/InputError";

const Register = () => {
  const { state, dispatch } = useGlobalContext();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

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


  const validatePassword = (password, password_confirmation) => {
    const passwordErrors = validatePasswordFn(password, password_confirmation);
    return passwordErrors;
  };

  const validate = () => {
    const errors = {};
    if (!formData.name) errors.name = ["Name is required"];
    if (!formData.email) errors.email = ["Email is required"];
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = ["Invalid email address"];

    const passwordErrors = validatePassword(
      formData.password,
      formData.password_confirmation
    );
    if (passwordErrors.length > 0) errors.password = passwordErrors;

    return errors;
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

    axios.post(`${process.env.REACT_APP_API_URL}/register`, formData)
      .then((response) => {
        if (response.data.status === "error") {
          setErrors({ ...response.data.errors });
          setIsSubmitting(false);
          return;
        } else if (response.data.status === "success") {
          localStorage.setItem("auth", JSON.stringify(response.data.data));
          dispatch({ type: "SET_STATE", payload: { state, auth: response.data.data } });
          dispatch({ type: "SET_FLASH_MSG", payload: { ...state.flashMsg, success: 'Registered successfully' } });
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
        Register an Account
      </h2>
      <InputError errors={errors?.form} />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>

          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className={`my-input ${errors?.name ? "border-red-500" : "border-gray-300"}`}
            placeholder="Enter your name"
            required

          />

          <InputError errors={errors?.name} />

        </div>

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

        <div>
          <label
            htmlFor="password_confirmation"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>

          <input
            type={showPassword ? "text" : "password"}
            name="password_confirmation"
            id="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            className={`my-input ${errors?.password_confirmation ? "border-red-500" : "border-gray-300"}`}
            placeholder="Confirm your password"
            required
          />
        </div>
        
        <InputError errors={errors?.password_confirmation} />

        <button
          type="submit"
          disabled={isSubmitting}
          className={`primary-button`}
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
