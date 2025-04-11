import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName :String,
    lastName:String,
    email:{type:String, unique:true, required: true},
    kindeId: String,
    role:String,
    orgCode: String,
})

const User = mongoose.model("User", userSchema);

export default User;