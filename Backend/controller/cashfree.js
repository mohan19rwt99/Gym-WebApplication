import Payment from "../model/booking.js";
import axios from "axios";
import dotenv from "dotenv";
import crypto from 'crypto';
import GymAdd from "../model/gymModel.js";

dotenv.config();

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const CASHFREE_URL = "https://sandbox.cashfree.com/pg/orders";

function generateOrderId() {
  return 'ORDER_' + crypto.randomBytes(8).toString('hex').toUpperCase();
}

// Create Payment
export const createPayment = async (req, res) => {
  try {
    const {
      amount,
      email,
      phone,
      gymId,
      selectedPlan,
      startDate,
      endDate,
      gymNames,
      currency,
      bookingDate,
      bookingTime,

    } = req.body;

    const userId = req.user?.sub;
    const buyer_name = req.user?.given_name || req.user?.name || "Gym User"; // Real user name from Kinde

    if (!userId || !email || !phone || !gymId || !selectedPlan) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const orderId = generateOrderId();

    const payload = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR", // Testing
      customer_details: {
        customer_id: userId,
        customer_email: email,
        customer_phone: phone,
        customer_name: buyer_name,
      },
      order_meta: {
        return_url: `http://localhost:3000/confirm-payment/${orderId}`,
      },
    };

    const response = await axios.post(CASHFREE_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": CASHFREE_APP_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
      },
    });

    const paymentSessionId = response?.data?.payment_session_id;

    const newPayment = new Payment({
      orderId,
      userId,
      gymId,
      buyer_name,
      email,
      phone,
      selectedPlan,
      amount,
      currency,
      status: "pending",
      startDate,
      endDate,
      gymNames,
      bookingDate,
      bookingTime,
    });

    console.log("New PYAMENT", newPayment)

    await newPayment.save();

    res.status(201).json({
      message: "Payment order created",
      paymentSessionId,
      orderId,
    });

  } catch (error) {
    console.error("Payment Error:", error?.response?.data || error.message);
    res.status(500).json({ message: "Server error", error: error?.response?.data || error.message });
  }
};





// verify payment
export const verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.params;

    console.log("Verifying orderId:", orderId);

    const response = await axios.get(`https://sandbox.cashfree.com/pg/orders/${orderId}`, {
      headers: {
        accept: "application/json",
        "x-api-version": "2022-09-01",
        "x-client-id": CASHFREE_APP_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
      },
    });

    const orderData = response.data;

    if (!orderData || orderData.order_status !== "PAID") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const paymentRecord = await Payment.findOne({ orderId });
    if (!paymentRecord) {
      console.log("No payment record found for:", orderId);
      return res.status(404).json({ message: "Payment record not found" });
    }

    paymentRecord.status = "successful";
    paymentRecord.transactionId = orderData.cf_order_id;
    paymentRecord.currency = orderData.order_currency;
    await paymentRecord.save();

    res.status(200).json({
      message: "Payment verified",
      payment: paymentRecord,
    });

  } catch (error) {
    console.error("Verify Payment Error:", error?.response?.data || error.message);
    res.status(500).json({ message: "Something went wrong while verifying payment." });
  }
};






// Webhook Handler
export const handleCashfreeWebhook = async (req, res) => {
  try {
    console.log("Cashfree Webhook Received:", req.body);

    const { order_id, order_status, payment_id, order_currency } = req.body;

    if (!order_id || !order_status) {
      return res.status(400).json({ message: "Invalid data from Cashfree" });
    }

    let updatedStatus = "pending";
    if (order_status === "PAID") updatedStatus = "successful";
    else if (["FAILED", "EXPIRED"].includes(order_status)) updatedStatus = "failed";

    const updatedPayment = await Payment.findOneAndUpdate(
      { orderId: order_id },
      {
        status: updatedStatus,
        transactionId: payment_id || null,
        currency: order_currency || "INR", // Save currency from webhook
      },
      { new: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({ message: "Payment status updated successfully" });
  } catch (error) {
    console.error("Webhook Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


//  Get Payment by User ID and Booking ID
export const getPaymentDetails = async (req, res) => {
  try {
    const { userId, bookingId } = req.params;

    const paymentDetails = await Payment.findOne({ userId, _id: bookingId });
    if (!paymentDetails) return res.status(404).json({ message: "Payment not found" });

    if (paymentDetails.status !== "successful") {
      return res.status(403).json({ message: "Payment not confirmed" });
    }

    res.status(200).json({ paymentDetails });

  } catch (error) {
    console.error("Fetch Payment Details Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 3. Get Payment by Order ID
export const getPaymentByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;

    const paymentDetails = await Payment.findOne({ orderId });
    if (!paymentDetails) return res.status(404).json({ message: "Payment not found" });

    res.status(200).json({ paymentDetails });

  } catch (error) {
    console.error("Get Payment by Order ID Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// // user Booking History

export const getUserBookingHistory = async (req, res) => {
  try {
    const userId = req.user.sub;

    const bookingHistory = await Payment.find({ userId });

    if (!bookingHistory) {
      return res.status(404).json({ message: "No Booking History Found" })
    }
    res.status(200).json({ message: "Booking History recive successfully", bookingHistory })
  } catch (error) {
    console.error("Error fetching booking history:", error);
    res.status(500).json({ message: "Server error", error });
  }
}

//
export const getOwnerBookings = async (req, res) => {
  try {
    const ownerId = req.user.id;
    console.log("owner Id is owner ", ownerId)

    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const gyms = await GymAdd.find({ gymOwner: ownerId }).select("_id");

    if (!gyms.length) {
      return res.status(404).json({ message: "NO Gyms found for this owner" })
    }

    const gymIds = gyms.map(gym => gym._id);

    const bookings = await Payment.find({ gymId: { $in: gymIds } })

    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching owner bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// create for fetch booking details according dates 
export const adminUserDetails = async (req, res) => {
  try {
    const { gymId, date } = req.query;

    if (!gymId || !date) {
      return res.status(401).json({ message: "Gym Id and Date are required" });
    }

    const selectedDate = new Date(date);
    const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

    console.log("Fetching active plans for Gym:", gymId, "Date Range:", startOfDay, "to", endOfDay);

    // Fetch bookings where the selected date falls within their plan duration
    const booking = await Payment.find({
      gymId,
      startDate: { $lte: endOfDay },  // Plan started before or on the selected date
      endDate: { $gte: startOfDay }   // Plan ends after or on the selected date
    }).populate("userId", "name email");

    console.log("Active Plans on Selected Date:", booking);

    if (booking.length === 0) {
      return res.status(404).json({ message: "No active plans found on the selected date." });
    }

    const bookingDetails = booking.map((bookings) => ({
      _id:bookings._id,
      userId: bookings.userId,
      gymName: bookings.gymNames,
      selectedPlan: bookings.selectedPlan,
      buyerName: bookings.buyer_name,
      startDate: bookings.startDate.toISOString().split('T')[0],
      endDate: bookings.endDate.toISOString().split('T')[0],
      status: bookings.status,
      visitingTime: bookings.bookingTime || "Not Set"
    }));

    console.log("Filtered Booking Details:", bookingDetails);

    res.status(200).json({ totalBookings: bookingDetails.length, bookings: bookingDetails });
  } catch (error) {
    console.error("Error fetching booking details:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// get booking details for dashboard customer
export const userBookingDashboard = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("userid", userId);

    const bookings = await Payment.find({ userId });
    console.log("bookings", bookings);

    // If no bookings found, return empty stats
    if (!bookings || bookings.length === 0) {
      return res.status(200).json({
        totalBooking: 0,
        upcomingBooking: [],
        bookings: []
      });
    }

    // Calculate total bookings
    const totalBooking = bookings.length;

    // Get today's date without time
    const today = new Date();
    today.setHours(0, 0, 0, 0)
    console.log("today normalized", today)

    // Filter upcoming bookings based on startDate being today or in the future
    const upcomingBooking = bookings.filter(booking => {
      const bookingDate = new Date(booking.startDate)

      bookingDate.setHours(0, 0, 0, 0)

      return bookingDate >= today
    })
    console.log("Upcoming Booking", upcomingBooking)

    res.status(200).json({
      totalBooking,
      upcomingBooking,
      bookings
    });

  } catch (error) {
    console.error("Error fetching booking details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Create a backend API endpoint to fetch the user’s active bookings for the same gym.

export const checkActiveBooking = async (req, res) => {
  const { userId, gymId } = req.params;
  const today = new Date().toISOString().split('T')[0];
  try {
    const existingBooking = await Payment.findOne({
      userId,
      gymId,
      status: "successful",
      startDate: { $lte: today },
      endDate: { $gte: today }
    })

    if (existingBooking) {
      res.status(200).json({
        conflict: true,
        booking: existingBooking
      })
    } else {
      return res.status(200).json({ conflict: false });
    }
  } catch (error) {
    console.error("Error checking active booking:", error);
    return res.status(500).json({ message: "Server error", error });
  }
}


//update Schedule of customer by owner

export const updateVisitingTime = async (req, res)=>{
  const {userId} = req.params;
  const {visitingTime} = req.body;

  if(!visitingTime){
    return res.status(400).json({message:'Visiting Time is required'})
  }
  try {
      const booking = await Payment.findById(userId);
      if(!booking){
        return res.status(404).json({message:"Booking Not found"})
      }
       //find Gym timing
       const gym = await GymAdd.findById(booking.gymId)
       if(!gym || !gym.timings){
          return res.status(404).json({message:"Gym or timings not found"})
       }

       const today = new Date();
       const [hours,minutes] = visitingTime.split(":").map(Number);
       const visitingMinutes = hours * 60 + minutes;

       const getMinutes = (date)=>{
          const d = new Date(date);
          return d.getHours() * 60 + d.getMinutes();
       }

       const morningStart = getMinutes(gym.timings.morning.openingTime);
       const morningEnd = getMinutes(gym.timings.morning.closingTime);
       const eveningStart = getMinutes(gym.timings.evening.openingTime);
       const eveningEnd = getMinutes(gym.timings.evening.closingTime);
       
       // Check if visiting time is within gym timings
       const isValid =
         (visitingMinutes >= morningStart && visitingMinutes <= morningEnd) ||
         (visitingMinutes >= eveningStart && visitingMinutes <= eveningEnd);
       
       if (!isValid) {
         return res.status(400).json({
           message: `Time ${visitingTime} is outside gym's open hours`,
         });
       }
       

       booking.bookingTime = visitingTime;
       await booking.save();

       res.status(200).json({
        message:"visiting Time update Successfully",
        booking,  
       })
  } catch (error) {
      console.error("Error updating visiting Time", error);
      res.status(500).json({message:"Internal Server Error"})
  }
}