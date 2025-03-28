import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import axios from "axios"
import toast from "react-hot-toast"
import { useKindeAuth } from "@kinde-oss/kinde-auth-react"
import GymLocationMap from "../page/map/GymLocationMap"

const NewGymAdd = () => {
  const [openingTime, setOpeningTime] = useState(new Date().setHours(9, 0))
  const [closingTime, setClosingTime] = useState(new Date().setHours(21, 0))
  const [error, setError] = useState("")

  const { getToken } = useKindeAuth()

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    gymName: "",
    address: {
      location: "",
      street:"",
      place_id: "",      
    },
    pricing:"",
    personalTrainerPricing:"",
    description: "",
  })
  console.log("setform data", formData)

  const [position, setPosition] = useState({ lat: 29.927, lng: 73.876 }) // Default Location

  // Handle opening time
  const handleOpeningTime = (time) => {
    setOpeningTime(time)
    if (new Date(time).getTime() >= new Date(closingTime).getTime()) {
      const updatedClosingTime = new Date(time)
      updatedClosingTime.setHours(updatedClosingTime.getHours() + 1)
      setClosingTime(updatedClosingTime)
    }
  }

  // Handle closing time
  const handleClosingTime = (time) => {
    if (new Date(time).getTime() <= new Date(openingTime).getTime()) {
      setError("Closing Time must be after Opening Time")
    } else {
      setError("")
      setClosingTime(time)
    }
  }


  const inputHandler = (e) => {
    const { name, value } = e.target;
    console.log("Input Change:", name, value);

    if (["location","street", "place_id"].includes(name)) {
      setFormData((prevState) => ({
        ...prevState,
        address: {
          ...prevState.address,
          [name]: value,
        },
      }));
    } else if (["hourlyRate", "weeklyRate", "monthlyRate", "trainerHourlyRate", "trainerWeeklyRate", "trainerMonthlyRate"].includes(name)) {
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

    // Convert empty strings to null or leave them as is, or remove them
    const parseNumber = (value) => {
      if (value === "") {
        return null; // Or you can return undefined, or leave it as ""
      }
      return Number(value);
    };

    const data = {
      ...formData,
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
      openingTime: new Date(openingTime),
      closingTime: new Date(closingTime),
    };

    console.log("data price", data)

    try {
      const response = await axios.post("http://localhost:4000/api/addgym", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
      <div className="bg-white border border-4 rounded-lg shadow relative m-10">
        <button className="mb-4 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition cursor-pointer ml-5 mt-5">
          <Link to="/add-gym"> Back To Page</Link>
        </button>
        <div className="flex items-start justify-between p-5 border-b rounded-t">
          <h3 className="text-xl font-semibold">Add Your Gym & Information</h3>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            data-modal-toggle="product-modal"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
        <div className="p-6 space-y-6">
          <form >
            <div className="grid grid-cols-6 gap-6">
              {/* Name */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="product-name" className="text-sm font-medium text-gray-900 block mb-2">
                  Gym Name
                </label>
                <input
                  type="text"
                  name="gymName"
                  id="gymName"
                  onChange={inputHandler}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  placeholder="Enter Your Gym Name...."
                  required=""
                />
              </div>

              {/* Hourly Charge */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="price" className="text-sm font-medium text-gray-900 block mb-2">
                  Hourly Price
                </label>
                <input
                  type="number"
                  name="hourlyRate"
                  id="hourlyRate"
                  onChange={inputHandler}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  placeholder="Hourly Price"
                  required=""
                />
              </div>
              {/* Personal Trainer Hourly Charge */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="price" className="text-sm font-medium text-gray-900 block mb-2">
                  Personal Trainer Hourly Prices
                </label>
                <input
                  type="number"
                  name="trainerHourlyRate"
                  id="trainerHourlyRate"
                  onChange={inputHandler}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  placeholder="Hourly Price"
                  required=""
                />
              </div>
              {/* Weekly Charge */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="price" className="text-sm font-medium text-gray-900 block mb-2">
                  Weekly Price\ MemberShip
                </label>
                <input
                  type="number"
                  name="weeklyRate"
                  id="weeklyRate"
                  onChange={inputHandler}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  placeholder="Weekly Price\ MemberShip"
                  required=""
                />
              </div>
              {/* Personal Trainer Weekly Charge */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="price" className="text-sm font-medium text-gray-900 block mb-2">
                  Personal Trainer Weekly Price\MemberShip{" "}
                </label>
                <input
                  type="number"
                  name="trainerWeeklyRate"
                  id="trainerWeeklyRate"
                  onChange={inputHandler}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  placeholder="Personal Trainer Weekly Price\MemberShip "
                  required=""
                />
              </div>
              {/* Monthly Charge */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="price" className="text-sm font-medium text-gray-900 block mb-2">
                  Monthly Price\MemberShip
                </label>
                <input
                  type="number"
                  name="monthlyRate"
                  id="monthlyRate"
                  onChange={inputHandler}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  placeholder="Monthly Price\MemberShip"
                  required=""
                />
              </div>
              {/* Personal Trainer Monthly Charge */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="price" className="text-sm font-medium text-gray-900 block mb-2">
                  Personal Trainer Monthly Price\MemberShip
                </label>
                <input
                  type="number"
                  name="trainerMonthlyRate"
                  id="trainerMonthlyRate"
                  onChange={inputHandler}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  placeholder="Personal Trainer Monthly Price\MemberShip"
                  required=""
                />
              </div>

              <br />
              {/* Opening Time */}
              <div className="col-span-6 sm:col-span-3">
                <label className="text-sm font-medium text-gray-900 block mb-2">Opening Time</label>
                <DatePicker
                  selected={new Date(openingTime)}
                  onChange={handleOpeningTime}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Opening Time"
                  dateFormat="h:mm aa"
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
              </div>
              {/* Closing Time */}
              <div className="col-span-6 sm:col-span-3">
                <label className="text-sm font-medium text-gray-900 block mb-2">Closing Time</label>
                <DatePicker
                  selected={new Date(closingTime)}
                  onChange={handleClosingTime}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Closing Time"
                  dateFormat="h:mm aa"
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
              </div>

    

              {/* Map of location */}

              <div className="col-span-6 sm:col-span-6">
                <label className="text-sm font-medium text-gray-900 block mb-2">Gym Location</label>
                <div className="h-[400px] w-full rounded-lg overflow-hidden border border-gray-300">
                  <GymLocationMap position={position} setPosition={setPosition}
                    setFormData={setFormData} />
                </div>
              </div>
              {/* Gym Details */}
              <div className="col-span-full">
                <label htmlFor="gym-description" className="text-sm font-medium text-gray-900 block mb-2">
                  Gym Details
                </label>
                <textarea
                  id="gym-description"
                  name="description"
                  rows="6"
                  onChange={inputHandler}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-4"
                  placeholder="Details"
                ></textarea>
              </div>


              {/* onSubmit={handleSubmit} */}
            </div>
            <div className="p-6 border-t border-gray-200 rounded-b">
              <button
                onClick={handleSubmit}
                className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer"
                type="submit"
              >
                Save all
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default NewGymAdd

