import { useState, useContext, useEffect } from 'react'
import Navbar from './navbar'
import { InvestedContext, CurrentContext, PercentContext, HoldingsContext } from './contexts';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import Loader from './Loader';

const Portfolio = () => {
    const { invested, setInvested } = useContext(InvestedContext);
    const { current, setCurrent } = useContext(CurrentContext);
    const { percent, setPercent } = useContext(PercentContext);
    const { holdings, setHoldings } = useContext(HoldingsContext);
    const {token} = useContext(AuthContext);

    const [pl, setpl] = useState(0)
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        setLoading(true);
        const fetchHoldings = async () => {
            try {
                const response = await axios.get('https://stoxy.onrender.com/my-holdings', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setHoldings(response.data);
            } catch (error) {
                console.error('Failed to fetch holdings:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHoldings();
    }, []);

    useEffect(() => {
        setpl(current - invested)
    }, [holdings])

    
    
    return (
        <>
            <div className="min-h-screen w-screen bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-400">
                {loading && <Loader />}
                <Navbar />
                <h1 className='font-medium text-xl m-3 mt-5 ml-5 text-white drop-shadow'>My Portfolio</h1>
                <div className='flex flex-col md:flex-row gap-6 justify-center text-gray-700'>
                    <div className='mx-auto w-[80vw] h-20 md:mx-0 md:h-[20vh] md:w-[26vw] rounded-md border-solid border-[1px] border-gray-300 bg-white box-border'>
                        <h1 className='mt-2 md:mt-6 ml-4'>Current value</h1>
                        <h3 className='ml-5 mt-2 text-lg text-black font-bold'>₹{Number(current.toFixed(2))}</h3>
                    </div>
                    <div className='mx-auto w-[80vw] h-20 md:mx-0 md:h-[20vh] md:w-[26vw] rounded-md border-solid border-[1px] border-gray-300 bg-white'>
                        <h1 className='mt-2 md:mt-6 ml-4'> Total Invested</h1>
                        <h3 className='ml-5 mt-2 text-lg text-black font-bold'>₹{invested}</h3>
                    </div>
                    <div className='mx-auto w-[80vw] h-20 md:mx-0 md:h-[20vh] md:w-[26vw] rounded-md border-solid border-[1px] border-gray-300 bg-white'>
                        <h1 className='mt-2 md:mt-6 ml-4'>Total Returns</h1>
                        <h3 className='ml-5 mt-2 text-lg font-bold inline-flex align-middle' style={{ color: (pl) >= 0 ? "green" : "red" }}>₹{pl.toFixed(2)}</h3>
                        <h3 className={`ml-3 px-2 mt-2 text-base rounded-lg inline-flex align-middle ${pl>=0 ? "bg-green-100":"bg-red-100"}`}>{percent}%</h3>
                    </div>
                </div>
                <div className=' w-screen flex justify-center mt-8'>
                    <div className='w-96 overflow-x-auto md:w-[90vw] ml-2 rounded-md border-solid border-[1px] border-gray-300 bg-white mt-2'>
                        <h1 className='ml-5 my-4 text-xl font-normal'>My Holdings</h1>
                        <ul className="grid grid-cols-6 text-xs md:text-lg text-center font-semibold py-2 text-gray-600">
                            <li>Name</li>
                            <li>Quantity</li>
                            <li>Buy Avg.</li>
                            <li>Current value</li>
                            <li>Total Invested</li>
                            <li>P/L</li>
                        </ul>
                        {holdings.map((value, index) => (
                            <Link to={`/stocks/${value.stock}`} key={index}>
                                <ul className="grid grid-cols-6 text-xs md:text-lg text-center py-3 hover:bg-gray-50 cursor-pointer">
                                    <li>{value.fullname}</li>
                                    <li>{value.quantity}</li>
                                    <li>₹{Number(value.buyprice.toFixed(2))}</li>
                                    <li>₹{Number(value.currentprice.toFixed(2))}</li>
                                    <li>₹{Number(value.investedamount.toFixed(2))}</li>
                                    <li className={`font-bold ${parseInt((value.quantity * value.currentprice) - value.investedamount) >= 0 ? "text-green-600" : "text-red-600"}`}>
                                        ₹{Number(((value.quantity * value.currentprice) - value.investedamount).toFixed(2))} <span className={`font-normal ml-2 px-1 md:px-2 rounded-lg ${parseInt((value.quantity * value.currentprice) - value.investedamount) >= 0 ? "bg-green-100" : "bg-red-100"}`}> {value.total_percent_change}%</span>
                                    </li>
                                </ul>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )

}

export default Portfolio;