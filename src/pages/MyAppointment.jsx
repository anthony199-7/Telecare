/** @format */

import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyAppointments = () => {
  const { backendUrl, token, userData, getDoctorsData } =
    useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const getUserAppointments = async () => {
    try {
      // Check if token exists before making the API call
      if (!token) return;

      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        // Ensure data.appointments is an array before reversing
        setAppointments(
          Array.isArray(data.appointments) ? data.appointments.reverse() : [],
        );
      }
    } catch (error) {
      console.log("Error fetching appointments:", error);
      // Optionally, handle 401/403 errors more specifically
      if (error.response && error.response.status === 401) {
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error("Failed to load appointments.");
      }
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      if (!token) {
        toast.error("You must be logged in to cancel an appointment.");
        return;
      }

      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData(); // Refresh doctor slots
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error cancelling appointment:", error);
      toast.error("Failed to cancel appointment.");
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
      description: `Appointment with Dr. ${appointment.docData?.name}`,
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
            getUserAppointments();
            getDoctorsData();
          } else {
            toast.error(data.message || "Payment verification failed");
          }
        } catch (error) {
          console.error("Verify payment failed:", error);
          toast.error(error.response?.data?.message || error.message);
        } finally {
          setPaymentLoading(false);
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

  const payPendingAppointment = async (appointment) => {
    if (!token) {
      toast.warn("Login to complete payment");
      return;
    }

    try {
      setPaymentLoading(true);
      const { data } = await axios.post(
        backendUrl + "/api/user/payment-razorpay",
        { appointmentId: appointment._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (data.success) {
        await openRazorpayCheckout(data.order, appointment._id);
      } else {
        toast.error(data.message || "Unable to create payment order.");
        setPaymentLoading(false);
      }
    } catch (error) {
      console.error("Create order failed:", error);
      toast.error(error.response?.data?.message || error.message);
      setPaymentLoading(false);
    }
  };

  useEffect(() => {
    // Trigger appointment fetching whenever the token changes (i.e., user logs in)
    getUserAppointments();
  }, [token]);

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-6 sm:p-8 mt-10">
        <h2 className="text-2xl font-semibold text-gray-800 pb-4 border-b border-gray-200">
          My Appointments
        </h2>

        <div className="flex flex-col gap-6 py-6">
          {appointments.length > 0 ?
            appointments.map((item, index) => (
              <div
                className="grid grid-cols-1 md:grid-cols-[120px_1fr_200px] gap-4 p-4 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 bg-white"
                key={index}>
                {/* Doctor Image */}
                <div className="hidden md:block">
                  <img
                    className="w-full h-28 object-cover rounded-lg bg-indigo-50"
                    src={
                      item.docData.image ||
                      "https://placehold.co/120x120/eef2ff/4338ca?text=Dr"
                    }
                    alt={`Dr. ${item.docData.name}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/120x120/eef2ff/4338ca?text=Dr";
                    }}
                  />
                </div>

                {/* Appointment Details */}
                <div className="text-sm text-zinc-600 space-y-1">
                  <p className="text-lg text-indigo-700 font-bold">
                    {item.docData.name}
                  </p>
                  <p className="text-sm font-medium text-gray-700">
                    {item.docData.speciality}
                  </p>
                  <p className="text-xs text-gray-500">
                    <span className="font-semibold">Address:</span>{" "}
                    {item.docData.address.line1}, {item.docData.address.line2}
                  </p>
                  <p className="text-sm mt-2 font-medium text-gray-700">
                    <span className="text-indigo-600">Date & Time:</span>{" "}
                    {item.slotDate} at {item.slotTime}
                  </p>
                </div>

                {/* Actions/Status */}
                <div className="flex flex-col gap-2 justify-center pt-2 md:pt-0">
                  {item.cancelled ?
                    <button className="w-full py-2 border border-red-500 rounded-full text-red-600 bg-red-50 font-medium cursor-default">
                      Cancelled
                    </button>
                  : <>
                      {item.payment ?
                        <button className="w-full py-2 rounded-full text-white bg-green-500 font-medium cursor-default">
                          Paid
                        </button>
                      : <button
                          onClick={() => payPendingAppointment(item)}
                          disabled={paymentLoading}
                          className="w-full py-2 rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed">
                          {paymentLoading ?
                            "Processing payment..."
                          : "Pay Online"}
                        </button>
                      }
                      <button
                        onClick={() => cancelAppointment(item._id)}
                        className="w-full py-2 rounded-full text-red-500 border border-red-300 bg-white hover:bg-red-50 transition-colors duration-300">
                        Cancel Appointment
                      </button>
                    </>
                  }
                </div>
              </div>
            ))
          : <div className="text-center py-16 bg-gray-50 rounded-lg">
              <p className="text-2xl font-light text-zinc-500">
                No Appointments Found
              </p>
              <p className="text-sm mt-2 text-zinc-400">
                It looks like you haven't booked any appointments yet.
              </p>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;
