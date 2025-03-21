import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    roleName:{
        type:String,
        required: true,
        unique: true,
        enum: ["Admin", "Manager", "Receptionist", "Trainer", "Customer"]
    },
    permissions:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Permissions"
        }] 
},{timestamps:true})

const Role = mongoose.model("Role", roleSchema)

export default Role;