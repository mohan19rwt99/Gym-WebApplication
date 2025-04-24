import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import Pagination from "../../admin/pagination/Pagination";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { MdEditSquare } from "react-icons/md";

const GymDetails = () => {
  const { id } = useParams();
  const { getToken } = useKindeAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const gymId = location.state?.gymId || id;

  const [gymDetails, setGymDetails] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  useEffect(() => {
    const fetchGymDetails = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(
          `http://localhost:4000/api/getSingleGym/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setGymDetails(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch gym details.");
        setLoading(false);
      }
    };

    fetchGymDetails();
  }, [id, getToken]);

  useEffect(() => {
    const fetchStaffData = async () => {
      if (!gymId) return;
      try {
        const token = await getToken();
        const response = await axios.get(
          `http://localhost:4000/api/getStaff/${gymId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching staff data:", error);
      }
    };

    fetchStaffData();
  }, [gymId, getToken]);

  const handleDelete = async (memberId) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;

    try {
      const token = await getToken();
      await axios.delete(`http://localhost:4000/api/deleteStaff/${memberId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== memberId)
      );
      alert("Staff member deleted successfully!");
    } catch (error) {
      console.error("Error deleting staff member:", error);
      alert("Failed to delete staff member. Please try again.");
    }
  };

  // Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

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
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
         <div className="flex items-center justify-between">
         <h1 className="text-2xl font-bold text-gray-900">
            {gymDetails.gymName || "Gym Details"}
          </h1>
          <Link to={"/gym-list"} >
          <button className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-800 cursor-pointer duration-300">
                Previous Page
          </button>
        </Link>
         </div>
          <p className="mt-1 text-sm text-gray-500">
            Location: {gymDetails.address?.location || "N/A"}
          </p>
        </div>

        <div className="px-6 py-4 border-b border-gray-200">
          <Link
            to="/addmember"
            state={{ gymId: id }}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-300 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300"
          >
            Add Staff
          </Link>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No staff members found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't added any staff members yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.map((member) => (
                  <tr key={member._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {member.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {member.email || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {member.number || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {member.role || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-4">
                        <Link
                          to={`/editStaff/${member._id}`}
                          state={{ staff: member }}
                          className="text-blue-500 hover:text-blue-700 text-xl cursor-pointer"
                        >
                         <MdEditSquare />
                        </Link>
                        <button
                          onClick={() => handleDelete(member._id)}
                          className="text-red-500 hover:text-red-700 text-xl cursor-pointer"
                        >
                           <RiDeleteBin5Fill />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GymDetails;