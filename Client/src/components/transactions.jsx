import Navbar from './navbar'
import { useState, useContext, useEffect } from 'react'
import { AuthContext } from './AuthContext';
import axios from 'axios'
import dayjs from 'dayjs';

const transactions = () => {
  const { token } = useContext(AuthContext);

  const [transactions, settransactions] = useState([])

  useEffect(() => {
    axios.get('https://stoxy.onrender.com/all-transactions', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => { settransactions(response.data) })
  }, [])


  return (
    <>
      <div className='bg-[#F7F6F9] w-screen h-screen'>
        <Navbar />

        <h1 className='font-medium text-xl m-3 mt-5 ml-5'>Transaction History</h1>

        <div className='mt-5 w-screen bg-white  rounded-md border-solid border-[1px] border-gray-300'>
          <ul className="grid grid-cols-5 text-xs md:text-lg text-center font-semibold py-2 text-gray-600">
            <li>Date</li>
            <li>Transaction Id</li>
            <li>Type</li>
            <li>Details</li>
            <li>Amount</li>
          </ul>

          {transactions
            .slice()
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((value, index) => (
              <ul className="grid grid-cols-5 text-xs md:text-lg text-center font-semibold py-2 " key={index}>
                <li className='text-lg'>{dayjs(value.date).format('DD-MM-YYYY')}</li>
                <li className='font-normal'>{value.tid}</li>
                <li>
                  <span className={`px-2 py-1 rounded-lg ${value.type == 'Buy' ? 'text-green-500' : 'text-red-500'} ${value.type == 'Buy' ? 'bg-green-200' : 'bg-red-200'}`}>
                    {value.type}
                  </span>
                </li>
                <li>
                  {value.stock} <br />
                  <div className='font-light'>{value.quantity} shares @ ₹{value.price}</div>
                </li>
                <li className={`${value.type == 'Buy' ? 'text-red-500' : 'text-green-500'} text-lg`}>₹{value.amount}</li>
              </ul>
            ))}

        </div>

      </div>
    </>
  )
}

export default transactions