import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import toast from "react-hot-toast";

const BookDetails = () => {
  const { gymId } = useParams();
  const { getToken } = useKindeAuth();
  const navigate = useNavigate();

  const [gymDetail, setGymDetail] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [morningOpeningTime, setMorningOpeningTime] = useState("");
  const [eveningOpeningTime, setEveningOpeningTime] = useState("");
  const [morningClosingTime, setMorningClosingTime] = useState("");
  const [eveningClosingTime, setEveningClosingTime] = useState("");

  useEffect(() => {
    const fetchGymDetail = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(
          `http://localhost:4000/api/getSingleGym/${gymId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("openig Time", response.data);
        if (response.data) {
          setGymDetail(response.data);
          setMorningOpeningTime(
            formatTime(response.data.timings.morning.openingTime)
          );
          setEveningOpeningTime(
            formatTime(response.data.timings.evening.openingTime)
          );
          setMorningClosingTime(
            formatTime(response.data.timings.morning.closingTime)
          );
          setEveningClosingTime(
            formatTime(response.data.timings.evening.closingTime)
          );
        }
      } catch (error) {
        console.log("Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGymDetail();
  }, [gymId]);

  const formatTime = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/kolkata",
    });
  };

  const handleSubmit = () => {
    if (!selectedDate) {
      toast.error("Please select a date.");
      return;
    }
    if (!selectedTime) {
      toast.error("Please select a gym visit time.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    if (selectedDate === today) {
      const now = new Date();
      const [hours, minutes] = selectedTime.split(":");
      const selectedDateTime = new Date();
      selectedDateTime.setHours(parseInt(hours));
      selectedDateTime.setMinutes(parseInt(minutes));
      selectedDateTime.setSeconds(0);

      if (selectedDateTime < now) {
        toast.error("Please Select The Valid Time:");
        return;
      }
    }

    const selectedTimeNumber = parseInt(selectedTime.replace(":", ""), 10);
    const morningOpeningTimeNumber = parseInt(
      morningOpeningTime.replace(":", ""),
      10
    );
    const morningClosingTimeNumber = parseInt(
      morningClosingTime.replace(":", ""),
      10
    );
    const eveningOpeningTimeNumber = parseInt(
      eveningOpeningTime.replace(":", ""),
      10
    );
    const eveningClosingTimeNumber = parseInt(
      eveningClosingTime.replace(":", ""),
      10
    );

    const isMorningSlot = selectedTimeNumber >= morningOpeningTimeNumber && selectedTimeNumber <= morningClosingTimeNumber;

    const isEveningslot = selectedTimeNumber >= eveningOpeningTimeNumber && selectedTimeNumber <= eveningClosingTimeNumber;

    if(!isMorningSlot && !isEveningslot){
        toast.error(
            `Please Select a Valid time between  ${morningOpeningTime}–${morningClosingTime} or ${eveningOpeningTime}–${eveningClosingTime}`,  {
                position: "top-center",
                duration: 3000,
              }
        );
        return;
    }

    navigate(`/CheckPrice/${gymId}`, {
      state: { selectedDate, selectedTime },
    });
  };

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-800 transition ml-5 cursor-pointer"
      >
        Back
      </button>
      <div className="flex justify-center p-6">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg text-center">
          {loading ? (
            <div className="flex justify-center items-center space-x-2">
              <div className="w-5 h-5 bg-[#d991c2] rounded-full animate-bounce"></div>
              <div className="w-5 h-5 bg-[#9869b8] rounded-full animate-bounce"></div>
              <div className="w-5 h-5 bg-[#6756cc] rounded-full animate-bounce"></div>
            </div>
          ) : (
            <div>
              <img
                src={
                  gymDetail.imageUrl ||
                  "https://img.freepik.com/premium-photo/modern-gym-interior-with-exercise-equipments_23-2147949737.jpg?w=996"
                }
                alt="Gym"
                className="w-full h-56 object-cover rounded-lg mb-4"
              />
              <h1 className="text-2xl font-bold text-gray-800">
                {gymDetail.gymName}
              </h1>
              <p className="text-gray-600 mt-2">{gymDetail.description}</p>

              {/* // Opening And closing Time */}

              <div className="flex flex-col items-center text-gray-600 font-semibold mt-3 gap-2">
                {/* Morning Row */}
                <div className="flex gap-6">
                  <h1 className="text-black min-w-[120px]">Morning Time</h1>
                  <span>
                    <strong>Opening:</strong> {morningOpeningTime}
                  </span>
                  <span>
                    <strong>Closing:</strong> {morningClosingTime}
                  </span>
                </div>

                {/* Evening Row */}
                <div className="flex gap-6">
                  <h1 className="text-black min-w-[120px]">Evening Time</h1>
                  <span>
                    <strong>Opening:</strong> {eveningOpeningTime}
                  </span>
                  <span>
                    <strong>Closing:</strong> {eveningClosingTime}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center mt-4">
                <label className="text-gray-700 font-semibold mb-2">
                  Select Date:
                </label>
                <input
                  type="date"
                  className="border rounded-lg px-4 py-2"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="flex flex-col items-center mt-4">
                <label className="text-gray-700 font-semibold mb-2">
                  Select Gym Visit Time:
                </label>
                <input
                  type="time"
                  name="appointment"
                //   min={new Date().toString().split("T")[0]}
                //   max={new Date().toString().split("T")[0]}
                  required
                  className="border rounded-lg px-4 py-2"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                />
              </div>
              <button
                onClick={handleSubmit}
                className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-2 cursor-pointer"
              >
                Enter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
