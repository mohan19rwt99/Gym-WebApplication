import express from "express"
// import requireAuth from "./middlewear.js"
import { registerOrLoginUser, getUserByEmail } from "../controller/authController.js"
import { addGym, getGym, updateGym, deleteGym,getSingleGym } from "../controller/gymAddController.js"
import { addStaff, deleteStaff, getStaff, staffId, updateStaff } from "../controller/staffMember.js";
import { protectRoute,getUser } from "@kinde-oss/kinde-node-express";
// import protectRoute from "../middlewear/checkRoutes.js";



const router = express.Router();


router.post("/register", registerOrLoginUser)
router.get("/user", getUserByEmail)

router.post('/addgym', protectRoute, getUser, addGym);
router.get("/getGym", protectRoute, getUser , getGym);
router.get("/getSingleGym/:id",protectRoute,getUser, getSingleGym)
router.put("/updateGym/:id",protectRoute,getUser, updateGym);
router.delete("/deleteGym/:id", protectRoute,getUser ,deleteGym);

// Staff of Gyms
router.post("/addstaff",protectRoute,getUser, addStaff)
router.get("/getStaff/:gymId",protectRoute,getUser , getStaff)
router.get("/staff/:id",protectRoute,getUser, staffId)
router.put("/updateStaff/:id",protectRoute,getUser, updateStaff)
router.delete("/deleteStaff/:id",protectRoute,getUser, deleteStaff)


export default router;

