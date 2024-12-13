import { useEffect, useState } from "react";
import { useGlobalContext } from "../../context/GlobalContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditCurrentExpenses from "./EditCurrentExpenses";

export default function ExpensesShow({ fetchedData, setFetchedData, containerClasses, paginateUrl, setPaginateUrl }) {
  const { state, dispatch } = useGlobalContext();

  const navigate = useNavigate();

  const [isLoadingPaginated, setIsLoadingPaginated] = useState(false);

  const LoadingMoreData = () => {
    if (!paginateUrl) {
      return;
    }

    setIsLoadingPaginated(true);

    axios.get(paginateUrl, {
      headers: { Authorization: `Bearer ${state?.auth?.token?.text}` }
    })
      .then((response) => {
        if (response.data.status === 'success') {
          setFetchedData({
            ...fetchedData,
            dates: {
              ...fetchedData.dates,
              data: [...fetchedData?.dates?.data, ...response?.data?.data?.dates?.data]
            }
          });
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

    setIsLoadingPaginated(false);
  }

  useEffect(() => {
    setPaginateUrl(fetchedData?.dates?.next_page_url);
  }, [fetchedData?.dates?.next_page_url])

  return (
    <>
      <div className={containerClasses}>

        <h1 className="text-2xl text-center font-bold my-3 p-3  rounded-xl bg-black text-white ">Show Recorded Expenses</h1>

        {!fetchedData?.dates?.data?.length && (
          <h3 className="text-xl text-center  p-3 rounded-xl ">
            There is no expenses
          </h3>
        )}

        {!!fetchedData?.dates?.data?.length && (
          <div className={" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start justify-between"} >
            {fetchedData?.dates?.data.map(date => (
              <div key={date.id} id={"date-id-" + date.id} className="border p-3 shadow-my-rounded rounded-xl">
                <h2 className="text-2xl font-bold text-center text-white bg-black p-3 rounded-xl ">
                  {date.date}  
                  <br  />  
                  <p className="bg-white my-3 p-2 rounded-xl text-sm text-black font-black w-fit mx-auto">  ( Expense Sum : {date.expenses_sum} )  </p>
                </h2>
                {!date?.expenses?.length && (
                  <h3 className="text-xl text-center  p-3 rounded-xl ">
                    There is no expenses
                  </h3>
                )}
                {!!date?.expenses?.length && <EditCurrentExpenses expenses={date?.expenses} categories={fetchedData?.categories} />}
              </div>
            ))}


            {isLoadingPaginated && <div className="w-full md:col-span-2 lg:col-span-3 text-center p-5" >
              "loading..."
            </div>}


            {!!paginateUrl && <button onClick={LoadingMoreData} className="primary-button md:col-span-2 lg:col-span-3 text-center p-5" disabled={!paginateUrl} >
              Load More
            </button>}
          </div>
        )}
      </div >
    </>
  )
}