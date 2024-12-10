import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";

const VerifyEmailForm = () => {

  const params = useParams();
  const navigate = useNavigate();
  const { state , dispatch } = useGlobalContext();

  const [formData, setFormData] = useState(
    {
      token: params.token ?? "",
    }
  );
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const auth = state?.auth;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    const validationErrors = {};
    if (!formData.token) validationErrors.token = ["Token is required."];

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/verify-email`, formData , { headers: { 
        Authorization : `Bearer ${state?.auth?.token?.text}` 
      } });

      // console.log(response.data);
      if (response.data.status === "error") {
        setErrors({ ...response.data.errors });
      } else if (response.data.status === "Unauthenticated") {
        dispatch({ type: "RESET_AUTH" });
        dispatch({ type: "SET_FLASH_MSG", payload:{ ...state.flashMsg, error: 'Logged Out' } } );
        navigate('/');
      } else if (response.data.status === "success") {
        let user = response.data.data.user;
        auth.user = user;
        localStorage.setItem("auth", JSON.stringify(auth));
        dispatch({ type: "SET_STATE", payload:{ ...state , auth: auth} }); 
        setSuccessMessage("Email has been verified successfully. You will be redirected soon.");
        dispatch({ type: "SET_FLASH_MSG", payload:  { ...state.flashMsg, success: 'Email has been verified successfully' } } );
        navigate('/');
      }
    } catch (error) {
      console.log(error);
      setErrors({ form: "An error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Verify Email
      </h2>
      {errors?.form && (
        <p className="mb-4 text-sm text-red-600 text-center">{errors?.form}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">

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
          />
          {errors?.token?.length > 0 && (
            <div className="mt-4 p-3 text-red-700 bg-red-100 border border-red-300 rounded">
              <ul className="list-disc list-inside">
                {errors?.token?.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`primary-button `}
        >
          {isSubmitting ? "Processing..." : "Verify Email"}
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

export default VerifyEmailForm;