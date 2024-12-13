import axios from "axios";
import React, { useState } from "react";
import InputError from "../../components/InputError";
import { useGlobalContext } from "../../context/GlobalContext";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { state, dispatch } = useGlobalContext();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    if (!email) {
      setErrors({ email: ["Email is required."] });
      return;
    }

    // Regex for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors({ email: ["Please enter a valid email."] });
      return;
    }

    setIsSubmitting(true);

    try {
      localStorage.setItem("reset_password_email", email);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/forgot-password`, { email });
    if (response.data.status === "errors") {
      setErrors(response.data.errors);
      return;
    } else if (response.data.status === "success") {
      setSuccessMessage("Password reset link has been sent to your email.");
      setEmail(""); // Reset the form
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
      Forgot Password
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`my-input ${errors?.email ? "border-red-500" : "border-gray-300"}`}
          required

        />

        <InputError errors={errors?.email} />

      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`primary-button`}
      >
        {isSubmitting ? "Processing..." : "Submit"}
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

export default ForgotPassword;
