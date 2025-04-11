import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Confirm = () => {
  const { orderId } = useParams();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyAndFetch = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/verify-payment/${orderId}`);
        console.log("Verification Response:", res.data);

        const response = await axios.get(`http://localhost:4000/api/getPaymentByOrderId/${orderId}`);

        const details = response.data.paymentDetails

        if (details.status == "CANCELLED" || details.status == "cancelled" || details.status == "failed") {
          setError("Your Payment was Cancelled")
        } else {
          setPaymentDetails(details);
        }
      } catch (err) {
        console.error("Error verifying or fetching payment:", err?.response?.data || err.message);
        setError("Something went wrong while verifying your payment.");
      }
    };

    if (orderId) verifyAndFetch();
  }, [orderId]);

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative shadow">
      <strong className="font-bold">Oops! </strong>
      <span className="block sm:inline ml-2">{error}</span>
    </div>
    )
    
  }
  if (!paymentDetails) return(
    <div className="max-w-md mx-auto mt-10 text-center text-gray-600">
      Loading payment details...
    </div>
  )

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-xl p-6 rounded-xl border border-gray-200">
      <h2 className="text-2xl font-semibold text-green-600 mb-4">Payment Successful</h2>
      <div className="text-gray-700 space-y-2 transform transition duratioin-300 ease-in-out hover:scale-105 hover:shadow-xl bg-white p-6 rounded-lg">
        <p><strong>User Name:</strong> {paymentDetails.buyer_name}</p>
        <p><strong>Booking ID:</strong> {paymentDetails._id}</p>
        {/* <p><strong>Order ID:</strong> {paymentDetails.orderId}</p> */}
        <p><strong>Gym:</strong> {paymentDetails.gymNames}</p>
        <p><strong>Plan:</strong> {paymentDetails.selectedPlan}</p>
        <p><strong>Amount:</strong> ₹{paymentDetails.amount}</p>
        <p><strong>Status:</strong> {paymentDetails.status}</p>
        <p><strong>Phone:</strong> {paymentDetails.phone}</p>
        <p><strong>Email:</strong> {paymentDetails.email}</p>
        <p><strong>Start Date:</strong> {new Date(paymentDetails.startDate).toLocaleDateString()}</p>
        <p><strong>End Date:</strong> {new Date(paymentDetails.endDate).toLocaleDateString()}</p>
        <p><strong>Transaction ID:</strong> {paymentDetails.transactionId || "Not available yet"}</p>
      </div>
    </div>
  );
};

export default Confirm;
