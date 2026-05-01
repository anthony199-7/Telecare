/** @format */
import React, { useContext, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

// --- Constants ---
const SPECIALITIES = [
  "Gynecologist",
  "Dermatologist",
  "Pediatrician",
  "Neurologist",
  "General physician",
  "Gastroenterologist",
  "General Practitioner",
];

// --- Sub-Components ---

const FilterItem = ({ name, active, onClick }) => (
  <p
    onClick={() => onClick(name)}
    className={`w-[94vw] sm:w-48 pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer whitespace-nowrap ${
      active ?
        "bg-indigo-100 text-black border-indigo-400"
      : "hover:bg-gray-50 text-gray-600"
    }`}>
    {name}
  </p>
);

const DoctorCard = ({ doctor, onClick }) => (
  <div
    onClick={onClick}
    className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-2 transition-all duration-500 bg-white">
    <img
      className="bg-blue-50 w-full h-48 object-cover"
      src={doctor.image}
      alt={doctor.name}
    />
    <div className="p-4">
      <div className="flex items-center gap-2 text-sm text-green-500 mb-1">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        <p>Available</p>
      </div>
      <h3 className="text-gray-900 text-lg font-semibold">{doctor.name}</h3>
      <p className="text-gray-600 text-sm">{doctor.speciality}</p>
    </div>
  </div>
);

// --- Main Component ---

const Doctors = () => {
  const navigate = useNavigate();
  const { speciality: urlSpeciality } = useParams();
  const { doctors } = useContext(AppContext);
  const [showFilter, setShowFilter] = useState(false);

  // Filter Logic
  const filteredDoctors = useMemo(() => {
    if (!urlSpeciality) return doctors;
    return doctors.filter(
      (doc) => doc.speciality.toLowerCase() === urlSpeciality.toLowerCase(),
    );
  }, [doctors, urlSpeciality]);

  const handleFilterClick = (name) => {
    if (urlSpeciality === name) {
      navigate("/doctors");
    } else {
      navigate(`/doctors/${name}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-gray-600 text-xl md:text-2xl font-light mb-6">
        Browse through the specialists
      </h1>

      <div className="flex flex-col sm:flex-row items-start gap-6">
        {/* Mobile Filter Toggle */}
        <button
          className={`sm:hidden py-2 px-5 border rounded-lg text-sm font-medium transition-all mb-4 ${
            showFilter ? "bg-indigo-600 text-white" : "bg-white text-gray-600"
          }`}
          onClick={() => setShowFilter((prev) => !prev)}>
          {showFilter ? "Close Filters" : "Show Filters"}
        </button>

        {/* Sidebar Filters */}
        <aside
          className={`flex-col gap-3 text-sm transition-all duration-300 ${
            showFilter ? "flex" : "hidden sm:flex"
          }`}>
          {SPECIALITIES.map((item) => (
            <FilterItem
              key={item}
              name={item}
              active={urlSpeciality === item}
              onClick={handleFilterClick}
            />
          ))}
        </aside>

        {/* Doctor Grid */}
        <main className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-8">
          {filteredDoctors.length > 0 ?
            filteredDoctors.map((item) => (
              <DoctorCard
                key={item._id}
                doctor={item}
                onClick={() => navigate(`/appointment/${item._id}`)}
              />
            ))
          : <div className="col-span-full py-20 text-center text-gray-400">
              No doctors found in this specialty.
            </div>
          }
        </main>
      </div>
    </div>
  );
};

export default Doctors;
