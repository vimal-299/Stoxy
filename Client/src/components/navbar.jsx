import { useState, useEffect, forwardRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import axios from 'axios';

const Navbar = forwardRef((props, ref) => {
    const [stocks, setstocks] = useState([]);
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        axios.get('https://stoxy.onrender.com/allstocks')
            .then(response => setstocks(response.data))
            .catch(error => console.error('Error fetching stocks:', error));
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        const filtered = stocks.filter((stock) =>
            stock.NAMEOFCOMPANY?.toLowerCase().includes(value.toLowerCase()) ||
            stock.SYMBOL?.toLowerCase().includes(value.toLowerCase())
        );
        setResults(filtered);
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className="bg-white box-border w-screen shadow-md">
            <div className="flex items-center justify-between h-16 px-4 md:px-0">
                <div className="flex items-center">
                    <NavLink to="/home"><div className="px-3 md:px-12 text-lg md:text-2xl font-medium">Stoxy</div></NavLink>
                    
                    <ul className="hidden md:flex list-none items-center">
                        <li className="text-md md:text-lg px-3 md:px-6">
                            <NavLink to="/home" className={({ isActive }) =>
                                isActive ? "bg-[#1d1d1d] text-white rounded-md p-1" : "hover:font-medium"}>
                                Home
                            </NavLink>
                        </li>
                        <li className="text-md px-3 md:px-6 md:text-lg">
                            <NavLink to="/portfolio" className={({ isActive }) =>
                                isActive ? "bg-[#1d1d1d] text-white rounded-md p-1" : "hover:font-medium"}>
                                Portfolio
                            </NavLink>
                        </li>
                        <li className="text-md px-3 md:px-6 md:text-lg">
                            <NavLink to="/transactions" className={({ isActive }) =>
                                isActive ? "bg-[#1d1d1d] text-white rounded-md p-1" : "hover:font-medium"}>
                                Transactions
                            </NavLink>
                        </li>
                    </ul>
                </div>

                <div className="flex ml-auto mr-5 px-2 md:px-0">
                    <div className="relative flex justify-center items-center">
                        <input
                            type="text"
                            ref={ref}
                            placeholder="Search stocks..."
                            value={search}
                            onChange={handleSearch}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setTimeout(() => setIsSearchFocused(false), 500)}
                            className="py-2 px-4 w-full md:w-[20vw] text-sm border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        {isSearchFocused && (
                            <div className="absolute top-full mt-2 bg-white w-full md:w-64 border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
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
                                    <div className="p-3 text-gray-500 text-center">No results found</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4 pr-4 md:pr-12">
                    <div className="md:hidden text-xl" onClick={toggleMenu}>
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </div>
                    <div className="hidden md:block">
                        <Link to="/myprofile"><FaUser /></Link>
                    </div>
                </div>
            </div>

            {menuOpen && (
                <ul className="flex flex-col md:hidden list-none px-4 py-2 gap-2">
                    <li>
                        <NavLink to="/home" onClick={() => setMenuOpen(false)} className={({ isActive }) =>
                            isActive ? "bg-[#1d1d1d] text-white rounded-md p-1 block" : "hover:font-medium block"}>
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/portfolio" onClick={() => setMenuOpen(false)} className={({ isActive }) =>
                            isActive ? "bg-[#1d1d1d] text-white rounded-md p-1 block" : "hover:font-medium block"}>
                            Portfolio
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/transactions" onClick={() => setMenuOpen(false)} className={({ isActive }) =>
                            isActive ? "bg-[#1d1d1d] text-white rounded-md p-1 block" : "hover:font-medium block"}>
                            Transactions
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/myprofile" onClick={() => setMenuOpen(false)} className={({ isActive }) =>
                            isActive ? "bg-[#1d1d1d] text-white rounded-md p-1 block" : "hover:font-medium block"}>
                            Profile
                        </NavLink>
                    </li>
                </ul>
            )}
        </div>
    );
});

export default Navbar;
