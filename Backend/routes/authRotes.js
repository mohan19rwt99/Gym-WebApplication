import express from "express"
// import requireAuth from "./middlewear.js"
import { registerOrLoginUser, getUserByEmail } from "../controller/authController.js"
import { addGym, getGym, getGymCity ,updateGym, deleteGym,getSingleGym, dashboardAdmin, getNearbyGyms } from "../controller/gymAddController.js"
import { addStaff, deleteStaff, getStaff, staffId, updateStaff } from "../controller/staffMember.js";
import { protectRoute,getUser } from "@kinde-oss/kinde-node-express";
import { createPayment, verifyPayment, handleCashfreeWebhook, getPaymentDetails,getPaymentByOrderId , getUserBookingHistory, getOwnerBookings, adminUserDetails, userBookingDashboard, checkActiveBooking,updateVisitingTime } from "../controller/cashfree.js";
import {handleWebhook} from "../controller/kindeController.js" 
import multer from "multer";
const storage = multer.memoryStorage(); // or use diskStorage if you want to store locally
const upload = multer({ storage });

const router = express.Router();


router.post("/register", registerOrLoginUser)
router.get("/user", getUserByEmail)

// router.post('/addgym', upload.single('image'), addGym);
router.post('/addgym',protectRoute,getUser,upload.single('image'),addGym);
router.get("/getGym", protectRoute, getUser , getGym);
router.get("/get-gym-city", protectRoute, getUser, getGymCity)
router.get("/getSingleGym/:id",protectRoute,getUser, getSingleGym)
router.put("/updateGym/:id",protectRoute,getUser, upload.single('image'), updateGym);
router.delete("/deleteGym/:id", protectRoute,getUser ,deleteGym);

// Gym fetch According Current Location
router.get("/nearby-gyms",protectRoute,getUser,getNearbyGyms)

// dashboard data fetch for Admin
router.get("/dashboard-stats", protectRoute,getUser,dashboardAdmin)

// Staff of Gyms
router.post("/addstaff",protectRoute,getUser, addStaff)
router.get("/getStaff/:gymId",protectRoute,getUser , getStaff)
router.get("/staff/:id",protectRoute,getUser, staffId)
router.put("/updateStaff/:id",protectRoute,getUser, updateStaff)
router.delete("/deleteStaff/:id",protectRoute,getUser, deleteStaff)


// cashfree 
router.post('/createCashfreeOrder', protectRoute,getUser,createPayment)
router.get('/verify-payment/:orderId', verifyPayment);
router.get('/confirm-payment/:orderId', protectRoute, getUser, verifyPayment);
router.post("/cashfree/payment-status", protectRoute,getUser, handleCashfreeWebhook);
router.get("/getPaymentDetails/:userId/:bookingId", protectRoute,getUser, getPaymentDetails);

router.get("/getPaymentByOrderId/:orderId", getPaymentByOrderId);

// update time 
router.put('/update-visiting-time/:userId',protectRoute,getUser,updateVisitingTime)


router.get("/getUserBookingHistory", protectRoute,getUser, getUserBookingHistory)

router.get("/owner-booking", protectRoute,getUser, getOwnerBookings)

// get user by date
router.get('/admin-user-details', protectRoute,getUser, adminUserDetails)


// dashboard data fetch for customer
router.get("/user-booking/:userId" , protectRoute,getUser,userBookingDashboard)

// get Same Active Membership
router.get('/booking-active/:userId/:gymId', protectRoute,getUser, checkActiveBooking)


// kinde Webhook
router.post('/kinde-webhook',handleWebhook)




export default router;

