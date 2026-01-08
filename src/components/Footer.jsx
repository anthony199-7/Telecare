import React from 'react';
import { assets } from '../assets/assets';


const Footer = () => {
  return (
    // Outer Container: Dark background, centered text on mobile, padding
    <footer className="bg-blue-900 text-gray-400 py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-6 sm:px-6 lg:px-8">
        
        {/* Main Grid Section: Three Columns (Logo/About, Company, Contact) */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-8 md:gap-12 pb-10 border-b border-gray-500">
          
          {/* Column 1: Logo and Short Description (takes 2/4 columns on desktop) */}
          <div className="md:col-span-2">
            <a href="/" className="inline-block mb-4">
              {/* NOTE: Check if the 'assets.telecare_login' is the correct image for the footer logo */}
              <img 
                className="h-10 w-auto" 
                src={assets.telecare_login} 
                alt="Telecare Logo" 
              />
            </a>
            <p className="text-sm leading-relaxed max-w-md">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, ullam.
            </p>
          </div>
          
          {/* Column 2: Company Links */}
          <div>
            <p className="text-lg font-bold text-white mb-4 uppercase tracking-wider">Company</p>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/home" className="hover:text-teal-400 transition duration-300">HOME</a>
              </li>
              <li>
                <a href="/about" className="hover:text-teal-400 transition duration-300">ABOUT US</a>
              </li>
              <li>
                <a href="/contact" className="hover:text-teal-400 transition duration-300">CONTACT US</a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-teal-400 transition duration-300">PRIVACY POLICY</a>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Get In Touch (Contact Info) */}
          <div>
            <p className="text-lg font-bold text-white mb-4 uppercase tracking-wider">Get In Touch</p>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="tel:+1234567779" className="hover:text-teal-400 transition duration-300">
                  <i className="fas fa-phone mr-2"></i> +123-456-7779
                </a>
              </li>
              <li>
                <a href="mailto:telecare@gmail.com" className="hover:text-teal-400 transition duration-300">
                  <i className="fas fa-envelope mr-2"></i> telecare@gmail.com
                </a>
              </li>
              {/* Optional: Add social media links here if you have them */}
            </ul>
          </div>
          
        </div>

        {/* Copyright Section */}
        <div className="pt-8 text-center text-sm text-gray-500">
          &copy; copyright 2025 Telecare. All Right Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;