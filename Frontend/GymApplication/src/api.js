import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:4000/api/"
})


api.interceptors.request.use(
    (config) =>{
        const token = getKindeToken();
        console.log("Token", token)
        if(token) {
            config.headers.Authorization = `Bearer ${token}`
        }
    },
    (error) =>{
        return Promise.reject(error)
    }
)

export default api;