/** @format */

import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorDashboard = () => {
  const { backendUrl, doctorToken, doctorData, loadDoctorProfileData } =
    useContext(AppContext);
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!doctorToken) {
      navigate("/doctor/login");
      return;
    }
    loadPageData();
  }, [doctorToken, navigate]);

  const loadPageData = async () => {
    setLoading(true);
    try {
      const [statsResponse, appointmentsResponse] = await Promise.all([
        axios.get(backendUrl + "/api/doctor/dashboard", {
          headers: { Authorization: `Bearer ${doctorToken}` },
        }),
        axios.get(backendUrl + "/api/doctor/appointments", {
          headers: { Authorization: `Bearer ${doctorToken}` },
        }),
      ]);

      if (statsResponse.data.success) {
        setStats(statsResponse.data.stats);
      }

      if (appointmentsResponse.data.success) {
        setAppointments(appointmentsResponse.data.appointments);
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const completeAppointment = async (appointmentId) => {
    setActionLoading(true);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/complete-appointment",
        { appointmentId },
        {
          headers: { Authorization: `Bearer ${doctorToken}` },
        },
      );

      if (data.success) {
        toast.success(data.message || "Appointment completed");
        loadPageData();
      } else {
        toast.error(data.message || "Could not complete appointment");
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  const toggleAvailability = async () => {
    setActionLoading(true);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/change-availability",
        {},
        {
          headers: { Authorization: `Bearer ${doctorToken}` },
        },
      );

      if (data.success) {
        toast.success(data.message || "Availability updated");
        await loadDoctorProfileData();
      } else {
        toast.error(data.message || "Could not update availability");
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">
                Doctor Dashboard
              </h1>
              <p className="mt-2 text-slate-600">
                Welcome back,
                <span className="font-semibold">
                  {" "}
                  {doctorData?.name || "Doctor"}
                </span>
              </p>
              <p className="text-sm text-slate-500">
                {doctorData?.speciality &&
                  `Speciality: ${doctorData.speciality}`}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={toggleAvailability}
                disabled={actionLoading}
                className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400">
                {doctorData?.available ? "Go Offline" : "Go Online"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-md">
            <h2 className="text-xl font-semibold text-slate-900">
              Performance
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                {
                  label: "Total Appointments",
                  value: stats?.totalAppointments ?? 0,
                },
                {
                  label: "Completed",
                  value: stats?.completedAppointments ?? 0,
                },
                {
                  label: "Cancelled",
                  value: stats?.cancelledAppointments ?? 0,
                },
                { label: "Paid", value: stats?.paidAppointments ?? 0 },
                { label: "Revenue", value: `₹${stats?.totalRevenue ?? 0}` },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-900">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                Upcoming Appointments
              </h2>
              <p className="text-sm text-slate-500">
                {appointments.length} total
              </p>
            </div>
            <div className="mt-5 space-y-4">
              {loading ?
                <p className="text-sm text-slate-500">
                  Loading appointments...
                </p>
              : appointments.length === 0 ?
                <p className="text-sm text-slate-500">No appointments yet.</p>
              : appointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-base font-semibold text-slate-900">
                          {appointment.userData?.name || "Patient"}
                        </p>
                        <p className="text-sm text-slate-500">
                          {appointment.slotDate} at {appointment.slotTime}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            appointment.isCompleted ?
                              "bg-emerald-100 text-emerald-700"
                            : appointment.cancelled ?
                              "bg-rose-100 text-rose-700"
                            : "bg-slate-100 text-slate-700"
                          }`}>
                          {appointment.cancelled ?
                            "Cancelled"
                          : appointment.isCompleted ?
                            "Completed"
                          : "Pending"}
                        </span>
                        <button
                          disabled={
                            appointment.isCompleted ||
                            appointment.cancelled ||
                            actionLoading
                          }
                          onClick={() => completeAppointment(appointment._id)}
                          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400">
                          Mark complete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
