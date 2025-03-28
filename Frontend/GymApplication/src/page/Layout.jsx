import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import Sidebar from './Sidebar';

const Layout = () => {
    const [permissions, setPermissions] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { getPermissions } = useKindeAuth();

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const { permissions: userPermissions } = await getPermissions();
                setPermissions(userPermissions || []);
            } catch (error) {
                console.error("Error fetching permissions:", error);
            }
        };
        fetchPermissions();
    }, [getPermissions]);

    return (
        <div className="flex min-h-screen bg-green-100">
            <Sidebar permissions={permissions} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <div className={`flex-1 h-screen overflow-y-auto p-6 ${isCollapsed ? 'pl-20' : 'pl-64'} transition-all duration-300`}>
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;