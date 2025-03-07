import React from 'react'
import { assets, testimonialsData } from '../assets/assets';
import { motion } from "framer-motion";

const Testimonials = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center my-20 py-12"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <h1 className="text-3xl sm:text-4xl font-semibold mb-2 text-gray-200">
        Customer testimonials
      </h1>
      <p className="text-gray-300 mb-12">What Our Users Are Saying</p>

      <div className="flex flex-wrap gap-6">
        {testimonialsData.map((item, index) => (
          <div
            key={index}
            className="bg-white/20 p-12 rounded-lg shadow-md order w-80 m-auto cursor-pointer hover:scale-[1.02] transition-all"
          >
            <div className="flex flex-col items-center">
              <img className="rounded-full w-14" src={item.image} alt="" />
              <h2 className="text-xl font-semibold mt-3 text-gray-200">{item.name}</h2>
              <p className="text-gray-300 mb-4">{item.role}</p>
              <div className="flex mb-4">
                {Array(item.stars)
                  .fill()
                  .map((item, index) => (
                    <img key={index} src={assets.rating_star} alt="" />
                  ))}
              </div>
              <p className="text-center text-sm text-gray-300">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default Testimonials