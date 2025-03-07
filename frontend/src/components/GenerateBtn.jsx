import React, { useContext } from 'react'
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const GenerateBtn = () => {
  const {user, setshowLogin} = useContext(AppContext)
  const navigate = useNavigate()

  const onclickhandler = () => {
    if(user){
      navigate("/results")
    }else{
      setshowLogin(true)
    }
  }
  return (
    <motion.div
      className="pb-16 text-center space-x-5"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <h1 className="text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold text-neutral-800 py-6 md:py-16">
        See the magic. Try now
      </h1>
      <button onClick={onclickhandler}
        className="inline-flex items-center gap-2 px-12 py-3 rounded-full bg-black text-white m-auto  hover:scale-105 transition-all duration-500"
      >
        Generate Image
      </button>
    </motion.div>
  );
}

export default GenerateBtn