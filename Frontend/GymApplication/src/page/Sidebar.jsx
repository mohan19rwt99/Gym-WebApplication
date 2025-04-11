import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import { IoMdClose, IoIosApps } from 'react-icons/io';
import { AiOutlineHome, AiOutlineUser } from 'react-icons/ai';
import { MdAddBusiness, MdList } from 'react-icons/md';
import Logout from './Logout';
import { FaSearchLocation } from "react-icons/fa";
import { TbBrandBooking } from "react-icons/tb";


const Sidebar = ({ permissions, isCollapsed, setIsCollapsed }) => {
    const navigate = useNavigate();

    return (
        <div className={`bg-[#333333] text-white flex flex-col p-4 h-screen fixed top-0 left-0 
                        ${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 overflow-hidden`}>

            <div
                className="cursor-pointer mb-6 text-white"
                onClick={() => setIsCollapsed(!isCollapsed)} // Corrected line
            >
                {isCollapsed ? <FiMenu size={28} /> : <IoMdClose size={28} />}
            </div>

            <nav>
                <ul className="space-y-3">


                    {permissions && permissions.includes('manage_gyms') && (
                        <>
                            <li
                                className="cursor-pointer hover:bg-gray-700 p-2 rounded flex items-center"
                                onClick={() => navigate('/')}
                            >
                                <AiOutlineHome size={24} className="mr-3" />
                                <span className={`whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'} transition-opacity duration-200 delay-100`}>
                                    Dashboard
                                </span>

                            </li>
                            <li
                                className="cursor-pointer hover:bg-gray-700 p-2 rounded flex items-center"
                                onClick={() => navigate('/add-gym')}
                            >
                                <MdAddBusiness size={24} className="mr-3" />
                                <span className={`whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'} transition-opacity duration-200 delay-100`}>
                                    Add Gym
                                </span>
                            </li>
                            <li
                                className="cursor-pointer hover:bg-gray-700 p-2 rounded flex items-center"
                                onClick={() => navigate('/customer-history')}
                            >
                                <AiOutlineUser size={24} className="mr-3" />
                                <span className={`whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'} transition-opacity duration-200 delay-100`}>
                                    Customer List
                                </span>
                            </li>
                            <li
                                className="cursor-pointer hover:bg-gray-700 p-2 rounded flex items-center"
                                onClick={() => navigate('/gym-list')}
                            >
                                <IoIosApps size={24} className="mr-3" />
                                <span className={`whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'} transition-opacity duration-200 delay-100`}>
                                    Add Staff
                                </span>
                            </li>

                            <li
                                className="cursor-pointer hover:bg-gray-700 p-2 rounded flex items-center"
                                onClick={() => navigate('/admin-user-filtter')}
                            >
                                <MdList size={24} className="mr-3" />
                                <span className={`whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'} transition-opacity duration-200 delay-100`}>
                                    Today Schedule
                                </span>
                            </li>
                        </>
                    )}

                    {permissions && permissions.includes('view-gyms') && (
                        <>
                         <li
                                className="cursor-pointer hover:bg-gray-700 p-2 rounded flex items-center"
                                onClick={() => navigate('/customer-dashboard')}
                            >
                                <AiOutlineUser size={24} className="mr-3" />
                                <span className={`whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'} transition-opacity duration-200 delay-100`}>
                                    Dashboard
                                </span>
                            </li>
                            <li
                                className="cursor-pointer hover:bg-gray-700 p-2 rounded flex items-center"
                                onClick={() => navigate('/browse-gyms')}
                            >
                                <FaSearchLocation size={24} className="mr-3" />
                                <span className={`whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'} transition-opacity duration-200 delay-100`}>
                                    Gyms Near You
                                </span>
                            </li>
                            <li
                                className="cursor-pointer hover:bg-gray-700 p-2 rounded flex items-center"
                                onClick={() => navigate('/book-session')}
                            >
                                <TbBrandBooking size={24} className="mr-3"/>
                                <span className={`whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'} transition-opacity duration-200 delay-100`}>
                                    Book a Seesion
                                </span>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
            <div className='mt-auto'>
                <Logout isCollapsed={isCollapsed} />
            </div>
        </div>
    );
};

export default Sidebar;