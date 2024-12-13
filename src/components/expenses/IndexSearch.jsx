import axios from "axios";
import { useState } from "react";
import InputError from "../InputError";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../context/GlobalContext";

export default function IndexSearch({ setFetchedData, categories, filters, ...props }) {
  const { state, dispatch } = useGlobalContext();
  const navigate = useNavigate();

  const [data, setData] = useState({
    start_date: filters?.start_date ?? '',
    end_date: filters?.end_date ?? '',
    category_id: filters?.category_id ?? '0',
    name: filters?.name ?? '',
  });

  const [errors, setErrors] = useState({});

  const [processing, setProcessing] = useState(false);

  const search = (e) => {
    e.preventDefault();

    setProcessing(true);

    axios.get(`${process.env.REACT_APP_API_URL}/date?start_date=${data.start_date}&end_date=${data.end_date}&category_id=${data.category_id}&name=${data.name}`, {
      headers: { Authorization: `Bearer ${state?.auth?.token?.text}` }
    })
      .then((response) => {
        if (response.data.status === 'success') {
          dispatch({ type: "SET_FLASH_MSG", payload: { ...state.flashMsg, success: 'Filtered data successfully' } });
          setFetchedData(response.data.data);
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

    setProcessing(false);
  }

  return (
    <>
      <h1 className="text-2xl text-center font-bold my-3 p-3  rounded-xl bg-black text-white ">Search in Expenses</h1>

      <form onSubmit={search} className="my-5 grid grid-cols-1 md:grid-cols-2 content-center justify-center gap-5">
        <div className="flex flex-col">
          <label htmlFor="start_date" > Start Date  <small>( format : mm/dd/yyyy )</small> </label>
          <input
            id="start_date"
            type="date"
            name="start_date"
            value={data.start_date}
            className={`my-input ${errors?.password ? "border-red-500" : "border-gray-300"}`}
            onChange={(e) => setData({ ...data, 'start_date': e.target.value })}
          />

          <InputError errors={errors?.start_date} />

        </div>

        <div className="flex flex-col">
          <label htmlFor="end_date" >End Date <small>( format : mm/dd/yyyy )</small></label>
          <input
            id="end_date"
            type="date"
            name="end_date"
            value={data.end_date}
            className={`my-input ${errors?.password ? "border-red-500" : "border-gray-300"}`}
            onChange={(e) => setData({ ...data, 'end_date': e.target.value })}
          />

          <InputError errors={errors?.end_date} />

        </div>

        <div className="flex flex-col">
          <label htmlFor="name" > Expense Name </label>
          <input
            id="name"
            type="text"
            name="name"
            value={data.name}
            className={`my-input ${errors?.password ? "border-red-500" : "border-gray-300"}`}
            onChange={(e) => setData({ ...data, 'name': e.target.value })}
          />
          <InputError errors={errors?.name} />

        </div>

        <div className="flex flex-col">
          <label htmlFor="category_id" > Expense Category </label>
          
          <select
            name="category_id"
            id="category_id"
            className={`my-input ${errors?.password ? "border-red-500" : "border-gray-300"}`}
            onChange={(e) => setData({ ...data, 'category_id': e.target.value })}
            value={data['category_id']}
          >
            <option value="0" >
              All
            </option>
            {!!categories &&
              categories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
          </select>

          <InputError errors={errors?.category_id} />

        </div>

        <div className="flex justify-stretch mt-6 md:col-span-2">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 w-full"
            disabled={processing}
          >
            Search
          </button>
        </div>
      </form>
    </>
  );
}
