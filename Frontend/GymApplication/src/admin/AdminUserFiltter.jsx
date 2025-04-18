import React, { useEffect, useState } from "react";
import axios from "axios";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import toast from "react-hot-toast";

const AdminUserFiltter = () => {
  const [date, setDate] = useState("");
  const [gyms, setGyms] = useState([]);
  const [selectedGym, setSelectedGym] = useState("");
  const [users, setUsers] = useState([]);
  const [visitingTime, setVisitingtime] = useState({});

  const { getToken } = useKindeAuth();

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const token = await getToken();
        const response = await axios.get("http://localhost:4000/api/getGym", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Response for gym", response.data);
        setGyms(response.data.gyms);
      } catch (error) {
        console.log("Erro for fetching gfindByIdAndDeleteyms", error);
      }
    };
    fetchGyms();
  }, []);

  const fetchUsers = async () => {
    if (!date || !selectedGym) {
      return toast("Please Select gym and Date");
    }
    try {
      const token = await getToken();
      const response = await axios.get(
        `http://localhost:4000/api/admin-user-details?gymId=${selectedGym}&date=${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response gym and date today", response.data);
      setUsers(response.data.bookings);

      const timeMap = {};
      response.data.bookings.forEach((booking)=>{
        timeMap[booking._id] = booking.visitingTime || "";
      })
      setVisitingtime(timeMap)
    } catch (error) {
      toast.error(`User not found on Date ${date}`);
      console.log("Error for fetching Details", error);
      setUsers([]);
    }
  };

  // update Visiting Time
  const updateTime = async (userId) => {
    const newTime = visitingTime[userId];
    if (!newTime) {
      return toast.error("Please select a time");
    }

    try {
      const token = await getToken();
      const response = await axios.put(
        `http://localhost:4000/api/update-visiting-time/${userId}`,
        {
          visitingTime: newTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response for update", response.data)

      toast.success(response.data.message || "Visiting time updated successfully");
    } catch (error) {
      console.error("Failed to update visiting Time", error);
      const message = error.response?.data?.message || "Failed to update visiting time";
      toast.error(message);
    }
  };

  return (
    <>
      <div className="p-5 text-center">
        <h1 className="text-xl font-bold mb-3">
          Search User According The Date
        </h1>
        <div className="flex justify-center items-center space-x-4 mb-5">
          <select
            value={selectedGym}
            onChange={(e) => setSelectedGym(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Select Gym</option>
            {Array.isArray(gyms) && gyms.length > 0 ? (
              gyms.map((gym) => (
                <option key={gym._id} value={gym._id}>
                  {gym.gymName}
                </option>
              ))
            ) : (
              <option disabled>No gyms found</option>
            )}
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded mx-2"
          />

          <button
            onClick={fetchUsers}
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 p-3 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 cursor-pointer"
          >
            Enter
          </button>
        </div>
        {/* Table */}
        <div className="container mx-auto p-4">
          <div className="relative overflow-x-auto mt-5">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-40">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Customer Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Gym Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Starting Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Plan
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Payment Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Visiting Time
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr
                      key={user._id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                    >
                      <td className="px-6 py-3">{user.buyerName}</td>
                      <td className="px-6 py-3">{user.gymName}</td>
                      <td className="px-6 py-3">{user.startDate}</td>
                      <td className="px-6 py-3">{user.selectedPlan}</td>
                      <td className="px-6 py-3">{user.status}</td>
                      <td className="px-6 py-3">
                        <input
                          type="time"
                          value={visitingTime[user._id] || ""}
                          onChange={(e) =>
                            setVisitingtime((prev) => ({
                              ...prev,
                              [user._id]: e.target.value,
                            }))
                          }
                          className="border p-1 rounded"
                        />
                      </td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => updateTime(user._id)}
                          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-800 cursor-pointer"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center px-6 py-3">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminUserFiltter;
