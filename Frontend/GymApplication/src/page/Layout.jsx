import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import Sidebar from './Sidebar';

const Layout = () => {
    const [permissions, setPermissions] = useState([]);
    const { getPermissions } = useKindeAuth();

    // Fetch permissions when component mounts
    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const { permissions: userPermissions } = await getPermissions();
                // console.log("Fetched permissions:", userPermissions); 
                setPermissions(userPermissions || []);
            } catch (error) {
                console.error("Error fetching permissions:", error);
            }
        };
        fetchPermissions();
    }, [getPermissions]);

    return (
        <div className="flex min-h-screen bg-green-100">
            {/* Sidebar */}
            <Sidebar permissions={permissions} />

            {/* Main Content Area */}
            <div className="flex-1 h-screen overflow-y-auto p-6 pl-64">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
