/** @format */

import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

// --- Sub-components ---

const EmptyState = () => (
  <section className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
    <p className="text-2xl font-light text-zinc-500">No Appointments Found</p>
    <p className="text-sm mt-2 text-zinc-400">
      It looks like you haven't booked any appointments yet.
    </p>
  </section>
);

const AppointmentCard = ({ item, onCancel, onPay, isLoading }) => {
  const { docData, slotDate, slotTime, cancelled, payment, _id } = item;

  return (
    <article
      className="flex flex-col sm:grid sm:grid-cols-[120px_1fr_180px] gap-4 p-4 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all bg-white"
      aria-labelledby={`doctor-name-${_id}`}>
      {/* Doctor Image */}
      <div className="flex justify-center sm:block">
        <img
          className="w-32 h-32 sm:w-full sm:h-28 object-cover rounded-lg bg-indigo-50"
          src={
            docData.image ||
            "https://placehold.co/120x120/eef2ff/4338ca?text=Dr"
          }
          alt={`Dr. ${docData.name}`}
        />
      </div>

      {/* Appointment Details */}
      <div className="text-sm text-zinc-600 space-y-1">
        <h3
          id={`doctor-name-${_id}`}
          className="text-lg text-indigo-700 font-bold">
          {docData.name}
        </h3>
        <p className="text-sm font-medium text-gray-700">
          {docData.speciality}
        </p>
        <div className="text-xs text-gray-500 mt-2">
          <p className="font-semibold text-gray-700 uppercase tracking-wider text-[10px]">
            Address
          </p>
          <p>{docData.address.line1}</p>
          <p>{docData.address.line2}</p>
        </div>
        <p className="text-sm mt-3 inline-block px-2 py-1 bg-indigo-50 rounded text-indigo-700">
          <span className="font-bold">Date:</span> {slotDate} | {slotTime}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 justify-center border-t sm:border-t-0 pt-4 sm:pt-0">
        {cancelled ?
          <button
            disabled
            className="w-full py-2 border border-red-600 rounded-lg text-red-400 bg-red-50 font-medium cursor-not-allowed">
            Cancelled
          </button>
        : <>
            {payment ?
              <button
                disabled
                className="w-full py-2 rounded-lg text-green-700 bg-green-100 font-medium border border-green-200">
                ✓ Paid
              </button>
            : <button
                onClick={() => onPay(item)}
                disabled={isLoading}
                aria-label={`Pay for appointment with Dr. ${docData.name}`}
                className="w-full py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50">
                {isLoading ? "Processing..." : "Pay Online"}
              </button>
            }
            <button
              onClick={() => onCancel(_id)}
              aria-label={`Cancel appointment with Dr. ${docData.name}`}
              className="w-full py-2 rounded-lg text-red-500 border border-red-200 hover:bg-red-50 transition-colors">
              Cancel Appointment
            </button>
          </>
        }
      </div>
    </article>
  );
};

// --- Main Component ---

const MyAppointments = () => {
  const { backendUrl, token, userData, getDoctorsData } =
    useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Memoized Headers
  const apiHeaders = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token],
  );

  const getUserAppointments = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/appointments`,
        apiHeaders,
      );
      if (data.success) {
        setAppointments(
          Array.isArray(data.appointments) ?
            [...data.appointments].reverse()
          : [],
        );
      }
    } catch (error) {
      toast.error(
        error.response?.status === 401 ?
          "Session expired. Please log in."
        : "Failed to load appointments.",
      );
    }
  }, [backendUrl, apiHeaders, token]);

  const cancelAppointment = useCallback(
    async (appointmentId) => {
      try {
        const { data } = await axios.post(
          `${backendUrl}/api/user/cancel-appointment`,
          { appointmentId },
          apiHeaders,
        );
        if (data.success) {
          toast.success(data.message);
          getUserAppointments();
          getDoctorsData();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Failed to cancel appointment.");
      }
    },
    [backendUrl, apiHeaders, getUserAppointments, getDoctorsData],
  );

  const initPay = useCallback(
    async (order, appointmentId) => {
      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "Telecare",
        description: "Medical Appointment",
        order_id: order.id,
        modal: { ondismiss: () => setPaymentLoading(false) },
        handler: async (response) => {
          try {
            const { data } = await axios.post(
              `${backendUrl}/api/user/verify-razorpay`,
              { ...response, appointmentId },
              apiHeaders,
            );
            if (data.success) {
              toast.success("Payment Successful");
              getUserAppointments();
              getDoctorsData();
            }
          } catch (error) {
            toast.error("Verification failed");
          } finally {
            setPaymentLoading(false);
          }
        },
        prefill: { name: userData?.name, email: userData?.email },
        theme: { color: "#4f46e5" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    },
    [backendUrl, apiHeaders, userData, getUserAppointments, getDoctorsData],
  );

  const payPendingAppointment = useCallback(
    async (appointment) => {
      setPaymentLoading(true);
      try {
        const { data } = await axios.post(
          `${backendUrl}/api/user/payment-razorpay`,
          { appointmentId: appointment._id },
          apiHeaders,
        );
        if (data.success) {
          await initPay(data.order, appointment._id);
        }
      } catch (error) {
        toast.error("Unable to initiate payment");
        setPaymentLoading(false);
      }
    },
    [backendUrl, apiHeaders, initPay],
  );

  useEffect(() => {
    getUserAppointments();
  }, [getUserAppointments]);

  return (
    <main className="p-4 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-2xl overflow-hidden mt-6 sm:mt-10">
        <header className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">My Appointments</h2>
          <p className="text-xs text-gray-500">
            Manage your upcoming and past medical consultations
          </p>
        </header>

        <div className="flex flex-col gap-4 p-6" aria-live="polite">
          {appointments.length > 0 ?
            appointments.map((item) => (
              <AppointmentCard
                key={item._id}
                item={item}
                onCancel={cancelAppointment}
                onPay={payPendingAppointment}
                isLoading={paymentLoading}
              />
            ))
          : <EmptyState />}
        </div>
      </div>
    </main>
  );
};

export default MyAppointments;
