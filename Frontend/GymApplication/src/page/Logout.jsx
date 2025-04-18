import React from 'react'
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useNavigate } from 'react-router-dom';
import { CiLogout } from "react-icons/ci";

const Logout = ({isCollapsed}) => {
    const navigate = useNavigate();
    const {logout} = useKindeAuth();

    const handleLogout = () => {
        navigate("/home");
        logout();
    };
  return (
    <>
         <button
            onClick={handleLogout}

            className={`w-full text-white font-small py-1.5 px-2 rounded bg-purple-400 hover:bg-purple-700 flex items-center justify-center transition-all duration-300 cursor-pointer
            ${isCollapsed ? 'justify-center' : 'justify-start'} `}
            style={{fontSize: '14px'}}
        >
            <CiLogout size={24} className={`${isCollapsed ? 'mx-auto' : 'mr-10'}`}/>
            <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Logout</span>
        </button>
    </>
  )
}

export default Logout
