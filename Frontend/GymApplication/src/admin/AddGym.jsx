import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import DataTable from "react-data-table-component";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { MdEditSquare } from "react-icons/md";
import "../App.css";

const AddGym = () => {
  const navigate = useNavigate();
  const { user, getToken, isAuthenticated } = useKindeAuth();

  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);

  const ownerId = user?.id || user?.metadata?.ownerId;

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

        console.log("response for gym details admin", response.data)

        setGyms(Array.isArray(response.data.gyms) ? response.data.gyms : []);
      } catch (error) {
        console.error(
          "Error fetching gyms:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchGyms();
    }
  }, [isAuthenticated]);

  // Handle Gym Edit
  const handleEdit = (gym) => {
    navigate(`/edit-gym/${gym._id}`, { state: { gym } });
  };

  // Handle Gym Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this gym?")) {
      try {
        const token = await getToken();

        const response = await axios.delete(
          `http://localhost:4000/api/deleteGym/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Gym deleted successfully!");

        setGyms((prevGyms) => prevGyms.filter((gym) => gym._id !== id));
      } catch (error) {
        console.error(
          "Error deleting gym:",
          error.response?.data || error.message
        );
        alert("Failed to delete gym. Please try again.");
      }
    }
  };

  // DataTable Columns
  const columns = [
    {
      name: "Gym Name",
      selector: (row) => row.gymName,
      sortable: true,
    },
    {
      name: "Location",
      selector: (row) => `${row.address.street}, ${row.address.location}`,
      sortable: true,
      wrap: true,
      width: "200px",
    },
    {
      name: "Pricing (Hourly/Weekly/Monthly)",
      selector: (row) =>
        `${row.currency.symbol} ${row.pricing.hourlyRate} / ${row.currency.symbol} ${row.pricing.weeklyRate} / ${row.currency.symbol} ${row.pricing.monthlyRate}`,
      sortable: true,
    },
    {
      name: "Trainer Pricing (Hourly/Weekly/Monthly)",
      selector: (row) =>
        `${row.currency.symbol} ${row.personalTrainerPricing.hourlyRate} / ${row.currency.symbol} ${row.personalTrainerPricing.weeklyRate} / ${row.currency.symbol} ${row.personalTrainerPricing.monthlyRate}`,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          {/* Edit Button */}
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-500 hover:text-blue-700 text-2xl flex items-center cursor-pointer"
            title="Edit Gym"
          >
            <MdEditSquare />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => handleDelete(row._id)}
            className="text-red-500 hover:text-red-700 text-2xl flex items-center cursor-pointer"
            title="Delete Gym"
          >
            <RiDeleteBin5Fill />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <>
      <div className="flex min-h-screen overflow-y-auto">
        <div className="flex-1 p-6">
          {/* Add New Gym Button */}
          <button
            type="button"
            className="focus:outline-none text-white bg-purple-400 hover:bg-purple-800 
                     focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm 
                     px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 
                     dark:focus:ring-purple-900 cursor-pointer transition duration-1000"
          >
            <Link to="/new-gym-add">Add Gym</Link>
          </button>

          {/* Using DataTable */}
          <div className="mt-6 bg-white shadow-md rounded p-4">
            <h2 className="text-2xl font-bold mb-2">Gym List</h2>
            <div>
              <DataTable
                columns={columns}
                data={gyms}
                progressPending={loading}
                pagination={gyms.length > 3}
                highlightOnHover
                striped
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddGym;
