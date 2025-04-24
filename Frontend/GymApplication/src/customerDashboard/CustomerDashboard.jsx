import React, { useEffect, useState } from 'react';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CustomerDashboard = () => {
  const { isAuthenticated, user, getToken } = useKindeAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBookings: 0,
    bookingsToday: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/home");
    } else {
      fetchUserStats();
      fetchBookings(); // Ensure both functions run
    }
  }, [isAuthenticated, navigate, user]);

  const fetchUserStats = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(`http://localhost:4000/api/user?email=${user?.email}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("User stats response", response.data);
      setStats((prevStats) => ({
        ...prevStats,
        ...response.data
      }));
    } catch (error) {
      console.log("Error fetching customer stats:", error?.response?.data || error.message);
    }
  };

  // const fetchBookings = async () => {
  //   try {   
  //     const token = await getToken();
  //     const response = await axios.get(`http://localhost:4000/api/user-booking/${user?.id}`, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });

  //     console.log("Customer booking response", response.data);

  //     setStats((prevStats) => ({
  //       ...prevStats, 
  //       totalBookings: response.data.totalBooking || 0, // Use totalBooking from backend
  //       bookingsToday: response.data.upcomingBooking?.length || 0 // Count upcoming bookings
  //     }));
  //   } catch (error) {
  //     console.log("Error fetching customer bookings:", error?.response?.data || error.message);
  //   }
  // };

  const fetchBookings = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(`http://localhost:4000/api/user-booking/${user?.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      const allBookings = response.data.bookings;
  
      if (!Array.isArray(allBookings)) {
        console.error("Unexpected booking array format:", allBookings);
        return;
      }
  
      //  Filter only successful bookings
      const successfulBookings = allBookings.filter(b => b.status === "successful");
  
      //  Get today's date string (yyyy-mm-dd)
      const today = new Date().toISOString().split("T")[0];
  
      //  Bookings for today
      const todayBookings = successfulBookings.filter(b => {
        const startDate = new Date(b.startDate).toISOString().split("T")[0];
        return startDate === today;
      });
  
      //  Optional: get the latest successful booking
      const latestBooking = successfulBookings[0];
  
      setStats((prevStats) => ({
        ...prevStats,
        totalBookings: successfulBookings.length,
        bookingsToday: todayBookings.length,
        activePlan: latestBooking
          ? {
              planName: latestBooking.selectedPlan,
              startDate: latestBooking.startDate,
              endDate: latestBooking.endDate,
              gymName: latestBooking.gymNames,
            }
          : null,
      }));
  
      console.log(" Successful Bookings:", successfulBookings);
      console.log(" Bookings Today:", todayBookings);
    } catch (error) {
      console.log("Error fetching customer bookings:", error?.response?.data || error.message);
    }
  };
  
  
  return (
    <div className="flex-1 flex flex-col items-center justify-start p-6 overflow-y-auto h-full">
      <h1 className="text-4xl font-bold text-[#333333]">
        Welcome {user?.givenName || "Customer"}
      </h1>
      <p className="text-lg text-gray-600 mt-2">Here's your activity!</p>

      {/* Customer Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 w-full max-w-4xl">
        <div className="bg-[#D8B4FE] text-white p-6 rounded-lg shadow-md transform">
        {/* transition duration-500 hover:scale-105 */}
          <h3 className="text-xl font-semibold">Total Bookings</h3>
          <p className="text-3xl font-bold">{stats.totalBookings}</p>
        </div>
        <div className="bg-[#A5B4FC] text-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Bookings Today</h3>
          <p className="text-3xl font-bold">{stats.bookingsToday}</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
