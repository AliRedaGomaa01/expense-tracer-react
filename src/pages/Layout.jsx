import { Outlet } from "react-router-dom";
import logo from "../logo.svg";
import Nav from "../components/layout/Nav";
import Footer from "../components/layout/Footer";

const Layout = () => {
  return (
    <>
      <div className="flex flex-col justify-between min-h-screen">
        <div className="flex flex-row justify-between items-center bg-my-grad  p-10 shadow-lg">
          <img src={logo} alt="logo" width="100px" height={"100px"}/>
          <Nav />
        </div>

        <div className="p-5 mx-auto min-w-[50vw] max-w-[90vw] bg-my-grad rounded-xl  shadow-my-rounded flex items-center justify-center">
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