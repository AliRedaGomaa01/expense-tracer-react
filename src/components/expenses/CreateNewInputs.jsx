import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputError from '../InputError';
import { useGlobalContext } from '../../context/GlobalContext';
import closeIcon from "../../assets/icons/Close-White.png";
import Modal from '../ui/Modal';

export default function CreateNewInputs({ initialData = null, categories, ...props }) {
  const [data, setData] = useState(initialData ?? {
    date: "",
    expenses: [],
  });

  const navigate = useNavigate();

  const { state, dispatch } = useGlobalContext();

  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const [openDeletionModal, setOpenDeletionModal] = useState(false);
  const [openDeletionModalIndex, setOpenDeletionModalIndex] = useState(null);

  const closeModal = () => {
    setOpenDeletionModal(false);
    setOpenDeletionModalIndex(null);
  };

  const submit = (e) => {
    e.preventDefault();

    axios.post(`${process.env.REACT_APP_API_URL}/expenses`, data, {
      headers: {
        Authorization: `Bearer ${state?.auth?.token?.text}`
      }
    })
      .then((response) => {

        if (response.data.status === "error") {

          setErrors({ ...response.data.errors });

        } else if (response.data.status === "Unauthenticated") {

          dispatch({ type: "RESET_AUTH" });
          dispatch({ type: "SET_FLASH_MSG", payload: { ...state.flashMsg, error: 'Logged Out' } });
          navigate('/');
          
        } else if (response.data.status === "success") {
          
          setData({
            date: data.date,
            expenses: [],
          })
          
          dispatch({ type: "SET_FLASH_MSG", payload: { ...state.flashMsg, success: 'Added successfully' } });
          
          setTimeout(() => {
            window.location.reload();
          },1000)
        }

        setProcessing(false);

      }).catch((error) => {

        console.log(error);

      });
  };

  const addNewExpense = (e) => {
    e.preventDefault();

    setData({
      ...data, expenses: [
        ...data.expenses,
        {
          name: '',
          price: '',
          category_id: '1',
        },
      ]
    });
  };

  const removeExpense = (e, index) => {
    e.preventDefault();

    setData({ ...data, expenses: [...data.expenses].filter((_, i) => i !== index) });

    closeModal();
  };

  return (
    <>
      <h1 className="text-2xl text-center font-bold my-3 p-3  rounded-xl bg-black text-white ">Add New Expenses</h1>

      <div className=" grid grid-cols-1 md:grid-cols-2 gap-3 items-stretch justify-items-stretch" >
        <div className='shadow-my-rounded bg-yellow-50 p-3 rounded-xl space-y-5 [&_input]:text-black'>
          <label htmlFor="date" > Expense Date <small>( format : mm/dd/yyyy )</small> </label>

          <input
            id="date"
            type="date"
            name="date"
            value={data.date}
            className={`my-input ${errors?.password ? "border-red-500" : "border-gray-300"}`}
            onChange={(e) => setData({ ...data, date: e.target.value })}
            required
          />

          <InputError errors={errors?.date} />
        </div>

        <div className='' >
          <button className={' primary-button h-full m-0  ' + (!!state?.flashMsg?.success  && state?.flashMsg?.success === "Added successfully" && 'bg-green-500')} onClick={addNewExpense} >  {!!state?.flashMsg?.success && !!state?.flashMsg?.success === "Added successfully" ? `${state?.flashMsg?.success}` : "+ Add New Input Fields"} </button>
        </div>

      </div>


      <form onSubmit={submit}>


        {!!data.expenses && data.expenses.map((expense, index) => (

          <div className={'p-2 my-4 relative rounded-xl grid grid-cols-1 md:grid-cols-3 gap-3 shadow-my-rounded' + `${index % 2 == 0 ? ' bg-red-50' : ' bg-green-50'}`} key={index}>
            <div
              className="absolute top-2 right-2 rounded-full cursor-pointer bg-red-500 hover:bg-red-400 w-6 h-6 flex items-center justify-center text-white space-y-5"
              onClick={(e) => { setOpenDeletionModalIndex(index); setOpenDeletionModal(true) }}
            >
              <img src={closeIcon} alt="close icon"
                width={"10px"}
                height={"10px"}
                className={`text-white`}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="name" > Describe the expense </label>

              <input
                id="name"
                type="text"
                name="name"
                placeholder="e.g. food , bills , subscriptions , clothes , transport , and so on"
                value={expense.name}
                className={`my-input ${errors?.password ? "border-red-500" : "border-gray-300"}`}

                onChange={(e) => setData({ ...data, expenses: [...data.expenses].map((item, idx) => { if (idx === index) { item['name'] = e.target.value }; return item; }) })}
                required
                autoComplete="off"
              />

              <InputError errors={errors?.expenses && errors?.expenses[index]['name']} />

            </div>

            <div className="space-y-2">
              <label htmlFor="price" > Expense Price </label>

              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={expense.price}
                className={`my-input ${errors?.password ? "border-red-500" : "border-gray-300"}`}

                onChange={(e) => setData({ ...data, expenses: [...data.expenses].map((item, idx) => { if (idx === index) { item['price'] = e.target.value }; return item; }) })}
                required
                autoComplete="off"
              />

              <InputError errors={errors?.expenses && errors?.expenses[index]?.price} />

            </div>

            <div className="space-y-2">
              <label htmlFor="category_id" > Expense Category </label>

              <select name="category_id" id="category_id"
                className={`my-input ${errors?.password ? "border-red-500" : "border-gray-300"}`}
                onChange={(e) => setData({ ...data, expenses: [...data.expenses].map((item, idx) => { if (idx === index) { item['category_id'] = e.target.value }; return item; }) })}
                required
                value={expense['category_id']}
              >
                <option value="" disabled> Choose a category </option>
                {!!categories && categories.map((category, index) => (
                  <option value={category.id} key={category.id}> {category.name} </option>
                ))}
              </select>

              <InputError errors={errors?.expenses && errors?.expenses[index]?.category_id} />

            </div>

            <Modal isOpen={openDeletionModal && openDeletionModalIndex === index} onClose={closeModal} key={index} >
              <div className="p-6 flex flex-col gap-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Are you sure you want to delete these inputs?
                </h2>

                <div className="flex justify-stretch content-center gap-3">
                  <button type="button" className="secondary-button" onClick={closeModal}>
                    Cancel
                  </button>

                  <button type="button" className="danger-button" onClick={(e) => removeExpense(e, index)}>
                    Delete Account
                  </button>
                </div>
              </div>
            </Modal>
          </div>
        ))}

        {data.expenses.length > 0 &&
          <>
            <div className="mt-4 flex items-center justify-end">
              <button className="primary-button" disabled={processing}>
                {processing ? 'Processing...' : 'Add'}
              </button>
            </div>
          </>
        }
      </form>
    </>
  );
}
