import React, { useEffect, useState } from 'react';
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Welcome = () => {
    const { isAuthenticated, user, getToken } = useKindeAuth();
    const navigate = useNavigate();
    const [userId, setUserId] = useState();
    const [stats, setStats] = useState({
        totalGyms: [],
        totalCustomers: 0,
        todayCustomers: 0,
        activeCustomers:0,
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/home");
        } else {
            fetchUserData();
        }
    }, [isAuthenticated, navigate, user]);

    const fetchUserData = async () => {
        try {
            const token = await getToken();
            const response = await axios.get(`http://localhost:4000/api/user?email=${user?.email}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data?.userId) {
                setUserId(response.data.userId);
                console.log("setUserId", setUserId.data.userId)
            }
        } catch (error) {
            console.log("Error fetching user:", error?.response?.data || error.message);
        }
    };

    useEffect(() => {
        if (!userId) return;

        const fetchStats = async () => {   
            try {
                const token = await getToken();
                const response = await axios.get(`http://localhost:4000/api/dashboard-stats?ownerId=${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("response for user", response.data)
                setStats(response.data);
            } catch (error) {
                console.log("Error fetching dashboard stats:", error?.response?.data || error.message);
            }
        };
        fetchStats();
    }, [userId]);

    return (
        <div className="flex-1 flex flex-col items-center justify-start p-6 overflow-y-auto h-full">
            <h1 className="text-4xl font-bold text-gray-800">
                Welcome {user?.givenName || "User"}
            </h1>

            {/* Admin Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6 w-full max-w-6xl">
                <div className="bg-[#D8B4FE] text-white p-6 rounded-lg shadow-md transform">
                    <h3 className="text-xl font-semibold">Your Total Gyms</h3>
                    <p className="text-3xl font-bold">{stats.totalGyms.length}</p>
                </div>

                <div className="bg-[#A5B4FC] text-white p-6 rounded-lg shadow-md transform">
                    <h3 className="text-xl font-semibold">Total Customers</h3>
                    <p className="text-3xl font-bold">{stats.totalCustomers}</p>
                </div>

                <div className="bg-green-300 text-white p-6 rounded-lg shadow-md transform">
                    <h3 className="text-xl font-semibold">New Customers add today</h3>
                    <p className="text-3xl font-bold">{stats.todayCustomers}</p>
                </div>

                <div className="bg-yellow-200 text-white p-6 rounded-lg shadow-md transform">
                    <h3 className="text-xl font-semibold">Active Customers</h3>
                    <p className="text-3xl font-bold">{stats.activeCustomers}</p>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
