import mongoose from "mongoose";

const gymSchema = new mongoose.Schema({
    gymName: {
        type: String,
        required: [true, "Gym Name is required"],
        trim: true
    },
    address: {
        location: { type: String, required: true },
        place_id: { type: String },
        street: { type: String }
    },
    coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    pricing: {
        hourlyRate: { type: Number, required: true, min: 0 },
        weeklyRate: { type: Number, required: true, min: 0 },
        monthlyRate: { type: Number, required: true, min: 0 }
    },
    personalTrainerPricing: {
        hourlyRate: { type: Number, required: true, min: 0 },
        weeklyRate: { type: Number, required: true, min: 0 },
        monthlyRate: { type: Number, required: true, min: 0 }
    },
    timings: {
        morning: {
          openingTime: { type: Date, required: true },
          closingTime: { 
            type: Date, 
            required: true,
            validate: {
              validator: function(value) {
                return value && this.parent().openingTime && value.getTime() > this.parent().openingTime.getTime();
              },
              message: 'Morning closing time must be after opening time'
            }
          }
        },
        evening: {
          openingTime: { type: Date, required: true },
          closingTime: { 
            type: Date, 
            required: true,
            validate: {
              validator: function(value) {
                return value && this.parent().openingTime && value.getTime() > this.parent().openingTime.getTime();
              },
              message: 'Evening closing time must be after opening time'
            }
          }
        }
      },
    currency: {
        type: String,
        required: true,
        enum: ['INR', 'USD', 'EUR', 'GBP', 'JPY', 'RUB', 'KRW'],
        default: 'INR'
    },
    description: {
        type: String,
        required: true,
        maxlength: [500, "Description cannot be more than 500 characters"]
    },
    gymOwner: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Add index for geospatial queries if needed
gymSchema.index({ coordinates: '2dsphere' });

const GymAdd = mongoose.model("Gym", gymSchema);

export default GymAdd;