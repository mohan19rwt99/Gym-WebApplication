import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

const GymDetails = () => {
    const { id } = useParams();
    const { getToken } = useKindeAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const location = useLocation();

    const gymId = location.state?.gymId || id;

    const [gymDetails, setGymDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGymDetails = async () => {
            try {
                const token = await getToken();
                console.log("Token", token)
                const response = await axios.get(`http://localhost:4000/api/getSingleGym/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("Fetched Gym Details:", response.data);
                setGymDetails(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch gym details.');
                setLoading(false);
            }
        };

        fetchGymDetails();
    }, [id]);


    useEffect(() => {
        const fetchStaffData = async () => {
            if (!gymId) return;
            try {
                const token = await getToken();
                const response = await axios.get(`http://localhost:4000/api/getStaff/${gymId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching staff data:", error);
            }
        };

        fetchStaffData();
    }, [gymId]);

    const handleDelete = async (memberId) => {
        if (!window.confirm("Are you sure you want to delete this member?")) return;

        try {
            const token = await getToken();
            await axios.delete(`http://localhost:4000/api/deleteStaff/${memberId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers((prevUsers) => prevUsers.filter((user) => user._id !== memberId));
            console.log("Staff deleted successfully");
        } catch (error) {
            console.error("Error deleting staff member:", error);
        }
    };

    return (
        <>
            <div className="p-6 bg-white shadow-md rounded-lg max-w-4xl mx-auto my-10">
                <Link to={"/gym-list"}>
                    <button className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer">
                        Back To Page
                    </button>
                </Link>

                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <div>
                        <h2 className="text-2xl font-bold mt-3">{gymDetails.gymName}</h2>
                        <p className="text-gray-700 mb-4">Location: {gymDetails.address.location}</p>

                        {gymDetails?.gymName && (
                            <Link
                                to="/addmember"
                                state={{ gymId: id }}
                                className="focus:outline-none bg-violet-600 text-white hover:bg-violet-800 px-5 py-2.5 rounded-lg"
                            >
                                Add Staff
                            </Link>
                        )}


                    </div>
                )}

                <div className="max-h-[400px] overflow-y-auto border border-gray-300 rounded-lg shadow-md mt-4">
                    <div className="bg-gray-50 px-6 py-3 sticky top-0 z-10">
                        <h3 className="text-lg font-bold">Staff Members</h3>
                    </div>

                    <div className="overflow-y-auto max-h-[350px]">
                        <table className="min-w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">Phone</th>
                                    <th className="px-6 py-3">Role</th>
                                    <th className="px-6 py-3">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.length > 0 ? (
                                    users.map((member) => (
                                        <tr key={member._id} className="bg-white border-b">
                                            <td className="px-6 py-4">{member.name}</td>
                                            <td className="px-6 py-4">{member.email}</td>
                                            <td className="px-6 py-4">{member.number}</td>
                                            <td className="px-6 py-4">{member.role}</td>
                                            <td className="px-6 py-4 flex gap-2">
                                                <Link
                                                    to={`/editStaff/${member._id}`}
                                                    state={{staff:member}}
                                                    className="text-white bg-yellow-400 hover:bg-yellow-500 px-3 py-2.5 rounded-lg"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(member._id)}
                                                    className="text-white bg-red-700 hover:bg-red-800 px-3 py-2.5 rounded-lg"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-gray-500">
                                            No Staff members found.
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

export default GymDetails;
