import userModel from "../models/user.js";
import axios from "axios"
import dotenv from "dotenv"
import FormData from "form-data";

dotenv.config()

export const generateImage = async(req , res) => {
  try {

    const {_id} = req.user;
    const {prompt} = req.body;

    const user = await userModel.findById(_id)

    if(!user || !prompt){
       return res.status(401).json({success:false, message:"Required Both"})
    } 

    if (user.creditBalance <= 0) {
      return res.json({
        success: false,
        message: "No Credit Balance",
        creditBalance: user.creditBalance,
      });
    }
     
    const formdata = new FormData()
    formdata.append("prompt", prompt)

    const {data} = await axios.post("https://clipdrop-api.co/text-to-image/v1", formdata, {
      headers: {
        "x-api-key": process.env.CLIPDROP_API,
        ...formdata.getHeaders(),
      },
      responseType:"arraybuffer"
    });
     
    const base64Image = Buffer.from(data, "binary").toString("base64")
    const resultImage = `data:image/png;base64,${base64Image}`
    const updatedUser = await userModel.findByIdAndUpdate(user._id,{creditBalance:user.creditBalance - 1},{new:true})

    res
      .status(200)
      .json({
        success: true,
        message: "Image Generated",
        creditBalance: updatedUser.creditBalance,
        resultImage,
      });
  } catch (error) {
    console.log(error)
    res.status(400).json({success:false, message:"Failed to Generate Image"})
  }
}