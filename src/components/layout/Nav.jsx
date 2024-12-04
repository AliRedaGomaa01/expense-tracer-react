import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import MenuIcon from "./MenuIcon";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isOpen && <MenuIcon isOpen={isOpen} setIsOpen={setIsOpen} className={`${!isOpen ? " opacity-100" : "opacity-10"}`} />}

      <nav className={`max-sm:side-menu-nav ${isOpen ? "max-sm:opacity-100 max-sm:translate-x-0" : "max-sm:opacity-0 max-sm:translate-x-[100%]"} `} >

        <ul className="flex flex-col gap-7 max-sm:items-center sm:flex-row sm:gap-3 ">
          <li>
            <MenuIcon isOpen={isOpen} setIsOpen={setIsOpen} className={`${isOpen ? "opacity-100" : "opacity-10"}`} />
          </li>
          <li>
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? "active" : ""} `}>Home</NavLink>
          </li>
          <li>
            <NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? "active" : ""} `}>Login</NavLink>
          </li>
          <li>
            <NavLink to="/register" className={({ isActive }) => `nav-link ${isActive ? "active" : ""} `}>Register</NavLink>
          </li>
        </ul>

      </nav>
    </>
  )
};

export default Nav;