import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className="flex items-center justify-between gap-4 py-3 mt-20">
      <Link to="/" className='flex items-center gap-2 sm:text-3xl text-xl font-bold text-gray-200'>
        <img
          src={assets.logo_icon}
          className="sm:w-10 w-10"
          width={150}
          alt=""
        />
        <span>Genify </span>
      </Link>
      <p className="flex-1 border-l border-gray-200 pl-4 text-sm text-gray-200 max-sm:hidden">
        Copyright @Imageify.dev | All right reserved.
      </p>
      <div className="flex gap-2.5">
        <img src={assets.facebook_icon} width={35} alt="" />
        <img src={assets.twitter_icon} width={35} alt="" />
        <img src={assets.instagram_icon} width={35} alt="" />
      </div>
    </div>
  );
}

export default Footer