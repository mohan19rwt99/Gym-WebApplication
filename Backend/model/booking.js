import mongoose from "mongoose";

const bookingTimeSlotSchema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  slotId: { type: mongoose.Schema.Types.ObjectId, required: true },
  status: { 
    type: String, 
    enum: ['booked', 'cancelled', 'completed'], 
    default: 'booked' 
  }
});

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
    bookingTimeSlots: [bookingTimeSlotSchema], 
    isActive: { type: Boolean, default: true } 

  }, { timestamps: true, toJSON: { virtuals: true },
  toObject: { virtuals: true }  });

// Add indexes for better query performance
paymentSchema.index({ userId: 1 });
paymentSchema.index({ gymId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ orderId: 1 }, { unique: true });

// Virtual for formatted dates if needed
paymentSchema.virtual('formattedStartDate').get(function() {
  return this.startDate.toLocaleDateString('en-IN');
});

paymentSchema.virtual('formattedEndDate').get(function() {
  return this.endDate.toLocaleDateString('en-IN');
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
