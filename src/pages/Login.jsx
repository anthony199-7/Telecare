/** @format */

import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import {useNavigate} from 'react-router-dom'
const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate =useNavigate()
  const [state, setState] = useState("sign up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

 const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
        let res; // Use 'res' for the Axios response object

        if (state === "Sign Up") {
            const data = { name, password, email };
            
            // 1.  Assign the result to 'res'
            res = await axios.post(backendUrl + "/api/users/register", data);

        } else { // state === "Login"
            const data = { email, password };

            // 1. CRITICAL FIX: Assign the result to 'res'
            res = await axios.post(backendUrl + "/api/users/login", data);
        }
        
        // 2. CRITICAL FIX: Check res.data.success and use res.data.token
        if (res.data.success) {
            // Success logic
            localStorage.setItem("token", res.data.token);
            setToken(res.data.token);
        } else {
            // Failure logic (Backend sent a success: false response)
            // Use res.data.message for the message sent from your backend controller
            toast.error(res.data.message);
        }

    } catch (error) {
        // 3. CRITICAL FIX: Handle network errors and get the message correctly
        const errorMessage = error.response
            ? error.response.data.message // Message from your backend (e.g., status 400)
            : error.message;             // General network/Axios error (e.g., server offline)
            
        toast.error(errorMessage);
    }
};
  useEffect(()=>{
    if (token){
      navigate('/')
    }
  },[token])



 return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm:shadow-lg">
        <div className="w-4 flex flex-col  m-auto p- min-w-[340px] sm:min-w-96 bg-blue-800 ">
          <img src={assets.telecare_login} alt="" />
        </div>

        <p className="text-2xl font-semibold">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>
        <p>
          Please {state === "Sign Up" ? "Sign Up" : "login"} to book appointment
        </p>

        {state === "Sign Up" && (
          <div className="w-full">
            <p>full Name</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 nt-1"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 nt-1"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 nt-1"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-900 text-white w-full py-2 rounded-md text-base">
          {state === "Sign Up" ? "Create Account" : "login"}
        </button>
        {state === "Sign Up" ? (
          <p>
            Already have an account ?
            <span
              onClick={() => setState("login")}
              className="text-blue-300 underline cursor-pointer">
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?
            <span
              onClick={() => setState("Sign Up")}
              className="text-blue-300 underline cursor-pointer">
              click here
            </span>{" "}
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
