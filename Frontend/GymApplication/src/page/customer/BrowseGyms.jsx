import React, { useEffect, useState } from "react";
import axios from "axios";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const BrowseGyms = () => {
  const [gyms, setGyms] = useState([]);
  const [city, setCity] = useState("");
  const [searched, setSearched] = useState(false)
  const navigate = useNavigate();

  const { getToken } = useKindeAuth();

  const fetchGyms = async () => {
    if (!city.trim()) {
      return alert("please enter a city name")
    }
    try {
      const token = await getToken();
      const response = await axios.get(`http://localhost:4000/api/getGymCity?city=${city}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Response to get Gym", response.data);
      setGyms(response.data);
      setSearched(true)
    } catch (error) {
      console.error("Error fetching gyms:", error);
      setSearched(false)
      toast.error("City is Not Found")
    }
  };

  const handleBookingDetails = (gymId)=>{
    navigate(`/BookDetails/${gymId}`)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Browse Gyms Near You</h1>

      {/* City Input Field */}
      <div className="mb-4 text-center">
        <input
          type="text"
          placeholder="Enter city Name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="bg-gray-100 p-2 border rounded-lg shadow-md w-full md:w-1/2"
        />
        <button
          onClick={fetchGyms}
          className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 ml-2 cursor-pointer"
        >
          Search Gyms
        </button>
      </div>

      {/* Gym List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {searched && gyms.length === 0 ? (
          <p className="text-center col-span-2">No Gym Found in this City</p>
        ) : (
          gyms.map((gym) => (
            <div key={gym._id} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <a href="#">
                <img className="rounded-t-lg" src="image-1.jpg" alt="" />
              </a>
              <div class="p-5">
                <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{gym.gymName}</h2>
                <p><strong>City:</strong> {gym.address?.location}</p>
                <p><strong>Street:</strong> {gym.address?.street}</p>
                <p><strong>Description:</strong>{gym.description}</p>
                <button className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mt-5 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 cursor-pointer"
                onClick={()=>handleBookingDetails(gym._id)}
                > Book and Details </button>
              </div>
            </div>
          ))
        )

        }
      </div>
    </div>
  );
};

export default BrowseGyms;