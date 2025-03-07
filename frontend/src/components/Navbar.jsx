import React, { useContext} from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
  
  const { user, setshowLogin, logout, credit } = useContext(AppContext);
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between py-4">
      <Link to="/" className="flex items-center gap-2 ">
        <img className="w-8 sm:w-10 lg:w-10" src={assets.logo_icon} alt="" />
        <span className="lg:text-4xl md:text-3xl text-xl font-bold text-gray-200">
          Genify
        </span>
      </Link>
      <div>
        {user ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate("/buy")}
              className="flex items-center gap-2 bg-blue-100 px-4 sm:px-6 py-1.5 sm:py-3 rounded-full hover:scale-105 transition-all duration-7 00"
            >
              <img className="w-5" src={assets.credit_star} alt="" />
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Credits left : {credit}
              </p>
            </button>
            <p className="text-gray-200 ">Hi, {user.name}</p>
            <div className="relative group">
              <img
                className="w-10 drop-shadow"
                src={assets.profile_icon}
                alt=""
              />
              <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12">
                <ul className="list-none m-0 p-2 bg-gray-600 rounded-md text-gray-200 text-sm ">
                  <li
                    className="py-1 px-2 cursor-pointer pr-10"
                    onClick={logout}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 items-center sm:gap-5">
            <p
              className="cursor-pointer text-gray-300"
              onClick={() => navigate("/buy")}
            >
              Pricing
            </p>
            <button
              className="bg-gray-700 text-white px-7 py-2 sm:px-10 rounded-full text-sm"
              onClick={() => setshowLogin(true)}
            >
              login
            </button>
          </div>
        )}
      </div>
    </div>
  ); 
}

export default Navbar