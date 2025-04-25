import React, { useEffect } from "react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
    const { login, register, isAuthenticated, user } = useKindeAuth();
    const navigate = useNavigate();

    const sendUserData = async (user) => {
        try {
            console.log("Sending user data to backend:", user);

            const response = await axios.post("http://localhost:4000/api/register", {
                firstName: user.given_name,
                lastName: user.family_name,
                email: user.email,
                kindeId: user.id,
            });

            console.log("Response received:", response.data);
            navigate("/"); 

        } catch (error) {
            console.error("Error sending user data:", error);
        }
    };

    useEffect(() => {
        console.log("authenticated", isAuthenticated, "user: data", user);
        
        if (isAuthenticated && user) {
            sendUserData(user);
        }
    }, [isAuthenticated, user]); 

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Welcome to Alfa Intellitech
            </h1>
            <div className="flex space-x-4">
                <button
                    onClick={register}
                    className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 cursor-pointer"
                >
                    Register
                </button>
                <button
                    onClick={login}
                    className="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 cursor-pointer"
                >
                    Log In
                </button>
            </div>
        </div>
    );
};

export default Home;