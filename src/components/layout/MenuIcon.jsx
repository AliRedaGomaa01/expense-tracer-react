import menuIcon from "../../assets/icons/Menu.png";
const MenuIcon = ({ isOpen = false , setIsOpen , className = "" }) => (
  <img src={menuIcon} alt="menu icon"
    width={"40px"}
    height={"40px"}
    onClick={() => setIsOpen(!isOpen)}
    className={`cursor-pointer rounded-full p-1 border border-transparent hover:border-black 
              transition-[opacity_border] duration-1000 sm:hidden 
              ${isOpen ? " bg-white border-black" : ""}
              ${className}`} />
)

export default MenuIcon;