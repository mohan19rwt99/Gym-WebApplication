import { assignRoleToUser } from "../services/kindeServices.js";

export const handleWebhook = async (req, res) => {
    const event = req.body;

    if (event.type === "user.created") {
        const user = event.data;

        const { id: userId, org_code: orgCode } = user;

        let roleKey = null;

        if (orgCode === "org_25b77b34feb7") {
            roleKey = "admin";
        } else if (orgCode === "org_4758b1358ddd") {
            roleKey = "customer";
        }

        if (!roleKey) {
            console.log("\u274C Unknown org code. Role not assigned.");
            return res.sendStatus(400);
        }

        try {
            await assignRoleToUser(userId, roleKey, orgCode);
            console.log(`\u2705 Role '${roleKey}' assigned to ${user.email}`);
        } catch (error) {
            console.log("\u274C Role Assignment failed:", error.message);
        }
    }

    res.sendStatus(200);
};
