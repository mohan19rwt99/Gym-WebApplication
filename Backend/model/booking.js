import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    userId:{type:String,required:true},
    gymId:{type:String, required:true},
    buyer_name:{type:String, reqired:true},
    email: { type: String, required: true },
    phone: { type: String, required: true },
    selectedPlan:{type:String, required:true},
    amount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ["pending", "successful", "cancelled"], 
        default: "pending" 
    },
    startDate:{type:Date,required:true},
    endDate:{type:Date,required:true},
    gymNames:{type:String, required:true},    
    createdAt: { type: Date, default: Date.now }
})

const Payment = mongoose.model("Payment", bookingSchema);

export default Payment;