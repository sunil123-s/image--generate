import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { motion } from "framer-motion";
import { AppContext } from '../context/AppContext';

const Results = () => {

   const [image, setimage] = useState(assets.sample_img_2)
   const [isImageLoaded, setisImageLoaded] = useState(true)
   const [loading, setloading] = useState(false)
   const [input, setinput] = useState("")
   
   const { generateImage } = useContext(AppContext);

   const handleFromSubmit = async(e) => {
      e.preventDefault();
     setloading(true)

      if(input){
        const imageGenerated = await generateImage(input)
        if (imageGenerated) {
          setisImageLoaded(true);
          setimage(imageGenerated);
        }     
      }
      setloading(false)
   }

  return (
    <motion.form
      className="flex flex-col min-h-[90vh] justify-center items-center"
      onSubmit={handleFromSubmit}
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <div>
        <div className="relative">
          <img className="max-w-sm rounded" src={image} alt="" />
          <span
            className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${
              loading ? "w-full transition-all duration-[10s]" : "w-0"
            } `}
          />
        </div>
        <p className={!loading ? "hidden" : "text-gray-200"}>loading...</p>
      </div>
      {!isImageLoaded && (
        <div className="flex w-full max-w-xl bg-neutral-300 text-sm p-0.5 mt-10 rounded-full">
          <input
            className="flex-1 bg-transparent outline-none ml-8 max-s:w-20 text-gray-700"
            type="text"
            placeholder="Describe what you want to generate"
            value={input}
            onChange={(e) => setinput(e.target.value)}
          />
          <button
            className="bg-zinc-900 px-10 sm:px-16 py-3 rounded-full text-white"
            type="submit"
          >
            Generate
          </button>
        </div>
      )}
      {isImageLoaded && (
        <div className="flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full">
          <p
            className="bg-transparent border border-gray-500 text-gray-200 px-8 py-3 rounded-full cursor-pointer"
            onClick={() => setisImageLoaded(false)}
          >
            Generate Another
          </p>
          <a
            className="bg-zinc-900 px-10 py-3 rounded-full cursor-pointer"
            download
            href={image}
          >
            Download
          </a>
        </div>
      )}
    </motion.form>
  );
}

export default Results