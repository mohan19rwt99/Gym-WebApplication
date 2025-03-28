import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';

const Confirm = () => {
  const { bookingId } = useParams();
  const { getToken, user } = useKindeAuth();
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null)

  useEffect(() => {
    const fetchPaymentDetails = async (req, res) => {
      try {
        const token = await getToken();
        const response = await axios.get(`http://localhost:4000/api/getPaymentDetails/${user?.id}/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setPaymentDetails(response.data.paymentDetails);
        console.log("Payment Details", response.data.paymentDetails)
        setBookingDetails(response.data.paymentDetails);
      } catch (error) {
        console.log("Errro fetching Details", error)
      }

    }
    fetchPaymentDetails();
  }, [getToken, user?.id, bookingId])
  
  const handleBack = () => {
    navigate(-1);
  }

  return (
    <>
      <div className='container mx-auto p-6'>
        <button onClick={handleBack}
          className="mb-6 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-600 transition cursor-pointer">
          Back
        </button>
        <h1 className='text-3xl font-bold text-center mb-6'>Your Payment is Confirm</h1>
        {/* Payments Details */}
        {paymentDetails && (
          <div className='relative overflow-x-auto'>
            <h1 className='text-2xl font-bold'>{paymentDetails.gymNames}</h1>
              <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                  <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                      <tr>
                        <th scope="col" className='px-6 py-3'>
                            Booking Information   
                        </th>
                        <th scope="col" className='px-6 py-3'>
                            Details
                        </th>
                      </tr>
                  </thead>
                  <tbody>
                    <tr className='bg-white border-b hover:bg-gray-50'>
                      <th scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap'>
                        Booking Date
                      </th>
                      <td className='px-6 py-4'>{new Date(paymentDetails.startDate).toLocaleDateString('en-IN',{
                        day:'2-digit',
                        month:'2-digit',
                        year:'numeric',
                        timeZone:'Asia/Kolkata'
                      })}</td>
                    </tr>
                  </tbody>
                      {/* // Selected Plan */}
                  <tbody>
                    <tr className='bg-white border-b hover:bg-gray-50'>
                      <th scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap'>
                        MemberShip type
                      </th>
                      <td className='px-6 py-4'>{paymentDetails.selectedPlan}</td>
                    </tr>
                  </tbody>

                    {/* Amount paid */}
                  <tbody>
                    <tr className='bg-white border-b hover:bg-gray-50'>
                      <th scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap'>
                        Amount Paid
                      </th>
                      <td className='px-6 py-4'>₹{paymentDetails.amount}</td>
                    </tr>
                  </tbody>

                    {/* Staus of amount paid */}
                  <tbody>
                    <tr className='bg-white border-b hover:bg-gray-50'>
                      <th scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap'>
                        Payment Status
                      </th>
                      <td className='px-6 py-4'><span className='px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full'>{paymentDetails.status}</span></td>
                    </tr>
                  </tbody>

                  {/* Payment Date */}
                  <tbody>
                    <tr className='bg-white border-b hover:bg-gray-50'>
                      <th scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap'>
                        Payment Date
                      </th>
                      <td className='px-6 py-4'>{new Date(paymentDetails.startDate).toLocaleDateString('en-IN',{
                        day:'2-digit',
                        month:'2-digit',
                        year:'numeric',
                        timeZone:'Asia/Kolkata'
                      })}</td>
                    </tr>
                  </tbody>
                  
              </table>
          </div>
        )}
      </div>
    </>
  )
}

export default Confirm
