import React, { useState, useEffect } from "react";
import axios from "axios";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const centerDefault = {
  lat: 28.6139, // Default to Delhi
  lng: 77.209,
};

const BrowseGyms = () => {
  const [gyms, setGyms] = useState([]);
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [selectedGym, setSelectedGym] = useState(null);
  const [mapCenter, setMapCenter] = useState(centerDefault);
  const navigate = useNavigate();
  const location = useLocation();

  const { getToken } = useKindeAuth();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyC8dQaD5ZNlJnsPydXHDpJLv7usOU1LM_Q",
  });

  // Restore saved state when navigating back
  useEffect(() => {
    if (location.state?.searchTerm) {
      setQuery(location.state.searchTerm);
      setGyms(location.state.gyms || []);
      setMapCenter(location.state.mapCenter || centerDefault);
      setSearched(true);
    }
  }, [location.state]);

  // Fetch gyms based on the city or gym name
  const fetchGymsByQuery = async () => {
    if (!query.trim()) return alert("Please enter city or gym name");

    try {
      const token = await getToken();
      const response = await axios.get(
        `http://localhost:4000/api/get-gym-city?query=${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Response for get City", response.data);

      const data = response.data;
      if (data.length === 0) {
        setGyms([]);
        setSearched(true);
        toast.error("No gyms found");
      } else {
        setGyms(data);
        setMapCenter({
          lat: data[0].coordinates?.lat || 28.6139,
          lng: data[0].coordinates?.lng || 77.209,
        });
        setSearched(true);
      }
    } catch (error) {
      console.error("Error fetching gyms:", error);
      setGyms([]);
      setSearched(true);
      toast.error("Error fetching gyms");
    }
  };

  const handleBookingDetails = (gymId) => {
    navigate(`/book-details/${gymId}`, {
      state: {
        searchTerm: query,
        gyms: gyms,
        mapCenter: mapCenter,
      },
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Browse Gyms Near You</h1>

      {/* Search Input */}
      <div className="mb-4 text-center">
        <input
          type="text"
          placeholder="Search by city or gym name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchGymsByQuery()}
          className="bg-gray-100 p-2 border rounded-lg shadow-md w-full md:w-1/2"
        />
        <button
          onClick={fetchGymsByQuery}
          className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-800 cursor-pointer"
        >
          Search Gyms
        </button>
      </div>

      {/* Google Map */}
      {isLoaded && gyms.length > 0 && (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={12}
        >
          {gyms.map((gym) => (
            <Marker
              key={gym._id}
              position={{
                lat: gym.coordinates?.lat || 0,
                lng: gym.coordinates?.lng || 0,
              }}
              onClick={() => setSelectedGym(gym)}
            />
          ))}

          {selectedGym && (
            <InfoWindow
              position={{
                lat: selectedGym.coordinates?.lat || 0,
                lng: selectedGym.coordinates?.lng || 0,
              }}
              onCloseClick={() => setSelectedGym(null)}
            >
              <div>
                <h2 className="font-bold">{selectedGym.gymName}</h2>
                <p>{selectedGym.address?.location}</p>
                <button
                  onClick={() => handleBookingDetails(selectedGym._id)}
                  className="bg-blue-600 text-white px-2 py-1 mt-2 rounded"
                >
                  Book Now
                </button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      )}

      {/* Gym Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {searched && gyms.length === 0 ? (
          <p className="text-center col-span-2">No Gym Found</p>
        ) : (
          gyms.map((gym) => (
            <div
              key={gym._id}
              className="bg-white p-4 border rounded-lg shadow-md trasition-all duration-300 hover:traslate-y-1 hover:shadow-2xl"
            >
              <h2 className="text-xl font-semibold">{gym.gymName}</h2>
              <p>City: {gym.address?.location}</p>
              <p>Street: {gym.address?.street}</p>
              <p>Description: {gym.description}</p>
              <button
                className="bg-gray-500 text-white px-4 py-2 mt-3 rounded hover:bg-gray-800 cursor-pointer"
                onClick={() => handleBookingDetails(gym._id)}
              >
                Book and Details
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BrowseGyms;