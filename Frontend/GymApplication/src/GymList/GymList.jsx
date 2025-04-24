import React, { useEffect, useState } from "react";
import axios from "axios";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

function GymList() {
  const { getToken } = useKindeAuth();
  const navigate = useNavigate();
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Gym Data
  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(`http://localhost:4000/api/getGym`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Fetched Gyms:", response.data);
        setGyms(response.data.gyms || []);
      } catch (err) {
        console.error(
          "Error fetching gyms:",
          err.response?.data || err.message
        );
        setError("Failed to fetch gyms. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGyms();
  }, []);

  return (
    <>
      <div className="flex-1 flex flex-col items-center justify-start p-6 overflow-y-auto h-full">
        <h1 className="custom-font text-4xl font-bold text-gray-800">
          Add Staff
        </h1>

        {/* Loading State */}
        {loading && <p className="text-gray-500">Loading gyms...</p>}

        {/* Error Message */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Gym List */}
        {!loading && !error && gyms.length === 0 && (
          <p className="text-gray-500">No gyms found.</p>
        )}

        {/* Gym Cards */}
        <div className={`grid gap-10 mt-10 ${
      gyms.length === 1
        ? "grid-cols-1 justify-center"
        : gyms.length === 2
        ? "grid-cols-2 justify-center"
        : "grid-cols-1 md:grid-cols-3 lg:grid-cols-3 justify-start"
    }`}>
          {gyms.map((gym) => (
            <div
              key={gym._id}
              className="group relative w-full overflow-hidden bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:mx-auto sm:max-w-sm sm:rounded-lg sm:px-10"
            >
              <h3 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {gym.gymName}
              </h3>
              {/* button Add Staff */}
              <button
                class="inline-flex items-center justify-center bg-purple-400 text-white px-3 py-2 rounded hover:bg-purple-700 transition transform hover:translate-y-[-2px] hover:shadow-md cursor-pointer"
                onClick={() => navigate(`/gymdetails/${gym._id}`)}
              >
                <i class="fas fa-plus mr-2"></i> <FaPlus className="mr-2"/> Add Staff
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default GymList;
