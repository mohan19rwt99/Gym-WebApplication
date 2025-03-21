import Staff from "../model/staff.js";


// Add Staff 
export const addStaff = async (req,res)=>{
    const {name, email, number, role, gymId} = req.body;
    // console.log("Incoming Data:", { name, email, number, role, gymId });

    if(!name || !email || !number || !role || !gymId) {
        return res.status(400).json({msg:"All fields Are Required"})
    }

    if(!/^\d{10}$/.test(number)){
        return res.status(400).json({msg:"Contact Number must be exactly 10 digit"})
    }

    try{
        const existingStaff = await Staff.findOne({"email":email})
        console.log("existingStaff", existingStaff)
        if(existingStaff){
            return res.status(400).json({msg:"Email Already Existest"})
        }
        const staff = await Staff.create({gymId,name,email, number,role})
        res.status(200).json({msg:"Staff Member is succesfully add", staff})
    } catch (error){
        console.log("Error console", error)
        res.status(500).json({message:"server error"})
    }
}

// get staff members list

export const getStaff = async (req,res)=>{
    try{
        const { gymId } = req.params;
        // console.log("STAFF",gymId)

        const response = await Staff.find({gymId: gymId})
        if(!response || response.length === 0){
            return res.status(400).json({msg:"No Staff member found"})
        }
        res.json(response)
    }catch(error){
        res.status(500).json({message:"server error"})
    }
}

// getStaffByID

export const staffId = async(req,res)=>{
    console.log("Request Params:", req.params);  
    try {
        const staff = await Staff.findById(req.params.id);
        if(!staff){
            return res.status(404).json({msg:"Staff Member is Not Found"})
        }
        res.status(200).json(staff)
    } catch (error) {
        res.status(500).json({message:"server error"})
    }
}

//update Staff members

export const updateStaff = async (req, res)=>{
    const {id} = req.params;
    const {name, email, number,role} = req.body;

    if (!/^\d{10}$/.test(number)) {
        return res.status(400).json({ msg: "Contact number must be exactly 10 digits" });
    }


    try{
        const staff = await Staff.findByIdAndUpdate(
            id,
            {name,email,number,role},
            {new:true}
        )
        if(!staff){
            return res.status(404).send("Staff is not found")
        }
        res.send("Staff Member is update succesfully")
    }catch(error){
        res.status(500).json({message:"server error"})
    }
}

// delete Staff Members

export const deleteStaff = async(req,res)=>{
    const {id} = req.params;
    try {
        const staffDelete = await Staff.findByIdAndDelete(id)
        if(!staffDelete){
            return res.status(400).send("Staff member is not found")
        }
        res.status(200).json("staff membere is succsefully delete")
    } catch (error) {
        res.status(500).json({message:"server error"})
    }
}