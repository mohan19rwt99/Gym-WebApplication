import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const INSTAMOJO_CLIENT_ID = process.env.INSTAMOJO_CLIENT_ID;
const INSTAMOJO_CLIENT_SECRET = process.env.INSTAMOJO_CLIENT_SECRET;
const INSTAMOJO_BASE_URL = "https://api.instamojo.com"; // Production URL

export const getAccessToken = async () => {
    try {
        const response = await axios.post(
            `${INSTAMOJO_BASE_URL}/oauth2/token/`,
            new URLSearchParams({
                grant_type: "client_credentials",
                client_id: INSTAMOJO_CLIENT_ID,
                client_secret: INSTAMOJO_CLIENT_SECRET
            }),
            {
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            }
        );

        console.log(" Access Token:", response.data.access_token);
        return response.data.access_token;
    } catch (error) {
        console.error("Token Error:", error.response ? error.response.data : error.message);
    }
};
