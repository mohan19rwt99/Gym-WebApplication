import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const {
    KINDE_M2M_CLIENT_ID,
    KINDE_M2M_CLIENT_SECRET,
    KINDE_TOKEN_URL,
    KINDE_API_BASE_URL
} = process.env;

let cachedToken = null;
let tokenExpiry = null;

const getM2MToken = async () => {
    const now = Math.floor(Date.now() / 1000);

    if (cachedToken && tokenExpiry && now < tokenExpiry - 60) {
        return cachedToken;
    }

    const response = await axios.post(
        KINDE_TOKEN_URL,
        new URLSearchParams({
            grant_type: "client_credentials",
            client_id: KINDE_M2M_CLIENT_ID,
            client_secret: KINDE_M2M_CLIENT_SECRET,
            audience: `${KINDE_API_BASE_URL}`,
        }),
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );

    cachedToken = response.data.access_token;
    tokenExpiry = now + response.data.expires_in;

    return cachedToken;
};

// export const assignRoleToUser = async (userId, roleKey, orgCode) => {
//     const token = await getM2MToken();

//     await axios.post(
//         `${KINDE_API_BASE_URL}/v1/roles/assign`, // Corrected URL
//         {
//             user_id: userId,
//             role_key: roleKey,
//             org_code: orgCode,
//         },
//         {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "application/json",
//             },
//         }
//     );
// };

export const assignRoleToUser = async (userId, roleKey) => {
    try {
        const token = await getM2MToken(); // Ensure this fetches a valid token
        const response = await axios.post(
            `${KINDE_API_BASE_URL}/v1/roles/assign`, // Correct endpoint
            {
                user_id: userId,
                role_key: roleKey,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("Role assigned successfully:", response.data);
    } catch (error) {
        console.error("Error assigning role:", error.response?.data || error.message);
    }
};
