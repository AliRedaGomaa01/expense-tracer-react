import React, { useState } from "react";
import { useGlobalContext } from "../../context/GlobalContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import validatePasswordFn from "../../util/validatePasswordFn";

const UpdatePasswordForm = () => {
    const { state, dispatch } = useGlobalContext();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");

    const validatePassword = (password) => {
        const validationErrors = validatePasswordFn(password);
        return validationErrors;
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setErrors([]);
            setSuccessMessage("");
            setIsProcessing(true);

            const validationErrors = validatePassword(formData.password);
            if (formData.password !== formData.password_confirmation) {
                validationErrors.push("The password field confirmation does not match.");
            }

            if (validationErrors.length > 0) {
                setErrors({ ...errors, password: validationErrors });
                setIsProcessing(false);
                return;
            }

            if (formData?.current_password.trim() === "") {
                setErrors({ ...errors, current_password: ["Current password is required."] });
                setIsProcessing(false);
                return;
            }

            axios.patch(`${process.env.REACT_APP_API_URL}/profile-password`, formData, {
                headers: {
                    Authorization: `Bearer ${state?.auth?.token?.text}`
                }
            }).then(response => {
                // console.log(response.data);
                if (response.data.status === "error") {
                    setErrors({ ...response.data.errors });
                } else if (response.data.status === "Unauthenticated") {
                    dispatch({ type: "RESET_AUTH" });
                    dispatch({ type: "SET_FLASH_MSG", payload:{ ...state.flashMsg, error: 'Logged Out' } } );
                    navigate('/');
                } else if (response.data.status === "success") {
                    setSuccessMessage("Password has been updated successfully!");
                    setTimeout(() => {
                        setSuccessMessage(null);
                    }, 10000)
                }
            }).catch(axiosError => {
                console.log(axiosError);
            });
        } catch (error) {
            console.log(error);
            setErrors({ form: "An error occurred. Please try again." });
        }
        setIsProcessing(false);
    };

    return (
        <>
            <h2 className="text-2xl font-semibold text-gray-800 text-center">Update Password</h2>
            {errors?.form && (
                <p className="mb-4 text-sm text-red-600 text-center">{errors?.form}</p>
            )}
            <form onSubmit={handleSubmit} className="mt-6">
                <div className="mb-4">
                    <label htmlFor="password-current" className="block text-sm font-medium text-gray-700">
                        Current Password
                    </label>
                    <div className="relative mt-1">
                        <input
                            type={showCurrentPassword ? "text" : "password"}
                            id="password-current"
                            value={formData.current_password}
                            onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                            className={`my-input ${errors?.current_password ? "border-red-500" : "border-gray-300"}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute inset-y-0 right-0 px-4 text-gray-500 focus:outline-none"
                        >
                            {showCurrentPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    {errors?.current_password?.length > 0 && (
                        <div className="mt-4 p-3 text-red-700 bg-red-100 border border-red-300 rounded">
                            <ul className="list-disc list-inside">
                                {errors?.current_password?.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        New Password
                    </label>
                    <div className="relative mt-1">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className={`my-input ${errors?.password ? "border-red-500" : "border-gray-300"}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 px-4 text-gray-500 focus:outline-none"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    {errors?.password?.length > 0 && (
                        <div className="mt-4 p-3 text-red-700 bg-red-100 border border-red-300 rounded">
                            <ul className="list-disc list-inside">
                                {errors?.password?.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                        Confirm Password
                    </label>
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                        className={`my-input ${errors?.password_confirmation ? "border-red-500" : "border-gray-300"}`}
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        disabled={isProcessing}
                        className={`primary-button`}
                    >
                        {isProcessing ? "Processing..." : "Update Password"}
                    </button>
                </div>
            </form>
            {successMessage && (
                <div className="text-green-600 rounded mt-2 ">
                    {successMessage}
                </div>
            )}
        </>
    );
};

export default UpdatePasswordForm;
