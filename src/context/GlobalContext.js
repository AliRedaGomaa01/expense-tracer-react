import React, { createContext, useContext, useReducer } from "react";
import globalReducer from "./reducers/globalReducer";

const GlobalContext = createContext();

const initialState = {  }; 

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom Hook for using the Global Context
export const useGlobalContext = () => useContext(GlobalContext);