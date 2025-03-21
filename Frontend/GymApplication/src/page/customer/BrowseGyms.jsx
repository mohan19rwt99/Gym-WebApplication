import React, { useEffect, useState } from "react";
import axios from "axios";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const BrowseGyms = () => {
  const [gyms, setGyms] = useState([]);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY", // Replace with your API key
  });

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/gyms");
        setGyms(response.data.gyms);
      } catch (error) {
        console.error("Error fetching gyms:", error);
      }
    };

    fetchGyms();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Browse Gyms Near You</h1>
      
      {/* Gym List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gyms.map((gym) => (
          <div key={gym._id} className="p-4 border rounded-lg shadow">
            <h2 className="text-xl font-semibold">{gym.gymName}</h2>
            <p>{gym.location}</p>
          </div>
        ))}
      </div>

      {/* Google Map */}
      <div className="mt-6 h-96">
        {isLoaded && (
          <GoogleMap
            zoom={12}
            center={{ lat: 28.7041, lng: 77.1025 }} // Default: Delhi (Change dynamically if needed)
            mapContainerStyle={{ width: "100%", height: "100%" }}
          >
            {gyms.map((gym) => (
              <Marker
                key={gym._id}
                position={{ lat: parseFloat(gym.latitude), lng: parseFloat(gym.longitude) }}
                title={gym.gymName}
              />
            ))}
          </GoogleMap>
        )}
      </div>
    </div>
  );
};

export default BrowseGyms;
