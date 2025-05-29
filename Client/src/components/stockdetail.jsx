import { HoldingsContext } from './contexts';
import { useState, useEffect, useContext } from 'react'
import Navbar from './navbar'
import { useParams } from 'react-router-dom'
import { HeartIcon } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import axios from 'axios'
import { AuthContext } from './AuthContext';

const stockdetail = () => {
  const { companyname } = useParams();
  const { token } = useContext(AuthContext);

  const [data, setdata] = useState(null)
  const [fullname, setfullname] = useState()
  const [realprice, setrealprice] = useState()

  useEffect(() => {
    axios.get(`https://stoxy.onrender.com/api/stock/${companyname}`)
      .then(response => { setdata(response.data), setfullname(response.data.companyName), setrealprice(response.data.currentPrice.NSE) })
  }, [companyname])

  const tickerid = data?.stockCorporateActionData.annualGeneralMeeting?.[0]?.tickerId;
  const comp = data?.companyProfile?.peerCompanyList?.find(company => company.tickerId === tickerid);

  const { holdings, setHoldings } = useContext(HoldingsContext)
  const [holding, setholding] = useState()
  useEffect(() => {
    const h = holdings.find(item => item.stock === companyname);
    setholding(h)
  }, [holdings, companyname])

  const [news, setnews] = useState(true)
  const [about, setabout] = useState(false)

  const [buybox, setbuybox] = useState(false)
  const [sellbox, setsellbox] = useState(false)
  const [added, setadded] = useState()

  const [buy_price, setbuy_price] = useState()
  const [buy_quantity, setbuy_quantity] = useState()
  const [sell_price, setsell_price] = useState()
  const [sell_quantity, setsell_quantity] = useState()
  const [orderPlaced, setOrderPlaced] = useState(false)

  const handlenewsclick = () => {
    setnews(true)
    setabout(false)
  }
  const handleaboutclick = () => {
    setnews(false)
    setabout(true)
  }

  useEffect(() => {
    if (!token) return; 

    axios.get('https://stoxy.onrender.com/wishlist', {
      params: { stock: companyname, fullname: fullname },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        setadded(res.data.exists);
      })
      .catch((err) => {
        console.error('Error checking wishlist status', err);
      });
  }, [companyname, token]);

  const handlenewwish = () => {
    if (!token) return;

    const newState = !added;
    setadded(newState);

    if (!added) {
      axios.post('https://stoxy.onrender.com/add-to-wishlist',
        { stock: companyname, fullname: fullname },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .catch(error => { alert("Error in adding to wishlist , please try again"); });

    } else {
      axios.delete('https://stoxy.onrender.com/delete-from-wishlist', {
        data: { stock: companyname, fullname: fullname },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .catch(error => { alert("Error in deleting from wishlist , please try again"); });
    }
  };

  const handlebuy = async (e) => {
    e.preventDefault();
    try {
      
      await axios.post(
        'https://stoxy.onrender.com/add-to-portfolio',
        {
          stock: companyname,
          fullname: fullname,
          buyprice: Number(buy_price),
          quantity: Number(buy_quantity),
          currentprice: Number(realprice),
          day_percent_change: Number(data?.percentChange)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      await axios.post(
        'https://stoxy.onrender.com/buy-transaction',
        {
          stock: fullname,
          price: Number(buy_price),
          quantity: Number(buy_quantity)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const response = await axios.get('https://stoxy.onrender.com/my-holdings', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setHoldings(response.data);

      setOrderPlaced(true);
      setTimeout(() => {
        setOrderPlaced(false);
        setbuybox(false);
      }, 1200);

    } catch (error) {
      console.error('Error buying stock:', error);
      alert("Buy failed. Please try again.");
    }
  };

  const handlesell = async (e) => {
    e.preventDefault();

    try {

      await axios.delete('https://stoxy.onrender.com/remove-from-portfolio', {
        data: {
          stock: companyname,
          buyprice: Number(sell_price),
          quantity: Number(sell_quantity),
          currentprice: Number(realprice)
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      await axios.post('https://stoxy.onrender.com/sell-transaction', {
        stock: fullname,
        price: Number(sell_price),
        quantity: Number(sell_quantity)
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setOrderPlaced(true);
      setTimeout(() => {
        setOrderPlaced(false);
        setsellbox(false);
      }, 1200);

    } catch (err) {
      console.error("Error selling stock:", err);
      alert("Sell failed. Please try again.");
    }
  };


  return (
    <>

      <div className={`w-screen h-full bg-[#F7F6F9] scrollbar-hidden ${buybox ? "blur-[0.5px]" : ""} transition-all mt-4`}>
        <Navbar />

        <div className='flex items-center mt-5'>

          <div className='flex items-center'>
            <div className='flex-col items-center'>
              <div className='px-3 font-semibold text-2xl ml-5'>{data?.companyName}</div>
              <div className='px-3 font-normal text-md ml-5 text-gray-500'>{companyname}</div>
            </div>
            <div className='px-3 cursor-pointer text-red-500 ' onClick={handlenewwish} ><HeartIcon fill={added ? 'red' : 'none'} /></div>
          </div>

          <div className='flex items-center ml-auto gap-3'>
            <div className='px-3 py-1 bg-black text-white rounded-md hover:cursor-pointer hover:text-lg' onClick={() => { setbuybox(true) }}  >Buy</div>

            <div className='px-3 py-1 bg-black text-white mr-10 rounded-md hover:cursor-pointer hover:text-lg' onClick={() => { setsellbox(true) }}>Sell</div>
          </div>

        </div>

        <div className='mt-5 flex justify-center '>

          <div className='mx-5 bg-white w-[90vw] h-[15vh] border-solid border-[1px] border-gray-300 rounded-md shadow-md shadow-gray-500'>
            <div className='flex items-center gap-3'>
              <div className='ml-5 mt-5 text-4xl font-medium'>₹{data?.currentPrice.NSE}</div>
              <div className={`mt-3 ml-[-7px] text-xl ${data?.percentChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>{data?.percentChange}%</div>
            </div>
          </div>

        </div>



        <div className='my-5 flex flex-col md:flex-row gap-3 items-center w-screen'>

          <div className='mx-5 md:ml-5 bg-white w-[90vw] md:w-[60vw] h-[50vh] border-solid border-[1px] border-gray-300 rounded-md shadow-md shadow-gray-500'>
            <div className="font-semibold text-xl ml-5 mt-5">Key Metrics</div>
            <div className='grid grid-cols-4 gap-14 ml-5 mt-5 overflow-y-scroll'>
              <div>
                <div className='text-sm text-gray-500'>P/E Ratio</div>
                <div className='font-medium'>{comp?.priceToEarningsValueRatio}</div>
              </div>

              <div>
                <div className='text-sm text-gray-500'>P/B Ratio</div>
                <div className='font-medium'>{comp?.priceToBookValueRatio}</div>
              </div>

              <div>
                <div className='text-sm text-gray-500'>Market Cap</div>
                <div className='font-medium'>₹{comp?.marketCap}Cr</div>
              </div>

              <div>
                <div className='text-sm text-gray-500'>ROE</div>
                <div className='font-medium'>{comp?.returnOnAverageEquity5YearAverage}%</div>
              </div>
              <div>
                <div className='text-sm text-gray-500'>Debt to Equity</div>
                <div className='font-medium'>{comp?.ltDebtPerEquityMostRecentFiscalYear}</div>
              </div>
              <div>
                <div className='text-sm text-gray-500'>Div Yield</div>
                <div className='font-medium'>{comp?.dividendYieldIndicatedAnnualDividend}%</div>
              </div>
              <div>
                <div className='text-sm text-gray-500'>Total Shares Outstanding</div>
                <div className='font-medium'>{comp?.totalSharesOutstanding}</div>
              </div>
              <div>
                <div className='text-sm text-gray-500'>52W High</div>
                <div className='font-medium'>₹{comp?.yhigh}</div>
              </div>
              <div>
                <div className='text-sm text-gray-500'>52W Low</div>
                <div className='font-medium'>₹{comp?.ylow}</div>
              </div>
            </div>
          </div>

          <div className='md:ml-auto md:mr-7 mx-5 bg-white w-[90vw] md:w-[30%] h-[50vh] border-solid border-[1px] border-gray-300 rounded-md shadow-md shadow-gray-500 flex-col'>
            <div className="font-semibold text-xl m-3">Your Holdings</div>
            {holding ?
              (
                <>
                  <div className='flex mt-3'>
                    <div className='ml-5 text-gray-700'>
                      Quantity
                    </div>
                    <div className='ml-auto mr-10 font-medium'>
                      {holding.quantity}
                    </div>
                  </div>
                  <div className='flex mt-3'>
                    <div className='ml-5 text-gray-700'>
                      Average Buy Price
                    </div>
                    <div className='ml-auto mr-10 font-medium'>
                      ₹{holding.buyprice}
                    </div>
                  </div>
                  <div className='flex mt-3'>
                    <div className='ml-5 text-gray-700'>
                      Current Value
                    </div>
                    <div className='ml-auto mr-10 font-medium'>
                      ₹{holding.currentprice}
                    </div>
                  </div>
                  <div className='flex mt-3'>
                    <div className='ml-5 text-gray-700'>
                      Total Invested
                    </div>
                    <div className='ml-auto mr-10 font-medium'>
                      ₹{holding.investedamount}
                    </div>
                  </div>
                  <div className='flex mt-3'>
                    <div className='ml-5 text-gray-700'>
                      Profit/Loss
                    </div>
                    <div className='ml-auto mr-10 font-medium' style={{ color: ((holding.quantity * holding.currentprice) - holding.investedamount) >= 0 ? 'green' : 'red' }}>
                      ₹{Number(((holding.quantity * holding.currentprice) - holding.investedamount).toFixed(2))}
                    </div>
                  </div>
                </>
              )
              :
              (<div className='text-center font-medium text-lg mb-auto'>No Holdings Found</div>)
            }
          </div>


        </div>

        <div className='flex flex-col-reverse md:flex-row justify-center mt-5 gap-3'>
          <div className='w-[90vw] mx-5 md:w-[60vw] rounded-md border-solid border-[1px] border-gray-300 md:ml-5 md:mr-3'>
            <div className='bg-gray-200 flex gap-3 text-center'>
              <div className="ml-auto px-14 py-1 my-1 hover:cursor-pointer rounded-sm" onClick={handlenewsclick} style={{ background: news ? "white" : "none" }}>News</div>
              <div className="mr-auto px-14 py-1 my-1 hover:cursor-pointer rounded-sm" onClick={handleaboutclick} style={{ background: about ? "white" : "none" }}>About</div>
            </div>
            <div className='m-5 bg-white border-solid border-[1px] border-gray-300 rounded-md shadow-md shadow-gray-500'>
              {news && (
                data?.recentNews.map((value, index) => (
                  <div key={index} className='border-b'>
                    <div className='font-semibold text-lg mt-2 ml-5'>{value.headline}</div>
                    <div className='font-light text-sm mb-3 ml-5'>{value.intro}</div>
                  </div>
                ))
              )}
            </div>

            <div className='m-5 bg-white border-solid border-[1px] border-gray-300 rounded-md shadow-md shadow-gray-500'>
              {about && data?.companyProfile && (
                <div className='px-2 py-2 font-normal'>{data.companyProfile.companyDescription}</div>
              )}
            </div>

          </div>
          <div className='md:ml-auto md:mr-7 bg-white w-[90vw] mx-5 md:w-[30vw] h-[55vh] border-solid border-[1px] border-gray-300 rounded-md shadow-md shadow-gray-500'>
            <div className='font-semibold text-xl ml-5 mt-5 overflow-y-auto'>Similar Stocks</div>
            {Array.isArray(data?.companyProfile?.peerCompanyList) &&
              data.companyProfile.peerCompanyList.map((peer, index) => (
                <div key={index} className='px-3'>
                  <div className='flex border-b py-2'>
                    <div className='ml-5 font-medium mt-5'>{peer.companyName.toUpperCase()}</div>
                    <div className='ml-auto mr-5 mt-5'>₹{peer.price}</div>
                  </div>
                </div>
              ))}

          </div>
        </div>
      </div>
      <AnimatePresence>
        {buybox && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {!orderPlaced ? (
              <motion.div
                className="bg-white p-6 rounded shadow-lg w-96"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-lg font-semibold">Buy {companyname}</h1>
                  <button
                    className="size-7 bg-red-500 text-white rounded text-xs flex items-center justify-center"
                    onClick={() => setbuybox(false)}
                  >
                    X
                  </button>
                </div>

                <div className="space-y-4">
                  <form onSubmit={handlebuy}>
                    <div>
                      <label className="font-semibold block mb-1">Quantity</label>
                      <input
                        type="number"
                        min={0}
                        className="w-full px-2 py-1 border rounded bg-slate-100"
                        onChange={(e) => { setbuy_quantity(e.target.value) }}
                        placeholder="Enter quantity"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Price</label>
                      <input
                        type="number"
                        min={0}
                        step="any"
                        className="w-full px-2 py-1 border rounded bg-slate-100"
                        onChange={(e) => { setbuy_price(e.target.value) }}
                        placeholder="Enter price"
                        required
                      />
                    </div>

                    <button
                      className="w-full bg-gray-700 text-white py-2 rounded hover:bg-blue-600 mt-5"
                      type='submit'

                    >
                      Confirm Buy
                    </button>
                  </form>
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="bg-white p-6 rounded shadow-lg w-80 flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="text-green-500 text-5xl mb-4">✔</div>
                <h2 className="text-lg font-semibold">Order Placed Successfully!</h2>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sellbox && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {!orderPlaced ? (
              <motion.div
                className="bg-white p-6 rounded shadow-lg w-96"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-lg font-semibold">Sell {companyname}</h1>
                  <button
                    className="size-7 bg-red-500 text-white rounded text-xs flex items-center justify-center"
                    onClick={() => setsellbox(false)}
                  >
                    X
                  </button>
                </div>

                <div className="space-y-4">
                  <form onSubmit={handlesell}>
                    <div>
                      <label className="font-semibold block mb-1">Quantity</label>
                      <input
                        type="number"
                        min={0}
                        max={holding.quantity}
                        className="w-full px-2 py-1 border rounded bg-slate-100"
                        onChange={(e) => { setsell_quantity(e.target.value) }}
                        placeholder="Enter quantity"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Price</label>
                      <input
                        type="number"
                        min={0}
                        step="any"
                        className="w-full px-2 py-1 border rounded bg-slate-100"
                        onChange={(e) => { setsell_price(e.target.value) }}
                        placeholder="Enter price"
                        required
                      />
                    </div>

                    <button
                      className="w-full bg-gray-700 text-white py-2 rounded hover:bg-blue-600 mt-5"
                      type='submit'

                    >
                      Confirm Sell
                    </button>
                  </form>
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="bg-white p-6 rounded shadow-lg w-80 flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="text-green-500 text-5xl mb-4">✔</div>
                <h2 className="text-lg font-semibold">Order Placed Successfully!</h2>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </>


  )
}

export default stockdetail