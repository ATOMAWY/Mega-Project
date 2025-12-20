import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaBars, FaHome } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentToken, selectCurrentUser, setUser, logOut } from "../features/auth/slice";

const UserProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const [userInfo, setUserInfo] = useState({
            id: user?.id || "",
            fullName: user?.fullName || "...",
            email: user?.email || "...",
            address: user?.address || "...",
            age: user?.age || 0,
            joinDate: user?.joinDate || "",
        });


    useEffect(() => {
    const fetchUserData = async () => {

      try {
        const response = await fetch(
          "https://cairogo.runasp.net/api/Auth/me",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (data.data) {
          const userData = {
            id: data.data.id,
            email: data.data.email,
            fullName: data.data.fullName,
            address: data.data.address,
            age: data.data.age,
            joinDate: data.data.joinDate,
          };
          const updatedUserInfo = {
            id: data.data.id,
            fullName: data.data.fullName,
            email: data.data.email,
            address: data.data.address,
            age: data.data.age,
            joinDate: data.data.joinDate,
          };
          setUserInfo(updatedUserInfo);
          dispatch(setUser(userData));
          console.log(updatedUserInfo);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData();
  }, []);

  
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleEdit = (field: string, currentValue: string) => {
    setIsEditing(field);
    setTempValue(currentValue);
  };

  const handleSave = (field: keyof typeof userInfo) => {
    setUserInfo({ ...userInfo, [field]: tempValue });
    setIsEditing(null);
    setTempValue("");
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    dispatch(logOut());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Title */}
      <div className="bg-white border-b px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <FaBars className="text-xl" />
          </button>
          <h1 className="text-lg sm:text-xl font-normal text-gray-700">
            User Profile
          </h1>
        </div>
        <div className="avatar">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full">
            <img
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              alt="Profile"
            />
          </div>
        </div>
      </div>

      <div className="flex relative">
        {/* Sidebar - Mobile Drawer */}
        <div
          className={`fixed lg:relative inset-y-0 left-0 z-50 w-64 lg:w-48 bg-white border-r transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="py-6">
            <div className="lg:hidden px-6 pb-4 border-b">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕ Close
              </button>
            </div>
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 text-gray-700"
            >
              <FaHome className="text-sm" />
              <span className="text-sm font-medium">Home</span>
            </Link>
            <Link
              to="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-6 py-3 bg-gray-100 border-r-2 border-orange-500 text-gray-900"
            >
              <FaUser className="text-sm" />
              <span className="text-sm font-medium">User Profile</span>
            </Link>
          </div>

          {/* Logout at bottom */}
          <div className="absolute bottom-8 left-0 w-full px-6">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 cursor-pointer"
            >
              <MdLogout className="text-base" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {/* User Profile Card */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-6">
                  User Profile
                </h2>

                {/* Profile Picture Section */}
                <div className="mb-8 pb-8 border-b">
                  <h3 className="text-sm sm:text-base font-semibold mb-4">
                    Profile Picture
                  </h3>
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                    <div className="avatar">
                      <div className="w-20 h-20 sm:w-16 sm:h-16 rounded-full">
                        <img
                          src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                          alt="Profile"
                        />
                      </div>
                    </div>
                    <button className="px-4 py-1.5 text-sm text-gray-700 hover:text-gray-900 underline">
                      Change Photo
                    </button>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="mb-8">
                  <h3 className="text-sm sm:text-base font-semibold mb-4">
                    Personal Information
                  </h3>
                  <div className="space-y-4">
                    {/* Full Name */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 gap-2">
                      <span className="text-sm text-gray-600 sm:w-32">
                        Full Name
                      </span>
                      <div className="flex items-center gap-4 flex-1">
                        {isEditing === "fullName" ? (
                          <>
                            <input
                              type="text"
                              value={tempValue}
                              onChange={(e) => setTempValue(e.target.value)}
                              className="input input-sm input-bordered flex-1"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSave("fullName")}
                              className="text-sm text-orange-500 hover:underline whitespace-nowrap"
                            >
                              Save
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-sm text-gray-900 flex-1">
                              {userInfo.fullName}
                            </span>
                            <button
                              onClick={() =>
                                handleEdit("fullName", userInfo.fullName)
                              }
                              className="text-sm text-orange-500 hover:underline whitespace-nowrap"
                            >
                              Edit
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Email Address */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 gap-2">
                      <span className="text-sm text-gray-600 sm:w-32">
                        Email Address
                      </span>
                      <div className="flex items-center gap-4 flex-1">
                        {isEditing === "email" ? (
                          <>
                            <input
                              type="email"
                              value={tempValue}
                              onChange={(e) => setTempValue(e.target.value)}
                              className="input input-sm input-bordered flex-1"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSave("email")}
                              className="text-sm text-orange-500 hover:underline whitespace-nowrap"
                            >
                              Save
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-sm text-gray-900 flex-1 break-all">
                              {userInfo.email}
                            </span>
                            <button
                              onClick={() =>
                                handleEdit("email", userInfo.email)
                              }
                              className="text-sm text-orange-500 hover:underline whitespace-nowrap"
                            >
                              Edit
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 gap-2">
                      <span className="text-sm text-gray-600 sm:w-32">
                        Address
                      </span>
                      <div className="flex items-center gap-4 flex-1">
                        {isEditing === "address" ? (
                          <>
                            <input
                              type="text"
                              value={tempValue}
                              onChange={(e) => setTempValue(e.target.value)}
                              className="input input-sm input-bordered flex-1"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSave("address")}
                              className="text-sm text-orange-500 hover:underline whitespace-nowrap"
                            >
                              Save
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-sm text-gray-900 flex-1">
                              {userInfo.address}
                            </span>
                            <button
                              onClick={() =>
                                handleEdit("address", userInfo.address)
                              }
                              className="text-sm text-orange-500 hover:underline whitespace-nowrap"
                            >
                              Edit
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Age */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 gap-2">
                      <span className="text-sm text-gray-600 sm:w-32">
                        Age
                      </span>
                      <div className="flex items-center gap-4 flex-1">
                        {isEditing === "age" ? (
                          <>
                            <input
                              type="number"
                              value={tempValue}
                              onChange={(e) => setTempValue(e.target.value)}
                              className="input input-sm input-bordered flex-1"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSave("age")}
                              className="text-sm text-orange-500 hover:underline whitespace-nowrap"
                            >
                              Save
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-sm text-gray-900 flex-1">
                              {userInfo.age}
                            </span>
                            <button
                              onClick={() =>
                                handleEdit("age", String(userInfo.age))
                              }
                              className="text-sm text-orange-500 hover:underline whitespace-nowrap"
                            >
                              Edit
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Join Date */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 gap-2">
                      <span className="text-sm text-gray-600 sm:w-32">
                        Join Date
                      </span>
                      <div className="flex items-center gap-4 flex-1">
                        {isEditing === "joinDate" ? (
                          <>
                            <input
                              type="text"
                              value={tempValue}
                              onChange={(e) => setTempValue(e.target.value)}
                              className="input input-sm input-bordered flex-1"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSave("joinDate")}
                              className="text-sm text-orange-500 hover:underline whitespace-nowrap"
                            >
                              Save
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-sm text-gray-900 flex-1">
                              {userInfo.joinDate ? new Date(userInfo.joinDate).toLocaleDateString() : "..."}
                            </span>
                            <button
                              onClick={() =>
                                handleEdit("joinDate", userInfo.joinDate)
                              }
                              className="text-sm text-orange-500 hover:underline whitespace-nowrap"
                            >
                              Edit
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Footer */}
                <div className="text-center text-xs text-gray-500 mt-6 pt-6 border-t">
                  © 2025 Mini Trip Planner. All rights reserved.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
