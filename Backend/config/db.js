import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(" Connected to database");
    } catch (error) {
        console.error(" Not connected to database:", error.message);
        process.exit(1); // Exit process if DB fails to connect
    }
};

export default connectDB;