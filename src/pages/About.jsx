/** @format */

import React, { useMemo } from "react";
import { assets } from "../assets/assets";

// Reusable Section Title Component
const SectionTitle = ({ mainText, spanText }) => (
  <h2 className="text-3xl md:text-4xl py-10 text-gray-500 text-center md:text-left">
    {mainText} <span className="text-gray-700 font-medium">{spanText}</span>
  </h2>
);

// Reusable Feature Card Component
const FeatureCard = ({ title, items }) => (
  <article
    className="border px-8 py-10 flex flex-col gap-4 transition-all duration-300 hover:bg-blue-50 hover:border-blue-200 cursor-default group"
    role="region"
    aria-labelledby={title.replace(/\s+/g, "-").toLowerCase()}>
    <h3
      id={title.replace(/\s+/g, "-").toLowerCase()}
      className="text-xl font-bold text-gray-900 group-hover:text-blue-700">
      {title}
    </h3>
    <div className="text-gray-600 space-y-3">
      {items.map((item, index) => (
        <div key={index}>
          {item.subtitle && (
            <strong className="block text-gray-800">{item.subtitle}</strong>
          )}
          <p>{item.text}</p>
        </div>
      ))}
    </div>
  </article>
);

const About = () => {
  // Memoizing static data to prevent unnecessary re-renders
  const whyChooseUsData = useMemo(
    () => [
      {
        title: "Post-COVID Growth",
        items: [
          { text: "Accelerated adoption due to social distancing." },
          { text: "Normalized virtual healthcare experiences." },
        ],
      },
      {
        title: "Market Trends",
        items: [
          { text: "Global market size projected to reach $450B by 2030." },
          {
            text: "Increased demand for chronic care and mental health services.",
          },
        ],
      },
      {
        title: "Problems It Solves",
        items: [
          {
            subtitle: "Access:",
            text: "Rural and underserved areas can reach specialists.",
          },
          { subtitle: "Cost:", text: "Reduces overhead and travel expenses." },
          {
            subtitle: "Convenience:",
            text: "On-demand care for patients and flexibility for providers.",
          },
          {
            subtitle: "Language:",
            text: "Patients can speak to doctors in their preferred language.",
          },
        ],
      },
    ],
    [],
  );

  return (
    <main className="container mx-auto px-4 md:px-10">
      {/* --- About Section --- */}
      <section>
        <SectionTitle mainText="ABOUT" spanText="US" />

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <img
            className="w-full lg:max-w-[500px] rounded-lg shadow-sm"
            src={assets.about_image}
            alt="Doctor providing a telecare consultation"
          />

          <div className="flex flex-col justify-center gap-6 text-gray-600 leading-relaxed">
            <p className="text-lg md:text-xl">
              Telecare aims to improve accessibility to your health and wellness
              needs. Connect to General practitioners on demand.
            </p>
            <strong className="text-2xl md:text-3xl text-gray-800">
              Video call a healthcare doctor now.
            </strong>
            <p className="text-lg">
              Skip the queue. Get the advice you need from the comfort of your
              home instantly. You can also schedule an appointment with your
              preferred provider at your convenience.
            </p>
            <strong className="text-2xl text-gray-800">
              We've got you covered—from medication to referrals.
            </strong>
            <p className="text-lg italic">
              Supporting documents will be sent straight to your inbox when
              necessary.
            </p>
          </div>
        </div>
      </section>

      {/* --- Why Choose Us Section --- */}
      <section className="my-20">
        <SectionTitle mainText="WHY" spanText="CHOOSE US" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-collapse">
          {whyChooseUsData.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              items={feature.items}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default About;
