import Payment from "../model/booking.js";
import GymAdd from "../model/gymModel.js";

// const FRONTEND_URL = process.env.FRONTEND_URL;

// export const createPayment = async (req, res) => {
//     try {
//         const { amount, buyer_name, email, phone } = req.body;

//         // Get Access Token First
//         const accessToken = await getAccessToken();

//         if (!accessToken) {
//             return res.status(500).json({ error: "Failed to obtain access token" });
//         }

//         // Make Payment Request
//         const response = await axios.post(
//             `${INSTAMOJO_BASE_URL}/v2/payment_requests/`,  
//             {
//                 purpose: "Gym Membership",
//                 amount: amount,
//                 buyer_name: buyer_name,
//                 email: email,
//                 phone: phone,
//                 redirect_url: `${FRONTEND_URL}/payment-success`,
//                 send_email: true,
//                 send_sms: true,
//                 allow_repeated_payments: false
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                     "Content-Type": "application/json"
//                 }
//             }
//         );

//         console.log("Payment Response:", response.data);

//         if (response.data.success) {
//             res.status(201).json({ payment_url: response.data.payment_request.longurl });
//         } else {
//             res.status(400).json({ error: "Payment request failed", details: response.data });
//         }
//     } catch (error) {
//         console.error("Payment Error:", error.response ? error.response.data : error.message);
//         res.status(500).json({ error: "Payment initiation failed" });
//     }
// };

export const createPayment = async (req, res) => {
    try {
        const { amount, buyer_name, email, phone, gymId, selectedPlan, startDate, endDate, gymNames } = req.body;
        const userId = req.user.sub;

        if (!gymId || !selectedPlan) {
            return res.status(400).json({ message: "Gym ID and Selected Plan are required" });
        }

        // Check if user already has an active plan for the same gym
        const existingPayment = await Payment.findOne({
            userId,
            gymId,
            status: "successful",
            endDate: { $gte: new Date() } // Ensures plan is still active
        });

        let adjustedAmount = amount;
        let previousAmount = 0;

        if (existingPayment) {
            previousAmount = existingPayment.amount;

            // Restrict booking if plan is still active
            const endDateFormatted = new Date(existingPayment.endDate).toDateString();
            return res.status(400).json({
                message: `You already have an active plan for this gym until ${endDateFormatted}.`,
                activePlan: existingPayment
            });

            //  If upgrading, enable below logic instead of blocking completely
            // adjustedAmount = Math.max(amount - previousAmount, 0);
        }

        // Create new payment record
        const newPayment = new Payment({
            userId,
            gymId,
            buyer_name,
            email,
            phone,
            selectedPlan,
            amount: adjustedAmount, // Adjusted price if upgrading
            status: "successful",
            startDate,
            endDate,
            gymNames,
        });

        console.log("New Payment:", newPayment);
        await newPayment.save();

        res.status(201).json({
            message: "Payment created successfully",
            payment: newPayment,
            previousAmount,
            adjustedAmount
        });

    } catch (error) {
        console.error("Payment Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};


// Payment Details
export const getPaymentDetails = async (req, res) => {
    try {
        console.log("Params received:", req.params);
        const { userId, bookingId } = req.params;

        if (!userId || !bookingId) {
            return res.status(400).json({ message: "User ID and Gym ID are required." });
        }

        // Freshly fetch payment details from DB
        let paymentDetails = await Payment.findById(bookingId)// 🔥 Use .lean() for fresh data

        if (!paymentDetails) {
            return res.status(404).json({ error: "Payment details not found." });
        }

        res.status(200).json({ paymentDetails });
    } catch (error) {
        console.error("Error fetching payment details:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// user Booking History

export const getUserBookingHistory = async (req, res)=>{
    try {
        const userId = req.user.sub;

        const bookingHistory = await Payment.find({userId});

        if(!bookingHistory){
            return res.status(404).json({message:"No Booking History Found"})
        }
        res.status(200).json({message:"Booking History recive successfully", bookingHistory})
    } catch (error) {
        console.error("Error fetching booking history:", error);
        res.status(500).json({ message: "Server error", error });
    }
}

/// get admin his gym 

export const getOwnerBookings = async (req, res)=>{
    try {
        const ownerId = req.user.id;
        console.log("owner Id is owner ", ownerId)

        if (!ownerId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const gyms = await GymAdd.find({gymOwner : ownerId}).select("_id");

        if(!gyms.length){
            return res.status(404).json({message:"NO Gyms found for this owner"})
        }

        const gymIds = gyms.map(gym=>gym._id);

        const bookings = await Payment.find({gymId : { $in : gymIds}})

        res.status(200).json({ bookings });
    } catch (error) {
        console.error("Error fetching owner bookings:", error);
        res.status(500).json({ message: "Server error" });
    }
}


