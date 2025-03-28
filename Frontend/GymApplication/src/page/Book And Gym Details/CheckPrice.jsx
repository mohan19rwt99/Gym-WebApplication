import React, { useEffect, useState } from 'react';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CheckPrice = () => {
    const { gymId } = useParams();
    const { getToken, user } = useKindeAuth();
    const [price, setPrice] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bookingStatus, setBookingStatus] = useState(null);
    const navigate = useNavigate();
    const [gymName, setGymName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    

    useEffect(() => {
        const fetchPrice = async () => {
            try {
                const token = await getToken();
                const response = await axios.get(`http://localhost:4000/api/getSingleGym/${gymId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("Gym Name is", response.data.gymName)
                setPrice(response.data);
                const gymNames = setGymName(response.data.gymName)
            } catch (error) {
                console.error("Error fetching price:", error);
            }
        };
        fetchPrice();
    }, [gymId, getToken]);

    // calucate Start and End Time

    useEffect(()=>{
        if(!selectedPlan) return;
        const today = new Date();
        const formattedStartDate = today.toISOString().split('T')[0];

        let newEndDate = new Date(today);
        if(selectedPlan.includes("WeeklyPlan")){
            newEndDate.setDate(today.getDate() + 7);
        } else if(selectedPlan.includes("Monthly Plan")){
            newEndDate.setDate(today.getDate()+30)
        }
        const formattedEndDate = newEndDate.toISOString().split('T')[0];

        setStartDate(formattedStartDate)
        setEndDate(formattedEndDate)
    },[selectedPlan])

    // Open Modal and Set Plan
    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
        setIsModalOpen(true);
    };

    const handleProceedToPayment = async () => {
        if (!phoneNumber || phoneNumber.length !== 10) {
            alert("Please enter a valid 10-digit phone number!");
            return;
        }

        const buyerName = user?.givenName || user?.name || "Gym Customer";
        console.log("BuyerName", buyerName)
        const email = user?.email || "example@gmail.com";
        console.log("BuyerName", email)

        try {
            const token = await getToken();

            let selectedRate;
            if (selectedPlan.includes("Hourly Plan With Trainer")) {
                selectedRate = price.personalTrainerPricing.hourlyRate;
            } else if (selectedPlan.includes("Hourly Plan")) {
                selectedRate = price.pricing.hourlyRate;
            } else if (selectedPlan.includes("Weekly Plan With Trainer")) {
                selectedRate = price.personalTrainerPricing.weeklyRate;
            } else if (selectedPlan.includes("Weekly Plan")) {
                selectedRate = price.pricing.weeklyRate;
            } else if (selectedPlan.includes("Monthly Plan With Trainer")) {
                selectedRate = price.personalTrainerPricing.monthlyRate;
            } else if (selectedPlan.includes("Monthly Plan")) {
                selectedRate = price.pricing.monthlyRate;
            } else {
                alert("Invalid plan selection!");
                return;
            }

            const response = await axios.post(
                "http://localhost:4000/api/createPayment",
                {
                    userId: user?.id,
                    buyer_name: buyerName,
                    email: email,
                    phone: phoneNumber,
                    gymId: gymId,
                    selectedPlan: selectedPlan,
                    amount: selectedRate,
                    status: "successful",
                    startDate:startDate,
                    endDate:endDate,
                    gymNames:gymName,
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            const bookingId = response?.data?.payment?._id;
            const bookingTime = new Date().toLocaleString();
            setBookingStatus({ status: "Success", time: bookingTime });
            navigate(`/confirm-payment/${bookingId}`)
        } catch (error) {
            console.error("Payment Error:", error);
            alert("Payment initiation failed. Please try again.");
            setBookingStatus("Failed");
        }

        setIsModalOpen(false);
    };

    return (
        <div className='container mx-auto px-4 py-8'>
            <button onClick={()=>navigate(-1)}
             className="mb-6 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-600 transition cursor-pointer">Back</button>
            <div className='text-center'>
                <h2 className="text-3xl font-bold sm:text-5xl">Choose Your Plan</h2>
                <p className="max-w-3xl mx-auto mt-4 text-xl">Choose a plan that fits your needs and upgrade anytime.</p>
            </div>

            {price ? (
                <div className="flex flex-wrap justify-center gap-8 mt-8">
                    {[
                        { name: "Hourly Plan", rate: price.pricing.hourlyRate, duration: "hour" },
                        { name: "Hourly Plan With Trainer", rate: price.personalTrainerPricing.hourlyRate, duration: "hour" },
                        { name: "Weekly Plan", rate: price.pricing.weeklyRate, duration: "week" },
                        { name: "Weekly Plan With Trainer", rate: price.personalTrainerPricing.weeklyRate, duration: "week" },
                        { name: "Monthly Plan", rate: price.pricing.monthlyRate, duration: "month" },
                        { name: "Monthly Plan With Trainer", rate: price.personalTrainerPricing.monthlyRate, duration: "month" }
                    ].map((plan) => (
                        <div key={plan.name} className="w-full sm:w-1/3 bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                            <h3 className="text-xl font-bold">{plan.name}</h3>
                            <p className="text-gray-600 mt-2">Access to gym facilities.</p>
                            <p className="text-3xl font-bold mt-4">₹{plan.rate}/{plan.duration}</p>
                            <button
                                onClick={() => handlePlanSelect(plan.name)}
                                className="text-black hover:before:bg-black border-black relative h-[50px] w-40 overflow-hidden border bg-white px-3 text-black shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-black before:transition-all before:duration-500 hover:text-white hover:shadow-black hover:before:left-0 hover:before:w-full cursor-pointer"
                            >
                                <span className="relative">Choose</span>
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex justify-center items-center space-x-2">
                    <div className="w-5 h-5 bg-[#d991c2] rounded-full animate-bounce"></div>
                    <div className="w-5 h-5 bg-[#9869b8] rounded-full animate-bounce"></div>
                    <div className="w-5 h-5 bg-[#6756cc] rounded-full animate-bounce"></div>
                </div>
            )}

            {/* Modal for Phone Number Input */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-10 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
                        <h3 className="text-xl font-bold">Enter Your Phone Number</h3>
                        <input
                            type="tel"
                            placeholder="Enter phone number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="border border-gray-400 rounded-md p-2 mt-4 w-full text-center"
                        />
                        <div className="flex justify-center gap-4 mt-6">
                            <button
                                onClick={handleProceedToPayment}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition cursor-pointer"
                            >
                                Proceed to Payment
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-400 transition cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckPrice;
