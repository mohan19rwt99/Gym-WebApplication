// import Payment from "../model/booking.js";
// import GymAdd from "../model/gymModel.js";
// import User from "../model/user.js";


// export const createPayment = async (req, res) => {
//     try {
//        ` const { amount, buyer_name, email, phone, gymId, selectedPlan, startDate, endDate, gymNames } = req.body;`
//         const userId = req.user.sub;

//         if (!gymId || !selectedPlan) {
//             return res.status(400).json({ message: "Gym ID and Selected Plan are required" });
//         }

//         // Check if user already has an active plan for the same gym
//         const existingPayment = await Payment.findOne({
//             userId,
//             gymId,
//             status: "successful",
//             endDate: { $gte: new Date() } // Ensures plan is still active
//         });

//         let adjustedAmount = amount;
//         let previousAmount = 0;

//         if (existingPayment) {
//             previousAmount = existingPayment.amount;

//             // Restrict booking if plan is still active
//             const endDateFormatted = new Date(existingPayment.endDate).toDateString();
//             return res.status(400).json({
//                 message: `You already have an active plan for this gym until ${endDateFormatted}.`,
//             });
//         }

//         const bookingDate = new Date();
//         const formattedStartDate = new Date(startDate);
//         const formattedEndDate = new Date(endDate);

//         // Create new payment record
//         const newPayment = new Payment({
//             userId,
//             gymId,
//             buyer_name,
//             email,
//             phone,
//             selectedPlan,
//             amount: adjustedAmount, // Adjusted price if upgrading
//             status: "successful",
//             startDate: formattedStartDate,
//             endDate: formattedEndDate,
//             gymNames,
//             createdAt: bookingDate,
//         });

//         console.log("New Payment:", newPayment);
//         await newPayment.save();

//         res.status(201).json({
//             message: "Payment created successfully",
//             payment: newPayment,
//             previousAmount,
//             adjustedAmount
//         });

//     } catch (error) {
//         console.error("Payment Error:", error);
//         res.status(500).json({ message: "Server error", error });
//     }
// };

// // cashfree integration


// // Payment Details
// export const getPaymentDetails = async (req, res) => {
//     try {
//         console.log("Params received:", req.params);
//         const { userId, bookingId } = req.params;

//         if (!userId || !bookingId) {
//             return res.status(400).json({ message: "User ID and Gym ID are required." });
//         }

//         // Freshly fetch payment details from DB
//         let paymentDetails = await Payment.findById(bookingId)// Use .lean() for fresh data

//         if (!paymentDetails) {
//             return res.status(404).json({ error: "Payment details not found." });
//         }

//         res.status(200).json({ paymentDetails });
//     } catch (error) {
//         console.error("Error fetching payment details:", error);
//         res.status(500).json({ message: "Server error", error });
//     }
// };

// // user Booking History

// export const getUserBookingHistory = async (req, res) => {
//     try {
//         const userId = req.user.sub;

//         const bookingHistory = await Payment.find({ userId });

//         if (!bookingHistory) {
//             return res.status(404).json({ message: "No Booking History Found" })
//         }
//         res.status(200).json({ message: "Booking History recive successfully", bookingHistory })
//     } catch (error) {
//         console.error("Error fetching booking history:", error);
//         res.status(500).json({ message: "Server error", error });
//     }
// }

// /// get admin his gym 

// export const getOwnerBookings = async (req, res) => {
//     try {
//         const ownerId = req.user.id;
//         console.log("owner Id is owner ", ownerId)

//         if (!ownerId) {
//             return res.status(401).json({ message: "Unauthorized" });
//         }

//         const gyms = await GymAdd.find({ gymOwner: ownerId }).select("_id");

//         if (!gyms.length) {
//             return res.status(404).json({ message: "NO Gyms found for this owner" })
//         }

//         const gymIds = gyms.map(gym => gym._id);

//         const bookings = await Payment.find({ gymId: { $in: gymIds } })

//         res.status(200).json({ bookings });
//     } catch (error) {
//         console.error("Error fetching owner bookings:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// }


// // create for fetch booking details according dates 
// export const adminUserDetails = async (req, res) => {
//     try {
//         const { gymId, date } = req.query;

//         if (!gymId || !date) {
//             return res.status(401).json({ message: "Gym Id and Date are required" });
//         }

//         const selectedDate = new Date(date);
//         const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
//         const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

//         console.log("Fetching active plans for Gym:", gymId, "Date Range:", startOfDay, "to", endOfDay);

//         // Fetch bookings where the selected date falls within their plan duration
//         const booking = await Payment.find({
//             gymId,
//             startDate: { $lte: endOfDay },  // Plan started before or on the selected date
//             endDate: { $gte: startOfDay }   // Plan ends after or on the selected date
//         }).populate("userId", "name email");

//         console.log("Active Plans on Selected Date:", booking);

//         if (booking.length === 0) {
//             return res.status(404).json({ message: "No active plans found on the selected date." });
//         }

//         const bookingDetails = booking.map((bookings) => ({
//             userId: bookings.userId,
//             gymName: bookings.gymNames,
//             selectedPlan: bookings.selectedPlan,
//             buyerName: bookings.buyer_name,
//             startDate: bookings.startDate.toISOString().split('T')[0],
//             endDate: bookings.endDate.toISOString().split('T')[0]
//         }));

//         console.log("Filtered Booking Details:", bookingDetails);

//         res.status(200).json({ totalBookings: bookingDetails.length, bookings: bookingDetails });
//     } catch (error) {
//         console.error("Error fetching booking details:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// };

// // get booking details for dashboard customer
// export const userBookingDashboard = async (req, res) => {
//     try {
//         const { userId } = req.params; 
//         console.log("userid", userId);

//         const bookings = await Payment.find({ userId });
//         console.log("bookings", bookings);

//         // If no bookings found, return empty stats
//         if (!bookings || bookings.length === 0) {
//             return res.status(200).json({ 
//                 totalBooking: 0, 
//                 upcomingBooking: [],
//                 bookings: [] 
//             });
//         }

//         // Calculate total bookings
//         const totalBooking = bookings.length;

//         // Get today's date without time
//         const today = new Date();
//         today.setHours(0,0,0,0)
//         console.log("today normalized", today)

//         // Filter upcoming bookings based on startDate being today or in the future
//         const upcomingBooking = bookings.filter(booking => {
//             const bookingDate = new Date(booking.startDate)

//             bookingDate.setHours(0, 0, 0,0)

//             return bookingDate >= today
//         })
//         console.log("Upcoming Booking", upcomingBooking)

//         res.status(200).json({
//             totalBooking,
//             upcomingBooking,
//             bookings
//         });

//     } catch (error) {
//         console.error("Error fetching booking details:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// };







