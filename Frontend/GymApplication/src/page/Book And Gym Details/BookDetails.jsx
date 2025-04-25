import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import toast from "react-hot-toast";
import { button } from "@material-tailwind/react";

const BookDetails = () => {
  const { gymId } = useParams();
  const { getToken } = useKindeAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [gymDetail, setGymDetail] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedTime, setSelectedTime] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [morningOpeningTime, setMorningOpeningTime] = useState("");
  const [eveningOpeningTime, setEveningOpeningTime] = useState("");
  const [morningClosingTime, setMorningClosingTime] = useState("");
  const [eveningClosingTime, setEveningClosingTime] = useState("");
  const [slots, setSlots] = useState({
    morning: [],
    evening: [],
  });

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

        console.log("timing according the", response.data.timings);
        // console.log("max people", response.data.timings.evening.slots[0].maxPeople)
        // response.data.timings.morning.slots.forEach((slot, index)=>{
        //   console.log(`Slot ${index + 1} - MaxPeople:`, slot.maxPeople,slot._id)
        // })

        const data = response.data;

        setSlots({
          morning: data.timings.morning.slots,
          evening: data.timings.evening.slots,
        });

        if (data) {
          setGymDetail(data);
          setMorningOpeningTime(formatTime(data.timings.morning.openingTime));
          setEveningOpeningTime(formatTime(data.timings.evening.openingTime));
          setMorningClosingTime(formatTime(data.timings.morning.closingTime));
          setEveningClosingTime(formatTime(data.timings.evening.closingTime));
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
    if (!selectedTime.length) {
      toast.error("Please select a gym visit time.");
      return;
    }

    console.log("selectedTime", selectedTime);

    navigate(`/check-price/${gymId}`, {
      state:  { selectedDate, selectedTime,  numberOfSlots: selectedTime.length  },
    });
  };

  const handleBack = () => {
    navigate(`/browse-gyms`, {
      state: location.state,
    });
  };

  const timeSelect = (slot) => {
    console.log("slot strat time", slot.start);
    console.log("selectedDate", selectedDate);

    const today = new Date().toISOString().split("T")[0];

    if (selectedDate === today) {
      const now = new Date();

      const [time, modifier] = slot.start.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      if (modifier === "pm" && hours !== 12) hours += 12;
      if (modifier === "am" && hours === 12) hours = 0;
      const slotTime = new Date();
      slotTime.setHours(hours);
      slotTime.setMinutes(minutes);
      slotTime.setSeconds(0);
      slotTime.setMilliseconds(0);

      if (slotTime < now) {
        toast.error("This slot is in the past. Please select a future time.");
        return;
      }
    }

    setSelectedTime((prevSelected) => {
      const exists = prevSelected.find((s) => s._id === slot._id);
      if (exists) {
        return prevSelected.filter((s) => s._id !== slot._id);
      } else {
        return [...prevSelected, { _id: slot._id, time: slot.start }];
      }
    });
    
  };

  return (
    <>
      <div className="w-full py-6 px-4">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
          {loading ? (
            <div className="flex justify-center items-center space-x-2">
              <div className="w-5 h-5 bg-[#d991c2] rounded-full animate-bounce"></div>
              <div className="w-5 h-5 bg-[#9869b8] rounded-full animate-bounce"></div>
              <div className="w-5 h-5 bg-[#6756cc] rounded-full animate-bounce"></div>
            </div>
          ) : (
            <>
              <button
                onClick={handleBack}
                className="mb-6 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-800 transition"
              >
                Back
              </button>

              <div className="w-full h-64 overflow-hidden rounded-md mb-6">
                <img
                  src={
                    gymDetail.images?.url ||
                    "https://img.freepik.com/premium-photo/modern-gym-interior-with-exercise-equipments_23-2147949737.jpg?w=996"
                  }
                  alt="Gym"
                  className="w-full h-full object-cover"
                />
              </div>

              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {gymDetail.gymName}
              </h1>
              <p className="text-gray-600 mb-4">{gymDetail.description}</p>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Amenities
                </h2>
                <ul className="flex flex-wrap gap-3 text-gray-700">
                  {gymDetail.amenities?.map(
                    (amenity) =>
                      amenity.checked && (
                        <li
                          key={amenity.id}
                          className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                        >
                          {amenity.label}
                        </li>
                      )
                  )}
                </ul>
              </div>

              {/* Time Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm font-medium text-gray-700">
                <div className="p-4 border rounded-lg">
                  <h3 className="text-md font-semibold mb-2">Morning Hours</h3>
                  <p>Opening: {morningOpeningTime}</p>
                  <p>Closing: {morningClosingTime}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="text-md font-semibold mb-2">Evening Hours</h3>
                  <p>Opening: {eveningOpeningTime}</p>
                  <p>Closing: {eveningClosingTime}</p>
                </div>
              </div>

              {/* Date and Time Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex flex-col">
                  <label className="mb-1 text-gray-700 font-semibold">
                    Select Date:
                  </label>
                  <input
                    type="date"
                    className="border rounded-md px-4 py-2"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                {/* <div className="flex flex-col">
              <label className="mb-1 text-gray-700 font-semibold">Select Gym Visit Time:</label>
              <input
                type="time"
                className="border rounded-md px-4 py-2"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </div> */}
              </div>

              <div className="mt-4 text-center">
                <h3 className="text-gray-700 font-semibold mb-2">
                  Select Time Slot:
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {slots.morning.concat(slots.evening).map((slot) => (
                    <button
                      key={slot._id}
                      onClick={() => timeSelect(slot)}
                      disabled={slot.booked >= slot.maxPeople}
                      className={`px-4 py-2 rounded-lg border ${
                        selectedTime.some((s) => s._id === slot._id)
                          ? "bg-gray-800 text-white"
                          : "bg-white text-gray-800"
                      } ${
                        slot.booked >= slot.maxPeople
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      {slot.start}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="text-center">
                <p className="text-xl font-bold text-blue-900 mb-3">
                  Confirm Time
                </p>
                <button
                  onClick={handleSubmit}
                  className="text-white bg-gray-400 hover:bg-black font-medium rounded-lg text-sm px-6 py-2 hover:bg-gray-800 transition transform duration-300 cursor-pointer"
                >
                  Continue
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BookDetails;
