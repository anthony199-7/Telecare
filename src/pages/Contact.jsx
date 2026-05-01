/** @format */

import React, { useMemo } from "react";
import { assets } from "../assets/assets";

// Sub-component for individual contact details to keep logic DRY
const ContactDetail = ({ title, details, className = "" }) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    <h2 className="font-semibold text-xl md:text-2xl text-gray-700 uppercase tracking-wide">
      {title}
    </h2>
    {details.map((line, index) => (
      <p
        key={index}
        className="text-gray-500 text-base md:text-lg leading-relaxed">
        {line}
      </p>
    ))}
  </div>
);

const Contact = () => {
  // useMemo ensures this object isn't re-created on every render
  const officeInfo = useMemo(
    () => ({
      title: "Our Office",
      address: ["Enugu State, Nigeria"],
      contact: ["+234-123-456-8910", "telecare@gmail.com"],
    }),
    [],
  );

  return (
    <section
      className="px-5 py-10 md:px-10 lg:px-20 max-w-7xl mx-auto"
      aria-labelledby="contact-heading">
      {/* Section Header */}
      <div className="text-center text-2xl md:text-3xl pt-10 text-gray-500 mb-12">
        <h1 id="contact-heading" className="font-light">
          CONTACT <span className="text-gray-800 font-semibold">US</span>
        </h1>
      </div>

      {/* Main Content Grid */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 lg:gap-24 mb-20">
        {/* Responsive Image Container */}
        <div className="w-full md:w-1/2 max-w-[600px] overflow-hidden rounded-lg shadow-sm">
          <img
            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
            src={assets.telecare_logo}
            alt="Telecare corporate headquarters and logo"
          />
        </div>

        {/* Contact Information */}
        <address className="w-full md:w-1/2 flex flex-col items-start gap-8 not-italic">
          <ContactDetail
            title={officeInfo.title}
            details={officeInfo.address}
          />

          <ContactDetail title="Get In Touch" details={officeInfo.contact} />

          <div className="flex flex-col gap-4 w-full sm:w-auto">
            <h2 className="font-semibold text-xl text-gray-700 uppercase">
              Careers at Telecare
            </h2>
            <p className="text-gray-500 text-base">
              Learn more about our teams and job openings.
            </p>
            <button
              type="button"
              aria-label="Explore job openings at Telecare"
              className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-300 active:bg-gray-800">
              Explore Jobs
            </button>
          </div>
        </address>
      </div>
    </section>
  );
};

export default Contact;
