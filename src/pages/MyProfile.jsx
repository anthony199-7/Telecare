/** @format */

import React, { useState, useContext, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

// --- 1. Main Component ---
const MyProfile = () => {
  const {
    token,
    backendUrl,
    // New context setter for Navbar image synchronization
    setProfileImage,
  } = useContext(AppContext);

  const fileInputRef = useRef(null);

  const [userData, setUserData] = useState({
    name: "Loading...",
    image: assets.profile_pic,
    imagePublicId: "",
    email: "...",
    phone: "",
    address: {
      line1: "",
      line2: "",
    },
    gender: "",
    dob: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newImageFile, setNewImageFile] = useState(null);

  // --- Functions ---
  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserData(data.userData);
        setProfileImage(data.userData.image || assets.profile_pic);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to load profile data.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "line1" || name === "line2") {
      setUserData({
        ...userData,
        address: { ...userData.address, [name]: value },
      });
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Append all text data
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    formData.append("phone", userData.phone);
    formData.append("gender", userData.gender);
    formData.append("dob", userData.dob);

    // IMPORTANT FIX: Stringify the address object before sending
    formData.append("address", JSON.stringify(userData.address));

    // Append image data
    formData.append("oldImagePublicId", userData.imagePublicId || "");
    if (newImageFile) {
      formData.append("image", newImageFile);
    }

    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (data.success) {
        toast.success("Profile updated!");
        setUserData(data.userData);
        // Sync context with the new image URL
        setProfileImage(data.userData.image || assets.profile_pic);
        setIsEditing(false);
        setNewImageFile(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Update failed.");
    }
  };

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    }
  }, [token]);

  // --- JSX Return ---
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        {/* Profile Header Section */}
        <div className="p-6 sm:p-10 bg-gradient-to-r from-teal-500 to-cyan-600 text-white flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="relative">
            <img
              src={
                newImageFile ?
                  URL.createObjectURL(newImageFile)
                : userData.image || assets.profile_pic
              }
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg"
            />
            {isEditing && (
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-white p-1 rounded-full text-teal-600 shadow-md hover:bg-gray-100 transition duration-150"
                onClick={() => fileInputRef.current.click()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-1.343 9.343l.793-.793 2.828 2.828-.793.793c-.22.22-.48.33-.74.33H5a2 2 0 01-2-2v-7a2 2 0 012-2h4a2 2 0 012 2v2.586l-4.586 4.586c-.22.22-.48.33-.74.33H5a2 2 0 01-2-2v-7a2 2 0 012-2h4a2 2 0 012 2v2.586l-4.586 4.586z" />
                </svg>
              </button>
            )}
          </div>

          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight">
              {userData.name}
            </h1>
            <p className="text-teal-200 text-lg">{userData.email}</p>
          </div>
        </div>

        {/* Profile Details Section (Wrapped in Form) */}
        <form onSubmit={handleProfileUpdate}>
          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => setNewImageFile(e.target.files[0])}
            className="hidden"
          />

          <div className="p-6 sm:p-10 grid md:grid-cols-2 gap-8">
            {/* Contact Details Card */}
            <DetailsCard title="Contact Information">
              <EditableDetailItem
                label="Name"
                name="name"
                value={userData.name}
                icon="👤"
                isEditing={isEditing}
                onChange={handleInputChange}
                required={true}
              />
              <DetailItem label="Email" value={userData.email} icon="📧" />
              <EditableDetailItem
                label="Phone"
                name="phone"
                value={userData.phone}
                icon="📞"
                isEditing={isEditing}
                onChange={handleInputChange}
              />
            </DetailsCard>

            {/* Personal Details Card */}
            <DetailsCard title="Personal Details">
              <EditableDetailItem
                label="Gender"
                name="gender"
                value={userData.gender}
                icon="🚻"
                isEditing={isEditing}
                onChange={handleInputChange}
              />
              <EditableDetailItem
                label="Date of Birth"
                name="dob"
                value={userData.dob}
                icon="📅"
                isEditing={isEditing}
                onChange={handleInputChange}
                type="date"
              />
            </DetailsCard>

            {/* Address Details Card (Full Width) */}
            <div className="md:col-span-2">
              <DetailsCard title="Address">
                <EditableDetailItem
                  label="Line 1"
                  name="line1"
                  value={userData.address?.line1}
                  icon="🏠"
                  isEditing={isEditing}
                  onChange={handleInputChange}
                  required={true} // <-- FIX for Mongoose validation error
                />
                <EditableDetailItem
                  label="Line 2"
                  name="line2"
                  value={userData.address?.line2}
                  icon="📍"
                  isEditing={isEditing}
                  onChange={handleInputChange}
                />
              </DetailsCard>
            </div>
          </div>

          {/* Save/Edit Button Row */}
          <div className="p-6 sm:p-10 pt-0 md:col-span-2 flex justify-end space-x-4">
            {isEditing ?
              <>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition">
                  Cancel
                </button>
              </>
            : <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition">
                Edit Profile
              </button>
            }
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyProfile;

// --- Helper Components ---
const DetailsCard = ({ title, children }) => (
  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 transition duration-300 hover:shadow-md">
    <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2 border-gray-300">
      {title}
    </h2>
    <div className="space-y-4">{children}</div>
  </div>
);

const DetailItem = ({ label, value, icon }) => (
  <div className="flex justify-between items-start text-sm sm:text-base">
    <div className="flex items-center space-x-2 text-gray-600 font-medium">
      <span className="text-lg">{icon}</span>
      <span>{label}:</span>
    </div>
    <div className="text-gray-800 font-semibold text-right max-w-[60%] opacity-70">
      {value || "N/A"}
    </div>
  </div>
);

const EditableDetailItem = ({
  label,
  name,
  value,
  icon,
  isEditing,
  onChange,
  type = "text",
  required,
}) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm sm:text-base">
    <div className="flex items-center space-x-2 text-gray-600 font-medium mb-1 sm:mb-0">
      <span className="text-lg">{icon}</span>
      <span>{label}:</span>
    </div>

    {isEditing ?
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full sm:w-[60%] p-2 border border-gray-300 rounded-md focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
        required={required} // Added support for required attribute
      />
    : <div className="text-gray-800 font-semibold text-right max-w-[60%] truncate">
        {value || "N/A"}
      </div>
    }
  </div>
);
