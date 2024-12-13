import axios from "axios";
import {  useState } from "react";
import InputError from "../InputError";
import Modal from "../ui/Modal";
import { useGlobalContext } from "../../context/GlobalContext";
import { useNavigate } from "react-router-dom";
import closeIcon from "../../assets/icons/Close-White.png";

  export default function EditCurrentExpenses({ expenses = [], categories, ...props }) {

  const { state, dispatch } = useGlobalContext();
  const navigate = useNavigate();

  const [currentExpenses, setCurrentExpenses] = useState(expenses || []);
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState({});
  const [statusIndex, setStatusIndex] = useState('');

  const [openDeletionModal, setOpenDeletionModal] = useState(false);
  const [openDeletionModalId, setOpenDeletionModalId] = useState(null);

  const closeModal = () => {
    setOpenDeletionModal(false);
    setOpenDeletionModalId(null);
  };

  const updateExpense = (e, id, index) => {

    const expense = currentExpenses.find((expense) => expense.id === id);
    setStatus('processing');
    setStatusIndex(index);

    axios.put(`${process.env.REACT_APP_API_URL}/expenses/${expense.id}`, expense, {
      headers: { Authorization: `Bearer ${state?.auth?.token?.text}` }
    })
      .then((response) => {
        if (response.data.status === 'success') {
          setStatus('success');
        } else if (response.data.status === "error") {
          setErrors({ ...errors, expenses: { [index]: { ...response.data.errors } } });
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

    setTimeout(() => {
      setStatus('');
      setStatusIndex('');
    }, 2000);
  }

  const deleteExpense = (e, id, index) => {

    const expense = currentExpenses.find((expense) => expense.id === id);

    axios.delete(`${process.env.REACT_APP_API_URL}/expenses/${expense.id}`, {
      headers: { Authorization: `Bearer ${state?.auth?.token?.text}` }
    })
      .then(async (response) => {
        if (response.data.status === 'success') {
          closeModal();
          setCurrentExpenses(prev => [...prev.filter((expense) => expense.id !== id)])
          if (currentExpenses.length - 1 === 0) { 
            document.getElementById('date-id-'+ expense.date_id).remove();
          }
          dispatch({ type: "SET_FLASH_MSG", payload: { ...state.flashMsg, success: 'Deleted successfully' } });
        } else if (response.data.status === "error") {
          setErrors({ ...response.data.errors });
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
  }

  return (
    <>
      {!!currentExpenses && currentExpenses.map(({ id, name, price, category_id }, index) => (
        <div className="" key={id}>
          <div className={'p-2 my-4 relative rounded-xl grid grid-cols-1 gap-5 shadow-my-rounded' + `${index % 2 == 0 ? ' bg-red-50' : ' bg-green-50'}`}>
            <div
              className="absolute top-2 right-2 rounded-full cursor-pointer bg-red-500 hover:bg-red-400 w-6 h-6 flex items-center justify-center text-white"
              onClick={(e) => { setOpenDeletionModal(true); setOpenDeletionModalId(id) }}
            >

              <img src={closeIcon} alt="close icon"
                width={"10px"}
                height={"10px"}
                className={`text-white`}
              />
            </div>
            <div className="mt-4">

              <label htmlFor="name" > Describe the expense </label>

              <input
                id="name"
                type="text"
                name="name"
                placeholder="e.g. food , bills , subscriptions , clothes , transport , and so on"
                value={name}
                className={`my-input  ${!!errors?.expenses && errors?.expenses[index]?.name ? "border-red-500" : "border-gray-300"}`}

                onChange={(e) => setCurrentExpenses(prev => prev.map((item, idx) => { if (idx === index) { item['name'] = e.target.value; } return item; }))}
                required
                autoComplete="off"
              />

              <InputError errors={!!errors?.expenses && errors?.expenses[index]?.name} />

            </div>

            <div className="mt-4">
              <label htmlFor="price" > Expenses Price  </label>

              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={price}
                className={`my-input ${!!errors?.expenses && errors?.expenses[index]?.price ? "border-red-500" : "border-gray-300"}`}
                onChange={(e) => setCurrentExpenses(prev => prev.map((item, idx) => { if (idx === index) { item['price'] = e.target.value; } return item; }))}
                required
                autoComplete="off"
              />

              <InputError errors={!!errors?.expenses && errors?.expenses[index]?.price} />

            </div>

            <div className="mt-4">
              <label htmlFor="category_id" > Category of expenses </label>

              <select name="category_id" id="category_id"
                className={`my-input ${!!errors?.expenses && errors?.expenses[index]?.category_id ? "border-red-500" : "border-gray-300"}`}
                onChange={(e) => setCurrentExpenses(prev => prev.map((item, idx) => { if (idx === index) { item['category_id'] = e.target.value; } return item; }))}
                required
                value={category_id}
              >

                <option value="" disabled> Choose a category </option>
                {!!categories && categories.map((category, index) => (
                  <option value={category.id} key={category.id}> {category.name} </option>
                ))}

              </select>

              <InputError errors={!!errors?.expenses && errors?.expenses[index]?.category_id} />

            </div>

            <div className="mt-4">
              {statusIndex !== index &&
                <button className='primary-button' onClick={(e) => updateExpense(e, id, index)} > Update </button>
              }
              {status == 'processing' && statusIndex === index &&
                <button className='primary-button !bg-yellow-700' > Processing... </button>
              }
              {status == 'success' && statusIndex === index &&
                <button className='primary-button !bg-green-700' > Updated Successfully </button>
              }
            </div>
          </div>

          <Modal isOpen={openDeletionModal && openDeletionModalId === id} onClose={closeModal} key={id} >
            <div className="p-6 flex flex-col gap-6">
              <h2 className="text-lg font-medium text-gray-900">
                Are you sure you want to delete this expenses?
              </h2>

              <div className="flex justify-stretch content-center gap-3">
                <button type="button" className="secondary-button" onClick={closeModal}>
                  Cancel
                </button>

                <button type="button" className="danger-button" onClick={(e) => deleteExpense(e, id, index)}>
                  Delete Account
                </button>
              </div>
            </div>
          </Modal>
        </div>
      ))
      }
    </>
  );
}
