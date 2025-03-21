import { getUser } from "@kinde-oss/kinde-node-express";

const checkPermission = (requiredPermission) => async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }

        const user = await getUser({ token });

        if (!user) {
            return res.status(401).json({ message: "Unauthorized - Please log in" });
        }

        if (!user.permissions || !user.permissions.includes(requiredPermission)) {
            return res.status(403).json({ message: "Access Denied - Insufficient Permissions" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Permission Error:", error); // Log full error object
        res.status(500).json({ message: "Server Error" });
    }
};

export default checkPermission;