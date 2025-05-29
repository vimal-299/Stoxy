import { useState, useContext, useEffect } from 'react'
import Navbar from './navbar'
import { AuthContext } from './AuthContext'
import axios from 'axios'
import Avatar from './avatar'
import { useNavigate } from "react-router-dom"

const myprofile = () => {
    const { token } = useContext(AuthContext)
    const [user, setuser] = useState([])
    useEffect(() => {
        axios.get('https://stoxy.onrender.com/user-profile', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => { setuser(response.data[0]) })
    }, [])

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <>
            <div className='bg-[#F7F6F9] h-screen'>
                <Navbar title="My Profile" />
                <div className='ml-5 mt-5 font-semibold text-3xl'>My Profile</div>
                <div className='flex gap-10 mt-10'>
                    <div className='bg-white flex flex-col gap-2 items-center justify-center ml-auto border-solid border-[1px] border-gray-300 shadow-md shadow-gray-500 h-[50vh] w-[25vw]'>
                        <Avatar name={user.name} />
                        <div className='font-medium text-2xl'>{user.name}</div>
                    </div>

                    <div className='bg-white mr-auto border-solid border-[1px] border-gray-300 shadow-md shadow-gray-500 h-[50vh] w-[50vw] px-5'>
                        <div className='mt-5 font-semibold text-lg'>Personal Information</div>
                        <div className='mt-5 font-medium'>Name</div>
                        <div className='px-3 py-1 border-solid border-[1px] border-gray-300 w-full'>{user.name}</div>
                        <div className='mt-5 font-medium'>Email</div>
                        <div className='px-3 py-1 border-solid border-[1px] border-gray-300 w-full'>{user.email}</div>

                        <div className='flex'>
                            <button
                                onClick={handleLogout}
                                className="ml-auto mt-10 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Sign Out
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default myprofile