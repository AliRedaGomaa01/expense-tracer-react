import axios from 'axios';
import { useState } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import Modal from '../ui/Modal';
import { useNavigate } from 'react-router-dom';

export default function DeleteUserForm({ ...props }) {
    const { state, dispatch } = useGlobalContext();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [openDeletionModal, setOpenDeletionModal] = useState(false);

    const openDeletionModalFn = () => {
        setOpenDeletionModal(true);
    };


    const closeModal = () => {
        setOpenDeletionModal(false);
        setErrors({});
        setFormData({
            password: '',
        });
    };

    const deleteUser = (e) => {
        try {
            e.preventDefault();

            setProcessing(true);

            if (formData?.password?.trim() == '') {
                setErrors({
                    password: ['Password is required'],
                })
                setProcessing(false);
                return;
            }

            axios.delete(`${process.env.REACT_APP_API_URL}/profile`, {
                data: formData,
                headers: {
                    Authorization: `Bearer ${state?.auth?.token?.text}`,
                },
            }).then(response => {
                console.log(response.data);
                if (response.data.status === "error") {
                    // console.log(Object.values(response.data.errors));
                    setErrors({ ...response.data.errors });
                } else if (response.data.status === "Unauthenticated") {
                    dispatch({ type: "RESET_AUTH" });
                    dispatch({ type: "SET_FLASH_MSG", payload:  { ...state.flashMsg, error: 'Logged Out' } });
                    navigate('/');
                } else if (response.data.status === "success") {
                    dispatch({ type: "RESET_AUTH" });
                    dispatch({ type: "SET_FLASH_MSG", payload:  { ...state.flashMsg, success: 'Account deleted successfully' } });
                    navigate('/');
                }
            }).catch(axiosError => {
                console.log(axiosError);
            });
        } catch (error) {
            console.log(error);
            setErrors({ form: "An error occurred. Please try again." });

        }

        setProcessing(false);
    };


    return (
        <>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Account Deletion
                </h2>

                {errors?.form && (
                    <p className="mb-4 text-sm text-red-600 text-center">{errors?.form}</p>
                )}

                <p className="mt-1 text-sm text-gray-600">
                    Once you delete your account, all of its resources and data will be permanently deleted. Before deleting your account, please store any data or information you wish to keep.
                </p>
            </header>

            <button className='danger-button' onClick={openDeletionModalFn}>
                Delete Account
            </button>

            <Modal isOpen={openDeletionModal} onClose={closeModal} title={"Account Deletion"}>
                <form onSubmit={deleteUser} className="p-6 flex flex-col gap-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Are you sure you want to delete your account?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Once you delete your account, all of its resources and data will be permanently deleted. Before deleting your account, please store any data or information you wish to keep.
                    </p>

                    <div className="">
                        <label htmlFor="password-delete" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="relative mt-1">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password-delete"
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

                    <div className="flex justify-stretch content-center gap-3">
                        <button type="button" className="secondary-button" onClick={closeModal}>
                            Cancel
                        </button>

                        <button type='submit' className="danger-button" disabled={processing}>
                            Delete Account
                        </button>
                    </div>

                    {errors?.password?.length > 0 && (
                        <div className="mt-4 p-3 text-red-700 bg-red-100 border border-red-300 rounded">
                            <ul className="list-disc list-inside">
                                {!!errors?.password && errors?.password?.map((error, index) => (
                                    <>
                                        {Array.isArray(error) && error.map((err, index) => (
                                            <li key={index}>{err}</li>
                                        ))}
                                        {!Array.isArray(error) && <li key={index}>{error}</li>}
                                    </>
                                ))}
                            </ul>
                        </div>
                    )}
                </form>
            </Modal>
        </>
    );
}
