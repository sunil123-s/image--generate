import React, { useContext } from 'react'
import { assets, plans } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const BuyCredit = () => {

  const { user, backendUrl, loadCreditBalance, setshowLogin } = useContext(AppContext);
  
    const navigate = useNavigate()

    const initPay = async(order) =>{
     const options = {
       key: import.meta.env.VITE_RAZORPAY_KEY_ID,
       amount: order.amount,
       currency: order.currency,
       name: "Credit Payment",
       description: "Credit Payment",
       order_id: order.id,
       recepit: order.recepit,
       handler: async (response) => {
         try {
           const res = await axios.post(`${backendUrl}/api/user/verify-payment`,response,{
            headers:{
              Authorization : `Bearer ${user?.token}`
            }
           });
           if(res.data.success){
            loadCreditBalance()
            navigate("/")
            toast.success("Credit Added")
           }
         } catch (error) {
          toast.error(error.message)
         }
       },
     };
     const rzp = new window.Razorpay(options)
     rzp.open()
    }

    const paymentRazorpay = async(planId) => {
      try {
        if(!user){
          setshowLogin(true)
        }

       const res = await axios.post(
         `${backendUrl}/api/user/payment`,
         { userId:user._id, planId },
         {
           headers: {
             Authorization: `Bearer ${user?.token}`,
           },
         }
       );
        if(res.data.success){
          initPay(res.data.order)
        }
      } catch (error) {
        console.log(error.message)
      }
    }

  return (
    <motion.div
      className="min-h-[80vh] text-center pt-4 mb-10"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <button className="border border-gray-500 px-10 py-2 rounded-full mb-6 text-gray-200">
        Our Plans
      </button>
      <h1 className="text-center text-3xl font-medium mb-6 sm:mb-10 text-gray-400">
        Choose the Plan
      </h1>
      <div className="flex flex-wrap justify-center gap-6 text-left">
        {plans.map((item) => (
          <div
            key={item.id}
            className="bg-white/20 drop-shadow-sm rounded-lg py-12 px-8 text-gray-200 hover:scale-105 transition-all duration-500"
          >
            <img width={40} src={assets.logo_icon} alt="" />
            <p className="mt-3 mb-1 font-semibold">{item.id}</p>
            <p className="text-sm">{item.desc}</p>
            <p className="mt-6">
              {" "}
              <span className="text-3xl font-medium ">{item.price}</span> /{" "}
              {item.credits} credits
            </p>
            <button onClick={() => paymentRazorpay(item.id)} className="w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52">
              {user ? "Purchase" : "Get Started"}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default BuyCredit 