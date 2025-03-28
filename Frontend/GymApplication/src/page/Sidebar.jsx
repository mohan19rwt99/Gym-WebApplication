import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import { IoMdClose, IoIosApps } from 'react-icons/io';
import { AiOutlineHome, AiOutlineUser } from 'react-icons/ai';
import { MdAddBusiness } from 'react-icons/md';

const Sidebar = ({ permissions, isCollapsed, setIsCollapsed }) => {
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Sidebar Permissions:", permissions);
    }, [permissions]);

    return (
        <div className={`bg-gray-800 text-white flex flex-col p-4 h-screen fixed top-0 left-0 
                        ${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 overflow-hidden`}>

            <div
                className="cursor-pointer mb-6 text-white"
                onClick={() => setIsCollapsed(!isCollapsed)} // Corrected line
            >
                {isCollapsed ? <FiMenu size={28} /> : <IoMdClose size={28} />}
            </div>

            <nav>
                <ul className="space-y-3">
                    <li
                        className="cursor-pointer hover:bg-gray-700 p-2 rounded flex items-center"
                        onClick={() => navigate('/')}
                    >
                        <AiOutlineHome size={24} className="mr-3" />
                        <span className={`whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'} transition-opacity duration-200 delay-100`}>
                            Dashboard
                        </span>
                    
                    </li>

                    {permissions && permissions.includes('manage_gyms') && (
                        <>
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
                                    Gym List
                                </span>
                            </li>
                        </>
                    )}

                    {permissions && permissions.includes('view-gyms') && (
                        <>
                            <li
                                className="cursor-pointer hover:bg-gray-700 p-2 rounded flex items-center"
                                onClick={() => navigate('/browse-gyms')}
                            >
                                <AiOutlineUser size={24} className="mr-3" />
                                <span className={`whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'} transition-opacity duration-200 delay-100`}>
                                    Gyms Near You
                                </span>
                            </li>
                            <li
                                className="cursor-pointer hover:bg-gray-700 p-2 rounded flex items-center"
                                onClick={() => navigate('/book-session')}
                            >
                                <AiOutlineUser size={24} className="mr-3" />
                                 <span className={`whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'} transition-opacity duration-200 delay-100`}>
                                    Book a Seesion
                                </span>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;