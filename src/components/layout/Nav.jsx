import { useState } from "react";
import { NavLink } from "react-router-dom";
import MenuIcon from "./MenuIcon";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems =  {
    Home: "/",
    Login: "/login",
    Register: "/register",}

  return (
    <>
      {!isOpen && <MenuIcon isOpen={isOpen} setIsOpen={setIsOpen} className={`${!isOpen ? " opacity-100" : "opacity-10"}`} />}

      <nav className={`max-sm:side-menu-nav ${isOpen ? "max-sm:opacity-100 max-sm:translate-x-0" : "max-sm:opacity-0 max-sm:translate-x-[100%]"} `} >

        <ul className="flex flex-col gap-7 max-sm:items-center sm:flex-row sm:gap-3 ">
          <li className="nav-list-item">
            <MenuIcon isOpen={isOpen} setIsOpen={setIsOpen} className={`${isOpen ? "opacity-100" : "opacity-10"}`} />
          </li>
          { Object.keys(navItems).map((name, index) => (
          <li key={name} className="nav-list-item">
            <NavLink to={navItems[name]} className={({ isActive }) => `nav-link ${isActive ? "active" : ""} `}> { name } </NavLink>
          </li>
          ))}
        </ul>

      </nav>
    </>
  )
};

export default Nav;