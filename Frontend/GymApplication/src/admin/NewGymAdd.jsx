import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

import MapComponent from "./googlemap/MapComponent";

const NewGymAdd = () => {
  const [morningOpeningTime, setMorningOpeningTime] = useState(new Date().setHours(5, 0));
  const [morningClosingTime, setMorningClosingTime] = useState(new Date().setHours(9, 0));
  const [eveningOpeningTime, setEveningOpeningTime] = useState(new Date().setHours(16, 0));
  const [eveningClosingTime, setEveningClosingTime] = useState(new Date().setHours(22, 0));
  const [error, setError] = useState("");
  const [currency, setCurrency] = useState("INR");

  const { getToken } = useKindeAuth();
  const navigate = useNavigate();

  const currencySymbols = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    RUB: "₽",
    KRW: "₩",
  };

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
      monthlyRate: ""
  },
  personalTrainerPricing: {
      hourlyRate: "",
      weeklyRate: "",
      monthlyRate: ""
  },
    description: "",
  });

  const [position, setPosition] = useState({ lat: 0, lng: 0 }); // Default Location

  // Handle opening time
  const handleMorningOpeningTime = (time) => {
    setMorningOpeningTime(time);
    if (new Date(time).getTime() >= new Date(morningClosingTime).getTime()) {
      const updatedClosingTime = new Date(time);
      updatedClosingTime.setHours(updatedClosingTime.getHours() + 1);
      setMorningClosingTime(updatedClosingTime);
    }
  };

  // Handle Morning closing time
  const handleMorningClosingTime = (time) => {
    if (new Date(time).getTime() <= new Date(morningOpeningTime).getTime()) {
      setError("Morning Closing Time must be after Opening Time");
    } else {
      setError("");
      setMorningClosingTime(time);
    }
  };

  // evening Opening Time
  const handleEveningOpeningTime = (time) => {
    setEveningOpeningTime(time);
    if (new Date(time).getTime() >= new Date(eveningClosingTime).getTime()) {
      const updatedClosingTime = new Date(time);
      updatedClosingTime.setHours(updatedClosingTime.getHours() + 1);
      setEveningClosingTime(updatedClosingTime);
    }
  };

  // evening closing Time
  const handleEveningClosingTime = (time) => {
    if (new Date(time).getTime() <= new Date(eveningOpeningTime).getTime()) {
      setError("Evening Closing Time must be after Opening Time");
    } else {
      setError("");
      setEveningClosingTime(time);
    }
  };


  const inputHandler = (e) => {
    const { name, value } = e.target;

    if (["location", "street", "place_id"].includes(name)) {
      setFormData((prevState) => ({
        ...prevState,
        address: {
          ...prevState.address,
          [name]: value,
        },
      }));
    } else if (
      [
        "hourlyRate",
        "weeklyRate",
        "monthlyRate",
        "trainerHourlyRate",
        "trainerWeeklyRate",
        "trainerMonthlyRate",
      ].includes(name)
    ) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value !== "" ? parseFloat(value) : "",
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await getToken();
    if (!token) {
      toast.error("Token not found. Please login again.");
      return;
    }

    const {
      gymName,
      address: { location, street },
      description,
    } = formData;
    if (
      !gymName.trim() ||
      !location.trim() ||
      !street.trim() ||
      !description.trim()
    ) {
      toast.error("Please fill all required fields properly. No empty spaces allowed!");
      return;
    }

    const parseNumber = (value) => {
      if (value === "") {
        return null;
      }
      return Number(value);
    };

    const data = {
      ...formData,
      currency,
      coordinates: position,
      pricing: {
        hourlyRate: parseNumber(formData.hourlyRate),
        weeklyRate: parseNumber(formData.weeklyRate),
        monthlyRate: parseNumber(formData.monthlyRate),
      },
      personalTrainerPricing: {
        hourlyRate: parseNumber(formData.trainerHourlyRate),
        weeklyRate: parseNumber(formData.trainerWeeklyRate),
        monthlyRate: parseNumber(formData.trainerMonthlyRate),
      },
      timings: {
        morning: {
          openingTime: new Date(morningOpeningTime),
          closingTime: new Date(morningClosingTime)
        },
        evening: {
          openingTime: new Date(eveningOpeningTime),
          closingTime: new Date(eveningClosingTime)
        }
      }
    };

    if (
      data.pricing.hourlyRate <= 0 ||
      data.pricing.weeklyRate <= 0 ||
      data.pricing.monthlyRate <= 0 ||
      data.personalTrainerPricing.hourlyRate <= 0 ||
      data.personalTrainerPricing.weeklyRate <= 0 ||
      data.personalTrainerPricing.monthlyRate <= 0
    ) {
      toast.error("All prices must be greater than 0");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/api/addgym", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response send google", response.data)

      if (response.status >= 200 && response.status < 300) {
        toast.success(response.data.msg || "Gym Added Successfully", {
          position: "top-right",
          duration: 4000,
        });
        setTimeout(() => {
          navigate("/add-gym");
        }, 1000);
      }
    } catch (error) {
      console.error("Gym not added:", error.response?.data || error.message);
      toast.error(error.response?.data?.msg || "Failed to add gym", {
        position: "top-right",
        duration: 4000,
      });
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/add-gym"
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
            </Link>
            <h2 className="text-2xl font-bold text-white">Add Your Gym</h2>
            <div className="w-5"></div>
          </div>
        </div>

        {/* Form Container */}
        <div className="p-6 md:p-8">
          <form>
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
                      onChange={inputHandler}
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
                      id="gym-description"
                      name="description"
                      rows="4"
                      onChange={inputHandler}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                      placeholder="Tell us about your gym facilities, equipment, and special features"
                    ></textarea>
                  </div>
                </div>
              </div>


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
                            htmlFor="hourlyRate"
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
                              name="hourlyRate"
                              id="hourlyRate"
                              onChange={inputHandler}
                              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md p-2 border"
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="weeklyRate"
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
                              name="weeklyRate"
                              id="weeklyRate"
                              onChange={inputHandler}
                              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md p-2 border"
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="monthlyRate"
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
                              name="monthlyRate"
                              id="monthlyRate"
                              onChange={inputHandler}
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
                            htmlFor="trainerHourlyRate"
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
                              name="trainerHourlyRate"
                              id="trainerHourlyRate"
                              onChange={inputHandler}
                              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md p-2 border"
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="trainerWeeklyRate"
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
                              name="trainerWeeklyRate"
                              id="trainerWeeklyRate"
                              onChange={inputHandler}
                              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md p-2 border"
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="trainerMonthlyRate"
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
                              name="trainerMonthlyRate"
                              id="trainerMonthlyRate"
                              onChange={inputHandler}
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
              {/* Hours Section */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-6">
                  Operating Hours
                </h3>

                {/* Morning Timings */}
                <div className="mb-8">
                  <h4 className="text-md font-medium text-gray-800 mb-4">Morning Timings</h4>
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
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
                </div>

                {/* Evening Timings */}
                <div className="mb-8">
                  <h4 className="text-md font-medium text-gray-800 mb-4">Evening Timings</h4>
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
                      {/* Google Location */}
                      <MapComponent
                        position={position}
                        setPosition={setPosition}
                        setFormData={setFormData} />
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
                  onClick={handleSubmit}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors cursor-pointer"
                  type="button"
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
    </>
  );
};

export default NewGymAdd;