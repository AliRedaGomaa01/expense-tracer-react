import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from './../ui/Modal';
import { useState } from 'react';

export default function IndexTest({ state, dispatch, ...props }) {
  const navigate = useNavigate();
  const [openDeletionModal, setOpenDeletionModal] = useState(false);

  const closeModal = () => {
    setOpenDeletionModal(false);
  };
  const deleteAll = () => {
    axios.delete(`${process.env.REACT_APP_API_URL}/expenses/delete-all`, {
      headers: { Authorization: `Bearer ${state?.auth?.token?.text}` }
    })
      .then((response) => {
        closeModal();
        if (response.data.status === 'success') {
          dispatch({ type: "SET_FLASH_MSG", payload: { ...state.flashMsg, success: 'Deleted successfully' } });
          setTimeout(() => {
            window.location.reload();
          }, 1000)
        } else if (response.data.status === "Unauthenticated") {
          dispatch({ type: "RESET_AUTH" });
          dispatch({ type: "SET_FLASH_MSG", payload: { ...state.flashMsg, error: 'Logged Out' } });
          navigate('/');
        } else {
          console.log(response.data);
        }
      }).catch((error) => {
        console.log(error);
      });
  };
  const seed = () => {
    axios.post(`${process.env.REACT_APP_API_URL}/expenses/seed`, {}, {
      headers: { Authorization: `Bearer ${state?.auth?.token?.text}` }
    })
      .then((response) => {
        if (response.data.status === 'success') {
          dispatch({ type: "SET_FLASH_MSG", payload: { ...state.flashMsg, success: 'Seeded successfully' } });
          setTimeout(() => {
            window.location.reload();
          }, 1000)
        } else if (response.data.status === "Unauthenticated") {
          dispatch({ type: "RESET_AUTH" });
          dispatch({ type: "SET_FLASH_MSG", payload: { ...state.flashMsg, error: 'Logged Out' } });
          navigate('/');
        } else {
          console.log(response.data);
        }
      }).catch((error) => {
        console.log(error);
      });
  };


  return (
    <>
      {
        <>
          <h1 className="text-2xl text-center font-bold my-3 p-3  rounded-xl bg-black text-white ">Test Data</h1>

          <div className="my-4 grid gap-4 grid-cols-2 items-center justify-items-center ">
            <button onClick={seed} className={' primary-button ' 
            + (!!state?.flashMsg?.success && state?.flashMsg?.success === "Seeded successfully" && '!bg-green-500')}
            >
              {!!state?.flashMsg?.success && state?.flashMsg?.success === 'Seeded successfully' ? `${state?.flashMsg?.success}` : "Add Test Data"}
            </button>
            <button onClick={() => setOpenDeletionModal(true)} className={' danger-button ' 
            + (!!state?.flashMsg?.success && state?.flashMsg?.success === "Deleted successfully" && '!bg-green-500')}
              >
              {!!state?.flashMsg?.success && state?.flashMsg?.success === 'Deleted successfully' ? `${state?.flashMsg?.success}` : "Delete All Data"}
            </button>
          </div>
          <Modal isOpen={openDeletionModal} onClose={closeModal} >
            <div className="p-6 flex flex-col gap-6">
              <h2 className="text-lg font-medium text-gray-900">
                Are you sure you want to delete all expenses?
              </h2>

              <div className="flex justify-stretch content-center gap-3">
                <button type="button" className="secondary-button" onClick={closeModal}>
                  Cancel
                </button>

                <button type='button' className="danger-button" onClick={() => deleteAll()}>
                  Delete Account
                </button>
              </div>

            </div>
          </Modal>
        </>
      }
    </>
  );
}
