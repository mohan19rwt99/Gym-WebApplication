import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { MdEditSquare } from "react-icons/md";
import Pagination from "./pagination/Pagination";

const AddGym = () => {
  const navigate = useNavigate();
  const { user, getToken, isAuthenticated } = useKindeAuth();

  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [gymsPerPage] = useState(3)

  // Fetch Gyms
  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const token = await getToken();
        const response = await axios.get("http://localhost:4000/api/getGym", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("response for add gym", response.data)

        setGyms(Array.isArray(response.data.gyms) ? response.data.gyms : []);
      } catch (error) {
        console.error("Error fetching gyms:", error);
        
      } finally {
        setLoading(false);
      }
    };

    

    if (isAuthenticated) {
      fetchGyms();
    }
  }, [isAuthenticated, getToken]);


  // Handle Gym Edit
  const handleEdit = (gym) => {
    navigate(`/edit-gym/${gym._id}`, { state: { gym } });
  };

  // Handle Gym Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this gym?")) {
      try {
        const token = await getToken();
        await axios.delete(`http://localhost:4000/api/deleteGym/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Gym deleted successfully!");
        setGyms((prevGyms) => prevGyms.filter((gym) => gym._id !== id));
      } catch (error) {
        console.error("Error deleting gym:", error);
        alert("Failed to delete gym. Please try again.");
      }
    }
  };

  // Pagination Logic
  const indexOfLastGym = currentPage * gymsPerPage;
  const indexOfFirstGym = indexOfLastGym - gymsPerPage;
  const currentGyms = gyms.slice(indexOfFirstGym, indexOfLastGym);
  const totalPages = Math.ceil(gyms.length / gymsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Gym Management</h1>
          <p className="mt-1 text-sm text-gray-500">View and manage all your gyms</p>
        </div>

        <div className="px-6 py-4 border-b border-gray-200">
          <Link
            to="/new-gym-add"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-300 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300"
          >
            
            Add New Gym
          </Link>
        </div>

        {gyms.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No gyms found</h3>
            <p className="mt-1 text-sm text-gray-500">You haven't added any gyms yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pricing
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trainer Pricing
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {currentGyms.map((gym) => (
                    <tr key={gym._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {gym.gymName || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {gym.address?.park || gym.address?.street}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {`${gym.currency?.symbol || "₹"}${
                          gym.pricing?.hourlyRate || ""
                        } / ${gym.currency?.symbol || ""}${
                          gym.pricing?.weeklyRate || ""
                        } / ${gym.currency?.symbol || ""}${
                          gym.pricing?.monthlyRate || ""
                        }`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {`${gym.currency?.symbol || ""}${
                          gym.personalTrainerPricing?.hourlyRate || ""
                        } / ${gym.currency?.symbol || ""}${
                          gym.personalTrainerPricing?.weeklyRate || ""
                        } / ${gym.currency?.symbol || ""}${
                          gym.personalTrainerPricing?.monthlyRate || ""
                        }`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleEdit(gym)}
                            className="text-blue-500 hover:text-blue-700 text-xl cursor-pointer"
                            title="Edit Gym"
                          >
                            <MdEditSquare />
                          </button>
                          <button
                            onClick={() => handleDelete(gym._id)}
                            className="text-red-500 hover:text-red-700 text-xl cursor-pointer"
                            title="Delete Gym"
                          >
                            <RiDeleteBin5Fill />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
          
        )}
      </div>
    </div>
    </>
  );
};

export default AddGym;