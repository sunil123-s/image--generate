import userModel from "../models/user.js";
import dotenv from "dotenv"
import jwt from "jsonwebtoken"

dotenv.config()
const jwt_secret = process.env.JWT_SECRET;

export const ProctedRoute = async(req,res,next) => {
   try {
     const getToken = req.headers.authorization;

     if(!getToken || !getToken.startsWith("Bearer")){
        return res
          .status(401)
          .json({ success: false, message: "token is not provided" });
     }

     const token = getToken.split(" ")[1]
     const decoded = jwt.verify(token, jwt_secret)

     if(!decoded){
         return res.status(401).json({ error: "Unauthorized : invaild token" });
     }

     const user = await userModel.findById(decoded.userId, "_id name email")
     if(!user){
        return res.status(404).json({ error: "User not found" });
     } 
    
     req.user = user;
     next()

   } catch (error) {
      console.error("Error in protectedRoute:", error);
      return res.status(500).json({ error: "Internal Server Error" });
   }
}