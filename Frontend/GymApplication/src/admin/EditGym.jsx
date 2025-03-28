import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import toast from 'react-hot-toast';
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import GymLocationMap from "../page/map/GymLocationMap";

function EditGym() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { getToken } = useKindeAuth();

    const [openingTime, setOpeningTime] = useState(new Date().setHours(9, 0));
    const [closingTime, setClosingTime] = useState(new Date().setHours(21, 0));
    const [error, setError] = useState("");
    const [position, setPosition] = useState({ lat: 29.927, lng: 73.876 }); // Default Location

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

    // Handle opening time
    const handleOpeningTime = (time) => {
        setOpeningTime(time);
        if (new Date(time).getTime() >= new Date(closingTime).getTime()) {
            const updatedClosingTime = new Date(time);
            updatedClosingTime.setHours(updatedClosingTime.getHours() + 1);
            setClosingTime(updatedClosingTime);
        }
    };

    // Handle closing time
    const handleClosingTime = (time) => {
        if (new Date(time).getTime() <= new Date(openingTime).getTime()) {
            setError("Closing Time must be after Opening Time");
        } else {
            setError("");
            setClosingTime(time);
        }
    };

    // Load Gym Details
    useEffect(() => {
        if (location.state?.gym) {
            const gym = location.state.gym;
            setFormData({
                gymName: gym.gymName || '',
                address: gym.address || {
                    location: '',
                    street: '',
                    place_id: ''
                },
                pricing: gym.pricing || {
                    hourlyRate: '',
                    weeklyRate: '',
                    monthlyRate: ''
                },
                personalTrainerPricing: gym.personalTrainerPricing || {
                    hourlyRate: '',
                    weeklyRate: '',
                    monthlyRate: ''
                },
                description: gym.description || ''
            });

            if (gym.openingTime) setOpeningTime(new Date(gym.openingTime));
            if (gym.closingTime) setClosingTime(new Date(gym.closingTime));
            if (gym.coordinates) setPosition(gym.coordinates);
        }
    }, [location]);

    // Handle Input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith("address.")) {
            const field = name.split(".")[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [field]: value
                }
            }));
        } else if (name.startsWith("pricing.")) {
            const field = name.split(".")[1];
            setFormData(prev => ({
                ...prev,
                pricing: {
                    ...prev.pricing,
                    [field]: value
                }
            }));
        } else if (name.startsWith("personalTrainerPricing.")) {
            const field = name.split(".")[1];
            setFormData(prev => ({
                ...prev,
                personalTrainerPricing: {
                    ...prev.personalTrainerPricing,
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            ...formData,
            coordinates: position,
            openingTime: new Date(openingTime),
            closingTime: new Date(closingTime),
        };

        try {
            const token = await getToken();
            const response = await axios.put(`http://localhost:4000/api/updateGym/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            toast.success(response.data.msg || "Gym Updated Successfully", {
                position: "top-right",
                duration: 4000
            });
            navigate(-1);
        } catch (error) {
            console.error("Error updating gym:", error);
            toast.error(error.response?.data?.msg || "Failed to update gym", {
                position: "top-right",
                duration: 4000
            });
        }
    };

    return (
        <div className="bg-white border border-4 rounded-lg shadow relative m-10">
            <button 
                className="mb-4 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition cursor-pointer ml-5 mt-5"
                onClick={() => navigate(-1)}
            >
                Back
            </button>
            <div className="flex items-start justify-between p-5 border-b rounded-t">
                <h3 className="text-xl font-semibold">Edit Gym Information</h3>
            </div>
            <div className="p-6 space-y-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-6 gap-6">
                        {/* Name */}
                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="gymName" className="text-sm font-medium text-gray-900 block mb-2">
                                Gym Name
                            </label>
                            <input
                                type="text"
                                name="gymName"
                                id="gymName"
                                value={formData.gymName}
                                onChange={handleChange}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                placeholder="Enter Your Gym Name...."
                                required
                            />
                        </div>

                        {/* Address Location
                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="address.location" className="text-sm font-medium text-gray-900 block mb-2">
                                Location
                            </label>
                            <input
                                type="text"
                                name="address.location"
                                id="address.location"
                                value={formData.address.location}
                                onChange={handleChange}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                placeholder="Location"
                                required
                            />
                        </div>

                        {/* Address Street */}
                        {/* <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="address.street" className="text-sm font-medium text-gray-900 block mb-2">
                                Street
                            </label>
                            <input
                                type="text"
                                name="address.street"
                                id="address.street"
                                value={formData.address.street}
                                onChange={handleChange}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                placeholder="Street"
                            />
                        </div> */} 

                    
                        {/* Hourly Rate */}
                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="pricing.hourlyRate" className="text-sm font-medium text-gray-900 block mb-2">
                                Hourly Price
                            </label>
                            <input
                                type="number"
                                name="pricing.hourlyRate"
                                id="pricing.hourlyRate"
                                value={formData.pricing.hourlyRate}
                                onChange={handleChange}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                placeholder="Hourly Price"
                            />
                        </div>

                        {/* Weekly Rate */}
                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="pricing.weeklyRate" className="text-sm font-medium text-gray-900 block mb-2">
                                Weekly Price
                            </label>
                            <input
                                type="number"
                                name="pricing.weeklyRate"
                                id="pricing.weeklyRate"
                                value={formData.pricing.weeklyRate}
                                onChange={handleChange}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                placeholder="Weekly Price"
                            />
                        </div>

                        {/* Monthly Rate */}
                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="pricing.monthlyRate" className="text-sm font-medium text-gray-900 block mb-2">
                                Monthly Price
                            </label>
                            <input
                                type="number"
                                name="pricing.monthlyRate"
                                id="pricing.monthlyRate"
                                value={formData.pricing.monthlyRate}
                                onChange={handleChange}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                placeholder="Monthly Price"
                            />
                        </div>

                        {/* Trainer Hourly Rate */}
                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="personalTrainerPricing.hourlyRate" className="text-sm font-medium text-gray-900 block mb-2">
                                Trainer Hourly Price
                            </label>
                            <input
                                type="number"
                                name="personalTrainerPricing.hourlyRate"
                                id="personalTrainerPricing.hourlyRate"
                                value={formData.personalTrainerPricing.hourlyRate}
                                onChange={handleChange}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                placeholder="Trainer Hourly Price"
                            />
                        </div>

                        {/* Trainer Weekly Rate */}
                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="personalTrainerPricing.weeklyRate" className="text-sm font-medium text-gray-900 block mb-2">
                                Trainer Weekly Price
                            </label>
                            <input
                                type="number"
                                name="personalTrainerPricing.weeklyRate"
                                id="personalTrainerPricing.weeklyRate"
                                value={formData.personalTrainerPricing.weeklyRate}
                                onChange={handleChange}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                placeholder="Trainer Weekly Price"
                            />
                        </div>

                        {/* Trainer Monthly Rate */}
                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="personalTrainerPricing.monthlyRate" className="text-sm font-medium text-gray-900 block mb-2">
                                Trainer Monthly Price
                            </label>
                            <input
                                type="number"
                                name="personalTrainerPricing.monthlyRate"
                                id="personalTrainerPricing.monthlyRate"
                                value={formData.personalTrainerPricing.monthlyRate}
                                onChange={handleChange}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                placeholder="Trainer Monthly Price"
                            />
                        </div>

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

                            {/* Map of location */}
                            <div className="col-span-6 sm:col-span-6">
                            <label className="text-sm font-medium text-gray-900 block mb-2">Gym Location</label>
                            <div className="h-[400px] w-full rounded-lg overflow-hidden border border-gray-300">
                                <GymLocationMap 
                                    position={position} 
                                    setPosition={setPosition}
                                    setFormData={setFormData}
                                />
                            </div>
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

                        {/* Description */}
                        <div className="col-span-full">
                            <label htmlFor="description" className="text-sm font-medium text-gray-900 block mb-2">
                                Gym Details
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="6"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-4"
                                placeholder="Details"
                            ></textarea>
                        </div>
                    </div>

                    <div className="p-6 border-t border-gray-200 rounded-b">
                        <button
                            type="submit"
                            className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditGym;