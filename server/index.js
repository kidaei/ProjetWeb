import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { Server } from "socket.io"
import authRoutes from "./routes/auth.js"
import checkToken from "./middlewares/checkToken.js"
import footballDataRoutes from "./routes/footballData.js"
import usersRoutes from "./routes/users.js"
import sanitizeInput from "./middlewares/sanitizeInput.js"
import setupChat from "./socket/chat.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use("/auth", authRoutes)
app.use("/api", checkToken, footballDataRoutes)
app.use("/users", checkToken, sanitizeInput, usersRoutes)

const server = app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`)
})

const io = new Server(server, {
    cors: {
        origin: process.env.DEV_FRONTEND_URL,
        methods: ["GET", "POST"],
    }
})

setupChat(io)
io.listen(4000)