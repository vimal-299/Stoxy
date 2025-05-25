import { useState, useEffect, forwardRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import axios from 'axios';

const navbar = forwardRef((props,ref) => {
    const [stocks, setstocks] = useState([])
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:3000/allstocks')  
        .then(response => {
            setstocks(response.data)
        })
        .catch(error => {
            console.error('Error fetching stocks:', error);
        });
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);

        const filtered = stocks.filter((stock) =>
            stock.NAMEOFCOMPANY?.toLowerCase().includes(value.toLowerCase()) ||
            stock.SYMBOL?.toLowerCase().includes(value.toLowerCase())        
        );

        setResults(filtered);
    }

    return (
        <div>
            <div className="bg-white box-border w-screen h-16">
                <ul className="flex list-none items-center">
                    <li className="pl-12 text-2xl font-medium"> Stoxy </li>
                    <li className="text-lg pl-12"><NavLink to="/home" className={({ isActive }) =>
                        isActive ? "bg-[#1d1d1d] text-white rounded-md p-1" : "hover:font-medium"}> Home </NavLink></li>
                    <li className="pl-12 text-lg"> <NavLink to="/portfolio" className={({ isActive }) =>
                        isActive ? "bg-[#1d1d1d] text-white rounded-md p-1" : "hover:font-medium"
                    }>Portfolio </NavLink></li>
                    <li className="pl-12 text-lg"><NavLink to="/transactions" className={({ isActive }) =>
                        isActive ? "bg-[#1d1d1d] text-white rounded-md p-1" : "hover:font-medium"
                    }> Transactions </NavLink></li>

                    <div className="mt-2 flex ml-auto pr-12 items-center gap-30">
                        <li className="flex items-center">
                            <div className="searchbar relative flex justify-center items-center">
                                <input
                                    type="text"
                                    ref={ref}
                                    placeholder="Search stocks..."
                                    value={search}
                                    onChange={handleSearch}
                                    onFocus={() => {
                                        setIsSearchFocused(true)
                                    }}
                                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 500)}
                                    className="py-3 px-5 w-[20vw] text-sm border border-solid border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-black"
                                />
                                {isSearchFocused && (
                                    <div className="absolute top-full mt-2 bg-white w-64 border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
                                        {results.length > 0 ? (
                                            results.map((stock, index) => (
                                                <Link
                                                    key={index}
                                                    to={`/stocks/${stock.SYMBOL}`}
                                                    className="block p-3 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                                                >
                                                    <div className="font-medium">{stock.NAMEOFCOMPANY}</div>
                                                    <div className="font-light text-sm">{stock.SYMBOL}</div>
                                                </Link>
                                            ))
                                        ) : (
                                            <div className="p-3 text-gray-500 text-center">
                                                No results found
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </li>

                        <li className="ml-8"><Link to="/myprofile"> <FaUser /> </Link></li>
                    </div>
                </ul>
            </div>
        </div>
    )
})

export default navbar