import { getUser } from "@kinde-oss/kinde-node-express";

const protectRoute = async (req,res, next)=>{

    try {
        const token = req.headers.authorization?.split(" ")[1];
        const user = await getUser({token})

        if(!user){
            return res.status(401).json({message:"Unauthorized - Please log in" })
        }
        req.user = user; // Attach user data to request
        next();
    } catch (error) {
        console.error("Auth Error:", error.message);
        res.status(500).json({ message: "Server Error" });
    }

}

export default protectRoute;