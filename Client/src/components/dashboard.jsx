import { useState, useEffect, useContext, useRef } from 'react'
import { InvestedContext, CurrentContext, PercentContext, HoldingsContext } from './contexts';
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from "./navbar"
import Stockcard from './stockcard'
import { FaArrowRight } from 'react-icons/fa'
import { Plus } from "lucide-react"
import { AuthContext } from './AuthContext'
import Loader from './Loader';

const dashboard = () => {
    const colors = ["#D1FAE5", "#EDE9FE", "#FEF3C7", "#DCFCE7", "#FCE7F3"];
    const [wishlist_items, setwishlist_items] = useState([])
    const [loading, setLoading] = useState(true);
    const [best, setbest] = useState(true)
    const [best_hold, setbest_hold] = useState([])
    const [worst, setworst] = useState(false)
    const [worst_hold, setworst_hold] = useState([])

    const { invested, setInvested } = useContext(InvestedContext)
    const { current, setCurrent } = useContext(CurrentContext)
    const { percent, setPercent } = useContext(PercentContext)
    const { holdings, setHoldings } = useContext(HoldingsContext)
    const { token } = useContext(AuthContext);

    const navigate = useNavigate()
    const searchInputRef = useRef(null)
    const handleAddToWatchlist = () => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };

    useEffect(() => {
        setLoading(true);
        Promise.all([
            axios.get('https://stoxy.onrender.com/wishlist-items', {
                headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get('https://stoxy.onrender.com/my-holdings', {
                headers: { Authorization: `Bearer ${token}` }
            })
        ])
        .then(([wishlistRes, holdingsRes]) => {
            setwishlist_items(wishlistRes.data);
            setHoldings(holdingsRes.data);
            setLoading(false);
        })
        .catch((err) => {
            setLoading(false);
            console.error('unable to fetch data', err);
        });
    }, []);
    useEffect(() => {
        const sortedHoldings = [...holdings].sort((a, b) => b.total_percent_change - a.total_percent_change);
        setbest_hold(sortedHoldings);
    }, [holdings])
    const handlebest = () => {
        setbest(true)
        setworst(false)
        const sortedHoldings = [...holdings].sort((a, b) => b.total_percent_change - a.total_percent_change);
        setbest_hold(sortedHoldings);
    }
    const handleworst = () => {
        setbest(false)
        setworst(true)
        const sortedHoldings = [...holdings].sort((a, b) => a.total_percent_change - b.total_percent_change);
        setworst_hold(sortedHoldings);
    }

    return (
        <div className="min-h-screen max-h-screen w-screen bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-400">
            {loading && <Loader />}
            <Navbar ref={searchInputRef} />
            <div>
                <p className="ml-14 mt-3 text-lg text-white drop-shadow">
                    My stocks
                </p>
                <div className="w-[90vw] h-[20vh] mt-2 p-2 flex justify-center justify-self-center items-center shadow-md bg-white border-solid border-[1px] border-gray-300 rounded-lg">
                    <div className="stockcards gap-4 flex overflow-x-scroll items-center scrollbar-hidden self-center scroll-smooth">
                        {holdings.length === 0 && (<div className='text-center text-gray-500'>Your portfolio is currently empty!</div>)}
                        {holdings.map((value, index) => (
                            <Link to={`/stocks/${value.stock}`} key={index}>
                                <Stockcard
                                    name={value.fullname}
                                    symbol={value.stock}
                                    price={value.currentprice}
                                    percent={value.day_percent_change}
                                    color={colors[index % colors.length]}
                                />
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="flex mt-5 flex-col md:flex-row justify-center mx-8 md:m-5 gap-6">
                    <div className="bg-white md:w-[30vw] md:h-[60vh] rounded-lg p-2 border-solid border-[1px] border-gray-300 shadow-md shadow-gray-500">
                        <p className="text-lg p-4">Current</p>
                        <div className="flex gap-3">
                            <div className="w-full md:w-[25vw] bg-[#6425FE] text-white text-lg rounded-lg p-3 pl-5">₹{Number(current.toFixed(2))}</div>
                            <div className="flex items-center rounded-lg p-3 text-lg" style={{ background: (current >= invested) ? "#C7FFA5" : "#fa6060" }}>{percent}%</div>
                        </div>
                        <p className="mt-3 md:mt-5 p-2 text-lg">Invested</p>
                        <div className="flex items-center pl-5 py-3 bg-[#1d1d1d] text-white rounded-lg text-lg">₹{invested}
                            <div className="flex items-center justify-center bg-[#6425FE] ml-auto mr-5 rounded-lg md:w-12 w-8 h-8 md:h-12 transition-all duration-[1300ms] hover:-rotate-45 hover:shadow-[0_0_15px_5px_rgba(100,37,254,0.6)] hover:animate-pulse-bg"><Link to="/portfolio"><FaArrowRight /></Link></div>
                        </div>
                    </div>
                    <div className="bg-white h-60 overflow-y-auto md:w-[30vw] md:h-[60vh] rounded-lg border-solid border-[1px] border-gray-300 shadow-md shadow-gray-500">
                        <div className='flex sticky top-0 items-center justify-center mt-4 gap-4 text-lg cursor-pointer'>
                            <span onClick={handlebest} className={`px-2 text-center text-base md:text-lg rounded-xl ${best ? "bg-black text-white" : "bg-white"}`}>My Best Performing</span>
                            <span onClick={handleworst} className={`px-2 text-center text-base md:text-lg rounded-xl ${worst ? "bg-black text-white" : "bg-white"}`}>My Worst Performing</span>
                        </div>
                        <div className='overflow-y-auto' >
                            {best && (
                                <div className='gap-4'>
                                    {best_hold.map((value, index) => (
                                        <Link to={`/stocks/${value.stock}`} key={index}>
                                            <div className='bg-white font-medium text-base mx-5 mt-5 cursor-pointer flex items-center justify-between'>
                                                <span>{value.fullname}</span>
                                                <span
                                                    className={`ml-2 px-2 py-0.5 rounded-lg text-sm font-semibold
                                                        ${value.total_percent_change >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                                                >
                                                    {value.total_percent_change}%
                                                </span>
                                            </div>
                                            <div className='border-b-2 bg-white font-light text-sm mx-5 cursor-pointer'>
                                                {value.stock}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )
                            }
                            {worst && (
                                <div className='gap-4'>
                                    {worst_hold.map((value, index) => (
                                        <Link to={`/stocks/${value.stock}`} key={index}>
                                            <div className='bg-white font-medium text-base mx-5 mt-5 cursor-pointer flex items-center justify-between'>
                                                <span>{value.fullname}</span>
                                                <span
                                                    className={`ml-2 px-2 py-0.5 rounded-lg text-sm font-semibold
                                                        ${value.total_percent_change >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                                                >
                                                    {value.total_percent_change}%
                                                </span>
                                            </div>
                                            <div className='border-b-2 bg-white font-light text-sm mx-5 cursor-pointer'>
                                                {value.stock}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )
                            }
                        </div>
                    </div>
                    <div className="bg-white overflow-x-hidden overflow-y-auto h-60 md:w-[30vw] md:h-[60vh] rounded-lg border-solid border-[1px] border-gray-300 shadow-md shadow-gray-500">
                        <div className="flex items-center">
                            <p className="mt-4 ml-5 text-lg align-middle">Watchlist</p>
                            <button className='mt-4 ml-auto mr-10 cursor-pointer rounded-sm' onClick={handleAddToWatchlist} > <Plus /></button>
                        </div>
                        <div>
                            {wishlist_items.length === 0 && (
                                <div className='text-center mt-10 font-medium'>Your watchlist is currently empty!</div>
                            )}
                            {wishlist_items.map((item, index) => (
                                <Link to={`/stocks/${item.stock}`} key={index}>
                                    <div className='bg-white font-medium text-base mx-5 mt-5 cursor-pointer'>
                                        {item.fullname}
                                    </div>
                                    <div className='border-b-2 bg-white font-light text-sm mx-5 cursor-pointer'>
                                        {item.stock}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default dashboard