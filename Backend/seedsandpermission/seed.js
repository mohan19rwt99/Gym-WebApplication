import mongoose from "mongoose";
import dotenv from "dotenv"
import Role from "../model/roleModel.js";
import Permissions from "../model/permissionModel.js";

dotenv.config(); 
console.log("MongoDB URI from .env:", process.env.DATABASE_URL);
const mongoURI = process.env.DATABASE_URL;  // Correct variable name

if (!mongoURI) {
    console.error("MongoDB URI is missing! Check your .env file.");
    process.exit(1); // Exit if URI is undefined
}

mongoose.connect(mongoURI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Seed Permission
const permissions =[
    "addGym", "editGym", "deleteGym", "viewBookings", "manageUsers", "manageStaff", "viewSchedules", "bookSessions", "managaeProfile"
]

const seedPermissions = async ()=>{
    await Permissions.deleteMany({});
    const createdPermissions = await Permissions.insertMany(
        permissions.map(permissionName=>({permissionName}))        
    )


    const permissionMap ={};
    createdPermissions.forEach(permission =>{
        permissionMap[permission.permissionName] =permission._id;        
    })

    //seed roles with Assigned Permission

    await Role.deleteMany({});
    await Role.insertMany([
        {
            roleName:"Admin",
            permissions: [
                permissionMap["addGym"],
                permissionMap["editGym"],
                permissionMap["deleteGym"],
                permissionMap["viewBookings"],
                permissionMap["manageUsers"],
                permissionMap["manageStaff"]
            ]
        },
        {
            roleName:"Manager",
            permissions: [
                permissionMap["viewBookings"],
                permissionMap["manageUsers"],
                permissionMap["manageStaff"]
            ]
        },
        {
            roleName:"Receptionist",
            permissions: [
                permissionMap["viewBookings"],
                permissionMap["viewSchedules"]
            ]
        },
        {
            roleName:"Trainer",
            permissions: [
                permissionMap["viewSchedules"],
            ]
        }
    ]);

    console.log("Roles and permission seeded successfully")
    process.exit();
}


seedPermissions();