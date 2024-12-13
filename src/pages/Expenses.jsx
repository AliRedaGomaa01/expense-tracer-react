import axios from "axios";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import IndexTest from "../components/expenses/IndexTest";
import IndexSearch from "../components/expenses/IndexSearch";
import ExpensesShow from "../components/expenses/ExpensesShow";
import CreateNewInputs from "../components/expenses/CreateNewInputs";
import ExpenseSummary from "../components/expenses/ExpenseSummary";

export default function ExpenseIndex() {
  const { state, dispatch } = useGlobalContext();

  const [fetchedData, setFetchedData] = useState({});

  const [isLoading, setIsLoading] = useState(true);

  const [paginateUrl, setPaginateUrl] = useState(null);

  const navigate = useNavigate();

  const containerClasses = "bg-my-grad shadow-my-rounded p-5 rounded-xl";

  const loadData = (() => {
    setIsLoading(true);

    axios.get(`${process.env.REACT_APP_API_URL}/date`, {
      headers: { Authorization: `Bearer ${state?.auth?.token?.text}` }
    })
      .then((response) => {
        if (response.data.status === 'success') {
          setFetchedData(response.data.data);
          setPaginateUrl(response.data.data.dates.next_page_url);
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

    setIsLoading(false);
  });

  useEffect(() => {
    loadData();
  }, [])

  return (isLoading
    ? (<Loading />)
    : (
      <div className="min-w-[80vw] space-y-10 " id="transparent-parent">
        <div className={containerClasses}>
          <IndexTest state={state} dispatch={dispatch} />
        </div>

        <div className={containerClasses}>
          <CreateNewInputs setFetchedData={setFetchedData} categories={fetchedData?.categories} />
        </div>

        <div className={containerClasses}>
          <IndexSearch setFetchedData={setFetchedData} categories={fetchedData?.categories} filters={fetchedData?.filters} />
        </div>

        { !!fetchedData?.expenseData?.startDate && !!fetchedData?.expenseData?.endDate && <div className={containerClasses}>
          <ExpenseSummary expenseData={fetchedData?.expenseData} filters={fetchedData?.filters} />
        </div>}

        <ExpensesShow fetchedData={fetchedData} setFetchedData={setFetchedData} containerClasses={containerClasses}  paginateUrl={paginateUrl} setPaginateUrl={setPaginateUrl}/>
      </div>
    ))
}