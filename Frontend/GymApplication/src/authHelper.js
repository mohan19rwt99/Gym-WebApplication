    import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

    export const getKindeToken = async ()=>{
        const {getToken} = useKindeAuth();
        return await getToken();
    }