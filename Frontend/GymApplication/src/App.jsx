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
import BookDetails from './page/Book And Gym Details/BookDetails';
import CheckPrice from './page/Book And Gym Details/CheckPrice';
import Confirm from './page/Book And Gym Details/Confirm';
import CustomerHistory from './admin/CustomerHistory';
import AdminUserFiltter from './admin/AdminUserFiltter';
import CustomerDashboard from './customerDashboard/CustomerDashboard';

function PrivateRoute({ element, requiredPermission }) {
    const { isAuthenticated, isLoading, getPermissions} = useKindeAuth();
    
    const [permissions, setPermissions] = useState([]);
    const [loadingPermissions, setLoadingPermissions] = useState(true);

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const { permissions: userPermissions } = await getPermissions();
                console.log("User Permissions:", userPermissions);
                setPermissions(userPermissions || []);
                setLoadingPermissions(false);
            } catch (error) {
                console.error("Error fetching permissions:", error);
                setLoadingPermissions(false);
            }
        };
        fetchPermissions();
    }, [getPermissions]);

    if (isLoading || loadingPermissions) return <p>Loading...</p>;

    if (!isAuthenticated) return <Navigate to="/home" />;

    // Check if user has the required permission
    if (requiredPermission && !permissions.includes(requiredPermission)) {
        return <Navigate to="/unauthorized" />;
    }

    return element;
}


const router = createBrowserRouter([
    {
        path: "/home",
        element: <Home />
    },

    {
        path: "/",
        element: <Layout />, // Keep layout for shared components
        children: [
            {
                path: "welcome",
                element: <PrivateRoute element={<Welcome />} requiredPermission="manage_gyms" />
            },
            {
                index: true,
                element: <CallbackPage /> // Dynamically redirect based on role
            },
            {
                path: "customer-dashboard",
                element: <PrivateRoute element={<CustomerDashboard />} requiredPermission="view-gyms" />
            },
            {
                path: "add-gym",
                element: <PrivateRoute element={<AddGym />} requiredPermission="manage_gyms" />
            },
            {
                path: "gymdetails/:id",
                element: <PrivateRoute element={<GymDetails />} requiredPermission="manage_gyms" />
            },
            {
                path: "addmember",
                element: <PrivateRoute element={<AddMember />} requiredPermission="manage_gyms" />
            },
            {
                path: "book-session",
                element: <PrivateRoute element={<BookSession />} requiredPermission="view-gyms" />
            },
            {
                path: "editStaff/:id",
                element: <PrivateRoute element={<EditStaff />} requiredPermission="manage_gyms" />
            },
            {
                path: "new-gym-add",
                element: <PrivateRoute element={<NewGymAdd />} requiredPermission="manage_gyms" />
            },
            {
                path: "edit-gym/:id",
                element: <PrivateRoute element={<EditGym />} requiredPermission="manage_gyms" />
            },
            {
                path: "gym-list",
                element: <PrivateRoute element={<GymList />} requiredPermission="manage_gyms" />
            },
            {
                path: "manage-staff",
                element: <PrivateRoute element={<ManageStaff />} requiredPermission="manage:staff" />
            },
            {
                path: "manage-bookings",
                element: <PrivateRoute element={<ManageBookings />} requiredPermission="manage:bookings" />
            },
            {
                path: "view-schedules",
                element: <PrivateRoute element={<ViewSchedules />} requiredPermission="view-schedules" />
            },
            {
                path: "/callback",
                element: <CallbackPage />
            },
            {
                path: "browse-gyms",
                element: <PrivateRoute element={<BrowseGyms />} requiredPermission="view-gyms" />
            },
            {
                path: "*",
                element: <Navigate to="/unauthorized" />
            },
            {
                path: "book-details/:gymId",
                element: <PrivateRoute element={<BookDetails />} requiredPermission="view-gyms" />
            },
            {
                path: "check-price/:gymId",
                element: <PrivateRoute element={<CheckPrice />} requiredPermission="view-gyms" />
            },
            {
                path: "confirm-payment/:orderId",
                element: <PrivateRoute element={<Confirm />} requiredPermission="view-gyms" />
            },
            {
                path: "customer-history",
                element: <PrivateRoute element={<CustomerHistory />} requiredPermission="manage_gyms" />
            },
            {
                path: "admin-user-filtter",
                element: <PrivateRoute element={<AdminUserFiltter />} requiredPermission="manage_gyms" />
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