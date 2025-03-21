import './App.css';
import Home from './Home';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Welcome from './page/Welcome';
import AddGym from './admin/AddGym';
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Navigate } from 'react-router-dom';
import AddMember from './page/Staff/AddMember';
import GymDetails from './page/Staff/GymDetails';
import EditStaff from './page/Staff/EditStaff';
import Layout from '../src/page/Layout';  // Import Layout
import NewGymAdd from './admin/NewGymAdd';
import EditGym from './admin/EditGym';
import GymList from './GymList/GymList';
import ManageStaff from './page/manage-staff/ManageStaff';
import ManageBookings from './page/receptionists/ManageBookings';
import ViewSchedules from './page/fortrainers/ViewSchedules';
import CallbackPage from './page/CallbackPage';
import { useState, useEffect } from 'react';
import BookSession from './page/customer/BookSession';
import BrowseGyms from './page/customer/BrowseGyms';

function PrivateRoute({ element, requiredPermission }) {
    const { isAuthenticated, isLoading, getPermissions } = useKindeAuth();
    const [permissions, setPermissions] = useState([]);

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

    if (isLoading) return <p>Loading...</p>;

    if (!isAuthenticated) return <Navigate to="/home" />;
    
    // if (requiredPermission && !permissions.includes(requiredPermission)) {
    //     return <Navigate to="/unauthorized" />;
    // }
    

    return element;
}


const router = createBrowserRouter([
    {
        path: "/home",
        element: <Home />
    },
    
    {
        path: "/",
        element: <Layout />, 
        children: [
            {
                index: true,
                element: <Welcome />
            },
            {
                path: "add-gym",
                element: <AddGym/>
            },
            {
                path: "gymdetails/:id",
                element: <GymDetails />
            },
            {
                path: "addmember",
                element: <PrivateRoute element={<AddMember />} requiredPermission="manage_gyms"/>
            },
            {
                path:"book-session",
                element:<PrivateRoute element={<BookSession/>} requiredPermission="view-gyms"/>
            },
            {
                path: "editStaff/:id",
                element: <PrivateRoute element={<EditStaff />} requiredPermission="manage_gyms"/>
            },
            {
                path: "newGymAdd",
                element: <PrivateRoute element={<NewGymAdd />} requiredPermission="manage_gyms"/>
            },
            {
                path: "editGym/:id",
                element: <PrivateRoute element={<EditGym />} requiredPermission="manage_gyms"/>
            },
            {
                path: "gym-list",
                element: <GymList />
            },
            { 
                path: "manage-staff", 
                element: <PrivateRoute element={<ManageStaff />} requiredPermission="manage:staff"/>
            },  
            { 
                path: "manage-bookings", 
                element: <PrivateRoute element={<ManageBookings />} requiredPermission="manage:bookings"/>
            },  
            { 
                path: "view-schedules", 
                element: <PrivateRoute element={<ViewSchedules />} requiredPermission="view-schedules"/>
            },
            {
                path:"/callback", 
                element:<CallbackPage/>
            },
            {
                path: "browse-gyms", 
                element: <PrivateRoute element={<BrowseGyms />} requiredPermission="view-gyms"/>
            },
            {
                path: "*",
                element: <Navigate to="/unauthorized" />
            }            
            
        ]
    }
]);

function App() {
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
