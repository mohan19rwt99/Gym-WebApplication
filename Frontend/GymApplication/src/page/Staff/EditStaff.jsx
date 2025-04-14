import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

function EditStaff() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { getToken } = useKindeAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    role: "",
  });

  // Load Staff Details from location.state
  useEffect(() => {
    console.log("Location State Data:", location.state);
    if (location.state?.staff) {
      const staff = location.state.staff;
      setFormData({
        name: staff.name || "",
        email: staff.email || "",
        number: staff.number || "",
        role: staff.role || "",
      });
    }
  }, [location]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "number") {
      if (!/^\d{0,10}$/.test(value)) return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = await getToken();

      const response = await axios.put(
        `http://localhost:4000/api/updateStaff/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.msg || "Staff Member Updated Successfully", {
        position: "top-right",
        duration: 4000,
      });
      navigate(-1);
    } catch (error) {
      console.error("Error updating staff:", error);
      toast.error(
        error.response?.data?.msg || "Failed to update staff member",
        {
          position: "top-right",
          duration: 4000,
        }
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div>
        <div className="bg-black text-white p-5 text-center">
          <h1 className="text-2xl font-bold">Edit Staff Member</h1>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-4">
              <label>Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label>Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            {/* Number */}
            <div className="mb-4">
              <label>Number</label>
              <input
                name="number"
                value={formData.number}
                onChange={handleChange}
                type="text"
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            {/* Role */}
            <div className="mb-4">
              <label>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Trainer">Trainer</option>
                <option value="Receptionist">Receptionist</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
              >
                Update
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditStaff;
