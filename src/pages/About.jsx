/** @format */

import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div>
      <div className="text-center text-4xl pt-10 text-gray-500">
        <p>
          About <span className="text-gray-700 font-medium">us</span>
        </p>
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img
          className="w-full md:max-w-[660px]"
          src={assets.about_image}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p className="text-2xl">
            Telecare aims to improve accessibility to your health and wellness
            needs. Connect to General practitioners on demand."
          </p>
          <b className="text-3xl">Video call a healthcare doctor now.</b>
          <p className="text-2xl">
            Skip the queue. Get the advice you need from the comfort of your
            home instantly. You can also schedule an appointment with your
            preferred provider at your convenience in your preferred language.
          </p>
          <b className="text-3xl">
            we've got you covered— from medication to referrals.
          </b>
          <p className="text-2xl">
            Supporting documents will be sent straight to your inbox when
            necessary.
          </p>
        </div>
      </div>

      <div className=" text-3xl my-4 py-15 px-5">
        <p>
          WHY <span className="text-gray-700 font-semi-bold">CHOOSE US.</span>{" "}
        </p>
      </div>

      <div className="flex flex-col md:flex-row mb-25 m-35">
        <div className="border px-10  md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[5]hover:bg-black-500 hover:text-blue-600 transition-all duration-300 text-gray-900 cursor-pointer">
          <b>Post-COVID Growth:</b>
          <p>Accelerated adoption due to social distancing</p>
          <p>Normalized virtual healthcare experiences </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[5]hover:bg-black-500 hover:text-blue-600 transition-all duration-300 text-gray-900 cursor-pointer">
          <b>Market Trends & Projections:</b>
          <p>Global market size projected to reach $450B by 2030</p>
          <p>Increased demand for chronic care and mental health services</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[5] hover:bg-black-500 hover:text-blue-600 transition-all duration-300 text-gray-900 cursor-pointer">
          <b>Problems It Solves:</b>
          <p> <h2>Access:</h2>Rural and underserved areas can reach specialists</p>
          <p>Cost:Reduces overhead and travel expenses</p>
          <p>
           <h2>Convenience:</h2> On-demand care for patients and flexibility for
            providers
          </p>
          <p>
           <h2>Language Barrier:</h2> patients can speak to their doctors <br/>in the language
            they are most conversant with
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
