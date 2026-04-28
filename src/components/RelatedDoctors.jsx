/** @format */

import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const RelatedDoctors = ({ speciality, docId }) => {
  const { doctors } = useContext(AppContext); // [4]
  const navigate = useNavigate(); // [3]

  const [relDoc, setRelDoc] = useState([]); // [4]

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      // Filter doctors by speciality and exclude the current doctor being viewed
      const doctorsData = doctors.filter(
        (doc) => doc.speciality === speciality && doc._id !== docId,
      ); // [2, 5]
      setRelDoc(doctorsData); // [5]
    }
  }, [doctors, speciality, docId]); // [2]

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Related Doctors</h1> {/* [6] */}
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors.
      </p>{" "}
      {/* [7] */}
      <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {relDoc.slice(0, 5).map(
          (
            item,
            index, // [3, 5]
          ) => (
            <div
              onClick={() => {
                navigate(`/appointment/${item._id}`);
                scrollTo(0, 0);
              }} // [3]
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
              key={index}>
              <img className="bg-blue-50" src={item.image} alt="" /> {/* [8] */}
              <div className="p-4">
                <div
                  className={`flex items-center gap-2 text-sm text-center ${item.available ? "text-green-500" : "text-gray-500"}`}>
                  {" "}
                  {/* [9] */}
                  <p
                    className={`w-2 h-2 ${item.available ? "bg-green-500" : "bg-gray-500"} rounded-full`}></p>{" "}
                  {/* [10] */}
                  <p>{item.available ? "Available" : "Not Available"}</p>{" "}
                  {/* [11] */}
                </div>
                <p className="text-gray-900 text-lg font-medium">{item.name}</p>{" "}
                {/* [12] */}
                <p className="text-gray-600 text-sm">{item.speciality}</p>{" "}
                {/* [12] */}
              </div>
            </div>
          ),
        )}
      </div>
      <button
        onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
        className="bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10">
        more
      </button>{" "}
      {/* [13] */}
    </div>
  );
};

export default RelatedDoctors;
