import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MapComponent from "./googlemap/MapComponent";

const EditGym = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { getToken } = useKindeAuth();

  const [file, setFile] = useState();
  const [viewImages, setImagesView] = useState([null]);

  const [morningOpeningTime, setMorningOpeningTime] = useState(
    new Date().setHours(5, 0)
  );
  const [morningClosingTime, setMorningClosingTime] = useState(
    new Date().setHours(9, 0)
  );
  const [eveningOpeningTime, setEveningOpeningTime] = useState(
    new Date().setHours(16, 0)
  );
  const [eveningClosingTime, setEveningClosingTime] = useState(
    new Date().setHours(22, 0)
  );
  const [error, setError] = useState("");
  const [position, setPosition] = useState({ lat: 29.927, lng: 73.876 });
  const [isLoading, setIsLoading] = useState(true);

  const [morningSlots, setMorningSlots] = useState([]);
  const [eveningSlots, setEveningSlots] = useState([]);
  const [morningNewSlot, setMorningNewSlot] = useState({
    start: "",
    end: "",
    maxPeople: 0,
  });
  const [eveningNewSlot, setEveningNewSlot] = useState({
    start: "",
    end: "",
    maxPeople: 0,
  });

  const [amenties, setAmenties] = useState([
    { id: "cardio", label: "Cardio Equipment", checked: false },
    { id: "Free Weights", label: "Free Weights", checked: false },
    { id: "Group Exercise", label: "Group Excercise", checked: false },
    { id: "Showers", label: "Showers", checked: false },
    { id: "Lockers", label: "Lockers", checked: false },
    { id: "Changing Room", label: "Changing Room", checked: false },
    { id: "Weight Machines", label: "Weight Machines", checked: false },
    { id: "Yoga Spaces", label: "Yoga Spaces", checked: false },
    { id: "Free Wifi", label: "Free Wifi", checked: false },
    { id: "Lounge Area", label: "Lounge Area", checked: false },
    { id: "Parking", label: "Parking", checked: false },
  ]);

  const [formData, setFormData] = useState({
    gymName: "",
    address: {
      location: "",
      street: "",
      place_id: "",
    },
    pricing: {
      hourlyRate: "",
      weeklyRate: "",
      monthlyRate: "",
    },
    personalTrainerPricing: {
      hourlyRate: "",
      weeklyRate: "",
      monthlyRate: "",
    },
    description: "",
  });

  const currencySymbols = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    RUB: "₽",
    KRW: "₩",
  };

  const [currency, setCurrency] = useState("INR");

  // Handle opening time
  const handleMorningOpeningTime = (time) => {
    setMorningOpeningTime(time);
    if (new Date(time).getTime() >= new Date(morningClosingTime).getTime()) {
      const updatedClosingTime = new Date(time);
      updatedClosingTime.setHours(updatedClosingTime.getHours() + 1);
      setMorningClosingTime(updatedClosingTime);
    }
    // Regenrate slots
    const updateSlots = generateSlots(
      time,
      morningClosingTime,
      morningNewSlot.maxPeople
    );
    setMorningSlots(updateSlots);
  };

  // Handle Morning closing time
  const handleMorningClosingTime = (time) => {
    if (new Date(time).getTime() <= new Date(morningOpeningTime).getTime()) {
      setError("Morning Closing Time must be after Opening Time");
    } else {
      setError("");
      setMorningClosingTime(time);
      // Re-generate slots
      const updatedSlots = generateSlots(
        morningOpeningTime,
        time,
        morningNewSlot.maxPeople
      );
      setMorningSlots(updatedSlots);
    }
  };

  // input max People

  const handleMaxPeopleChange = (e) => {
    const maxPeople = parseInt(e.target.value, 10);
    setMorningNewSlot((prev) => ({ ...prev, maxPeople }));
    const updatedSlots = generateSlots(
      morningOpeningTime,
      morningClosingTime,
      maxPeople
    );
    setMorningSlots(updatedSlots);
  };

  // evening Opening Time
  const handleEveningOpeningTime = (time) => {
    setEveningOpeningTime(time);
    if (new Date(time).getTime() >= new Date(eveningClosingTime).getTime()) {
      const updatedClosingTime = new Date(time);
      updatedClosingTime.setHours(updatedClosingTime.getHours() + 1);
      setEveningClosingTime(updatedClosingTime);
    }
    // Regenrate Evening Opening Time
    const updateSlots = generateSlots(
      time,
      eveningClosingTime,
      eveningNewSlot.maxPeople
    );
    setEveningSlots(updateSlots);
  };

  // evening closing Time
  const handleEveningClosingTime = (time) => {
    if (new Date(time).getTime() <= new Date(eveningOpeningTime).getTime()) {
      setError("Evening Closing Time must be after Opening Time");
    } else {
      setError("");
      setEveningClosingTime(time);
      // Re-generate slots
      const updatedSlots = generateSlots(
        eveningOpeningTime,
        time,
        eveningNewSlot.maxPeople
      );
      setEveningSlots(updatedSlots);
    }
  };

  const handleEveningMaxPeopleChange = (e) => {
    const maxPeople = parseInt(e.target.value, 10);
    setEveningNewSlot((prev) => ({ ...prev, maxPeople }));
    const updatedSlots = generateSlots(
      eveningOpeningTime,
      eveningClosingTime,
      maxPeople
    );
    setEveningSlots(updatedSlots);
  };

  const formatTime = (timeStamp) => {
    const date = new Date(timeStamp);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const generateSlots = (startTime, endTime, maxPeople) => {
    const slots = [];
    console.log("slots", slots);
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    let current = start;
    while (current < end) {
      const next = new Date(current + 30 * 60 * 1000);
      if (next.getTime() <= end) {
        slots.push({
          start: formatTime(current),
          end: formatTime(next.getTime()),
          maxPeople: maxPeople || 0,
        });
      }
      current = next.getTime();
    }
    return slots;
  };

  // for amenties checkbox
  const handleCheckboxChange = (id) => {
    setAmenties((prevAmenties) =>
      prevAmenties.map((amentie) =>
        amentie.id === id ? { ...amentie, checked: !amentie.checked } : amentie
      )
    );
  };

  // Load Gym Details
  useEffect(() => {
    const fetchGymData = async () => {
      setIsLoading(true);
      try {
        let gym;
        if (location.state?.gym) {
          gym = location.state.gym;
        } else {
          const token = await getToken();
          const response = await axios.get(
            `http://localhost:4000/api/getGym/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          gym = response.data;
        }

        // Set all other form data
        setFormData({
          gymName: gym.gymName || "",
          address: {
            location: gym.address?.location || "",
            street: gym.address?.street || "",
            place_id: gym.address?.place_id || "",
          },
          pricing: {
            hourlyRate: gym.pricing?.hourlyRate || "",
            weeklyRate: gym.pricing?.weeklyRate || "",
            monthlyRate: gym.pricing?.monthlyRate || "",
          },
          personalTrainerPricing: {
            hourlyRate: gym.personalTrainerPricing?.hourlyRate || "",
            weeklyRate: gym.personalTrainerPricing?.weeklyRate || "",
            monthlyRate: gym.personalTrainerPricing?.monthlyRate || "",
          },
          description: gym.description || "",
        });

        // Set timings
        if (gym.timings?.morning) {
          setMorningOpeningTime(new Date(gym.timings.morning.openingTime));
          setMorningClosingTime(new Date(gym.timings.morning.closingTime));
        }

        if (gym.timings?.evening) {
          setEveningOpeningTime(new Date(gym.timings.evening.openingTime));
          setEveningClosingTime(new Date(gym.timings.evening.closingTime));
        }

        // Set position - make sure to handle cases where coordinates might be null/undefined
        if (gym.coordinates && gym.coordinates.lat && gym.coordinates.lng) {
          setPosition({
            lat: gym.coordinates.lat,
            lng: gym.coordinates.lng,
          });
        }

        if (gym.currency) setCurrency(gym.currency);
      } catch (error) {
        console.error("Error loading gym data:", error);
        toast.error("Failed to load gym details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGymData();
  }, [id, location.state, getToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ...formData,
      currency: {
        name: currency,
        symbol: currencySymbols[currency],
      },
      coordinates: position,
      timings: {
        morning: {
          openingTime: morningOpeningTime,
          closingTime: morningClosingTime,
          slots: morningSlots.map((slot) => ({
            start: slot.start,
            end: slot.end,
            maxPeople: slot.maxPeople,
          })),
        },
        evening: {
          openingTime: eveningOpeningTime,
          closingTime: eveningClosingTime,
          slots: eveningSlots.map((slot) => ({
            start: slot.start,
            end: slot.end,
            maxPeople: slot.maxPeople,
          })),
        },
      },
      amenities: amenties
        .filter((amenity) => amenity.checked)
        .map((amenity) => ({
          id: amenity.id,
          label: amenity.label,
          checked: amenity.checked,
        })),
    };
  
    console.log("data", data)

    try {
      console.log("data", data);
      const dataForm = new FormData();
      dataForm.append("data", JSON.stringify(data));
      dataForm.append("image", file);
      const token = await getToken();
      const response = await axios.put(
        `http://localhost:4000/api/updateGym/${id}`,
        dataForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("response", response.data)

      toast.success(response.data.msg || "Gym Updated Successfully", {
        position: "top-right",
        duration: 4000,
      });
      navigate(-1);
    } catch (error) {
      console.error("Error updating gym:", error);
      toast.error(error.response?.data?.msg || "Failed to update gym", {
        position: "top-right",
        duration: 4000,
      });
    }
  };

  const handleInputImage = (e) => {
    const showImage = e.target.files[0];
    if (showImage) {
      setFile(showImage);
      setImagesView(URL.createObjectURL(showImage));
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setImagesView(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-white hover:text-blue-100 transition-colors cursor-pointer"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back
            </button>
            <h2 className="text-2xl font-bold text-white">Edit Gym</h2>
            <div className="w-5"></div>
          </div>
        </div>

        {/* Form Container */}
        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {/* Basic Information Section */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-6">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label
                      htmlFor="gymName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Gym Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="gymName"
                      id="gymName"
                      value={formData.gymName}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                      placeholder="Enter gym name"
                      required
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Gym Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows="4"
                      value={formData.description}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                      placeholder="Tell us about your gym facilities, equipment, and special features"
                      required
                    ></textarea>
                  </div>
                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Amenties
                    </label>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      {amenties.map((amentie) => (
                        <div key={amentie.id}>
                          <input
                            type="checkbox"
                            name="amenties"
                            checked={amentie.checked}
                            onChange={() => handleCheckboxChange(amentie.id)}
                            className="w-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <label
                            className={`ml-2 text-gray-700
                              }`}
                          >
                            {amentie.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-6">
                  Gallery
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {!viewImages && (
                    <input
                      type="file"
                      onChange={handleInputImage}
                      accept="image/*"
                      className="border border-blue-500 w-full h-[300px] object-fit"
                    />
                  )}
                  {viewImages && (
                    <div className="relative">
                      <img
                        src={viewImages}
                        alt="Uploaded"
                        className="w-full border border-gray-500 h-[300px] object-cover"
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Currency Selection */}
              <div className="border-b border-gray-200 pb-8">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="currency"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  >
                    {Object.entries(currencySymbols).map(([code, symbol]) => (
                      <option key={code} value={code}>
                        {code} ({symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-6">
                  Membership Pricing
                </h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  {/* Regular Pricing */}
                  <div className="sm:col-span-6 md:col-span-3">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="text-md font-medium text-gray-800 mb-4">
                        Standard Membership
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="pricing.hourlyRate"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Hourly Rate
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">
                                {currencySymbols[currency]}
                              </span>
                            </div>
                            <input
                              type="number"
                              name="pricing.hourlyRate"
                              id="hourlyRate"
                              value={formData.pricing.hourlyRate}
                              onChange={(e) => {
                                if (e.target.value.length <= 7) {
                                  handleChange(e);
                                }
                              }}
                              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md p-2 border"
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="pricing.weeklyRate"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Weekly Rate
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">
                                {currencySymbols[currency]}
                              </span>
                            </div>
                            <input
                              type="number"
                              name="pricing.weeklyRate"
                              id="weeklyRate"
                              value={formData.pricing.weeklyRate}
                              onChange={(e) => {
                                if (e.target.value.length <= 7) {
                                  handleChange(e);
                                }
                              }}
                              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md p-2 border"
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="pricing.monthlyRate"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Monthly Rate
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">
                                {currencySymbols[currency]}
                              </span>
                            </div>
                            <input
                              type="number"
                              name="pricing.monthlyRate"
                              id="monthlyRate"
                              value={formData.pricing.monthlyRate}
                              onChange={(e) => {
                                if (e.target.value.length <= 7) {
                                  handleChange(e);
                                }
                              }}
                              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md p-2 border"
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trainer Pricing */}
                  <div className="sm:col-span-6 md:col-span-3">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="text-md font-medium text-gray-800 mb-4">
                        Personal Trainer
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="personalTrainerPricing.hourlyRate"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Hourly Rate
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">
                                {currencySymbols[currency]}
                              </span>
                            </div>
                            <input
                              type="number"
                              name="personalTrainerPricing.hourlyRate"
                              id="trainerHourlyRate"
                              value={formData.personalTrainerPricing.hourlyRate}
                              onChange={(e) => {
                                if (e.target.value.length <= 7) {
                                  handleChange(e);
                                }
                              }}
                              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md p-2 border"
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="personalTrainerPricing.weeklyRate"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Weekly Rate
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">
                                {currencySymbols[currency]}
                              </span>
                            </div>
                            <input
                              type="number"
                              name="personalTrainerPricing.weeklyRate"
                              id="trainerWeeklyRate"
                              value={formData.personalTrainerPricing.weeklyRate}
                              onChange={(e) => {
                                if (e.target.value.length <= 7) {
                                  handleChange(e);
                                }
                              }}
                              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md p-2 border"
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="personalTrainerPricing.monthlyRate"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Monthly Rate
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">
                                {currencySymbols[currency]}
                              </span>
                            </div>
                            <input
                              type="number"
                              name="personalTrainerPricing.monthlyRate"
                              id="trainerMonthlyRate"
                              value={
                                formData.personalTrainerPricing.monthlyRate
                              }
                              onChange={(e) => {
                                if (e.target.value.length <= 7) {
                                  handleChange(e);
                                }
                              }}
                              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md p-2 border"
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hours Section */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-6">
                  Operating Hours
                </h3>

                {/* Morning Timings */}
                <div className="w-full max-w-sm min-w-[200px]">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">
                    Morning Timings
                  </h4>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Opening Time
                      </label>
                      <DatePicker
                        selected={new Date(morningOpeningTime)}
                        onChange={handleMorningOpeningTime}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={30}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Closing Time
                      </label>
                      <DatePicker
                        selected={new Date(morningClosingTime)}
                        onChange={handleMorningClosingTime}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={30}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      />
                      {error && (
                        <p className="mt-1 text-sm text-red-600">{error}</p>
                      )}
                    </div>
                  </div>
                  <div className="w-full max-w-sm min-w-[200px]">
                    <label
                      htmlFor="maxPeople"
                      className="block text-sm font-medium"
                    >
                      Max People
                    </label>
                    <input
                      type="number"
                      id="maxPeople"
                      value={morningNewSlot.maxPeople}
                      onChange={handleMaxPeopleChange}
                      placeholder="Enter Max People"
                      className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow mt-2 cursor-pointer"
                    />
                  </div>
                  <ul className="mt-4 max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                    {morningSlots.map((slot, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span>
                          {slot.start} - {slot.end} ({slot.maxPeople} People)
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Evening Timings */}
                <div className="w-full max-w-sm min-w-[200px] mt-3">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">
                    Evening Timings
                  </h4>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Opening Time
                      </label>
                      <DatePicker
                        selected={new Date(eveningOpeningTime)}
                        onChange={handleEveningOpeningTime}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={30}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Closing Time
                      </label>
                      <DatePicker
                        selected={new Date(eveningClosingTime)}
                        onChange={handleEveningClosingTime}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={30}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      />
                      {error && (
                        <p className="mt-1 text-sm text-red-600">{error}</p>
                      )}
                    </div>
                  </div>
                  <div className="w-full max-w-sm min-w-[200px]">
                    <label
                      htmlFor="maxPeople"
                      className="block text-sm font-medium"
                    >
                      Max People
                    </label>
                    <input
                      type="number"
                      id="maxPeople"
                      value={eveningNewSlot.maxPeople}
                      onChange={handleEveningMaxPeopleChange}
                      placeholder="Enter Max People"
                      className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow mt-2 cursor-pointer"
                    />
                  </div>
                  <ul className="mt-4 max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                    {eveningSlots.map((slot, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span>
                          {slot.start} - {slot.end} ({slot.maxPeople} People)
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Location Section */}
              <div className="pb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-6">
                  Gym Location
                </h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <div className="h-96 w-full rounded-lg overflow-hidden border border-gray-300 shadow-sm">
                      <MapComponent
                        position={position}
                        setPosition={setPosition}
                        setFormData={setFormData}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Drag the marker to set your gym's exact location
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors cursor-pointer"
                >
                  Save Gym Details
                  <svg
                    className="ml-2 -mr-1 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditGym;
