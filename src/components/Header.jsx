/** @format */

import React from "react";
import { assets } from "../assets/assets";

const Header = () => {
  return (
    <div className="flex flex-col md:flex-row flex-wrap bg-blue-200 rounded-lg px-6 md:px-10 lg:px-20 ">
      {/*............. left side......*/}
      <div className=" flex flex-col items-start justify-center gap-5 py-10 m-auto md:py-[10vw] md:mb-[-30px]">
        <p className=" mt-8 mb-6 text-4xl font-heading font-semibold lg:mb-12 lg:text-5xl text-white">
          Book Appointment <br />
          With Trusted Doctors
        </p>
      
        <div className="flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light">
          <img className="w-28" src={assets.group_profiles} alt="" />
        <p  className="text-xl text-gray-500 text-white">
          List of our Available trusted doctors
        </p>
        </div>
      <a href="#speciality" className="inline-block px-6 py-4 mb-3 mr-4 text-sm font-medium leading-normal bg-red-400 hover:bg-red-300 text-white rounded transition duration-200 ">
        Book appointment 
      </a>
      </div>

      {/*............right side.......*/}
      <div className="md:w-1/2 reletive">
        <img
          className="w-1/2md:absolute buttom-0 h-150 rounded-lg "
           src={assets.header_img}
          alt=""
        />
      </div>
    </div>
  );
};

export default Header;
