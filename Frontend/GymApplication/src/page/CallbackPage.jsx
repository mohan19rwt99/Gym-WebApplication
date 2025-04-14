import React, { useEffect, useState } from "react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useNavigate } from "react-router-dom";

const CallbackPage = () => {
    const { isAuthenticated, isLoading, getPermissions } = useKindeAuth();
    const [permissions, setPermissions] = useState([]);
    const [loadingPermissions, setLoadingPermissions] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const { permissions: userPermissions } = await getPermissions();
                setPermissions(userPermissions || []);
                setLoadingPermissions(false);
            } catch (error) {
                console.error("Error fetching permissions:", error);
                setLoadingPermissions(false);
            }
        };

        if (isAuthenticated) {
            fetchPermissions();
        } else {
            navigate("/home"); // Redirect to home if not authenticated
        }
    }, [isAuthenticated, getPermissions, navigate]);

    useEffect(() => {
        if (!isLoading && !loadingPermissions) {
            // Redirect based on permissions
            if (permissions.includes("manage_gyms")) {
                navigate("/welcome"); // Admin dashboard
            } else if (permissions.includes("view-gyms")) {
                navigate("/customer-dashboard"); // Customer dashboard
            } else {
                navigate("/unauthorized"); // Unauthorized page
            }
        }
    }, [isLoading, loadingPermissions, permissions, navigate]);

    if (isLoading || loadingPermissions) {
        return <p>Loading...</p>;
    }

    return <p>Redirecting...</p>;
};

export default CallbackPage;