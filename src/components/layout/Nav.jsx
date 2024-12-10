import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../context/GlobalContext";
import menuIcon from "../../assets/icons/Menu.png";
import closeIcon from "../../assets/icons/Close.png";

const Nav = ({ isAuthenticated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { state, dispatch } = useGlobalContext();
  const navigate = useNavigate();

  const neutralNavItems = useMemo(() => ({
    Home: "/",
  }), []);

  const [navItems, setNavItems] = useState({ ...neutralNavItems });

  const guestNavItems = useMemo(() => ({
    Login: "/login",
    Register: "/register",
  }), []);

  const authNavItems = useMemo(() => ({
    Profile: "/profile",
  }), []);

  useEffect(() => {
    setNavItems(isAuthenticated ? { ...neutralNavItems, ...authNavItems } : { ...neutralNavItems, ...guestNavItems });
  }, [isAuthenticated, guestNavItems, authNavItems, neutralNavItems]);

  const handleLogout = () => {
    try {

      dispatch({ type: "RESET_AUTH" });
      dispatch({ type: "SET_FLASH_MSG", payload: { ...state.flashMsg, success: 'Logged Out Successfully' }  });
      navigate('/');

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <img src={menuIcon} alt="menu icon"
        width={"40px"}
        height={"40px"}
        onClick={() => setIsOpen(prev => !prev)}
        className={`menu-icon ${!isOpen ? " border-black scale-100" : "border-transparent scale-[0.1]"}
              `} />

      <nav className={`max-sm:side-menu-nav ${isOpen ? "max-sm:opacity-100 max-sm:translate-x-0" : "max-sm:opacity-0 max-sm:translate-x-[100%]"} relative z-50 `} >

        <ul className="flex flex-col gap-7 max-sm:items-center sm:flex-row sm:gap-3 ">

          <li className={`nav-list-item 
              grid place-items-center text-center mx-auto  
              `}  >

            <img src={closeIcon} alt="close icon"
              width={"40px"}
              height={"40px"}
              onClick={() => setIsOpen(prev => !prev)}
              className={`menu-icon ${isOpen ? " border-black scale-100" : "border-transparent scale-[0.1]"}
              `} />

          </li>

          {Object.keys(navItems).map((name, index) => (
            <li key={name} className="nav-list-item">
              <NavLink to={navItems[name]} className={({ isActive }) => `nav-link ${isActive ? "active" : ""} `}> {name} </NavLink>
            </li>
          ))}

          {isAuthenticated && <li className="nav-list-item ">
            <button className={` nav-link bg-red-500 text-[white_!important]  `} onClick={handleLogout}> Logout </button>
          </li>}
        </ul>

      </nav>
    </>
  )
};

export default Nav;