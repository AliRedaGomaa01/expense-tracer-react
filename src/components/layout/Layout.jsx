import { NavLink, Outlet } from "react-router-dom";
import logo from "../../logo.svg";
import Nav from "./Nav";
import Footer from "./Footer";
import { useGlobalContext } from "../../context/GlobalContext";
import { useEffect } from "react";

const Layout = ({ isAuthenticated, isVerified }) => {
  const { state, dispatch } = useGlobalContext();

  useEffect(() => {
    if (state?.flashMsg?.success != false || state?.flashMsg?.error != false) {
      setTimeout(() => dispatch({ type: "CLEAR_FLASH_MSG" }), 1000);
    }
  }, [state?.flashMsg?.success, state?.flashMsg?.error]);

  return (
    <>
      <div className="flex flex-col justify-between gap-10 min-h-screen bg-yellow-50">
        <div className="">
          <div className="flex flex-row justify-between items-center bg-my-grad  p-10 shadow-lg">
            <NavLink to={'/'} className={''}> <img src={logo} alt="logo" width="100px" height={"100px"} /> </NavLink>
            <Nav isAuthenticated={isAuthenticated} isVerified={isVerified} />
          </div>
          {!!state?.flashMsg?.success && <div className="bg-green-100 p-3 text-center">{state?.flashMsg?.success}</div>}
          {!!state?.flashMsg?.error && <div className="bg-red-100 p-3 text-center">{state?.flashMsg?.error}</div>}
        </div>

        <div className="p-5 mx-auto min-w-[30vw] max-w-[90vw] rounded-xl flex items-center justify-center" id="main-container">
          <Outlet />
        </div>

        <div className="flex flex-row justify-center text-center items-center bg-my-grad  p-10 shadow-my-upper">
          <Footer />
        </div>
      </div>
    </>
  )
};

export default Layout;