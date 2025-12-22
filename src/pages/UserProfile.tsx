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
            profilePictureUrl: user?.profilePictureUrl || null
        });

  // Helper function to construct full URL from backend path
  const constructFullUrl = (path: string | null | undefined): string | null => {
    if (!path) return null;
    // If already a full URL, return as is
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    // Prepend base URL to relative path
    const baseUrl = "https://cairogo.runasp.net";
    // Ensure path starts with /
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${normalizedPath}`;
  };


    useEffect(() => {
    const fetchUserData = async () => {

      try {
        const response1 = await fetch(
          "https://cairogo.runasp.net/api/Auth/me",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const response2 = await fetch(
          "https://cairogo.runasp.net/api/user-profile/me",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data1 = await response1.json();
        const data2 = await response2.json();
        if (data1.data) {
          const userData1 = {
            id: data1.data.id,
            email: data1.data.email,
            age: data1.data.age,
            joinDate: data1.data.joinDate,
          };
          const updatedUserInfo1 = {
            id: data1.data.id,
            email: data1.data.email,
            age: data1.data.age,
            joinDate: data1.data.joinDate,
          };
          if (data2) {
          const profilePictureUrl = constructFullUrl(data2.profilePictureUrl);
          const userData2 = {
            ...userData1,
            fullName: data2.fullName,
            address: data2.address,
            age: data2.age,
            profilePictureUrl: profilePictureUrl,
          };
          const updatedUserInfo2 = {
            ...updatedUserInfo1,
            fullName: data2.fullName,
            address: data2.address,
            age: data2.age,
            profilePictureUrl: profilePictureUrl,
          };
          console.log(updatedUserInfo2);
          setUserInfo(updatedUserInfo2);
          dispatch(setUser(userData2));
          console.log(updatedUserInfo2);
        }
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
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);

  const handleEdit = (field: string, currentValue: string) => {
    setIsEditing(field);
    setTempValue(currentValue);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSave = async (field: keyof typeof userInfo) => {
    if (!token) {
      setErrorMessage("You must be logged in to update your profile");
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Validate input before sending
      if (field === "age") {
        const ageValue = parseInt(tempValue, 10);
        if (isNaN(ageValue) || ageValue < 1 || ageValue > 120) {
          setErrorMessage("Age must be a valid number between 1 and 120");
          setIsSaving(false);
          return;
        }
      } else if (field === "fullName" && !tempValue.trim()) {
        setErrorMessage("Full name cannot be empty");
        setIsSaving(false);
        return;
      }

      // Prepare the update payload - API requires all three fields
      // Use current values for fields not being updated
      const currentFullName = userInfo.fullName && userInfo.fullName !== "..." ? userInfo.fullName : "";
      const currentAge = userInfo.age && userInfo.age > 0 ? userInfo.age : 0;
      const currentAddress = userInfo.address && userInfo.address !== "..." ? userInfo.address : "";

      const updatePayload: { fullName: string; age: number; address: string } = {
        fullName: field === "fullName" ? tempValue.trim() : currentFullName,
        age: field === "age" ? parseInt(tempValue, 10) : currentAge,
        address: field === "address" ? tempValue.trim() : currentAddress,
      };

      // Validate age if it's being updated or if current age is invalid
      if (field === "age") {
        if (updatePayload.age < 1 || updatePayload.age > 120) {
          setErrorMessage("Age must be between 1 and 120");
          setIsSaving(false);
          return;
        }
      } else if (updatePayload.age < 1) {
        // If not updating age but current age is invalid, set to a default
        // Some APIs might reject 0, so we'll let the server handle it
        updatePayload.age = 0;
      }

      // Log the payload for debugging
      console.log("Updating profile field:", field);
      console.log("Payload:", updatePayload);

      const response = await fetch(
        "https://cairogo.runasp.net/api/user-profile/me",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatePayload),
        }
      );

      if (!response.ok) {
        let errorMessage = `Failed to update ${field}`;
        try {
          const errorData = await response.json();
          // Handle different error response formats
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.errors) {
            // Handle validation errors
            const errors = Array.isArray(errorData.errors) 
              ? errorData.errors.join(", ")
              : JSON.stringify(errorData.errors);
            errorMessage = `Validation error: ${errors}`;
          } else if (errorData.title) {
            errorMessage = errorData.title;
          }
        } catch (parseError) {
          // If JSON parsing fails, use status text
          errorMessage = `${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const responseData = await response.json().catch(() => ({}));
      
      // Update local state
      const updatedValue = field === "age" ? parseInt(tempValue, 10) : tempValue;
      const updatedInfo = { ...userInfo, [field]: updatedValue };
      
      // If response contains updated data, use it
      if (responseData.fullName || responseData.age !== undefined || responseData.address) {
        if (responseData.fullName) updatedInfo.fullName = responseData.fullName;
        if (responseData.age !== undefined) updatedInfo.age = responseData.age;
        if (responseData.address) updatedInfo.address = responseData.address;
      }
      
      setUserInfo(updatedInfo);
      
      // Update Redux store
      const updatedUser = {
        ...user,
        ...updatedInfo,
      };
      dispatch(setUser(updatedUser));

      setIsEditing(null);
      setTempValue("");
      setSuccessMessage(`${field === "fullName" ? "Full name" : field === "age" ? "Age" : "Address"} updated successfully`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setErrorMessage(error.message || "Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setTempValue("");
    setErrorMessage(null);
  };

  const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!token) {
      setErrorMessage("You must be logged in to update your profile picture");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select an image file");
      return;
    }

    // Validate file size (e.g., max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setErrorMessage("Image size must be less than 5MB");
      return;
    }

    setIsUploadingPicture(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "https://cairogo.runasp.net/api/user-profile/me/profile-picture",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to upload profile picture");
      }

      const data = await response.json();
      
      // Handle different possible response formats
      let newProfilePictureUrl: string | null = null;
      if (data.profilePictureUrl) {
        newProfilePictureUrl = constructFullUrl(data.profilePictureUrl);
      } else if (data.url) {
        newProfilePictureUrl = constructFullUrl(data.url);
      } else if (data.data?.profilePictureUrl) {
        newProfilePictureUrl = constructFullUrl(data.data.profilePictureUrl);
      } else {
        // If no URL in response, create a temporary object URL
        newProfilePictureUrl = URL.createObjectURL(file);
      }
      
      if (!newProfilePictureUrl) {
        throw new Error("No profile picture URL received from server");
      }
      
      // Update local state with new profile picture URL
      setUserInfo({ ...userInfo, profilePictureUrl: newProfilePictureUrl });
      
      // Update Redux store
      const updatedUser = {
        ...user,
        profilePictureUrl: newProfilePictureUrl,
      };
      dispatch(setUser(updatedUser));

      setSuccessMessage("Profile picture updated successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      console.error("Error uploading profile picture:", error);
      setErrorMessage(error.message || "Failed to upload profile picture. Please try again.");
    } finally {
      setIsUploadingPicture(false);
      // Reset file input
      event.target.value = "";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    dispatch(logOut());
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Page Title */}
      <div className="flex-shrink-0 bg-white border-b px-4 sm:px-8 py-4 flex items-center justify-between">
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
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-gray-200">
            <img
              src={
                userInfo.profilePictureUrl ||
                "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              }
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex relative flex-1 overflow-hidden">
        {/* Sidebar - Mobile Drawer */}
        <div
          className={`fixed lg:relative inset-y-0 lg:h-full left-0 z-50 w-64 lg:w-48 bg-white border-r transform transition-transform duration-300 ease-in-out ${
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

                {/* Error and Success Messages */}
                {errorMessage && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {errorMessage}
                  </div>
                )}
                {successMessage && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                    {successMessage}
                  </div>
                )}

                {/* Profile Picture Section */}
                <div className="mb-8 pb-8 border-b">
                  <h3 className="text-sm sm:text-base font-semibold mb-4">
                    Profile Picture
                  </h3>
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                    <div className="avatar">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-gray-200">
                        <img
                          src={
                            userInfo.profilePictureUrl ||
                            "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                          }
                          alt="Profile"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="px-4 py-1.5 text-sm text-gray-700 hover:text-gray-900 underline cursor-pointer">
                        {isUploadingPicture ? "Uploading..." : "Change Photo"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureChange}
                          className="hidden"
                          disabled={isUploadingPicture}
                        />
                      </label>
                      {isUploadingPicture && (
                        <div className="text-xs text-gray-500">Please wait...</div>
                      )}
                    </div>
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
                              disabled={isSaving}
                            />
                            <button
                              onClick={() => handleSave("fullName")}
                              disabled={isSaving}
                              className="text-sm text-orange-500 hover:underline whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isSaving ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              disabled={isSaving}
                              className="text-sm text-gray-500 hover:underline whitespace-nowrap disabled:opacity-50"
                            >
                              Cancel
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

                    {/* Email Address - Read Only */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 gap-2">
                      <span className="text-sm text-gray-600 sm:w-32">
                        Email Address
                      </span>
                      <div className="flex items-center gap-4 flex-1">
                        <span className="text-sm text-gray-900 flex-1 break-all">
                          {userInfo.email}
                        </span>
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          Cannot be changed
                        </span>
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
                              disabled={isSaving}
                            />
                            <button
                              onClick={() => handleSave("address")}
                              disabled={isSaving}
                              className="text-sm text-orange-500 hover:underline whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isSaving ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              disabled={isSaving}
                              className="text-sm text-gray-500 hover:underline whitespace-nowrap disabled:opacity-50"
                            >
                              Cancel
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
                              disabled={isSaving}
                              min="1"
                              max="120"
                            />
                            <button
                              onClick={() => handleSave("age")}
                              disabled={isSaving}
                              className="text-sm text-orange-500 hover:underline whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isSaving ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              disabled={isSaving}
                              className="text-sm text-gray-500 hover:underline whitespace-nowrap disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-sm text-gray-900 flex-1">
                              {userInfo.age || "Not set"}
                            </span>
                            <button
                              onClick={() =>
                                handleEdit("age", String(userInfo.age || ""))
                              }
                              className="text-sm text-orange-500 hover:underline whitespace-nowrap"
                            >
                              Edit
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Join Date - Read Only */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 gap-2">
                      <span className="text-sm text-gray-600 sm:w-32">
                        Join Date
                      </span>
                      <div className="flex items-center gap-4 flex-1">
                        <span className="text-sm text-gray-900 flex-1">
                          {userInfo.joinDate ? new Date(userInfo.joinDate).toLocaleDateString() : "..."}
                        </span>
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          Cannot be changed
                        </span>
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
