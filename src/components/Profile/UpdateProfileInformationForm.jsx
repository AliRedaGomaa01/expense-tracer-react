import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../context/GlobalContext";

const UpdateProfileInformationForm = () => {
    const { state, dispatch } = useGlobalContext();

    const auth = state?.auth;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: auth?.user?.name ?? '',
        email: auth?.user?.email ?? ''
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = ["Name is required."];
        if (!formData.email.trim()) {
            newErrors.email = ["Email is required."];
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = ["Email is invalid."];
        }
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setProcessing(true);
        setSuccessMessage("");
        try {
            axios.patch(`${process.env.REACT_APP_API_URL}/profile`, formData, {
                headers: {
                    Authorization: `Bearer ${state?.auth?.token?.text}`
                }
            }).then(response => {
                // console.log(response.data);
                if (response.data.status === "error") {
                    setErrors({ ...response.data.errors });
                } else if (response.data.status === "Unauthenticated") {
                    dispatch({ type: "RESET_AUTH" });
                    dispatch({ type: "SET_FLASH_MSG", payload:  { ...state.flashMsg, error: 'Logged Out' } });
                    navigate('/');
                } else if (response.data.status === "success") {
                    let user = response.data.data.user;
                    let successMessageContent = "Profile updated successfully! " + (user.email != auth.user.email ? "And a new verification has been sent to your new email" : "");
                    auth.user = user;
                    localStorage.setItem("auth", JSON.stringify(auth));
                    dispatch({ type: "SET_STATE", payload: { ...state, auth: auth } });
                    setSuccessMessage(successMessageContent);
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
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <h2 className="text-2xl font-bold text-center mb-4">Update Profile Information </h2>
            {errors?.form && (
                <p className="mb-4 text-sm text-red-600 text-center">{errors?.form}</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`my-input ${errors?.name ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors?.name?.length > 0 && (
                        <div className="mt-4 p-3 text-red-700 bg-red-100 border border-red-300 rounded">
                            <ul className="list-disc list-inside">
                                {errors?.name?.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`my-input ${errors?.email ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors?.email?.length > 0 && (
                        <div className="mt-4 p-3 text-red-700 bg-red-100 border border-red-300 rounded">
                            <ul className="list-disc list-inside">
                                {errors?.email?.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={!!processing}
                    className={`primary-button`}
                >
                    {processing ? "Processing..." : "Update Profile"}
                </button>
            </form>
            {successMessage && (
                <div className="text-green-600 rounded mt-2 ">
                    {successMessage}
                </div>
            )}
        </>
    );
};

export default UpdateProfileInformationForm;
