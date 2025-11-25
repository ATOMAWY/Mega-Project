import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaHome } from "react-icons/fa";
import { FaLightbulb } from "react-icons/fa";
import { FaList } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { FaMap } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import {
  isAuthenticated,
  getCurrentUser,
  logout,
} from "../../services/authService";
import type { User } from "../../types/auth";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const authStatus = isAuthenticated();
      const currentUser = getCurrentUser();
      setAuthenticated(authStatus);
      setUser(currentUser);
    };

    checkAuth();
    // Check auth status periodically (e.g., when storage changes)
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    setAuthenticated(false);
    setUser(null);
    navigate("/");
    window.location.reload();
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    } else {
      return currentPath.startsWith(path);
    }
  };
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
              <Link
                to="/"
                className={
                  isActive("/") ? "text-gray-400 pointer-events-none" : ""
                }
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/quiz"
                className={
                  isActive("/quiz") ? "text-gray-400 pointer-events-none" : ""
                }
              >
                Quiz
              </Link>
            </li>
            <li>
              <Link
                to="/browse"
                className={
                  isActive("/browse") ? "text-gray-400 pointer-events-none" : ""
                }
              >
                Browse
              </Link>
            </li>
            <li>
              <Link
                to="/recommendations"
                className={
                  isActive("/recommendations")
                    ? "text-gray-400 pointer-events-none"
                    : ""
                }
              >
                Recommendations
              </Link>
            </li>
            <li>
              <a className="text-gray-400 cursor-not-allowed">Trip Planner</a>
            </li>
            <li>
              <Link
                to="/favourites"
                className={
                  isActive("/favourites")
                    ? "text-gray-400 pointer-events-none"
                    : ""
                }
              >
                Favourites
              </Link>
            </li>
            {authenticated ? (
              <>
                <li>
                  <Link
                    to="/profile"
                    className={
                      isActive("/profile")
                        ? "text-gray-400 pointer-events-none"
                        : ""
                    }
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings"
                    className={
                      isActive("/settings")
                        ? "text-gray-400 pointer-events-none"
                        : ""
                    }
                  >
                    Settings
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className={
                      isActive("/login")
                        ? "text-gray-400 pointer-events-none"
                        : ""
                    }
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className={
                      isActive("/register")
                        ? "text-gray-400 pointer-events-none"
                        : ""
                    }
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      <div className="flex-1 hidden lg:flex">
        <Link
          to="/"
          className={`btn btn-ghost text-sm ${
            isActive("/") ? "bg-gray-200 pointer-events-none" : ""
          }`}
        >
          <FaHome />
          Home
        </Link>
        <Link
          to="/quiz"
          className={`btn btn-ghost text-sm ${
            isActive("/quiz") ? "bg-gray-200 pointer-events-none" : ""
          }`}
        >
          <FaLightbulb />
          Quiz
        </Link>
        <Link
          to="/browse"
          className={`btn btn-ghost text-sm ${
            isActive("/browse") ? "bg-gray-200 pointer-events-none" : ""
          }`}
        >
          <FaMap />
          Browse
        </Link>
        <Link
          to="/recommendations"
          className={`btn btn-ghost text-sm ${
            isActive("/recommendations")
              ? "bg-gray-200 pointer-events-none"
              : ""
          }`}
        >
          <FaList />
          Recommendations
        </Link>
        <a className="btn btn-ghost text-sm text-gray-400 cursor-not-allowed">
          <FaCalendarAlt />
          Trip Planner
        </a>
        <Link
          to="/favourites"
          className={`btn btn-ghost text-sm ${
            isActive("/favourites") ? "bg-gray-200 pointer-events-none" : ""
          }`}
        >
          <FaRegHeart />
          Favourites
        </Link>
      </div>

      {/* beginning of profile section */}
      <div className="flex gap-2 w-full lg:w-auto justify-end">
        {authenticated ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="User avatar"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={-1}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <div className="px-4 py-2 text-sm text-gray-500 border-b">
                  {user?.fullName || "User"}
                </div>
              </li>
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/settings">Settings</Link>
              </li>
              <li>
                <a onClick={handleLogout} className="cursor-pointer">
                  Logout
                </a>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link
              to="/login"
              className={`btn btn-ghost text-sm ${
                isActive("/login") ? "bg-gray-200 pointer-events-none" : ""
              }`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`btn bg-orange-400 hover:bg-orange-500 border-none text-white text-sm ${
                isActive("/register") ? "opacity-75 pointer-events-none" : ""
              }`}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
