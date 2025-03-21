import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import toast from 'react-hot-toast';
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

function EditGym() {

    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const {getToken} = useKindeAuth();

    const [formData, setFormData] = useState({
        name: '',
        location: '',
        pricing: {
            hourlyRate: '',
            weeklyRate: '',
            monthlyRate: ''
        },
        personalTrainerPricing: {
            hourlyRate: '',
            weeklyRate: '',
            monthlyRate: ''
        }
    })

    // Load Gym Details

    useEffect(() => {
        console.log("Location State Data:", location.state);
        if (location.state?.gym) {
            const gym = location.state.gym;
            
            setFormData({
                gymName: gym.gymName || '',
                location: gym.location || '',
                pricing: gym.pricing || {
                    hourlyRate: '',
                    weeklyRate: '',
                    monthlyRate: ''
                },
                personalTrainerPricing: gym.personalTrainerPricing || {
                    hourlyRate: '',
                    weeklyRate: '',
                    monthlyRate: ''
                }
            })
        }
    }, [location])

    // Handle Input changes
    const handleChange = async (e) => {
        const { name, value } = e.target;

        if(name.startsWith("pricing")){
            const key = name.split(".")[1];
            setFormData((prev)=>({
                ...prev,
                pricing: {...prev.pricing, [ key]: value}
            }));
        } else if(name.startsWith("personalTrainerPricing")){
            const key = name.split(".")[1];
            setFormData((prev)=>({
                ...prev,
                personalTrainerPricing:{...prev.personalTrainerPricing, [key]: value}
            }))
        } else{
            setFormData((prev)=>({
                ...prev,
                [name]:value
            }))
        }

    }

    const handleSubmit = async(e)=>{
        e.preventDefault();

        console.log("Submitting Data:", formData); 

        try {
            const token = await getToken();
            console.log("Token", token)
            const response = await axios.put(`http://localhost:4000/api/updateGym/${id}`, formData,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });
            console.log("response", response.data)
            toast.success(response.data.msg || "Gym Updated Successfully", {
                position: "top-right",
                duration: 4000
              });
            navigate(-1)
        } catch (error) {
            console.error("Error updating gym:", error);
            toast.error(error.response?.data?.msg || "Failed to add member", {
                position: "top-right",
                duration: 4000
              });
        }
    }

    return (
        <div>
            <div className='min-h-screen flex items-center justify-center bg-green-100'>
                <div>
                    <div className='bg-black text-white p-5 text-center'>
                        <h1 className=' text-2xl font-bold'>Edit Gym Details</h1>
                    </div>
                    <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>

                        <div>
                            <form onSubmit={handleSubmit}>
                                <div className='mb-4'>
                                    <label>Name</label>
                                    <input
                                        name='gymName'
                                        value={formData.gymName}
                                        onChange={handleChange}
                                        type="text"
                                        className='w-full border rounded-lg px-4 py-2' />
                                </div>

                                {/* location */}
                                <div className='mb-4'>
                                    <label>Location</label>
                                    <input
                                        name='location'
                                        value={formData.location}
                                        onChange={handleChange}
                                        type="text"
                                        className='w-full border rounded-lg px-4 py-2' />
                                </div>

                                {/* Pricing Section */}
                                <h2 className='text-xl font-semibold mt-4'>Gym Pricing</h2>
                                <div className='mb-4'>
                                    <label>Hourly Rate</label>
                                    <input
                                        name='pricing.hourlyRate'
                                        value={formData.pricing.hourlyRate}
                                        onChange={handleChange}
                                        type="text"
                                        className='w-full border rounded-lg px-4 py-2' />
                                </div>

                                {/* Weekly Price */}
                                <div className='mb-4'>
                                    <label>Weekly Rate</label>
                                    <input
                                        name='pricing.weeklyRate'
                                        value={formData.pricing.weeklyRate}
                                        onChange={handleChange}
                                        type="text"
                                        className='w-full border rounded-lg px-4 py-2' />
                                </div>


                                {/* Monthly Price */}
                                <div className='mb-4'>
                                    <label>Monthly Rate</label>
                                    <input
                                        name='pricing.monthlyRate'
                                        value={formData.pricing.monthlyRate}
                                        onChange={handleChange}
                                        type="text"
                                        className='w-full border rounded-lg px-4 py-2' />
                                </div>

                                {/* Trainer Pricing Section */}
                                <h2 className='text-xl font-semibold mt-4'>Trainer Pricing</h2>


                                <div className='mb-4'>
                                    <label>Hourly Rate</label>
                                    <input
                                        name='personalTrainerPricing.hourlyRate'
                                        value={formData.personalTrainerPricing.hourlyRate}
                                        onChange={handleChange}
                                        type="text"
                                        className='w-full border rounded-lg px-4 py-2' />
                                </div>

                                {/* Weekly Price */}
                                <div className='mb-4'>
                                    <label>Weekly Rate</label>
                                    <input
                                        name='personalTrainerPricing.weeklyRate'
                                        value={formData.personalTrainerPricing.weeklyRate}
                                        onChange={handleChange}
                                        type="text"
                                        className='w-full border rounded-lg px-4 py-2' />
                                </div>


                                {/* Monthly Price */}
                                <div className='mb-4'>
                                    <label>Monthly Rate</label>
                                    <input
                                        name='personalTrainerPricing.monthlyRate'
                                        value={formData.personalTrainerPricing.monthlyRate}
                                        onChange={handleChange}
                                        type="text"
                                        className='w-full border rounded-lg px-4 py-2' />
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                                    >
                                        Update
                                    </button>
                                    <button
                                        type="button"
                                          onClick={() => navigate(-1)}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default EditGym
