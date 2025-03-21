// import express from "express";
// import dotenv from "dotenv";
// import { setupKinde, protectRoute, getUser, GrantType } from "@kinde-oss/kinde-node-express";

// dotenv.config();

// const app = express();

// Kinde Authentication Config
// const config = {
//   clientId: process.env.KINDE_CLIENT_ID || "0977e354075849b2a93183c13bdc9f07",
//   issuerBaseUrl: "https://alfaintellitech.kinde.com",
//   siteUrl: "http://localhost:3000",
//   secret: process.env.KINDE_CLIENT_SECRET || "<YOUR_CLIENT_SECRET>",
//   redirectUrl: "http://localhost:3000",
//   scope: "openid profile email",
//   grantType: GrantType.AUTHORIZATION_CODE, // AUTHORIZATION_CODE, CLIENT_CREDENTIALS, or PKCE
//   unAuthorisedUrl: "http://localhost:3000/unauthorised",
//   postLogoutRedirectUrl: "http://localhost:3000"
// };

// Setup Kinde Authentication Middleware
// setupKinde(config, app);

// Middleware to Protect Routes
// export const requireAuth = async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   // ✅ Step 1: Token Check
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "Unauthorized: Token is required" });
//   }

//   const token = authHeader.split(" ")[1];
//   console.log("🔹 Token from Backend:", token);

//   try {
//       const user = await getUser({ token });

//       if (!user) {
//           console.log("🔴 No User Found - Likely Expired Token");
//           return res.status(401).json({ message: "Session expired, please log in again." });
//       }

//       console.log("✅ Verified User:", user);
//       req.ownerId = user.id;  // ✅ OwnerID ko assign karo
//       next(); // ✅ Proceed if authenticated

//   } catch (error) {
//       console.error("🔴 Token Validation Error:", error);

//       if (error.response && error.response.status === 401) {
//           return res.status(401).json({ message: "Session expired, please log in again." });
//       }

//       res.status(500).json({ message: "Server error during token verification." });
//   }
// };

// import { getUser } from "@kinde-oss/kinde-node-express";

// export const requireAuth = async (req, res, next) => {
//     const authHeader = req.headers.authorization;
    
    
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//         return res.status(401).json({ message: "Unauthorized: Token is required" });
//     }

//     const token = authHeader.split(" ")[1];

//     try {
//         console.log("hello")
//         const user = await getUser({ token });
//         console.log("user", user)
//         if (!user) {
//             return res.status(401).json({ message: "Session expired, please log in again." });
//         }

//         req.ownerId = user.id; // Ensure this matches your database logic
//         next();
//     } catch (error) {
//         console.error("Token validation error:", error.message);
//         res.status(500).json({ message: "Server error during token verification." });
//     }
// };





