import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

function AddMember() {
  const { getToken } = useKindeAuth();

  const users = {
    name: "",
    email: "",
    number: "",
    role: "",
  };
  const [user, setUser] = useState(users);

  const navigate = useNavigate();
  const location = useLocation();
  const gymId = location.state?.gymId;

  const inputHandler = (e) => {
    const { name, value } = e.target;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (name === "number") {
      if (!/^\d{0,10}$/.test(value)) return;
    } else if (name === "email") {
      if (!emailRegex.test(value)) return;
    }
    setUser({ ...user, [name]: value });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const requestData = {
      ...user,
      gymId: gymId,
    };

    try {
      const token = await getToken();
      const response = await axios.post(
        "http://localhost:4000/api/addstaff",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response is:", response.data);

      if (response.status >= 200 && response.status < 300) {
        toast.success(response.data.msg || "Member added successfully!", {
          position: "top-right",
          duration: 4000,
        });

        setTimeout(() => {
          navigate(`/gymdetails/${gymId}`);
        }, 1000);
      }
    } catch (error) {
      console.error(
        "Error adding staff:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.msg || "Failed to add member", {
        position: "top-right",
        duration: 4000,
      });
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
          <button
            className="mb-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-300 cursor-pointer"
            onClick={() => navigate(`/gymdetails/${gymId}`)}
          >
            Previous Page
          </button>

          <h3 className="text-2xl font-bold text-center mb-6">
            Add New Staff Member
          </h3>

          <form onSubmit={submitForm} className="space-y-4">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                autoComplete="off"
                placeholder="Enter Name..."
                onChange={inputHandler}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {FormData.number && FormData.number.length !== 10 && (
                <p className="text-red-500 text-sm mt-1">
                  Contact Number must be exactly 10 digit
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="off"
                placeholder="Enter Email..."
                onChange={inputHandler}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Contact Number Field */}
            <div>
              <label
                htmlFor="number"
                className="block text-gray-700 font-medium mb-1"
              >
                Contact Number
              </label>
              <input
                type="tel"
                id="number"
                name="number"
                maxLength="10"
                pattern="[0-9]{10}"
                autoComplete="off"
                placeholder="Enter Contact Number..."
                onChange={inputHandler}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label
                htmlFor="role"
                className="block text-gray-700 font-medium mb-1"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                onChange={inputHandler}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Staff Role</option>
                {/* <option value="Admin">Admin</option> */}
                <option value="Manager">Manager</option>
                <option value="Trainer">Trainer</option>
                <option value="Receptionist">Receptionist</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-purple-400 text-white w-full py-2 rounded-lg hover:bg-purple-700 transition duration-300 cursor-pointer"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddMember;
