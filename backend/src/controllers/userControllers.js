import userModel from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import Razorpay from "razorpay";
import transactionModel from "../models/transactionModel.js";

dotenv.config();
const jwt_secret = process.env.JWT_SECRET;

export const registerUser = async(req, res) => {
    try {
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({success:false, message:"All field required"})
        }

        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res
              .status(404)
              .json({ success: false, message: "User already exits" });
        }

        const hashPassword = await bcrypt.hash(password, 10)
        
        const user = await userModel.create({
            name, email, password:hashPassword
        })
        
        await user.save()

       const token = jwt.sign({ userId: user._id }, jwt_secret, {
         expiresIn: "7d",
       });
      
      res.status(200).json({success:true, data:{
        _id:user._id,
        name:user.name,
        email:user.email,
        token
      }})

    } catch (error) {
         console.error("Login Error:", error);
         res
           .status(500)
           .json({ success: false, message: "failed to register" });
    }
}

export const Login = async(req, res) => {
   try {
      const {email, password} = req.body;

      if(!email || !password){
       return res
         .status(400)
         .json({ success: false, message: "All fields are required" });
      }
       
     const existingUser = await userModel.findOne({email})
     if(!existingUser){
        return res
          .status(401)
          .json({ success: false, message: "Invalid details" });
     }

     const validPassword = await bcrypt.compare(
       password,
       existingUser.password
     );
     if (!validPassword) {
       return res
         .status(404)
         .json({ success: false, message: "Invaild Deatils" });
     }

     const token = jwt.sign({userId:existingUser._id},jwt_secret,{expiresIn:"7d"})

     res.status(200).json({success:true, data:{
        _id:existingUser._id,
        name:existingUser.name,
        email:existingUser.email,
        token
     }})

   } catch (error) {
       console.error("Login Error:", error);
       res.status(500).json({ success: false, message: "failed to Login" });
   }
}

export const userCredit = async(req,res) => {
    try {
        const {_id} = req.user

        const user = await userModel.findById({_id})
        res.status(200).json({success:true, data:{
            credit:user.creditBalance,
            name:user.name
        }})
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "failed to show " });
    }
}
 
 const razorpayInstance = new Razorpay({
   key_id: process.env.RAZORPAY_KEY_ID,
   key_secret: process.env.RAZORPAY_KEY_SECRET,
 });

export const paymentRazorpay = async(req,res) => {
  try {
     
    const {userId,planId} = req.body

    const userData = await userModel.findById(userId)

    if(!userId || !planId){
      return res.json({success:false, message:"Missing Deatils"})
    }

    let date, amount, plan, credit

    switch (planId) {
      case "Basic":
        plan = "Basic";
        credit = 100;
        amount = 10;
        break;

      case "Advanced":
        plan = "Advanced";
        credit = 500;
        amount = 40;
        break;

      case "Business":
        plan = "Business";
        credit = 5000;
        amount = 200;
        break;

      default:
        return res.json({ success: false, message: "Plan not found" });
    }
     
    date = Date.now();

    const newTransaction = await transactionModel.create({
      date,userId,plan,amount,credit
    })

    const options = {
      amount: amount * 100,
      currency: process.env.CURRENCY,
      receipt: newTransaction._id.toString(),
    };

    await razorpayInstance.orders.create(options,(error, order) =>{
        if(error){
          console.log(error)
          res.json({success:false, message:error.message})
        }else{
          res.json({success:true, order})
        }
    })
   
  } catch (error) {
    console.log(error)
    res.status(400).json({success:false, message:"failed to Payment"})
  }
}

export const verifyRazorpay = async(req, res) => {
  try {
    
     const {razorpay_order_id} = req.body
     const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

     if(orderInfo.status === "paid"){
       const transactionData = await transactionModel.findById(orderInfo.receipt)
       if(transactionData.payment){
         return res.json({success:false, message:"payment failed"})
       }

       const userData = await userModel.findById(transactionData.userId)
        const creditBalance = userData.creditBalance + transactionData.credit;
        await userModel.findByIdAndUpdate(userData._id,{creditBalance})

        await transactionModel.findByIdAndUpdate(transactionData._id,{payment:true})

        res.json({success:true, message:"Credit Added"})
      }else{
        res.json({success:false, message:"Payment Failed"})
     }

  } catch (error) {
    console.log(error)
    res.json({success:false, message:error.message})
  }
}