import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
    permissionName:{
        type:String,
        required:true,
        unique:true
    }
}, {timestamps:true})

const Permissions = mongoose.model("Permission", permissionSchema)

export default Permissions;