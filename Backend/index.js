import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from './routes/authRotes.js';
import { setupKinde, GrantType } from "@kinde-oss/kinde-node-express";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());



// Kinde Authentication Config
const config = {
  clientId: process.env.KINDE_CLIENT_ID,  
  issuerBaseUrl: process.env.KINDE_ISSUER_URL,
  siteUrl: process.env.KINDE_SITE_URL,
  secret: process.env.KINDE_CLIENT_SECRET, 
  redirectUrl: process.env.KINDE_REDIRECT_URI,
  scope: "openid profile email",
  grantType: GrantType.AUTHORIZATION_CODE, 
  unAuthorisedUrl: "http://localhost:3000/unauthorised",
  postLogoutRedirectUrl: process.env.KINDE_LOGOUT_REDIRECT_URI,
};

console.log("KINDE_REDIRECT_URI:", process.env.KINDE_REDIRECT_URI);
console.log("KINDE_LOGOUT_REDIRECT_URI:", process.env.KINDE_LOGOUT_REDIRECT_URI);

setupKinde(config, app);

// Routes
app.use("/api", authRoutes);
app.use("/api/payment", authRoutes)

// Database connection
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
