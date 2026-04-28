/** @format */

import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext); // [3]
  const navigate = useNavigate(); // [4]

  const [state, setState] = useState("Sign Up"); // [1]

  const [email, setEmail] = useState(""); // [1]
  const [password, setPassword] = useState(""); // [1]
  const [name, setName] = useState(""); // [5]

  const onSubmitHandler = async (event) => {
    event.preventDefault(); // [5]

    try {
      if (state === "Sign Up") {
        // API call to register user [2]
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          password,
          email,
        });
        if (data.success) {
          localStorage.setItem("token", data.token); // [2]
          setToken(data.token); // [6]
        } else {
          toast.error(data.message); // [6]
        }
      } else {
        // API call to login user [6]
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          password,
          email,
        });
        if (data.success) {
          localStorage.setItem("token", data.token); // [2]
          setToken(data.token); // [6]
        } else {
          toast.error(data.message); // [6]
        }
      }
    } catch (error) {
      toast.error(error.message); // [7]
    }
  };

  // Redirect to home if user is already logged in [4]
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>{" "}
        {/* [8] */}
        <p>
          Please {state === "Sign Up" ? "sign up" : "log in"} to book
          appointment
        </p>{" "}
        {/* [9] */}
        {/* Only show Name field during Sign Up [10, 11] */}
        {state === "Sign Up" && (
          <div className="w-full ">
            <p>Full Name</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />{" "}
            {/* [9, 12] */}
          </div>
        )}
        <div className="w-full ">
          <p>Email</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />{" "}
          {/* [9, 12] */}
        </div>
        <div className="w-full ">
          <p>Password</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />{" "}
          {/* [12, 13] */}
        </div>
        <button
          type="submit"
          className="bg-primary text-white w-full py-2 rounded-md text-base">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </button>{" "}
        {/* [13, 14] */}
        {/* Toggle between Login and Sign Up states [10, 15] */}
        {state === "Sign Up" ?
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-primary underline cursor-pointer">
              Login here
            </span>{" "}
          </p>
        : <p>
            Create a new account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-primary underline cursor-pointer">
              click here
            </span>{" "}
          </p>
        }
      </div>
    </form>
  );
};

export default Login;
