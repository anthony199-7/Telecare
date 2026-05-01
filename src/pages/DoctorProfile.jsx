/** @format */

import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const { backendUrl, doctorToken, doctorData, loadDoctorProfileData } =
    useContext(AppContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [degree, setDegree] = useState("");
  const [experience, setExperience] = useState("");
  const [about, setAbout] = useState("");
  const [fees, setFees] = useState("");
  const [address, setAddress] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!doctorToken) {
      navigate("/doctor/login");
      return;
    }

    if (doctorData) {
      setName(doctorData.name || "");
      setEmail(doctorData.email || "");
      setSpeciality(doctorData.speciality || "");
      setDegree(doctorData.degree || "");
      setExperience(doctorData.experience?.toString() || "");
      setAbout(doctorData.about || "");
      setFees(doctorData.fees?.toString() || "");
      setAddress(
        typeof doctorData.address === "string" ?
          doctorData.address
        : JSON.stringify(doctorData.address || {}) || "",
      );
      setPreview(doctorData.image || "");
    }
  }, [doctorData, doctorToken, navigate]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append("experience", experience);
      formData.append("about", about);
      formData.append("fees", fees);
      formData.append("address", JSON.stringify({ street: address }));
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const { data } = await axios.post(
        backendUrl + "/api/doctor/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${doctorToken}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (data.success) {
        toast.success(data.message || "Profile updated successfully");
        await loadDoctorProfileData();
        navigate("/doctor/dashboard");
      } else {
        toast.error(data.message || "Unable to update profile");
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-md">
          <h1 className="text-3xl font-semibold text-slate-900">
            Doctor Profile
          </h1>
          <p className="mt-2 text-slate-600">
            Update your profile information and availability details.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white p-6 shadow-md space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                value={email}
                disabled
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Speciality
              </label>
              <input
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Degree
              </label>
              <input
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Experience (years)
              </label>
              <input
                type="number"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Fees
              </label>
              <input
                type="number"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              About
            </label>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              rows={4}
              className="mt-2 w-full rounded-3xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Clinic address
            </label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
              placeholder="e.g. 123 Wellness Ave, City, State"
              required
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2 items-end">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Profile image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2 w-full text-sm text-slate-500"
              />
            </div>
            {preview && (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500 mb-2">Preview</p>
                <img
                  src={preview}
                  alt="Profile preview"
                  className="max-h-40 rounded-xl object-cover"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => navigate("/doctor/dashboard")}
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400">
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorProfile;
