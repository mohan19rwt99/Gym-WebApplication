import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    userId: { type: String },
    gymId: { type: mongoose.Schema.Types.ObjectId, ref: "Gym" },
    buyer_name: String,
    email: String,
    phone: String,
    selectedPlan: String,
    amount: Number,
    currency:{type:String, default: "INR"},
    status: { type: String, default: "pending" },
    transactionId: { type: String, default: null },
    startDate: Date,
    endDate: Date,
    gymNames: String,
    bookingDate: { type: String },
    bookingTime: { type: String },

  }, { timestamps: true });
const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
