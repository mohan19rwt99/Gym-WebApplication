    import React, { useEffect, useState } from 'react';
    import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
    import { useNavigate } from 'react-router-dom';
    import axios from 'axios';

    const Welcome = () => {
        const { logout, isAuthenticated, user, getToken } = useKindeAuth();
        const navigate = useNavigate();
        const [gyms, setGyms] = useState([]);
        const [userId,setUserId] = useState();
        useEffect(() => {
            if (!isAuthenticated) {
                navigate("/home");
            } else {
                fetchUserData();       
            }
        }, [isAuthenticated, navigate, user]);
        

        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/user?email=${user?.email}`);
                if (!response.data || !response.data.userId) return;
                setUserId(response.data.userId);
                console.log("setUserId", response.data.userId)
            } catch (error) {
                console.error("Error fetching user:", error?.response?.data || error.message);
            }
        };


        const handleLogout = () => {
            navigate("/home");
            logout();
            
        };

        return (
            <div className="flex-1 flex flex-col items-center justify-start p-6 overflow-y-auto h-full">
                <h1 className="text-4xl font-bold text-gray-800">
                    Welcome, {user?.givenName || "User"}
                </h1> 
                {/* admin name */}
                <p className="text-lg text-gray-600 mt-2">You have successfully logged in!</p>

                <button
                    onClick={handleLogout}
                    className="relative h-12 w-40 overflow-hidden border border-black shadow-2xl 
                    before:absolute before:inset-0 before:bg-gray-900 before:scale-x-0 before:origin-left 
                    before:transition-transform before:duration-300 
                    hover:before:scale-x-100 hover:text-white mt-5 cursor-pointer"
                >
                    <span className="absolute inset-0 flex items-center justify-center">Log Out</span>
                </button>

            </div>
        );
    };

    export default Welcome;
