import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import { IoMdClose, IoIosApps } from 'react-icons/io';
import { AiOutlineHome, AiOutlineUser } from 'react-icons/ai';
import { MdAddBusiness } from 'react-icons/md';

const Sidebar = ({ permissions }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Sidebar Permissions:", permissions);  // Confirm here
    }, [permissions]);

    return (
        <div className={`bg-gray-800 text-white flex flex-col p-5 h-screen fixed top-0 left-0 
                        ${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300`}>

            {/* Hamburger Menu Toggle */}
            <div
                className="cursor-pointer mb-6 text-white"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                {isCollapsed ? <FiMenu size={28} /> : <IoMdClose size={28} />}
            </div>

            {/* Sidebar Links */}
            <nav>
                <ul className="space-y-3">

                    {/* Common Links for All Roles */}
                    <li
                        className="cursor-pointer hover:bg-gray-700 p-2 rounded flex items-center"
                        onClick={() => navigate('/')}
                    >
                        <AiOutlineHome size={24} className="mr-3" />
                        {!isCollapsed && 'Dashboard'}
                    </li>

                    {/* Admin Links */}
                    {permissions.includes('manage_gyms') && (
                        <>
                            <li
                                className="cursor-pointer hover:bg-gray-700 p-2 rounded flex items-center"
                                onClick={() => navigate('/add-gym')}
                            >
                                <MdAddBusiness size={24} className="mr-3" />
                                {!isCollapsed && 'Add Gym'}
                            </li>
                            <li
                                className="cursor-pointer hover:bg-gray-700 p-2 rounded flex items-center"
                                onClick={() => navigate('/users')}
                            >
                                <AiOutlineUser size={24} className="mr-3" />
                                {!isCollapsed && 'Users'}
                            </li>
                            <li
                                className="cursor-pointer hover:bg-gray-700 p-2 rounded flex items-center"
                                onClick={() => navigate('/gym-list')}
                            >
                                <IoIosApps size={24} className="mr-3" />
                                {!isCollapsed && 'Gym List'}
                            </li>
                        </>
                    )}

                    {/* Customer Links */}
                    {permissions.includes('view-gyms') && (
                        <>
                            <li
                                className="cursor-pointer hover:bg-gray-700 p-2 rounded flex items-center"
                                onClick={() => navigate('/browse-gyms')}
                            >
                                <AiOutlineUser size={24} className="mr-3" />
                                {!isCollapsed && 'Browser hello Gyms'}
                            </li>
                            <li
                                className="cursor-pointer hover:bg-gray-700 p-2 rounded flex items-center"
                                onClick={() => navigate('/book-session')}
                            >
                                <AiOutlineUser size={24} className="mr-3" />
                                {!isCollapsed && 'Book a Session'}
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
