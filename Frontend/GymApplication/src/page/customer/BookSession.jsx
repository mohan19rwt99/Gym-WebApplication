import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useKindeAuth } from '@kinde-oss/kinde-auth-react'
import { useParams } from 'react-router-dom';

function BookSession() {
  const [history, setHistory] = useState([])
  const { getToken } = useKindeAuth();


  useEffect(() => {
    const getHistory = async () => {
      try {
        const token = await getToken()
        const response = await axios.get("http://localhost:4000/api/payment/getUserBookingHistory", {
          headers: { Authorization: `Bearer ${token}` }
        })
        console.log("Response from Data and Other", response.data.bookingHistory)
        setHistory(response.data.bookingHistory)
      } catch (error) {
        console.log("Errorr", error)
      }
    }
    getHistory();
  }, [getToken])


  return (
    <>
      <div className='container mx-auto p-4'>
        <h1 className='text-center mb-5 text-2xl font-bold'>Booking History</h1>


        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Gym name
                </th>
                <th scope="col" className="px-6 py-3">
                  Starting Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Ending Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Plan
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((booking, index)=> (
                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                  <td className="px-6 py-4">
                    {booking.gymNames}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(booking.startDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      timeZone: 'Asia/Kolkata'
                    })}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(booking.endDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      timeZone: 'Asia/Kolkata'
                    })}
                  </td>
                  <td className="px-6 py-4">
                    {booking.selectedPlan}
                  </td>
                </tr>
              )
              )}
            </tbody>
          </table>
        </div>

      </div>
    </>
  )
}

export default BookSession
