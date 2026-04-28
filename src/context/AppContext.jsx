/** @format */

import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "₹";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false,
  );
  const [doctorToken, setDoctorToken] = useState(
    localStorage.getItem("doctorToken") ?
      localStorage.getItem("doctorToken")
    : false,
  );
  const [userData, setUserData] = useState(false);
  const [doctorData, setDoctorData] = useState(false);
  const [profileImage, setProfileImage] = useState(assets.profile_pic);

  const getDoctorsData = async () => {
    try {
      // CRITICAL FIX: Use 'res' for the Axios response object
      const res = await axios.get(backendUrl + "/api/doctor/list");

      if (res.data.success) {
        setDoctors(res.data.doctors);
      } else {
        // Backend failure (e.g., status 200, but success: false)
        toast.error(res.data.message);
      }
    } catch (error) {
      // FIX: Use the actual error variable, not a literal string
      const errorMessage =
        error.response ? error.response.data.message : error.message;

      console.error("Error fetching doctors:", errorMessage); // Use console.error
      toast.error(errorMessage);
    }
  };

  // Placeholder function to load user data (for update success)
  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Loading user profile data failed:", error);
    }
  };

  const loadDoctorProfileData = async () => {
    try {
      if (!doctorToken) {
        setDoctorData(false);
        return;
      }

      const { data } = await axios.get(backendUrl + "/api/doctor/profile", {
        headers: { Authorization: `Bearer ${doctorToken}` },
      });

      if (data.success) {
        setDoctorData(data.doctor);
      }
    } catch (error) {
      console.error("Loading doctor profile data failed:", error);
      setDoctorData(false);
    }
  };

  // FIX: Add getDoctorsData to the context value
  const value = {
    doctors,
    setDoctors,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    getDoctorsData,
    userData,
    setUserData,
    loadUserProfileData,
    doctorToken,
    setDoctorToken,
    doctorData,
    setDoctorData,
    loadDoctorProfileData,
    profileImage,
    setProfileImage,
  };
  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token]);

  useEffect(() => {
    if (doctorToken) {
      loadDoctorProfileData();
    } else {
      setDoctorData(false);
    }
  }, [doctorToken]);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
