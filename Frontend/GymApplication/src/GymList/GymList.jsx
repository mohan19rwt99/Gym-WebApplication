import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useNavigate } from 'react-router-dom';

function GymList() {
    const { getToken } = useKindeAuth();
    const navigate = useNavigate();
    const [gyms, setGyms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch Gym Data
    useEffect(() => {
        const fetchGyms = async () => {

            try {
                const token = await getToken()
                const response = await axios.get(`http://localhost:4000/api/getGym`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("Fetched Gyms:", response.data);
                setGyms(response.data.gyms || []);
            } catch (err) {
                console.error("Error fetching gyms:", err.response?.data || err.message);
                setError("Failed to fetch gyms. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchGyms();
    }, []);


    return (
        <>
            <div className="flex-1 flex flex-col items-center justify-start p-6 overflow-y-auto h-full">
                <h1 className='text-4xl font-bold text-gray-800'>GYM List</h1>

                {/* Loading State */}
                {loading && <p className="text-gray-500">Loading gyms...</p>}

                {/* Error Message */}
                {error && <p className="text-red-500">{error}</p>}

                {/* Gym List */}
                {!loading && !error && gyms.length === 0 && (
                    <p className="text-gray-500">No gyms found.</p>
                )}

                {/* Gym Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {gyms.map((gym) => (
                        <div
                            key={gym._id}
                            className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
                        >
                            <h3 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {gym.gymName}
                            </h3>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Location: {gym.location}</p>
                            <p className="text-gray-500">Hourly Rate: ₹{gym.pricing?.hourlyRate || 0}</p>
                            <p className="text-gray-500">Weekly Rate: ₹{gym.pricing?.weeklyRate || 0}</p>
                            <p className="text-gray-500">Monthly Rate: ₹{gym.pricing?.monthlyRate || 0}</p>
                            {/* button Add Staff */}
                            <a href="#" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-5"
                            onClick={() => navigate(`/gymdetails/${gym._id}`)}>
                                Add Your Staff
                                <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                </svg>
                            </a>
                        </div>
                    ))}
                </div>

            </div>
        </>
    );
}

export default GymList;
