import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
    gymId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "gym",
      },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    number:{
        type:String,
        required:true
    },
    role:{
        type: String,
        required: true
    },
    
}, {collection: "staffMembers"})

const Staff = mongoose.model("Staff", staffSchema)

export default Staff;