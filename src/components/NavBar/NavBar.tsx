import { FaHome } from "react-icons/fa";
import { FaLightbulb } from "react-icons/fa";
import { FaList } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { LuPiggyBank } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa";

const NavBar = () => {
  return (
    <div className="px-20 navbar bg-base-100 shadow-sm">
      <div className="navbar-start lg:hidden">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={-1}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow "
          >
            <li>
              <a>Homepage</a>
            </li>
            <li>
              <a>Portfolio</a>
            </li>
            <li>
              <a>About</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex-1 hidden lg:flex">
        <a className="btn btn-ghost text-sm">
          <FaHome />
          Home
        </a>
        <a className="btn btn-ghost text-sm">
          <FaLightbulb />
          Quiz
        </a>
        <a className="btn btn-ghost text-sm">
          <FaList />
          Recommendations
        </a>
        <a className="btn btn-ghost text-sm">
          <FaCalendarAlt />
          Trip Planner
        </a>
        <a className="btn btn-ghost text-sm">
          <LuPiggyBank />
          Branch
        </a>
        <a className="btn btn-ghost text-sm">
          <FaRegHeart />
          Favourites
        </a>
      </div>

      {/* beginning of profile section */}
      <div className="flex gap-2  w-full  justify-end">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={-1}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
