import User from "../model/user.js"


export const registerOrLoginUser = async(req, res)=>{
    try{
        const {firstName, lastName, email, kindeId} = req.body;
        console.log("kindeId", kindeId)

        let user = await User.findOne({email});
        console.log("user", user)

        if(!user){
            user = new User({firstName, lastName, email, kindeId});
            await user.save();
            console.log("newuser", user)
        } else{
            user.firstName = firstName;
            user.lastName = lastName;
            user.kindeId = kindeId;
            await user.save()
            console.log("User Updated:", user);
        }

        return res.status(200).json({messagge: "user authenticated succesfully", 
            userId : user._id,
            user

        })
    }catch(error){
        console.log("Auth error", error)
        res.status(500).json({message:"Server Error", error})
    }
}

// Login 
export const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.query;
        console.log("Fetching user for email:", email);

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log("Fetched user:", user);
        res.status(200).json({ 
            userId: user._id,  
            user 
        });

    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Server Error", error });
    }
};




