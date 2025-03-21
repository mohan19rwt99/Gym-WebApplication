import mongoose from "mongoose";

const gymSchema = new mongoose.Schema({
    gymName: {
        type: String,
        required: [true, "Gym Name is required"],
        trim: true
    },
    location: {
        type: String,
        required: [true, "Location is required"],
        trim: true
    },
    pricing: {
        hourlyRate: {
            type: Number,
            required: true, min: 0
        },
        weeklyRate: {
            type: Number,
            required: true, min: 0
        },
        monthlyRate: {
            type: Number,
            required: true, min: 0
        }
    },
    personalTrainerPricing: {
        hourlyRate: {
            type: Number,
            required: true, min: 0
        },
        weeklyRate: {
            type: Number,
            required: true, min: 0
        },
        monthlyRate: {
            type: Number,
            required: true, min: 0
        }
    },
    openingTime: {
        type: String,
        required: [true, "Opening time is required"]
    },
    closingTime: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return value > this.openingTime;
            },
            message: 'Closing time must be after opening time'
        }
    },
    
    description: {
        type: String,
        maxlength: [500, "Description can not be more then 500 charachters"]
    },
    gymOwner:{
        type: String,
        required: true
    }
}
    , {
        timestamps: true
    })

const GymAdd = mongoose.model("gym", gymSchema)

export default GymAdd;