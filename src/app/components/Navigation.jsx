import { DarkThemeToggle, Navbar, Dropdown } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../favicon.svg";
import { FaUserCircle } from "react-icons/all";
import { useDispatch, useSelector } from "react-redux";
import { invoke } from "../features/authSlice";
import ButtonIcon from "./addons/ButtonIcon";
import { useNavigate } from "react-router-dom";

export default () => {
  let paths = useLocation()
    .pathname.split("/")
    .filter((s) => s.trim() !== "/" && s.trim().length > 1);
  const auth = useSelector((state) => state.auth.value);
  const dispatcher = useDispatch();
  const history = useNavigate();
  return (
    <Navbar fluid={false} rounded={false}>
      <Navbar.Brand href="/">
        <img src={Logo} className="mr-3 h-6 sm:h-9" alt="Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold text-gray-700 dark:text-white">
          Tågmästarna
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        {auth.isAuthenticated ? (
          <Dropdown
            class="p-2.5 cursor-pointer rounded-lg  text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
            label={<FaUserCircle className="h-6 w-6"></FaUserCircle>}
            arrowIcon={false}
          >
            <Dropdown.Item>
              <Link to="/profile">Profile</Link>
            </Dropdown.Item>
            <Dropdown.Item>
              <Link to="/tickets">Tickets</Link>
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                dispatcher(invoke());
                history("/");
              }}
            >
              Sign out
            </Dropdown.Item>
          </Dropdown>
        ) : (
          <ButtonIcon>
            <Link to="/login">
              <FaUserCircle className="h-6 w-6"></FaUserCircle>
            </Link>
          </ButtonIcon>
        )}

        <DarkThemeToggle />
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Link
          to="/"
          className={
            paths.length === 0
              ? "block py-2 pr-4 pl-3 md:p-0 bg-blue-700 text-white dark:text-white md:bg-transparent md:text-blue-700"
              : "block py-2 pr-4 pl-3 md:p-0 border-b border-gray-100  text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white"
          }
        >
          Home
        </Link>
        <Link
          to="/time-table"
          className={
            paths[0] === "time-table"
              ? "block py-2 pr-4 pl-3 md:p-0 bg-blue-700 text-white dark:text-white md:bg-transparent md:text-blue-700"
              : "block py-2 pr-4 pl-3 md:p-0 border-b border-gray-100  text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white"
          }
        >
          TimeTable
        </Link>
        <Link
          to="/contact-us"
          className={
            paths[0] === "contact-us"
              ? "block py-2 pr-4 pl-3 md:p-0 bg-blue-700 text-white dark:text-white md:bg-transparent md:text-blue-700"
              : "block py-2 pr-4 pl-3 md:p-0 border-b border-gray-100  text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white"
          }
        >
          Contact Us
        </Link>
      </Navbar.Collapse>
    </Navbar>
  );
};
