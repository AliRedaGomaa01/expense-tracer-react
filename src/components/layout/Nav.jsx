import { NavLink } from "react-router-dom";

const Nav = () => {
  return (
    <>
      <nav >
        <ul className="flex flex-row gap-3">
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