import axios from "axios";
import { useState } from 'react';
import { useGlobalContext } from "../context/GlobalContext";
import { useNavigate } from "react-router-dom";

export default function VerifyEmailFirst() {
  const { state , dispatch } = useGlobalContext();
  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleResendLink = async () => {
    setIsSubmitting(true);
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/email/verification-notification`, {} , { headers: { 
      Authorization : `Bearer ${state?.auth?.token?.text}` 
    } });

    if ( response.data.status === "success") {
      setSuccessMessage("Verification email has been sent to your email successfully.");
      setTimeout(() => {
        setSuccessMessage(null);
      } , 10000)

    } else if (response.data.status === "Unauthenticated") {

      dispatch({ type: "RESET_AUTH" });
      dispatch({ type: "SET_FLASH_MSG", payload: { ...state.flashMsg, error: 'Logged Out' } });
      navigate('/');
    }
    setIsSubmitting(false);
    
  };
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-gray-800 text-center">Verify Your Email To Reach Protected Pages</h1>
      <p className="mt-4 text-gray-600">Please check your email to verify your account.</p>
      <p className="mt-2 text-gray-600">If you haven't received the verification email, please check your spam folder.</p>
      <p className="mt-2 text-gray-600">If you still haven't received the verification email, please click the "Resend Verification Email" button to send it again.</p>
      <button className="primary-button" 
      onClick={handleResendLink} disabled={isSubmitting || !!successMessage}>
        Resend Verification Email
      </button>
      {!!successMessage && <p className="mt-4 text-green-600 ">{successMessage}</p>}
    </div>
  );
}