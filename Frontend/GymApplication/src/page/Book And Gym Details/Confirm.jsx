import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";

const Confirm = () => {
  const { orderId } = useParams();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState("");

  const printRef = useRef(); 

  useEffect(() => {
    const verifyAndFetch = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/verify-payment/${orderId}`);
        console.log("Verification Response:", res.data);

        const response = await axios.get(`http://localhost:4000/api/getPaymentByOrderId/${orderId}`);

        const details = response.data.paymentDetails;

        if (
          details.status === "CANCELLED" ||
          details.status === "cancelled" ||
          details.status === "failed"
        ) {
          setError("Your Payment was Cancelled");
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

  const handlePrint = () => {
    window.print(); 
  };

  // function formateTimeTo12Hour(time){
  //     const [hour,minute] = time.split(":");
  //     const hourNum = parseInt(hour,10);
  //     const ampm = hourNum >= 12 ? "PM" : "AM";
  //     const hour12 = hourNum % 12 || 12;
  //     return `${hour12}:${minute} ${ampm}`
  // }

  const handleDownload = () => {
    if (!paymentDetails) return;

    // Create a new instance of jsPDF
    const doc = new jsPDF();

    // Add content to the PDF
    doc.text("Booking Confirmation", 10, 10);
    doc.text(`User Name: ${paymentDetails.buyer_name}`, 10, 20);
    doc.text(`Booking ID: ${paymentDetails._id}`, 10, 30);
    doc.text(`Gym: ${paymentDetails.gymNames}`, 10, 40);
    doc.text(`Plan: ${paymentDetails.selectedPlan}`, 10, 50);
    doc.text(`Amount: ₹${paymentDetails.amount}`, 10, 60);
    doc.text(`Status: ${paymentDetails.status}`, 10, 70);
    doc.text(`Phone: ${paymentDetails.phone}`, 10, 80);
    doc.text(`Email: ${paymentDetails.email}`, 10, 90);
    doc.text(
      `Start Date: ${new Date(paymentDetails.startDate).toLocaleDateString()}`,
      10,
      100
    );
    doc.text(
      `End Date: ${new Date(paymentDetails.endDate).toLocaleDateString()}`,
      10,
      110
    );
    doc.text(
      `Transaction ID: ${paymentDetails.transactionId || "Not available yet"}`,
      10,
      120
    );
    
    let currentY = 130;
    doc.text("Visiting Slots", 10, currentY)
    currentY +=10;

    paymentDetails.bookingTimeSlots.forEach((slot,index)=>{
      doc.text(`Slot ${index + 1}:`, 10, currentY);
    doc.text(`  Date: ${slot.date}`, 10, currentY + 10);
    doc.text(`  Time: ${slot.time}`, 10, currentY + 20);
    doc.text(`  Status: ${slot.status}`, 10, currentY + 30);
    currentY += 40; 
    })

    // Save the PDF
    doc.save("BookingConfirmation.pdf");
  };

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative shadow">
        <strong className="font-bold">Oops! </strong>
        <span className="block sm:inline ml-2">{error}</span>
      </div>
    );
  }

  if (!paymentDetails)
    return (
      <div className="max-w-md mx-auto mt-10 text-center text-gray-600">
        Loading payment details...
      </div>
    );

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-xl p-6 rounded-xl border border-gray-200">
      <h2 className="text-2xl font-semibold text-green-500 mb-4">Payment Successful</h2>
      <div
        ref={printRef} // Assign the ref to the printable content
        className="text-gray-700 space-y-2 transform transition duratioin-300 ease-in-out hover:scale-105 hover:shadow-xl bg-white p-6 rounded-lg"
      >
        <p>
          <strong>User Name:</strong> {paymentDetails.buyer_name}
        </p>
        <p>
          <strong>Booking ID:</strong> {paymentDetails._id}
        </p>
        <p>
          <strong>Gym:</strong> {paymentDetails.gymNames}
        </p>
        <p>
          <strong>Plan:</strong> {paymentDetails.selectedPlan}
        </p>
        <p>
          <strong>Amount:</strong> ₹{paymentDetails.amount}
        </p>
        <p>
          <strong>Status:</strong> {paymentDetails.status}
        </p>
        <p>
          <strong>Phone:</strong> {paymentDetails.phone}
        </p>
        <p>
          <strong>Email:</strong> {paymentDetails.email}
        </p>
        <p>
          <strong>Start Date:</strong> {new Date(paymentDetails.startDate).toLocaleDateString()}
        </p>
        <p>
          <strong>End Date:</strong> {new Date(paymentDetails.endDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Transaction ID:</strong> {paymentDetails.transactionId || "Not available yet"}
        </p>
       <div>
        <strong>Visiting Slots:</strong>
        <ul className="list-disc ml-5 mt-2"
        >{paymentDetails.bookingTimeSlots.map((slot, index)=>(
          <li key={slot._id}>
            <p>Slot {index +1}:</p>
            <p>
              <strong>Date:</strong> {slot.date}
            </p>
            <p>
              <strong>Time:</strong> {slot.time}
            </p>
            <p>
              <strong>Status:</strong> {slot.status}
            </p>
          </li>
        ))}</ul>
       </div>
      </div>

      {/* Buttons for Print and Download */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-[#D4C9BE] text-white rounded-lg hover:bg-[#7a7067] transition-colors cursor-pointer duration-300"
        >
          Print
        </button>
        <button
          onClick={handleDownload}
          className="px-4 py-2  bg-[#D4C9BE] text-white rounded-lg hover:bg-[#7a7067] transition-colors cursor-pointer duration-300"
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default Confirm;