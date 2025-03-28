import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

const BookDetails = () => {
    const { gymId } = useParams();
    const { getToken } = useKindeAuth();
    const navigate = useNavigate();

    const [gymDetail, setGymDetail] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    useEffect(() => {
        const fetchGymDetail = async () => {
            try {
                const token = await getToken();
                const response = await axios.get(`http://localhost:4000/api/getSingleGym/${gymId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setGymDetail(response.data);
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
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    const handleSubmit = () => {
        if (!selectedDate) {
            alert("Please select a date.");
            return;
        }
        if (!selectedTime) {
            alert("Please select a gym visit time.");
            return;
        }
        navigate(`/CheckPrice/${gymId}?date=${selectedDate}&time=${selectedTime}`);
    };

    return (
        <div>
            <button
                onClick={() => navigate(-1)}
                className="mb-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-600 transition ml-5">
                Back
            </button>
            <div className='flex justify-center p-6'>
                <div className='bg-white shadow-lg rounded-lg p-6 w-full max-w-lg text-center'>
                    {loading ? (
                        <div className="flex justify-center items-center space-x-2">
                            <div className="w-5 h-5 bg-[#d991c2] rounded-full animate-bounce"></div>
                            <div className="w-5 h-5 bg-[#9869b8] rounded-full animate-bounce"></div>
                            <div className="w-5 h-5 bg-[#6756cc] rounded-full animate-bounce"></div>
                        </div>
                    ) : (
                        <div>
                            <img
                                src={gymDetail.imageUrl || "https://img.freepik.com/premium-photo/modern-gym-interior-with-exercise-equipments_23-2147949737.jpg?w=996"}
                                alt="Gym"
                                className="w-full h-56 object-cover rounded-lg mb-4"
                            />
                            <h1 className="text-2xl font-bold text-gray-800">{gymDetail.gymName}</h1>
                            <p className="text-gray-600 mt-2">{gymDetail.description}</p>
                            <div className="flex justify-between items-center text-gray-600 font-semibold mt-3">
                                <span><strong>Opening:</strong> {formatTime(gymDetail.openingTime)}</span>
                                <span><strong>Closing:</strong> {formatTime(gymDetail.closingTime)}</span>
                            </div>
                            <div className='flex flex-col items-center mt-4'>
                                <label className="text-gray-700 font-semibold mb-2">Select Date:</label>
                                <input
                                    type="date"
                                    className="border rounded-lg px-4 py-2"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
                            </div>
                            <div className='flex flex-col items-center mt-4'>
                                <label className="text-gray-700 font-semibold mb-2">Select Gym Visit Time:</label>
                                <input
                                    type="time"
                                    name="appointment"
                                    min="06:00"
                                    max="22:00"
                                    required
                                    className="border rounded-lg px-4 py-2"
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleSubmit}
                                className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-2 cursor-pointer">
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