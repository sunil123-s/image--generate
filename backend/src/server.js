import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import { connectdb } from "./config/MogodbUrl.js";
import userRoutes from "./routes/userRoutes.js"
import imageRoutes from "./routes/imageRoutes.js"

const app = express()

dotenv.config()
const PORT = process.env.PORT || 8000

app.use(express.json())
app.use(
  cors({
    origin: process.env.FORTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/user", userRoutes)
app.use("/api/image", imageRoutes)

connectdb().then(() => {
    console.log("connect to mongodb")
    app.listen(PORT, () => console.log(`server is running on Port ${PORT} `))
}).catch((error) => {
    console.error("failed to connect" + error)
})