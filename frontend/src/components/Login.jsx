import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { motion } from "framer-motion";
import axios from "axios"
import { toast } from 'react-toastify';

const Login = () => {
    const [state, setstate] = useState("Login")
    const [name, setname] = useState("")
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const {setshowLogin,backendUrl,setuser } = useContext(AppContext)
   
    useEffect(() => {
      document.body.style.overflow = "hidden"
    
      return () => {
        document.body.style.overflow = "unset"
      }
    }, [])

    const handleForm = async(e) => {
     e.preventDefault()
     try {
      if(state === "Login"){
      const res = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        })
        if(res.data.success){
          setuser(res.data.data)
          localStorage.setItem("userdata", JSON.stringify(res?.data?.data));
          setshowLogin(false)
        }else{
          console.log(res.data.message)
           toast.error(res.data.message)
        }
      }else{
        const res = await axios.post(`${backendUrl}/api/user/register`,{
          name,email,password
        })
        if(res.data.success){
          setuser(res.data.data)
          localStorage.setItem("userdata", JSON.stringify(res.data.data));
          setshowLogin(false)
        }else{
          console.log(res.data.message);
          toast.error(res.data.message)
        }
      }
      
     } catch (error) {
       toast.error(error.message)
       console.log(error.response.data.message)
     }
    }
    

  return (
    <div className="fixed top-0 right-0 left-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <motion.form onSubmit={handleForm}
        className="relative bg-white p-10 rounded-xl text-slate-500"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
      >
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          {state}
        </h1>
        <p className="text-sm">Welcome back! please sign in to continue</p>
        {state !== "Login" && (
          <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-5">
            <img src={assets.profile_icon} width={17} alt="" />
            <input
              className="outline-none text-sm"
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setname(e.target.value)}
              required
            />
          </div>
        )}
        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
          <img src={assets.email_icon} alt="" />
          <input
            className="outline-none text-sm"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            required
          />
        </div>
        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
          <img src={assets.lock_icon} alt="" />
          <input
            className="outline-none text-sm"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            required
          />
        </div>
        <p className="text-sm text-blue-500 my-4 cursor-pointer">
          forgot password?
        </p>
        <button className="bg-blue-600 w-full text-white py-2 rounded-full">
          {state === "Login" ? "Login" : "create account"}
        </button>
        <p className="mt-5 text-center">
          {state === "Login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => setstate(state === "Login" ? "Sign up" : "Login")}
          >
            {state === "Login" ? "Sign up" : "Login"}
          </span>
        </p>
        <img
          src={assets.cross_icon}
          onClick={() => setshowLogin(false)}
          className="absolute  top-5 right-5 cursor-pointer"
          alt=""
        />
      </motion.form>
    </div>
  );
}

export default Login