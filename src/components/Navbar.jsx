/** @format */

import React, { useContext, useState, useCallback, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

// 1. Centralized navigation data to keep code DRY
const NAV_LINKS = [
  { path: "/", label: "HOME" },
  { path: "/doctors", label: "ALL DOCTORS" },
  { path: "/about", label: "ABOUT" },
  { path: "/contact", label: "CONTACT" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken, profileImage, doctorToken, setDoctorToken } =
    useContext(AppContext);

  // 2. Optimized logout functions with useCallback
  const handleLogout = useCallback(
    (type) => {
      if (type === "user") {
        setToken(false);
        localStorage.removeItem("token");
      } else {
        setDoctorToken(false);
        localStorage.removeItem("doctorToken");
      }
      navigate("/");
    },
    [setToken, setDoctorToken, navigate],
  );

  // 3. Reusable Sub-component for Nav Links
  const NavItems = ({ isMobile = false, onClick = () => {} }) => (
    <ul
      className={`${isMobile ? "flex flex-col gap-5 mt-5 px-5" : "hidden md:flex items-center gap-6"} font-medium`}>
      {NAV_LINKS.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          onClick={onClick}
          className={({ isActive }) =>
            `cursor-pointer transition-all ${isActive ? "text-blue-600" : "text-gray-700"}`
          }>
          <li className="py-1 list-none text-sm lg:text-base uppercase tracking-wider">
            {link.label}
            <hr className="border-none outline-none h-0.5 bg-blue-600 w-3/5 m-auto hidden" />
          </li>
        </NavLink>
      ))}
    </ul>
  );

  return (
    <nav className="flex items-center justify-between py-4 mb-5 border-b border-gray-200 bg-white sticky top-0 z-50 px-4 sm:px-[5%]">
      {/* Logo Section */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}>
        <img
          src={assets.telecare_logo}
          alt="Telecare Logo"
          className="w-32 md:w-40"
        />
        <h1 className="text-xl md:text-2xl font-bold text-blue-600 hidden sm:block">
          Telecare
        </h1>
      </div>

      {/* Desktop Navigation */}
      <NavItems />

      <div className="flex items-center gap-4">
        {/* User Profile Dropdown */}
        {token ?
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
              src={profileImage}
              alt="User Profile"
            />
            <img className="w-2.5" src={assets.dropdown_icon} alt="" />

            {/* Dropdown Menu */}
            <div className="absolute top-full right-0 pt-4 hidden group-hover:block transition-all">
              <div className="min-w-48 bg-white shadow-xl border border-gray-100 rounded-lg flex flex-col p-2 text-gray-700">
                <button
                  onClick={() => navigate("/my-profile")}
                  className="text-left px-4 py-2 hover:bg-gray-50 rounded">
                  My Profile
                </button>
                <button
                  onClick={() => navigate("/my-appointments")}
                  className="text-left px-4 py-2 hover:bg-gray-50 rounded">
                  Appointments
                </button>
                <button
                  onClick={() => handleLogout("user")}
                  className="text-left px-4 py-2 hover:bg-red-50 text-red-600 rounded">
                  Logout
                </button>
              </div>
            </div>
          </div>
        : <button
            onClick={() => navigate("/login")}
            className="hidden md:block bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-blue-700 transition-all text-sm">
            Create account
          </button>
        }

        {/* Doctor Portal Logic */}
        <div className="hidden md:flex gap-2">
          {doctorToken ?
            <>
              <button
                onClick={() => navigate("/doctor/dashboard")}
                className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs font-semibold">
                Dashboard
              </button>
              <button
                onClick={() => handleLogout("doctor")}
                className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-xs font-semibold">
                Logout
              </button>
            </>
          : <button
              onClick={() => navigate("/doctor/login")}
              className="border border-red-200 text-red-600 px-4 py-2 rounded-full text-xs font-semibold hover:bg-red-50">
              Doctor Portal
            </button>
          }
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setShowMenu(true)}
          aria-label="Open Menu"
          aria-expanded={showMenu}>
          <img className="w-6" src={assets.menu_icon} alt="Menu icon" />
        </button>

        {/* Mobile Sidebar Menu */}
        <div
          className={`fixed inset-0 z-50 bg-white transition-all duration-300 transform ${showMenu ? "translate-x-0" : "translate-x-full"} md:hidden`}>
          <div className="flex items-center justify-between px-5 py-6 border-b">
            <img className="w-32" src={assets.telecare_logo} alt="Logo" />
            <button onClick={() => setShowMenu(false)} aria-label="Close Menu">
              <img className="w-7" src={assets.cross_icon} alt="Close icon" />
            </button>
          </div>

          <NavItems isMobile onClick={() => setShowMenu(false)} />

          {/* Mobile Doctor Actions */}
          <div className="mt-8 px-9 flex flex-col gap-4">
            {doctorToken ?
              <button
                onClick={() => {
                  handleLogout("doctor");
                  setShowMenu(false);
                }}
                className="w-full py-3 text-red-600 border border-red-200 rounded-lg font-bold">
                DOCTOR LOGOUT
              </button>
            : <button
                onClick={() => {
                  navigate("/doctor/login");
                  setShowMenu(false);
                }}
                className="w-full py-3 bg-gray-900 text-white rounded-lg font-bold">
                DOCTOR LOGIN
              </button>
            }
          </div>
        </div>
      </div>
    </nav>
  );
};

export default React.memo(Navbar);
