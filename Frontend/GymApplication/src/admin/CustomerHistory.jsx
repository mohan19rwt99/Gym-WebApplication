import React, { useEffect, useState } from 'react';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import axios from 'axios';
import Pagination from './pagination/Pagination';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 

function CustomerHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getToken } = useKindeAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [customerPerPage] = useState(3);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = await getToken();
                const response = await axios.get('http://localhost:4000/api/owner-booking', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log("Response for Owner Booking", response.data.bookings);

                if (Array.isArray(response.data.bookings)) {
                    setHistory(response.data.bookings);
                } else {
                    console.log("Unexpected Error Format", response.data);
                    setHistory([]);
                }
            } catch (error) {
                console.error("Error fetching owner bookings:", error);
                setHistory([]);
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchHistory();
    }, [getToken]);

    const indexOfLastCustomer = currentPage * customerPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customerPerPage;
    const cuurentCustomer = history.slice(indexOfFirstCustomer, indexOfLastCustomer);
    const totalPages = Math.ceil(history.length / customerPerPage);

    const handleDownload = () => {
        if (cuurentCustomer.length === 0) return;
    
        const doc = new jsPDF();
    
        const tableColumn = ["Customer Name", "Gym Name", "Starting Date", "Ending Date", "Plan", "Payment"];
        const tableRows = [];
    
        cuurentCustomer.forEach(booking => {
            const bookingData = [
                booking.buyer_name,
                booking.gymNames,
                new Date(booking.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Kolkata' }),
                new Date(booking.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Kolkata' }),
                booking.selectedPlan,
                booking.status || 'N/A'
            ];
            tableRows.push(bookingData);
        });
    
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
        });
    
        doc.save('Customer_History.pdf');
    };
    

    return (
        <>
            <div className='container mx-auto p-4'>
                <h1 className='text-3xl font-bold text-center'>Customer History</h1>
                <div className='relative overflow-x-auto mt-5'>
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                            <tr>
                                <th className="px-6 py-3">Customer Name</th>
                                <th className="px-6 py-3">Gym Name</th>
                                <th className="px-6 py-3">Starting Date</th>
                                <th className="px-6 py-3">Ending Date</th>
                                <th className="px-6 py-3">Plan</th>
                                <th className="px-6 py-3">Payment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">
                                        <div className="flex items-center justify-center w-full h-16 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                                            <div role="status">
                                                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="..." fill="currentColor" />
                                                    <path d="..." fill="currentFill" />
                                                </svg>
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : cuurentCustomer.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-gray-600 dark:text-gray-300">
                                        No user found
                                    </td>
                                </tr>
                            ) : (
                                cuurentCustomer.map((booking, index) => (
                                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                        <td className="px-6 py-4">{booking.buyer_name}</td>
                                        <td className="px-6 py-4">{booking.gymNames}</td>
                                        <td className="px-6 py-4">{new Date(booking.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Kolkata' })}</td>
                                        <td className="px-6 py-4">{new Date(booking.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Kolkata' })}</td>
                                        <td className="px-6 py-4">{booking.selectedPlan}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                booking.status === "completed" ? 'bg-green-100 text-green-800' :
                                                booking.status === "pending" ? 'bg-yellow-100-text-yellow-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {booking.status || 'N/A'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        <button
                        className="px-4 py-2 mt-4 bg-[#D4C9BE] text-white rounded-lg hover:bg-[#7a7067] transition-colors cursor-pointer duration-300" 
                        onClick={handleDownload}>
                        Download PDF
                    </button>
                    </table>
                   
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}/>
                </div>
            </div>
        </>
    );
}

export default CustomerHistory;