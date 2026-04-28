/** @format */

import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const { docId } = useParams(); // [4]
  const {
    doctors,
    currencySymbol,
    backendUrl,
    token,
    getDoctorsData,
    userData,
  } = useContext(AppContext); // [3-5]
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]; // [6]

  const [docInfo, setDocInfo] = useState(null); // [7]
  const [docSlots, setDocSlots] = useState([]); // [2]
  const [slotIndex, setSlotIndex] = useState(0); // [2]
  const [slotTime, setSlotTime] = useState(""); // [2]
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const navigate = useNavigate(); // [8]

  // Find particular doctor data by ID
  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId); // [4, 7]
    setDocInfo(docInfo); // [7]
  };

  // Generate booking slots for next 7 days
  const getAvailableSlots = async () => {
    setDocSlots([]); // [9]

    let today = new Date(); // [9]

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i); // [10]

      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0); // Slots end at 9 PM [11]

      // Setting start hours based on current time if date is today
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10,
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0); // [11, 12]
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0); // [12]
      }

      let timeSlots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }); // [13]

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = day + "_" + month + "_" + year; // [14]
        const slotTime = formattedTime;

        const isSlotBooked =
          docInfo?.slots_booked?.[slotDate] &&
          docInfo.slots_booked[slotDate].includes(slotTime);

        if (!isSlotBooked) {
          timeSlots.push({
            dateTime: new Date(currentDate),
            time: formattedTime,
          }); // [13]
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30); // 30-minute intervals [16]
      }

      setDocSlots((prev) => [...prev, timeSlots]); // [16]
    }
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const openRazorpayCheckout = async (order, appointmentId) => {
    const isLoaded = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js",
    );
    if (!isLoaded) {
      toast.error("Razorpay SDK failed to load. Please try again.");
      return;
    }

    const options = {
      key: order.key_id,
      amount: order.amount,
      currency: order.currency,
      name: "Telecare",
      description: `Appointment with Dr. ${docInfo.name}`,
      order_id: order.id,
      modal: {
        ondismiss: () => setPaymentLoading(false),
      },
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backendUrl + "/api/user/verify-razorpay",
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              appointmentId,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          if (data.success) {
            toast.success(data.message);
            getDoctorsData();
            navigate("/my-appointments");
          } else {
            toast.error(data.message || "Payment verification failed");
          }
        } catch (error) {
          console.error("Verify payment failed:", error);
          toast.error(error.response?.data?.message || error.message);
        }
      },
      prefill: {
        name: userData?.name || "",
        email: userData?.email || "",
      },
      theme: {
        color: "#2563eb",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const payForAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }

    if (!selectedSlot) {
      toast.warn("Select a slot before booking.");
      return;
    }

    try {
      const date = selectedSlot.dateTime;
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const slotDate = `${day}_${month}_${year}`;

      setPaymentLoading(true);
      const { data } = await axios.post(
        backendUrl + "/api/user/payment-razorpay",
        {
          docId,
          slotDate,
          slotTime: selectedSlot.time,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (data.success) {
        await openRazorpayCheckout(data.order, data.appointmentId);
      } else {
        toast.error(data.message || "Unable to create payment order.");
      }
    } catch (error) {
      console.error("Create order failed:", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setPaymentLoading(false);
    }
  };

  useEffect(() => {
    fetchDocInfo(); // [7]
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlots(); // [9]
  }, [docInfo]);

  return (
    docInfo && (
      <div>
        {/* ---------- Doctor Details ---------- */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-primary w-full sm:max-w-72 rounded-lg"
              src={docInfo.image}
              alt=""
            />{" "}
            {/* [21, 22] */}
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            {/* Doc Info: name, degree, experience */}
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}
              <img className="w-5" src={assets.verified_icon} alt="" />{" "}
              {/* [22, 23] */}
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>{" "}
              {/* [24] */}
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>{" "}
              {/* [24, 25] */}
            </div>

            {/* ----- Doctor About ----- */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} alt="" /> {/* [25, 26] */}
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {docInfo.about}
              </p>{" "}
              {/* [25, 26] */}
            </div>
            <p className="text-gray-500 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-600">
                {currencySymbol}
                {docInfo.fees}
              </span>{" "}
              {/* [5, 27] */}
            </p>
          </div>
        </div>
        {/* ---------- Booking Slots ---------- */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking slots</p> {/* [6, 28] */}
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlots.length > 0 &&
              docSlots.map((slotGroup, index) => {
                const firstSlot = slotGroup[0];
                return (
                  <div
                    onClick={() => setSlotIndex(index)}
                    className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? "bg-primary text-white" : "border border-gray-200"}`}
                    key={index}>
                    <p>
                      {firstSlot && daysOfWeek[firstSlot.dateTime.getDay()]}
                    </p>
                    <p>{firstSlot && firstSlot.dateTime.getDate()}</p>
                  </div>
                );
              })}
          </div>
          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {docSlots.length > 0 &&
              docSlots[slotIndex]?.map((item, index) => (
                <p
                  onClick={() => {
                    setSlotTime(item.time);
                    setSelectedSlot(item);
                  }}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? "bg-primary text-white" : "text-gray-400 border border-gray-300"}`}
                  key={index}>
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>
          <button
            onClick={payForAppointment}
            disabled={paymentLoading}
            className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6 disabled:opacity-60 disabled:cursor-not-allowed">
            {paymentLoading ?
              "Processing payment..."
            : "Pay & Book appointment"}
          </button>{" "}
          {/* [34] */}
        </div>
        {/* Listing Related Doctors */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />{" "}
        {/* [35] */}
      </div>
    )
  );
};

export default Appointment;
